import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MapContainer from './components/MapContainer';
import SimulationPanel from './components/SimulationPanel';
import StatsPanel from './components/StatsPanel';
import DataManagementView from './components/DataManagementView';
import ReportModal from './components/ReportModal';
import { ApiService } from './services/api';
import initialData from './data/initialData.json';
import { translations } from './i18n/translations';

export default function App() {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'data'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('medimap_lang') || 'vi';
  });

  const t = translations[language] || translations.vi;

  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('medimap_lang', lang);
  };

  const [backendStatus, setBackendStatus] = useState({ online: false });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Core Data
  const [facilities, setFacilities] = useState(initialData.facilities || []);
  const [deserts, setDeserts] = useState(initialData.desert_sample || []);
  const [proposedClinics, setProposedClinics] = useState(initialData.proposed_clinics || []);
  const [moranStats, setMoranStats] = useState(initialData.moran_summary || null);
  const [districtStats, setDistrictStats] = useState(initialData.districts_stats || []);

  // Map and Layer Filters
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [layers, setLayers] = useState({
    facilities: true,
    isochrones: true,
    deserts: true,
    proposed: false
  });

  // Simulation Parameters
  const [simulationParams, setSimulationParams] = useState({
    base_speed_kmh: 32.0,
    slope_friction_weight: 3.5,
    vehicle_type: 'motorbike'
  });

  // User Custom Clinics
  const [customClinics, setCustomClinics] = useState([]);
  const [isAddingClinic, setIsAddingClinic] = useState(false);

  // Simulation Result Output
  const [simulationResult, setSimulationResult] = useState(null);

  // Initial Data Load & Health Check
  const loadInitialData = useCallback(async () => {
    const health = await ApiService.checkHealth();
    setBackendStatus(health);

    const facs = await ApiService.getFacilities();
    if (facs && facs.length > 0) setFacilities(facs);

    const opt = await ApiService.getOptimization();
    if (opt?.recommended_sites) setProposedClinics(opt.recommended_sites);

    const stats = await ApiService.getSpatialStats();
    if (stats?.moran) setMoranStats(stats.moran);
    if (stats?.districts) setDistrictStats(stats.districts);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Run Real-time Simulation Engine
  const runSimulation = useCallback(async () => {
    const res = await ApiService.simulateIsochrone({
      base_speed_kmh: simulationParams.base_speed_kmh,
      slope_friction_weight: simulationParams.slope_friction_weight,
      vehicle_type: simulationParams.vehicle_type,
      include_proposed_clinics: layers.proposed,
      additional_custom_clinics: customClinics
    });
    setSimulationResult(res);
  }, [simulationParams, layers.proposed, customClinics]);

  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation();
    }, 150);
    return () => clearTimeout(timer);
  }, [runSimulation]);

  // Custom Clinic Handlers
  const handleAddCustomClinic = (newClinic) => {
    setCustomClinics(prev => [...prev, newClinic]);
    setIsAddingClinic(false);
  };

  const handleRemoveCustomClinic = (id) => {
    setCustomClinics(prev => prev.filter(c => c.id !== id));
  };

  const handleClearCustomClinics = () => {
    setCustomClinics([]);
  };

  const handleResetSimulation = () => {
    setSimulationParams({
      base_speed_kmh: 32.0,
      slope_friction_weight: 3.5,
      vehicle_type: 'motorbike'
    });
    setLayers({
      facilities: true,
      isochrones: true,
      deserts: true,
      proposed: false
    });
    setSelectedDistrict('');
    setCustomClinics([]);
    setIsAddingClinic(false);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-app)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        onRefresh={loadInitialData}
        isAddingClinic={isAddingClinic}
        setIsAddingClinic={setIsAddingClinic}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        language={language}
        setLanguage={handleSetLanguage}
        t={t}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {activeTab === 'map' ? (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Interactive WebGIS Leaflet Map */}
            <MapContainer
              facilities={facilities}
              deserts={deserts}
              proposedClinics={proposedClinics}
              showFacilities={layers.facilities}
              showIsochrones={layers.isochrones}
              showDeserts={layers.deserts}
              showProposed={layers.proposed}
              simulationResult={simulationResult}
              isAddingClinic={isAddingClinic}
              customClinics={customClinics}
              onAddCustomClinic={handleAddCustomClinic}
              onRemoveCustomClinic={handleRemoveCustomClinic}
              selectedDistrict={selectedDistrict}
              t={t}
              language={language}
            />

            {/* Left Floating Simulation Control Panel */}
            <SimulationPanel
              params={simulationParams}
              setParams={setSimulationParams}
              layers={layers}
              setLayers={setLayers}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              onResetSimulation={handleResetSimulation}
              customClinicsCount={customClinics.length}
              onClearCustomClinics={handleClearCustomClinics}
              t={t}
            />

            {/* Right Floating KPI and Spatial Stats Panel */}
            <StatsPanel
              simulationResult={simulationResult}
              moranStats={moranStats}
              districtStats={districtStats}
              isProposedActive={layers.proposed}
              t={t}
              language={language}
            />
          </div>
        ) : (
          /* Data Management View (Screen 1) */
          <DataManagementView
            facilities={facilities}
            districtsStats={districtStats}
            t={t}
            language={language}
          />
        )}
      </main>

      {/* Academic Brief & Acceptance Criteria Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        t={t}
        language={language}
      />
    </div>
  );
}
