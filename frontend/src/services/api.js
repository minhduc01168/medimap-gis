import initialData from '../data/initialData.json';

const API_BASE = '/api/v1';

export const ApiService = {
  // Check backend health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        return { online: true, ...data };
      }
    } catch (err) {
      // Backend is offline, return fallback
    }
    return {
      online: false,
      status: 'offline_mode',
      facilities_cached: initialData.facilities.length,
      healthcare_deserts_points: initialData.accessibility_summary.healthcare_deserts_clusters_count
    };
  },

  // Fetch 67 Facilities
  async getFacilities(district = '', tier = null) {
    try {
      const params = new URLSearchParams({ format: 'json' });
      if (district) params.append('district', district);
      if (tier) params.append('tier', tier);

      const res = await fetch(`${API_BASE}/facilities?${params.toString()}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback
    }

    let filtered = initialData.facilities;
    if (district) filtered = filtered.filter(f => f.district === district);
    if (tier) filtered = filtered.filter(f => f.tier === Number(tier));
    return filtered;
  },

  // Run or simulate dynamic isochrones & accessibility
  async simulateIsochrone(params = {}) {
    const {
      base_speed_kmh = 32.0,
      slope_friction_weight = 3.5,
      vehicle_type = 'motorbike',
      include_proposed_clinics = false,
      additional_custom_clinics = []
    } = params;

    try {
      const res = await fetch(`${API_BASE}/isochrone/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base_speed_kmh,
          slope_friction_weight,
          vehicle_type,
          include_proposed_clinics,
          additional_custom_clinics
        }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Client-side fallback simulation engine
    }

    // Mathematical local estimation based on parameters:
    // When speed increases or proposed clinics are added, coverage increases
    const speedRatio = base_speed_kmh / 32.0;
    const slopePenalty = slope_friction_weight / 3.5;
    const effectiveSpeedFactor = speedRatio / Math.sqrt(slopePenalty);

    let baselineDeserts = 34498;
    let baselineLessThan15 = 78723;
    let baseline15to30 = 57754;
    let baseline30to60 = 48119;
    const totalPop = 219094;

    let desertReductionFactor = 1.0;
    if (include_proposed_clinics) {
      // P-median rescues 85.7% of desert pop
      desertReductionFactor *= 0.143;
    }

    if (additional_custom_clinics.length > 0) {
      // Each custom clinic rescues an estimated 3,500 people
      const customRescue = additional_custom_clinics.length * 3500;
      desertReductionFactor = Math.max(0.02, desertReductionFactor - (customRescue / baselineDeserts));
    }

    // Speed adjustment
    if (effectiveSpeedFactor > 1) {
      desertReductionFactor *= (1 / (effectiveSpeedFactor ** 0.8));
    } else {
      desertReductionFactor *= (1 / (effectiveSpeedFactor ** 0.5));
    }

    const calculatedDeserts = Math.round(baselineDeserts * Math.min(1.2, desertReductionFactor));
    const rescued = baselineDeserts - calculatedDeserts;
    
    const newUnder15 = Math.min(totalPop, Math.round(baselineLessThan15 + (rescued * 0.45 * effectiveSpeedFactor)));
    const new15to30 = Math.min(totalPop - newUnder15, Math.round(baseline15to30 + (rescued * 0.35)));
    const new30to60 = Math.max(0, totalPop - newUnder15 - new15to30 - calculatedDeserts);

    return {
      simulation_parameters: {
        base_speed_kmh,
        slope_friction_weight,
        vehicle_type,
        include_proposed_clinics,
        additional_custom_clinics_count: additional_custom_clinics.length
      },
      population_accessibility: {
        less_than_15min: {
          population: newUnder15,
          percentage: Number(((newUnder15 / totalPop) * 100).toFixed(2))
        },
        between_15_and_30min: {
          population: new15to30,
          percentage: Number(((new15to30 / totalPop) * 100).toFixed(2))
        },
        between_30_and_60min: {
          population: new30to60,
          percentage: Number(((new30to60 / totalPop) * 100).toFixed(2))
        },
        greater_than_60min_deserts: {
          population: calculatedDeserts,
          percentage: Number(((calculatedDeserts / totalPop) * 100).toFixed(2))
        }
      },
      isochrone_bands_km: {
        band_15min_radius_approx_km: Number((7.5 * effectiveSpeedFactor).toFixed(1)),
        band_30min_radius_approx_km: Number((15.0 * effectiveSpeedFactor).toFixed(1)),
        band_60min_radius_approx_km: Number((30.0 * effectiveSpeedFactor).toFixed(1))
      }
    };
  },

  // Get Optimization impact and 5 recommended clinics
  async getOptimization() {
    try {
      const res = await fetch(`${API_BASE}/optimization/impact`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback
    }
    return {
      ...initialData.optimization_impact,
      recommended_sites: initialData.proposed_clinics
    };
  },

  // Get Moran's I & District summaries
  async getSpatialStats() {
    try {
      const res = await fetch(`${API_BASE}/e2sfca/spatial-autocorrelation`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const moran = await res.json();
        const distRes = await fetch(`${API_BASE}/e2sfca/district-summary`, { signal: AbortSignal.timeout(2000) });
        const districts = distRes.ok ? await distRes.json() : initialData.districts_stats;
        return { moran, districts };
      }
    } catch (e) {
      // Fallback
    }
    return {
      moran: initialData.moran_summary,
      districts: initialData.districts_stats
    };
  },

  // Get Deserts summary
  async getDeserts() {
    try {
      const res = await fetch(`${API_BASE}/deserts/summary`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback
    }
    return {
      healthcare_deserts_population: initialData.accessibility_summary.healthcare_deserts_total_pop,
      healthcare_deserts_clusters: initialData.accessibility_summary.healthcare_deserts_clusters_count,
      total_population_analyzed: initialData.accessibility_summary.total_population_analyzed,
      deserts_percentage: initialData.accessibility_summary.population_by_tier['>60m (Healthcare Desert)'].percentage
    };
  }
};
