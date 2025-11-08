/* 
Thuộc tính	            Ý nghĩa
status	            Tình trạng đơn hàng: giúp admin cập nhật tiến trình
address.type	    "tài khoản" → lấy từ thông tin người dùng; "nhập mới" → nhập tay
address.value	    Địa chỉ thực tế để giao hàng
payment.method	    Hình thức thanh toán: mặc định là "tiền mặt"
payment.confirmed	Có thể dùng để xác nhận đã thanh toán (nếu là chuyển khoản/trực tuyến)
reviewed	        Cho biết khách đã xem lại đơn hàng sau khi đặt

Gợi ý giao diện
Khi khách chọn mua → hiển thị địa chỉ từ tài khoản hoặc cho phép nhập mới

Cho phép chọn hình thức thanh toán (radio hoặc select)

Sau khi đặt hàng → lưu reviewed: true để đánh dấu đã xem lại

vd:

const orders = [
  {
    id: "DH01",
    userId: "KH01",
    date: "2025-11-06",
    items: [
      { productId: "SP01", quantity: 1 }
    ],
    status: "processed", // hoặc: newly ordered,processed,delivered,cancelled

    // Địa chỉ nhận hàng
    address: {
      type: "tài khoản", // hoặc "nhập mới"
      value: "123 Lê Văn Sỹ, Q.3, TP.HCM"
    },

    // Hình thức thanh toán
    payment: {
      method: "tiền mặt", // hoặc "chuyển khoản", "trực tuyến"
      confirmed: true     // đã xác nhận thanh toán (nếu cần)
    },

    // Cho phép hiển thị lại đơn hàng sau khi mua
    reviewed: true // hoặc false nếu chưa xem lại
  }
];
*/

export const orders = [
    {
        id: "DH01",
        userId: "KH01",
        date: "2025-11-06",
        items: [{ productId: "SP01", quantity: 1 }],
        status: "newly ordered",
        address: {
            type: "tài khoản",
            value: "123 Lê Văn Sỹ, Q.3, TP.HCM"
        },
        payment: {
            method: "tiền mặt",
            confirmed: true
        },
        reviewed: true
    },
    {
        id: "DH02",
        userId: "KH02",
        date: "2025-11-07",
        items: [{ productId: "SP02", quantity: 2 }],
        status: "processed",
        address: {
            type: "nhập mới",
            value: "456 Nguyễn Trãi, Q.5, TP.HCM"
        },
        payment: {
            method: "chuyển khoản",
            confirmed: true
        },
        reviewed: false
    },
    {
        id: "DH03",
        userId: "KH03",
        date: "2025-11-08",
        items: [{ productId: "SP03", quantity: 1 }],
        status: "delivered",
        address: {
            type: "tài khoản",
            value: "789 Cách Mạng Tháng 8, Q.10, TP.HCM"
        },
        payment: {
            method: "trực tuyến",
            confirmed: true
        },
        reviewed: true
    },
    {
        id: "DH04",
        userId: "KH04",
        date: "2025-11-09",
        items: [{ productId: "SP04", quantity: 3 }],
        status: "newly ordered",
        address: {
            type: "nhập mới",
            value: "12 Trần Hưng Đạo, Q.1, TP.HCM"
        },
        payment: {
            method: "tiền mặt",
            confirmed: false
        },
        reviewed: false
    },
    {
        id: "DH05",
        userId: "KH05",
        date: "2025-11-10",
        items: [{ productId: "SP05", quantity: 1 }],
        status: "delivered",
        address: {
            type: "tài khoản",
            value: "88 Lý Thường Kiệt, Q.Tân Bình, TP.HCM"
        },
        payment: {
            method: "chuyển khoản",
            confirmed: true
        },
        reviewed: true
    },
    {
        id: "DH06",
        userId: "KH06",
        date: "2025-11-11",
        items: [{ productId: "SP06", quantity: 1 }],
        status: "processed",
        address: {
            type: "nhập mới",
            value: "99 Nguyễn Văn Cừ, Q.1, TP.HCM"
        },
        payment: {
            method: "trực tuyến",
            confirmed: true
        },
        reviewed: false
    },
    {
        id: "DH07",
        userId: "KH07",
        date: "2025-11-12",
        items: [{ productId: "SP07", quantity: 2 }],
        status: "cancelled",
        address: {
            type: "tài khoản",
            value: "15 Phan Đăng Lưu, Q.Bình Thạnh, TP.HCM"
        },
        payment: {
            method: "tiền mặt",
            confirmed: false
        },
        reviewed: false
    },
    {
        id: "DH08",
        userId: "KH08",
        date: "2025-11-13",
        items: [{ productId: "SP08", quantity: 1 }],
        status: "newly ordered",
        address: {
            type: "nhập mới",
            value: "22 Lê Duẩn, Q.1, TP.HCM"
        },
        payment: {
            method: "chuyển khoản",
            confirmed: true
        },
        reviewed: false
    },
    {
        id: "DH09",
        userId: "KH09",
        date: "2025-11-14",
        items: [{ productId: "SP09", quantity: 1 }],
        status: "delivered",
        address: {
            type: "tài khoản",
            value: "101 Võ Thị Sáu, Q.3, TP.HCM"
        },
        payment: {
            method: "trực tuyến",
            confirmed: true
        },
        reviewed: true
    },
    {
        id: "DH10",
        userId: "KH10",
        date: "2025-11-15",
        items: [{ productId: "SP10", quantity: 2 }],
        status: "newly ordered",
        address: {
            type: "nhập mới",
            value: "33 Nguyễn Đình Chiểu, Q.3, TP.HCM"
        },
        payment: {
            method: "tiền mặt",
            confirmed: false
        },
        reviewed: false
    }
];


