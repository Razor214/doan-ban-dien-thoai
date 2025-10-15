# 💻 Đồ án Website Bán Điện Thoại

## 🏫 Trường Đại học Sài Gòn – Khoa CNTT
**Môn:** Lập trình Web và Ứng dụng  
**Nhóm:** 04 

---

## 📘 Mô tả đề tài
Website bán điện thoại cho phép khách hàng xem, tìm kiếm, đặt hàng và quản lý tài khoản; đồng thời admin có thể quản lý sản phẩm, đơn hàng và tồn kho.
Web lấy icon: https://fontawesome.com/icons/
---

## 🧩 Tính năng chính

### 👤 Người dùng
1. Quản lý đăng nhập: 
Đăng kí
Đăng nhập / đăng xuất (khi đăng nhập hiển thị thông tin tài khoản đang đăng nhập)
Quản lý (xem / sửa) thông tin cá nhân.

2. Hiển thị và tìm kiếm sản phẩm:
Hiển thị sản phẩm theo phân loại (có phân trang)
Hiển thị chi tiết sản phẩm (thông tin chi tiết phù hợp với sản phẩm bán). 
Tìm kiếm sản phẩm (kết quả tìm kiếm có phân trang):
Tìm cơ bản: theo tên sản phẩm
Tìm nâng cao: theo tên sản phẩm, có chọn phân loại và khoảng giá (kết hợp nhiều tiêu chí trong một thao tác tìm kiếm)

3. Mua sản phẩm bằng giỏ hàng (khách hàng phải đăng kí và đăng nhập mới sử dụng được chức năng giỏ hàng): 
Chọn mua sản phẩm từ trang hiển thị theo loại và từ trang chi tiết sản phẩm
Cho phép thêm bớt sản phẩm trong giỏ hàng
Cho phép chọn địa chỉ nhận hàng từ tài khoản hoặc nhập địa chỉ giao hàng mới (thiết kế các control nhập liệu đủ và đúng cho từng trường hợp)
Cho phép chọn thanh toán tiền mặt/chuyển khoản hoặc thanh toán trực tuyến (mặc định chọn tiền mặt khi nhận hàng).
Xem lại đơn đặt hàng khi kết thúc quá trình mua.

4. Xem lại đơn hàng đã mua (đối với một khách hàng).
  

### 🛠️ Admin
1. Giao diện admin: 
Trang đăng nhập không dùng chung với khách hàng
Danh mục chức năng quản trị.

2. Quản lý người dùng / khách hàng: 
Hiển thị danh sách thông tin khách hàng
Reset mật khẩu
Khóa / mở khóa tài khoản

3. Quản lý loại sản phẩm: thêm, sửa, xóa / ẩn

4. Quản lý danh mục sản phẩm
Thêm sản phẩm: thông tin sản phẩm gồm loại, mã, tên, hình, mô tả.
Sửa sản phẩm: hiển thị đúng thông tin trước khi sửa.
Xóa / Ẩn sản phẩm

5. Quản lý Nhập sản phẩm
Hiển thị & tìm danh mục phiếu nhập hàng
Thêm phiếu nhập hàng: thông tin phiếu nhập gồm ngày nhập, giá nhập và số lượng của từng sản phẩm (không quản lý nhà cung cấp)
Sửa và hoàn thành phiếu nhập: chỉ có thể sửa phiếu nhập trước khi hoàn thành

6. Quản lý giá bán
Hiển thị & nhập / sửa thông tin tỉ lệ % lợi nhuận theo loại sản phẩm, theo sản phẩm trong từng loại.
Hiển thị & tra cứu giá vốn, % lợi nhuận, giá bán sản phẩm

7. Quản lý đơn đặt hàng của khách hàng
Quản lý và tra cứu đơn hàng theo (1) ngày đặt trong một khoảng thời gian; (2) theo tình trạng đơn hàng.
Xem chi tiết một đơn hàng và cập nhật tình trạng đơn hàng (mới đặt, đã xử lý, đã giao, hủy)

8. Quản lý số lượng tồn của sản phẩm
Tra cứu số lượng tồn của một sản phẩm, của sản phẩm theo loại tại một thời điểm
Cảnh báo sản phẩm sắp hết hàng
Tra cứu số lượng nhập – xuất – tồn của một sản phẩm, của sản phẩm trong một khoản thời gian.
  

---

## 🧠 Thành viên nhóm

| MSSV | Họ tên | Vai trò |
|------|---------|----------|
| 3124410069 | Võ Khải Đăng | Đăng ký / Đăng nhập / Hồ sơ cá nhân |
| 3124560091 | Nguyễn Vương Hoàng Tịnh | Hiển thị & tìm kiếm sản phẩm |
| 3124410159 | Nguyễn Lê Tiến Khoa | Giỏ hàng & đặt hàng, đơn đã mua |
| 3124560059 | Trương Đình Ngân | Admin: Quản lý người dùng + loại sản phẩm |
| 3124410140 | Trương Gia Khải |  Admin: Quản lý danh mục + nhập sản phẩm  |
| 3124410215 | Lê Uyên My | Admin: nhập hàng, đơn hàng, tồn kho |

---

## 🚀 Cách chạy website
1. Tải về:  
   ```bash
   git clone https://github.com/Razor241/doan-ban-dien-thoai.git
