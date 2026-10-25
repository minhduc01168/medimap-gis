# MediMap GIS

> **Hệ thống bản đồ số hóa và phân tích khả năng tiếp cận nguồn lực y tế vùng núi sử dụng Spatial Analysis và WebGIS**  
> *(Pilot: Cụm Thị xã Sa Pa, Huyện Bát Xát, Huyện Mường Khương — Tỉnh Lào Cai)*

---

## 📖 Giới thiệu (Abstract)

Dự án **MediMap GIS** được phát triển nhằm tự động hóa việc đánh giá và tối ưu hóa mạng lưới cơ sở y tế tuyến cơ sở tại khu vực miền núi hiểm trở phía Bắc Việt Nam, dựa trên hệ thống phân tích không gian (Spatial Analysis) kết hợp dữ liệu mở từ OpenStreetMap và cơ sở dữ liệu y tế địa phương.

Việc đánh giá khả năng tiếp cận y tế bằng bán kính đường chim bay truyền thống là không chính xác do đặc thù địa hình chia cắt, độ dốc lớn và hạ tầng giao thông hạn chế tại vùng cao. MediMap GIS giải quyết bài toán này thông qua:
1. **Automated Spatial Data Pipeline:** Tự động thu thập, chuẩn hóa tọa độ trạm y tế, trích xuất mạng lưới đường bộ (`osmnx`), dữ liệu cao độ (NASA SRTM 30m DEM) và mật độ dân số vi mô (WorldPop Constrained 100m).
2. **Topographic Impedance Routing:** Tích hợp hàm ma sát sườn dốc (Tobler's Hiking Function) vào mạng lưới giao thông đường bộ để tính toán thời gian di chuyển (Travel Time) thực tế cho xe máy và xe cấp cứu.
3. **Healthcare Deserts Identification:** Phân tích chồng lớp (Overlay Analysis) nhằm xác định các "Vùng lõm y tế" (>60 phút tiếp cận) và đề xuất các vị trí ưu tiên xây dựng trạm y tế mới.

---

## 🗺️ 4 Lớp Dữ liệu Lõi (Core Data Layers)

| Lớp Dữ Liệu | Nguồn Cấp | Định Dạng | Mô Tả |
| :--- | :--- | :--- | :--- |
| **Cơ sở Y tế** | Sở Y tế Lào Cai, BHYT | Point Vector (`.gpkg`) | ~55-60 cơ sở y tế (BVĐK, TTYT, TYT) được xác thực vệ tinh 100% |
| **Giao thông Vùng cao** | OpenStreetMap (OSM) via `osmnx` | Graph / Vector | Đồ thị mạng lưới đường miền núi có xét đến đường mòn và xe máy |
| **Cao độ & Địa hình** | NASA SRTM 30m DEM | Raster GeoTIFF | Cung cấp độ dốc ($\Delta h / d$) để gán trọng số thời gian di chuyển |
| **Dân cư Vi mô** | WorldPop 2020 Constrained | GeoTIFF 100m / H3 Grid | Phân bố dân cư bám sát bản làng thực tế vùng cao |

---

## 📂 Cấu trúc Dự án

```text
medimap_gis/
├── data/
│   ├── 01_raw/             # Dữ liệu gốc tải về
│   ├── 02_intermediate/    # Dữ liệu sau khi xử lý cắt/chuyển hệ toạ độ
│   └── 04_research_ready/  # Dataset đóng gói phục vụ nghiên cứu (.gpkg, .geojson)
├── docs/
│   └── dataset_research_plan.md  # Kế hoạch chi tiết xây dựng bộ dữ liệu nghiên cứu
├── scripts/                # Python data pipeline scripts
├── .gitignore
└── README.md
```

---

## 📑 Tài liệu Chi tiết

Xem chi tiết kế hoạch nghiên cứu và từ điển dữ liệu tại: [Kế hoạch Xây dựng Bộ Dữ liệu Nghiên cứu Không gian](docs/dataset_research_plan.md).

---

## ⚖️ Giấy phép (License)
Dự án được phát triển phục vụ mục đích nghiên cứu khoa học y tế công cộng và công nghệ GIS.
