const userList = [
    {
        id: "admin",
        fullName: "Quản Trị Viên",
        username: "admin",
        email: "admin@saigonphone.com",
        phone: "0900000000",
        pass: "admin123",
        status: "active",
        address: "TP.HCM",
        role: "admin"
    },
    {
        id: "KH01",
        fullName: "Lê Thị Bích Ngọc",
        username: "bichngoc91",
        email: "bichngoc91@gmail.com",
        phone: "0938123471",
        pass: "ngoc2023",
        status: "active",
        address: "123 Lê Văn Sỹ, Q.3, TP.HCM",
        role: "user"
    },
    {
        id: "KH02",
        fullName: "Trần Văn Minh",
        username: "minhtran88",
        email: "minhtran88@gmail.com",
        phone: "0902456789",
        pass: "minhpass88",
        status: "active",
        address: "45 Nguyễn Trãi, Q.5, TP.HCM",
        role: "user"
    },
    {
        id: "KH03",
        fullName: "Phạm Quốc Huy",
        username: "huyphamqk",
        email: "huyphamqk@gmail.com",
        phone: "0912345670",
        pass: "huy123qk",
        status: "active",
        address: "78 Cách Mạng Tháng 8, Q.10, TP.HCM",
        role: "user"
    },
    {
        id: "KH04",
        fullName: "Nguyễn Thị Lan Anh",
        username: "lananh2000",
        email: "lananh2000@gmail.com",
        phone: "0978123456",
        pass: "lananh2000",
        status: "active",
        address: "12 Nguyễn Văn Cừ, Q.1, TP.HCM",
        role: "user"
    },
    {
        id: "KH05",
        fullName: "Đặng Văn Tuấn",
        username: "tuandang96",
        email: "tuandang96@gmail.com",
        phone: "0967890123",
        pass: "tuan96pass",
        status: "active",
        address: "56 Trường Chinh, Q.Tân Bình, TP.HCM",
        role: "user"
    },
    {
        id: "KH06",
        fullName: "Hoàng Thị Như Ý",
        username: "nhuyhoang",
        email: "nhuyhoang@gmail.com",
        phone: "0945123789",
        pass: "nhuy2024",
        status: "active",
        address: "89 Lý Thường Kiệt, Q.Tân Phú, TP.HCM",
        role: "user"
    },
    {
        id: "KH07",
        fullName: "Vũ Đức Long",
        username: "longvuduc",
        email: "longvuduc@gmail.com",
        phone: "0934567890",
        pass: "longpass",
        status: "active",
        address: "34 Phan Đăng Lưu, Q.Bình Thạnh, TP.HCM",
        role: "user"
    },
    {
        id: "KH08",
        fullName: "Bùi Thị Hồng",
        username: "hongbui89",
        email: "hongbui89@gmail.com",
        phone: "0923456781",
        pass: "hongbui89",
        status: "active",
        address: "67 Nguyễn Thị Minh Khai, Q.1, TP.HCM",
        role: "user"
    },
    {
        id: "KH09",
        fullName: "Đỗ Văn Quang",
        username: "quangdo77",
        email: "quangdo77@gmail.com",
        phone: "0956781234",
        pass: "quang77do",
        status: "active",
        address: "101 Hoàng Văn Thụ, Q.Phú Nhuận, TP.HCM",
        role: "user"
    },
    {
        id: "KH10",
        fullName: "Ngô Thị Mai",
        username: "maingo92",
        email: "maingo92@gmail.com",
        phone: "0901234567",
        pass: "ngoMai92",
        status: "active",
        address: "88 Nguyễn Đình Chiểu, Q.3, TP.HCM",
        role: "user"
    }
];

// Khởi tạo dữ liệu nếu chưa có
if (!localStorage.getItem("ListUser") || JSON.parse(localStorage.getItem("ListUser")).length === 0) {
    localStorage.setItem("ListUser", JSON.stringify(userList));
    console.log('✅ Đã khởi tạo dữ liệu mẫu với', userList.length, 'users');
}