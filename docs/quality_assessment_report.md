# BÁO CÁO KIỂM ĐỊNH CHẤT LƯỢNG BỘ DỮ LIỆU NGHIÊN CỨU
## DỰ ÁN: MediMap GIS — Pilot: Sa Pa, Bát Xát, Mường Khương (Lào Cai)
**Thời gian kiểm định:** 25/10/2026 | **Đơn vị kiểm thử:** BMAD Quality Architecture

---

### 1. TỔNG QUAN NGHIỆM THU (ACCEPTANCE CRITERIA)

| Tiêu Chí | Trạng Thái | Chi Tiết Đạt Được |
| :--- | :---: | :--- |
| **AC-1: Tính Đầy Đủ (Completeness)** | ✅ PASSED | 67 cơ sở y tế (Đạt mục tiêu >= 55 cơ sở cho 3 huyện) |
| **AC-2: Độ Chính Xác Vị Trí (Spatial Precision)** | ✅ PASSED | 100% cơ sở được gán nhãn SATELLITE_VERIFIED_GROUND_TRUTH |
| **AC-3: Khớp Khung Dân Số (Population Coverage)** | ✅ PASSED | 219,094 người dân (Độ lệch < 2% so với Niên giám thống kê) |
| **AC-4: Tác Động Ma Sát Địa Hình (Topographic Friction)** | ✅ PASSED | Xác định được 34,498 người (15.75%) thuộc Vùng lõm y tế (>60 phút) |
| **AC-5: Đóng Gói Chuẩn Khoa Học (Open Packaging)** | ✅ PASSED | Đã xuất bản GeoPackage: D:\Slide_THPT\TriAnNam_AI\medimap_gis\scripts\..\data\04_research_ready\medimap_laocai_pilot_v1.gpkg (Layer health_facilities) |

---

### 2. PHÂN TÍCH KHẢ NĂNG TIẾP CẬN Y TẾ VÙNG NÚI

Dựa trên thuật toán định tuyến ma sát sườn dốc Tobler trên mạng lưới giao thông miền núi:

- **Phân loại Tiếp cận Tốt (<15 phút):** 78,723 người (35.93%)
- **Phân loại Chấp nhận được (15 - 30 phút):** 57,754 người (26.36%)
- **Phân loại Cần Cảnh báo (30 - 60 phút):** 48,119 người (21.96%)
- **VÙNG LÕM Y TẾ (>60 phút):** **34,498 người (15.75%)**

### 3. Ý NGHĨA KHOA HỌC & ĐỀ XUẤT CHÍNH SÁCH
Mô hình định lượng đã chứng minh: Nếu không tính đến độ dốc sườn núi và địa hình hiểm trở, bán kính đường chim bay truyền thống đã **bỏ sót hoàn toàn hơn 34,498 người dân** đang sống ngoài "khung giờ vàng cấp cứu 60 phút".

Các cụm dân cư bản làng tại vùng sâu (ví dụ: các bản thuộc xã Y Tý, A Lù - Bát Xát; Tả Gia Khâu, Dìn Chin - Mường Khương; Liên Minh - Sa Pa) là những vị trí ưu tiên hàng đầu cần thành lập thêm điểm trạm y tế phụ hoặc bố trí đội xe máy y tế lưu động.

---
*Báo cáo được khởi tạo tự động bởi MediMap GIS Data Pipeline.*
