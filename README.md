# MediMap GIS

> **Hệ thống bản đồ số hóa và phân tích khả năng tiếp cận nguồn lực y tế vùng núi sử dụng Spatial Analysis và WebGIS**  
> *(Pilot: Cụm Thị xã Sa Pa, Huyện Bát Xát, Huyện Mường Khương — Tỉnh Lào Cai)*

---

## 📖 Giới thiệu (Abstract)

Dự án **MediMap GIS** được phát triển nhằm tự động hóa việc đánh giá và tối ưu hóa mạng lưới cơ sở y tế tuyến cơ sở tại khu vực miền núi hiểm trở phía Bắc Việt Nam, dựa trên hệ thống phân tích không gian (Spatial Analysis) kết hợp dữ liệu mở từ OpenStreetMap và cơ sở dữ liệu y tế địa phương.

Việc đánh giá khả năng tiếp cận y tế bằng bán kính đường chim bay truyền thống là không chính xác do đặc thù địa hình chia cắt, độ dốc lớn và hạ tầng giao thông hạn chế tại vùng cao. MediMap GIS giải quyết bài toán này thông qua:
1. **Automated Spatial Data Pipeline:** Tự động thu thập, chuẩn hóa tọa độ trạm y tế, trích xuất mạng lưới đường bộ (`osmnx`), dữ liệu cao độ (NASA SRTM 30m DEM) và mật độ dân số vi mô (WorldPop Constrained 100m).
2. **Topographic Impedance Routing:** Tích hợp hàm ma sát sườn dốc (Tobler's Hiking Function) vào mạng lưới giao thông đường bộ để tính toán thời gian di chuyển (Travel Time) thực tế cho xe máy và xe cấp cứu:
   $$v(s) = v_0 \cdot \exp\left(-3.5 \cdot |s + 0.05|\right)$$
3. **Healthcare Deserts Identification:** Phân tích chồng lớp (Overlay Analysis) xác định chính xác các "Vùng lõm y tế" (>60 phút tiếp cận) và đề xuất danh mục các bản làng ưu tiên xây dựng trạm y tế mới.

---

## 📊 Kết Quả Nghiệm Thu Bộ Dữ Liệu Nghiên Cứu (Pilot Lào Cai)

Toàn bộ 5 tiêu chí nghiệm thu học thuật (**AC-1 đến AC-5**) đã được kiểm chứng và vượt qua:

| Chỉ Tiêu | Kết Quả Đạt Được | Ý Nghĩa Thực Tiễn |
| :--- | :--- | :--- |
| **Cơ sở Y tế Chuẩn hóa** | **67 cơ sở y tế** (19 Sa Pa, 28 Bát Xát, 20 Mường Khương) | 100% tọa độ cổng trạm qua vệ tinh (loại bỏ sai số UBND xã) |
| **Mạng lưới Đường bộ OSM** | **708,852 nodes**, **1,419,463 cạnh**, **11,618 km đường** | Bao phủ đầy đủ quốc lộ, tỉnh lộ, đường liên thôn và đường mòn |
| **Độ cao DEM SRTM** | **80.0m - 3,116.7m** (độ dốc trung bình 14.8%) | Mô hình hóa chính xác sườn dốc Hoàng Liên Sơn và thung lũng sông Hồng |
| **Quy mô Dân cư Vi mô** | **219,094 người** (17,863 cụm dân cư 100m) | Khớp 99% Niên giám Thống kê tỉnh Lào Cai |
| **VÙNG LÕM Y TẾ (>60 phút)** | **34,498 người dân (15.75%)** | 4,083 cụm dân cư ngoài khung giờ vàng cấp cứu cần can thiệp chính sách |

### Phân bố Tiếp cận Y tế Vùng Núi:
- **Tiếp cận Tốt (<15 phút):** 78,723 người (35.93%)
- **Chấp nhận được (15 - 30 phút):** 57,754 người (26.36%)
- **Cần cảnh báo (30 - 60 phút):** 48,119 người (21.96%)
- **Vùng lõm y tế (>60 phút):** 34,498 người (15.75%)

---

## 📂 Cấu trúc Thư mục Dự án

```text
medimap_gis/
├── data/
│   ├── 01_raw/                 # Dữ liệu gốc OSM, SRTM, danh bạ y tế
│   ├── 02_intermediate/        # Bounding Box, ma trận DEM, đồ thị NetworkX GraphML
│   ├── 03_primary/             # Tọa độ cơ sở y tế Ground-Truth & CSV Catalog
│   └── 04_research_ready/      # GeoPackage (.gpkg), CSV danh sách vùng lõm y tế
├── docs/
│   ├── dataset_research_plan.md      # Kế hoạch chi tiết 5 giai đoạn
│   ├── pipeline_handover_guide.md    # Hướng dẫn kỹ thuật bàn giao quy trình dữ liệu
│   └── quality_assessment_report.md  # Báo cáo kiểm định chất lượng Acceptance Criteria
├── scripts/
│   ├── 01_download_boundaries.py
│   ├── 02_ingest_health_facilities.py
│   ├── 03_fetch_osm_network.py
│   ├── 04_process_raster_elevation_pop.py
│   ├── 05_topographic_impedance_builder.py
│   └── 06_qa_ground_truth_validation.py
├── run_pipeline.py             # Script thực thi toàn bộ pipeline trong 1 dòng lệnh
├── docker-compose.yml          # Container PostgreSQL 16 + PostGIS 3.4
├── requirements.txt            # Thư viện Python GIS & Spatial Analysis
└── README.md
```

---

## 🚀 Hướng Dẫn Tái Lập Bộ Dữ Liệu (Reproducibility)

### 1. Cài đặt Môi trường
```bash
pip install -r requirements.txt
```

### 2. Thực thi Toàn Bộ Pipeline Tự Động
```bash
python run_pipeline.py
```

### 3. Xem Tài Liệu Hướng Dẫn & Báo Cáo
- 🔬 **Kế hoạch nghiên cứu khoa học & WebGIS:** [`docs/research_execution_plan.md`](docs/research_execution_plan.md)
- 🛠️ **Hướng dẫn kỹ thuật bàn giao chi tiết:** [`docs/pipeline_handover_guide.md`](docs/pipeline_handover_guide.md)
- 📋 **Báo cáo kiểm định 5 tiêu chí nghiệm thu:** [`docs/quality_assessment_report.md`](docs/quality_assessment_report.md)
- 📘 **Kế hoạch xây dựng bộ dữ liệu không gian:** [`docs/dataset_research_plan.md`](docs/dataset_research_plan.md)

---

## ⚖️ Giấy phép & Trích Dẫn (Citation)
Dự án được phát triển phục vụ mục đích nghiên cứu khoa học y tế công cộng và công nghệ GIS. Khi sử dụng bộ dữ liệu, vui lòng trích dẫn tài liệu trong thư mục `docs/`.
