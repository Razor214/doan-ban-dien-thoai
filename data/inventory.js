/* function updateInventoryWithHistory(inventoryList, importList, orders) {
  // Reset dữ liệu
  inventoryList.forEach(sp => {
    sp.slNhap = 0;
    sp.slBan = 0;
    sp.slTon = 0;
    sp.history = [];
  });

  // Xử lý phiếu nhập
  importList.forEach(phieu => {
    if (phieu.status === "completed" || phieu.status === "hoàn tất") {
      phieu.items.forEach(item => {
        const sp = inventoryList.find(p => p.productId === item.productId);
        if (sp) {
          sp.slNhap += item.quantity;
          sp.history.push({
            ngay: phieu.date,
            hanhDong: "Nhập",
            soLuong: item.quantity
          });
        }
      });
    }
  });

  // Xử lý đơn hàng
  orders.forEach(order => {
    if (order.status === "đã giao" || order.status === "hoàn tất") {
      order.items.forEach(item => {
        const sp = inventoryList.find(p => p.productId === item.productId);
        if (sp) {
          sp.slBan += item.quantity;
          sp.history.push({
            ngay: order.date,
            hanhDong: "Bán",
            soLuong: item.quantity
          });
        }
      });
    }
  });

  // Tính tồn kho và cảnh báo
  inventoryList.forEach(sp => {
    sp.slTon = sp.slNhap - sp.slBan;
    sp.canhBao = sp.slTon < sp.minTon;
    sp.ngayCapNhat = new Date().toISOString().split("T")[0];
  });

  return inventoryList;
}
*/
export const inventoryList = [
    {
        id: "TK01",
        productId: "SP01",
        categoryId: "TH01",
        slNhap: 10,
        slBan: 1,
        slTon: 9,
        minTon: 10,
        maxTon: 50,
        ngayCapNhat: "2025-11-06",
        history: [
            { ngay: "2025-10-20", hanhDong: "Nhập", soLuong: 10 },
            { ngay: "2025-11-06", hanhDong: "Bán", soLuong: 1 }
        ],
        trangThai: "cần nhập thêm"
    },
    {
        id: "TK02",
        productId: "SP02",
        categoryId: "TH01",
        slNhap: 10,
        slBan: 2,
        slTon: 8,
        minTon: 10,
        maxTon: 50,
        ngayCapNhat: "2025-11-07",
        history: [
            { ngay: "2025-10-25", hanhDong: "Nhập", soLuong: 10 },
            { ngay: "2025-11-07", hanhDong: "Bán", soLuong: 2 }
        ],
        trangThai: "cần nhập thêm"
    },
    {
        id: "TK03",
        productId: "SP03",
        categoryId: "TH02",
        slNhap: 10,
        slBan: 1,
        slTon: 9,
        minTon: 10,
        maxTon: 50,
        ngayCapNhat: "2025-11-08",
        history: [
            { ngay: "2025-10-26", hanhDong: "Nhập", soLuong: 10 },
            { ngay: "2025-11-08", hanhDong: "Bán", soLuong: 1 }
        ],
        trangThai: "cần nhập thêm"
    },
    {
        id: "TK04",
        productId: "SP04",
        categoryId: "TH03",
        slNhap: 10,
        slBan: 3,
        slTon: 7,
        minTon: 10,
        maxTon: 50,
        ngayCapNhat: "2025-11-09",
        history: [
            { ngay: "2025-10-27", hanhDong: "Nhập", soLuong: 10 },
            { ngay: "2025-11-09", hanhDong: "Bán", soLuong: 3 }
        ],
        trangThai: "cần nhập thêm"
    },
    {
        id: "TK05",
        productId: "SP05",
        categoryId: "TH04",
        slNhap: 10,
        slBan: 1,
        slTon: 9,
        minTon: 10,
        maxTon: 50,
        ngayCapNhat: "2025-11-10",
        history: [
            { ngay: "2025-10-28", hanhDong: "Nhập", soLuong: 10 },
            { ngay: "2025-11-10", hanhDong: "Bán", soLuong: 1 }
        ],
        trangThai: "cần nhập thêm"
    },
    {
        id: "TK06",
        productId: "SP06",
        categoryId: "TH05",
        slNhap: 10,
        slBan: 1,
        slTon: 9,
        minTon: 10,
        maxTon: 50,
        ngayCapNhat: "2025-11-11",
        history: [
            { ngay: "2025-10-29", hanhDong: "Nhập", soLuong: 10 },
            { ngay: "2025-11-11", hanhDong: "Bán", soLuong: 1 }
        ],
        trangThai: "cần nhập thêm"
    },
    {
        id: "TK07",
        productId: "SP07",
        categoryId: "TH06",
        slNhap: 10,
        slBan: 2,
        slTon: 8,
        minTon: 10,
        maxTon: 50,
        ngayCapNhat: "2025-11-12",
        history: [
            { ngay: "2025-10-30", hanhDong: "Nhập", soLuong: 10 },
            { ngay: "2025-11-12", hanhDong: "Bán", soLuong: 2 }
        ],
        trangThai: "cần nhập thêm"
    },
    {
        id: "TK08",
        productId: "SP08",
        categoryId: "TH07",
        slNhap: 10,
        slBan: 1,
        slTon: 9,
        minTon: 10,
        maxTon: 50,
        ngayCapNhat: "2025-11-13",
        history: [
            { ngay: "2025-11-01", hanhDong: "Nhập", soLuong: 10 },
            { ngay: "2025-11-13", hanhDong: "Bán", soLuong: 1 }
        ],
        trangThai: "cần nhập thêm"
    },
    {
        id: "TK09",
        productId: "SP09",
        categoryId: "TH08",
        slNhap: 10,
        slBan: 1,
        slTon: 9,
        minTon: 10,
        maxTon: 50,
        ngayCapNhat: "2025-11-14",
        history: [
            { ngay: "2025-11-02", hanhDong: "Nhập", soLuong: 10 },
            { ngay: "2025-11-14", hanhDong: "Bán", soLuong: 1 }
        ],
        trangThai: "cần nhập thêm"
    },
    {
        id: "TK10",
        productId: "SP10",
        categoryId: "TH09",
        slNhap: 10,
        slBan: 2,
        slTon: 8,
        minTon: 10,
        maxTon: 50,
        ngayCapNhat: "2025-11-15",
        history: [
            { ngay: "2025-11-03", hanhDong: "Nhập", soLuong: 10 },
            { ngay: "2025-11-15", hanhDong: "Bán", soLuong: 2 }
        ],
        trangThai: "cần nhập thêm"
    }
];
