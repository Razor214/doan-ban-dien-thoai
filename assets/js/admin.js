/* ======================================================
   🔹 QUẢN LÝ SẢN PHẨM
====================================================== */
const productModal = document.getElementById('ProductPopup');
const productForm = document.getElementById('ProductForm');
const productTable = document.querySelector('#ProductTable tbody');
const cancelProduct = document.getElementById('cancelProduct');

if (typeof productList !== "undefined") {
    productTable.innerHTML = productList.map(p => `
    <tr>
      <td>${p.type}</td>
      <td>${p.code}</td>
      <td>${p.name}</td>
      <td><img src="${p.img || 'assets/img/logo.png'}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;"></td>
      <td>${p.desc}</td>
      <td class="action">
        <button class="edit" onclick="openProductModal('edit', this)">Sửa</button>
        <button class="delete" onclick="deleteProduct(this)">Xóa</button>
      </td>
    </tr>
  `).join("");
} else {
    console.warn("⚠️ products.js chưa được nạp.");
}

function openProductModal(mode, btn) {
    productForm.reset();
    productModal.style.display = 'flex';
    editingRow = null;

    if (mode === 'edit' && btn) {
        const row = btn.closest('tr');
        document.getElementById('prodType').value = row.cells[0].innerText;
        document.getElementById('prodCode').value = row.cells[1].innerText;
        document.getElementById('prodName').value = row.cells[2].innerText;
        document.getElementById('prodImg').value = row.cells[3].querySelector('img').src;
        document.getElementById('prodDesc').value = row.cells[4].innerText;
        editingRow = row;
    }
}

productForm.onsubmit = e => {
    e.preventDefault();
    const newProd = {
        type: document.getElementById('prodType').value.trim(),
        code: document.getElementById('prodCode').value.trim(),
        name: document.getElementById('prodName').value.trim(),
        image: document.getElementById('prodImg').value.trim() || 'assets/img/logo.png',
        desc: document.getElementById('prodDesc').value.trim()
    };

    if (!newProd.type || !newProd.code || !newProd.name) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (editingRow) {
        const index = editingRow.rowIndex - 1;
        products[index] = newProd;
    } else {
        products.push(newProd);
    }

    localStorage.setItem('products', JSON.stringify(products));
    renderProductTable();
    productModal.style.display = 'none';
};

cancelProduct.onclick = () => productModal.style.display = 'none';

function deleteProduct(btn) {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        const row = btn.closest('tr');
        const code = row.cells[1].innerText;
        products = products.filter(p => p.code !== code);
        localStorage.setItem('products', JSON.stringify(products));
        renderProductTable();
    }
}

function searchProductCategory() {
    const keyword = document.getElementById('searchProductCategory').value.trim().toLowerCase();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.code.toLowerCase().includes(keyword) ||
        p.type.toLowerCase().includes(keyword)
    );
    renderProductTable(filtered);
}

//Quản lý giá bán
const priceModal = document.getElementById('popup');
const form = document.getElementById('productadd');
const cancelBtn = document.getElementById('cancelBtn');
const table = document.querySelector('#Bangsp tbody');
const searchInput = document.getElementById('Timkiem')
const categoryInput = document.getElementById('category');
const nameInput = document.getElementById('name');
const costInput = document.getElementById('cost');
const profitInput = document.getElementById('profit');
const priceInput = document.getElementById('sell');

let editingRow = null;
const data = [
    { "brand": "Apple", "name": "iPhone 15", "cost": 20000000, "profit": 15, "price": 23000000 },
    { "brand": "Samsung", "name": "Samsung Galaxy A17 5G", "cost": 4000000, "profit": 15, "price": 6590000 },
    { "brand": "Oppo", "name": "Oppo A6 Pro", "cost": 5900000, "profit": 15, "price": 7490000 },
    { "brand": "Xiaomi", "name": "Xiaomi 15T Pro 5G", "cost": 15000000, "profit": 10, "price": 18490000 },
    { "brand": "Apple", "name": "iPhone Air 256G", "cost": 28300000, "profit": 15, "price": 31490000 },
    { "brand": "Samsung", "name": "Samsung Galaxy S25 FE 5G", "cost": 12200000, "profit": 10, "price": 14390000 },
    { "brand": "Vivo", "name": "Vivo V60 5G", "cost": 12300000, "profit": 12, "price": 15990000 },
    { "brand": "Samsung", "name": "Samsung Galaxy S25 Ultra 5G", "cost": 24500000, "profit": 14, "price": 27280000 },
    { "brand": "Apple", "name": "iPhone 16", "cost": 18000000, "profit": 15, "price": 21590000 }
];
table.innerHTML = data.map(sp => `
    <tr>
        <td>${sp.brand}</td>
        <td>${sp.name}</td>
        <td>${sp.cost.toLocaleString("vi-VN")}</td>
        <td>${sp.profit}%</td>
        <td>${sp.price.toLocaleString("vi-VN")}</td>
        <td class="action">
            <button class="edit">Sửa</button> 
            <button class="delete">Xóa</button>
        </td>
    </tr>
    `).join("");
table.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {
        openPriceModal("edit", e.target);
    } else if (e.target.classList.contains("delete")) {
        confirmDelete(e.target);
    }
});

function openPriceModal(mode, btn) {
    form.reset();
    priceInput.value = '';
    priceModal.style.display = 'flex';
    editingRow = null;

    if (mode === 'edit' && btn) {
        const row = btn.closest('tr');
        categoryInput.value = row.cells[0].innerText;
        nameInput.value = row.cells[1].innerText;
        costInput.value = row.cells[2].innerText.replace(/,/g, '');
        profitInput.value = parseFloat(row.cells[3].innerText);
        priceInput.value = row.cells[4].innerText.replace(/,/g, '');
        editingRow = row;
    }
}

cancelBtn.onclick = () => priceModal.style.display = 'none';

costInput.addEventListener('input', updatePrice);
profitInput.addEventListener('input', updatePrice);
priceInput.addEventListener('input', updateProfit);

function cleanNumber(value) {
    return parseFloat(value.replace(/[.,\s]/g, '')) || 0;
}
function formatNumber(num) {
    return num.toLocaleString('vi-VN');
}
function updatePrice() {
    const cost = cleanNumber(costInput.value);
    const profit = parseFloat(profitInput.value);
    if (cost > 0 && !isNaN(profit)) {
        const price = cost + (cost * profit / 100);
        priceInput.value = formatNumber(Math.round(price));
    } else {
        priceInput.value = '';
    }
}

function updateProfit() {
    const cost = cleanNumber(costInput.value);
    const price = cleanNumber(priceInput.value);
    if (cost > 0 && price > 0) {
        const profit = ((price - cost) / cost) * 100;
        profitInput.value = profit.toFixed(2);
    }
}
function formatOnInput(input) {
    let val = cleanNumber(input.value);
    input.value = val ? formatNumber(val) : '';
}

form.onsubmit = (e) => {
    e.preventDefault();
    const category = categoryInput.value;
    const name = nameInput.value;
    const cost = costInput.value;
    const profit = profitInput.value;
    const price = priceInput.value;

    if (!category || !name || !cost || !profit) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    if (editingRow) {
        editingRow.cells[0].innerText = category;
        editingRow.cells[1].innerText = name;
        editingRow.cells[2].innerText = cost;
        editingRow.cells[3].innerText = profit + '%';
        editingRow.cells[4].innerText = price;
    } else {
        const row = table.insertRow();
        row.innerHTML = `
                <td>${category}</td>
                <td>${name}</td>
                <td>${cost}</td>
                <td>${profit}%</td>
                <td>${price}</td>
                <td class="action">
                    <button class="edit" onclick="openModal('edit', this)">Sửa</button>
                    <button class="delete" onclick="confirmDelete(this)">Xóa</button>
                </td>
            `;
    }
    priceModal.style.display = 'none';
};

function searchProduct() {
    const keyword = searchInput.value.trim().toLowerCase();
    const rows = table.getElementsByTagName('tr');

    for (let row of rows) {
        const productName = row.cells[1].innerText.toLowerCase();
        row.style.display = productName.startsWith(keyword) || keyword === '' ? '' : 'none';

    }
}
searchInput.addEventListener('input', searchProduct);
costInput.addEventListener('blur', () => {
    let val = cleanNumber(costInput.value);
    costInput.value = val ? formatNumber(val) : '';
});
priceInput.addEventListener('blur', () => {
    let val = cleanNumber(priceInput.value);
    priceInput.value = val ? formatNumber(val) : '';
});
updatePrice();


function confirmDelete(btn) {
    const popup = document.getElementById('xacnhan');
    popup.style.display = 'flex';
    const row = btn.closest('tr');
    document.getElementById('xacnhanxoa').onclick = () => {
        row.remove();
        popup.style.display = 'none';
    };
    document.getElementById('xacnhankhong').onclick = () => popup.style.display = 'none';
}

function confirmExit() {
    openSection("home-section");
    document.getElementById('xacnhanthoat').style.display = 'none';
    document.getElementById('price-section').style.display = 'none';
    document.getElementById('home-section').style.display = 'block';
    document.getElementById('confirmno').onclick = () => document.getElementById('xacnhanthoat').style.display = 'none';
}

function exportData() {
    document.getElementById('Xuatfile').style.display = 'flex';
    document.getElementById('confirm').onclick = () => {
        alert('Xuất dữ liệu thành công!');
        document.getElementById('Xuatfile').style.display = 'none';
    };
    document.getElementById('confirm-no').onclick = () => document.getElementById('Xuatfile').style.display = 'none';
}
//Quản lý đơn đặt hàng 
const orderData = [
    {
        "id": "AB100",
        "customer": "Nguyễn Văn A",
        "date": "2025-10-20",
        "total": 34000000,
        "status": "Đã giao",
        "details": [
            { "product": "iPhone 17", "quantity": 1, "price": 34000000 }
        ]

    },
    {
        "id": "AB101",
        "customer": "Lê Thị C",
        "date": "2025-10-28",
        "total": 29990000,
        "status": "Đang xác nhận",
        "details": [
            { "product": "Samsung Galaxy Z Fold5", "quantity": 1, "price": 29990000 }
        ]

    },
    {
        "id": "AB102",
        "customer": "Ngô Văn B",
        "date": "2025-9-25",
        "total": 35090000,
        "status": "Đã hủy",
        "details": [
            { "product": "iPhone 13", "quantity": 1, "price": 8090000 },
            { "product": "iPhone 17", "quantity": 1, "price": 35000000 }
        ]


    },
    {
        "id": "AB103",
        "customer": "Ly Thanh V",
        "date": "2025-10-25",
        "total": 14000000,
        "status": "Đang vận chuyển",
        "details": [
            { "product": "iPhone 14", "quantity": 1, "price": 14000000 }
        ]
    },
    {
        "id": "AB100",
        "customer": "Nguyễn Lê Thị D",
        "date": "2025-8-10",
        "total": 25000000,
        "status": "Đã giao",
        "details": [
            { "product": "iPhone 17", "quantity": 1, "price": 25000000 }
        ]
    }
];
displayOrder(orderData);
function displayOrder(orders) {
    const tableBody = document.getElementById("orderTable");
    tableBody.innerHTML = "";

    orders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.total.toLocaleString()}đ</td>
            <td>${order.status}</td>
            <td><button onclick ="showDetails('${order.id}')">Xem chi tiết</button></td>
        `;
        tableBody.appendChild(row);
    });
}
function Orders() {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const status = document.getElementById("status").value;

    const filtered = orderData.filter(order => {
        const orderDate = new Date(order.date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const inDateRange = (!from || orderDate >= from) && (!to || orderDate <= to);
        const statusMatch = !status || order.status === status;
        return inDateRange && statusMatch;
    });
    displayOrder(filtered);
}
function showDetails(orderId) {
    const order = orderData.find(o => o.id === orderId);
    const popup = document.getElementById("details");

    document.getElementById("detail-id").textContent = order.id;
    document.getElementById("detail-cus").textContent = order.customer;
    document.getElementById("detail-date").textContent = order.date;
    document.getElementById("detail-total").textContent = order.total.toLocaleString() + " đ";
    const select = document.getElementById("detailsstatus");
    select.value = order.status;
    const statusFlow = [
        "Đang xác nhận",
        "Đang xử lý",
        "Đang vận chuyển",
        "Đã hủy",
        "Đã giao"
    ];
    const current = statusFlow.indexOf(order.status);
    for (let option of select.options) {
        const optionIndex = statusFlow.indexOf(option.value);
        if (order.status == "Đã giao" || order.status == "Đã hủy") {
            option.disabled = option.value !== order.status;
        } else {
            option.disabled = optionIndex < current;
        }
    }
    const listBody = document.querySelector("#list tbody");
    listBody.innerHTML = order.details.map(d => `
        <tr>
            <td>${d.product}</td>
            <td>${d.quantity}</td>
            <td>${d.price.toLocaleString()} đ</td>
        </tr>
    `).join("");
    popup.style.display = "flex";
}
function closeDetails() {
    document.getElementById("details").style.display = "none";
}
function closeMain() {
    openSection("home-section");
}
function update() {
    const id = document.getElementById("detail-id").textContent;
    const newStatus = document.getElementById("detailsstatus").value;

    const order = orderData.find(o => o.id === id);
    if (order) {
        order.status = newStatus;
        displayOrder(orderData); // Cập nhật lại bảng
        alert("Đã cập nhật trạng thái đơn hàng!");
        closeDetails();
    } else {
        alert("Không tìm thấy đơn hàng để cập nhật!");
    }
}
//Quản lý tồn kho

const tableBody = document.querySelector('#Table tbody');
const tonkhoModal = document.getElementById('detailModal');
const summaryModal = document.getElementById('popup-modal');
const btnSearch = document.getElementById('Btnsearch');
const exportBtn = document.getElementById('exportBtn');
const viewDetails = document.querySelector('.view-details');
const closeBtns = document.querySelectorAll('.close-modal, .close-popup');
const nameSearch = document.getElementById('Namesearch');
const nhanhieuSelect = document.getElementById('danhsach');
let inventory = [];
let filterData = [];
const TonData = [
    {
        "maSP": "SP001",
        "tenSP": "iPhone 15 Pro Max 256GB",
        "nhanHieu": "Apple",
        "khoHang": "Cửa hàng Quận 8",
        "ghiChu": "Hàng mới về, nguyên seal",
        "slNhap": 50,
        "slXuat": 35,
        "slTon": 15,
        "ngayCapNhat": "2025-10-27",
        "trangThai": "ok",
        "minTon": 10,
        "maxTon": 50,
        "history": [
            { "ngay": "2025-10-27", "hanhDong": "Nhập", "soLuong": 20, "nguoiThucHien": "Nguyễn Thị T" },
            { "ngay": "2025-10-25", "hanhDong": "Xuất", "soLuong": 5, "nguoiThucHien": "Trần Thị V" },
            { "ngay": "2025-10-20", "hanhDong": "Nhập", "soLuong": 30, "nguoiThucHien": "Lê Văn C" },
            { "ngay": "2025-10-18", "hanhDong": "Xuất", "soLuong": 30, "nguoiThucHien": "Phạm Minh T" }
        ]
    },
    {
        "maSP": "SP002",
        "tenSP": "Samsung Galaxy A80",
        "nhanHieu": "Samsung",
        "khoHang": "Cửa hàng Quận 5",
        "ghiChu": "Hàng mới về, nguyên seal",
        "slNhap": 80,
        "slXuat": 78,
        "slTon": 2,
        "ngayCapNhat": "2025-10-31",
        "trangThai": "low",
        "minTon": 5,
        "maxTon": 80,
        "history": [
            { "ngay": "2025-10-31", "hanhDong": "Xuất", "soLuong": 16, "nguoiThucHien": "Nguyễn Thị T" },
            { "ngay": "2025-10-25", "hanhDong": "Nhập", "soLuong": 16, "nguoiThucHien": "Trần Thị V" }
        ]
    },
    {
        "maSP": "SP003",
        "tenSP": "iPhone 17 Pro Max TB",
        "nhanHieu": "Apple",
        "khoHang": "Cửa hàng Quận 10",
        "ghiChu": "Hàng mới về, nguyên seal",
        "slNhap": 20,
        "slXuat": 20,
        "slTon": 0,
        "ngayCapNhat": "2025-10-29",
        "trangThai": "out",
        "minTon": 3,
        "maxTon": 25,
        "history": [
            { "ngay": "2025-10-29", "hanhDong": "Xuất", "soLuong": 20, "nguoiThucHien": "Nguyễn Thị T" },
            { "ngay": "2025-10-25", "hanhDong": "Nhập", "soLuong": 16, "nguoiThucHien": "Nguyễn Xuân A" }
        ]
    },
    {
        "maSP": "SP004",
        "tenSP": "Redmi Note 2",
        "nhanHieu": "Xiaomi",
        "khoHang": "Cửa hàng Quận 8",
        "ghiChu": "Hàng mới về, nguyên seal",
        "slNhap": 45,
        "slXuat": 5,
        "slTon": 40,
        "ngayCapNhat": "2025-10-22",
        "trangThai": "ok",
        "minTon": 10,
        "maxTon": 50,
        "history": [
            { "ngay": "2025-10-22", "hanhDong": "Nhập", "soLuong": 20, "nguoiThucHien": "Nguyễn Thị T" }
        ]
    }
];
inventory = TonData;
displayTon(TonData);
renderSummary(TonData);
function displayTon(data) {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Không tìm thấy sản phẩm.</td></tr>';
        return;
    }
    data.forEach(item => {
        const row = document.createElement('tr');
        let statusText = 'Còn hàng', statusClass = 'ok';
        if (item.slTon === 0) { statusText = 'Hết hàng'; statusClass = 'out'; }
        else if (item.slTon <= item.minTon) { statusText = 'Sắp hết'; statusClass = 'low'; }
        row.innerHTML = `
            <td>${item.maSP}</td>
            <td>${item.nhanHieu}</td>
            <td>${item.tenSP}</td>
            <td>${item.slNhap.toLocaleString()}</td>
            <td>${item.slXuat.toLocaleString()}</td>
            <td>${item.slTon.toLocaleString()}</td>
            <td>${item.ngayCapNhat}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
        `;
        row.addEventListener('click', () => openModal(item));
        tableBody.appendChild(row);
    });
}
function renderSummary(data) {
    document.getElementById('outcount').textContent = data.filter(i => i.slTon === 0).length;
    document.getElementById('lowcount').textContent = data.filter(i => i.slTon > 0 && i.slTon <= i.minTon).length;
    document.getElementById('okcount').textContent = data.filter(i => i.slTon > i.minTon).length;
}
function openModal(item) {
    if (!tonkhoModal) return;
    document.getElementById('modalMaSP').textContent = item.maSP;
    document.getElementById('modalTenSP').textContent = item.tenSP;
    document.getElementById('modalNhanhieuSP').textContent = item.nhanHieu;
    document.getElementById('modalGhichuSP').textContent = item.ghiChu || 'Không có ghi chú';

    const historyBody = document.getElementById('modalHistoryBody');
    historyBody.innerHTML = '';
    if (item.history && item.history.length > 0) {
        item.history
            .sort((a, b) => new Date(b.ngay) - new Date(a.ngay))
            .slice(0, 5)
            .forEach(hist => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${hist.ngay}</td>
                    <td class="${hist.hanhDong === 'Xuất' ? 'action-xuat' : 'action-nhap'}">${hist.hanhDong}</td>
                    <td>${hist.soLuong.toLocaleString()}</td>
                    <td>${hist.nguoiThucHien}</td>
                `;
                historyBody.appendChild(row);
            });
    } else {
        historyBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Không có lịch sử nhập/xuất gần đây.</td></tr>';
    }
    tonkhoModal.classList.add('show');
}
function openSummaryModal() {
    if (!summaryModal) return;
    const outOfStock = inventory.filter(item => item.slTon === 0);
    const lowStock = inventory.filter(item => item.slTon > 0 && item.slTon <= item.minTon);
    const inStock = inventory.filter(item => item.slTon > item.minTon);
    document.getElementById('sum-outcount').textContent = `(${outOfStock.length})`;
    document.getElementById('sum-lowcount').textContent = `(${lowStock.length})`;
    document.getElementById('sum-okcount').textContent = `(${inStock.length})`;
    const outList = document.getElementById('sum-outList');
    const lowList = document.getElementById('sum-lowlist');
    const okList = document.getElementById('sum-oklist');
    const createListItems = (list) => list.map(item =>
        `<li><span class="summary-code">[${item.maSP}]</span> ${item.tenSP}</li>`
    ).join('');

    outList.innerHTML = outOfStock.length ? createListItems(outOfStock) : '<li>Không có sản phẩm nào.</li>';
    lowList.innerHTML = lowStock.length ? createListItems(lowStock) : '<li>Không có sản phẩm nào.</li>';
    okList.innerHTML = inStock.length ? createListItems(inStock) : '<li>Không có sản phẩm nào.</li>';

    summaryModal.classList.add('show');
}
if (btnSearch) {
    btnSearch.addEventListener('click', () => {
        const keyword = nameSearch.value.trim().toLowerCase();
        const nhanHieu = nhanhieuSelect.value;
        const start = document.getElementById("startDate").value;
        const end = document.getElementById("endDate").value;
        // Hàm chuẩn hóa ngày (dd/mm/yyyy -> yyyy-mm-dd)
        const normalizeDate = (dateStr) => {
            if (!dateStr) return null;
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return dateStr;
        };
        // Chuẩn hóa và tạo đối tượng Date
        const startDate = normalizeDate(start) ? new Date(normalizeDate(start)) : null;
        let endDate = normalizeDate(end) ? new Date(normalizeDate(end)) : null;

        // Đẩy giờ lên cuối ngày cho ngày kết thúc
        if (endDate) {
            endDate.setHours(23, 59, 59, 999);
        }
        filterData = inventory.filter(item => {
            const itemDate = new Date(item.ngayCapNhat);
            const keywordMatch = !keyword || item.maSP.toLowerCase().includes(keyword) || item.tenSP.toLowerCase().includes(keyword);
            const brandMatch = !nhanHieu || item.nhanHieu === nhanHieu;
            const dateStartMatch = !startDate || itemDate >= startDate;
            const dateEndMatch = !endDate || itemDate <= endDate;

            return keywordMatch && brandMatch && dateStartMatch && dateEndMatch;
        });
        displayTon(filterData);
        renderSummary(filterData);
    });
}
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        alert('Đã xuất báo cáo thành công! (Dữ liệu dựa trên kết quả lọc hiện tại)');
    });
}

if (viewDetails) {
    viewDetails.addEventListener('click', (e) => {
        e.preventDefault();
        openSummaryModal();
    });
}
closeBtns.forEach(btn => {
    btn.onclick = function () {
        if (tonkhoModal) tonkhoModal.classList.remove('show');
        if (summaryModal) summaryModal.classList.remove('show');
    }
});
function closeInventory() {
    const stockSection = document.getElementById("stock-section");
    if (stockSection) stockSection.style.display = "none";
    const modal = document.getElementById("detailModal");
    const popup = document.getElementById("popup-modal");
    if (modal) modal.classList.remove("show");
    if (popup) popup.classList.remove("show");
    openSection("home-section");

}
function openDetailModal(item) {
    tonkhoModal.classList.add('show');
}
function closeModal() {
    tonkhoModal.classList.remove('show');
}
function openminiPU() {
    summaryModal.classList.add('show');
}
function closeMiniPU() {
    summaryModal.classList.remove('show');
}

// sidebar
document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".sidebar-menu a");

    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const target = item.dataset.section;
            openSection(`${target}-section`);
        });
    });

    // Hiển thị mặc định
    openSection("home-section");
});
function openSection(id) {
    // Ẩn tất cả section
    document.querySelectorAll(".admin-section").forEach(sec => {
        sec.style.display = "none";
    });

    // Ẩn tất cả popup/modal nếu có
    document.querySelectorAll(".modal, .popup").forEach(p => {
        p.style.display = "none";
        p.classList.remove("show");
    });

    // Hiện section được chọn
    const target = document.getElementById(id);
    if (target) target.style.display = "block";
}

// Quan ly loai san pham
const categoryPopup = document.getElementById("category-popup");
const categoryForm = document.getElementById("category-form");
const categoryCancel = document.getElementById("category-cancel");
const categoryTable = document.getElementById("data1");
const addBtn = document.getElementById("add");

let categorys_data_local = [];
let editingIndex = null;

// Đóng giao diện quản lý
function closeData1() {
    document.getElementById("category-section").style.display = "none";
    document.getElementById("home-section").style.display = "block";
}

// Lấy dữ liệu từ localStorage nếu có
const savedCategorys = localStorage.getItem("categorys_data");
categorys_data_local = savedCategorys ? JSON.parse(savedCategorys) : categorys_data;

// Hiển thị bảng thương hiệu
function renderCategorys() {
    categoryTable.innerHTML = categorys_data_local.map((ct, index) => {
        const isHidden = ct.status === "inactive";

        return `
            <tr data-index="${index}" class="${isHidden ? 'fade-out' : ''}">
                <td>${isHidden ? "Đã ẩn" : ct.id}</td>
                <td>${isHidden ? "Đã ẩn" : ct.brand}</td>
                <td>${isHidden ? "Đã ẩn" : ct.country}</td>
                <td>${isHidden ? "Đã ẩn" : ct.desc}</td>
                <td class="status1">${ct.status}</td>
                <td class="action1">
                    <button class="toggle">${ct.status === "active" ? "Ẩn" : "Hiện"}</button>
                    <button class="delete" ${isHidden ? "disabled" : ""}>Xóa</button>
                    <button class="edit" ${isHidden ? "disabled" : ""}>Sửa</button> 
                </td>
            </tr>
        `;
    }).join("");

    attachEventHandlers();
}

// Gắn sự kiện cho các nút
function attachEventHandlers() {
    const rows = categoryTable.querySelectorAll("tr");

    rows.forEach(row => {
        const index = row.dataset.index;
        const toggleBtn = row.querySelector(".toggle");
        const deleteBtn = row.querySelector(".delete");
        const editBtn = row.querySelector(".edit");

        // Ẩn / Hiện
        toggleBtn.addEventListener("click", () => {
            const isActive = categorys_data_local[index].status === "active";
            /*  categorys_data_local[index].status = isActive ? "inactive" : "active";
              saveAndRender(); */

            if (isActive)
                if (confirm("Bạn có muốn ẩn loại sản phẩm này không?")) {
                    categorys_data_local[index].status = "inactive";
                    saveAndRender();
                }
            if (!isActive)
                if (confirm("Bạn có muốn hiện loại sản phẩm này không?")) {
                    categorys_data_local[index].status = "active";
                    saveAndRender();
                }
        });

        // Xóa
        deleteBtn.addEventListener("click", () => {
            if (confirm("Bạn có chắc muốn xóa loại sản phẩm này không?")) {
                categorys_data_local.splice(index, 1);
                saveAndRender();
            }
        });

        // Sửa
        editBtn.addEventListener("click", () => {
            openPopup("edit", index);
        });
    });
}

// Mở popup thêm hoặc sửa
function openPopup(mode, index = null) {
    categoryForm.reset();
    categoryPopup.style.display = "flex";
    editingIndex = null;

    if (mode === "edit" && index !== null) {
        const data = categorys_data_local[index];
        categoryForm.elements[0].value = data.id;
        categoryForm.elements[1].value = data.brand;
        categoryForm.elements[2].value = data.country;
        categoryForm.elements[3].value = data.desc;
        categoryForm.elements[4].value = data.status;
        editingIndex = index;
    }
}

// Lưu dữ liệu từ form
categoryForm.onsubmit = e => {
    e.preventDefault();

    const newData = {
        id: categoryForm.elements[0].value.trim(),
        brand: categoryForm.elements[1].value.trim(),
        country: categoryForm.elements[2].value.trim(),
        desc: categoryForm.elements[3].value.trim(),
        status: categoryForm.elements[4].value
    };

    if (editingIndex !== null) {
        categorys_data_local[editingIndex] = newData;
    } else {
        categorys_data_local.push(newData);
    }

    saveAndRender();
    alert("Đã cập nhật thành công!");
    categoryPopup.style.display = "none";
};

// Hủy popup
categoryCancel.onclick = () => {
    categoryPopup.style.display = "none";
};

// Nút thêm
addBtn.onclick = () => {
    openPopup("add");
};

// Lưu và hiển thị lại
function saveAndRender() {
    localStorage.setItem("categorys_data", JSON.stringify(categorys_data_local));
    renderCategorys();
}

// Khởi tạo
renderCategorys();


// Quan ly khach hangg

function closeData2() {
    document.getElementById("customers-section").style.display = "none";
    document.getElementById("home-section").style.display = "block";
}

const customersTable = document.getElementById("data2");
const customersPopup = document.getElementById("customers-popup");
const customersForm = document.getElementById("customers-form");
const customersCancel = document.getElementById("customers-cancel");

let customers_data_local = [];
let editingIndex2 = null;

const savedCustomers = localStorage.getItem("customers_data");
customers_data_local = savedCustomers ? JSON.parse(savedCustomers) : customers_data;


function renderCustomers() {
    customersTable.innerHTML = customers_data_local.map((cm, index2) => {
        const isBlocked = cm.status === "blocked";

        return `
            <tr data-index2="${index2}" class="${isBlocked ? 'fade-out' : ''}">
                <td>${isBlocked ? "Đã khóa" : cm.id}</td>
                <td>${isBlocked ? "Đã khóa" : cm.fullname}</td>
                <td>${isBlocked ? "Đã khóa" : cm.username}</td>
                <td>${isBlocked ? "Đã khóa" : cm.email}</td>
                <td>${cm.status}</td>
                <td class = "action1">
                    <div class = "wrapper-button"><button class="unlock">${cm.status === "active" ? "Khóa" : "Mở khóa"}</button></div>
                    <button class="reset" ${isBlocked ? "disabled" : ""}>Reset mật khẩu</button>
                </td>
            </tr>
        `;
    }).join("");

    attachEventHandlers2();
}


function attachEventHandlers2() {
    const rows2 = customersTable.querySelectorAll("tr");

    rows2.forEach(row2 => {
        const index2 = +row2.dataset.index2;
        const unlockBtn = row2.querySelector(".unlock");
        const resetBtn = row2.querySelector(".reset");

        unlockBtn.addEventListener("click", () => {
            const isActive = customers_data_local[index2].status === "active";
            if (isActive)
                if (confirm("Bạn có muốn khóa tài khoản người dùng này hay không?")) {
                    customers_data_local[index2].status = "blocked";
                    saveAndRender2();
                }
            if (!isActive)
                if (confirm("Bạn có muốn mở khóa tài khoản người dùng này hay không?")) {
                    customers_data_local[index2].status = "active";
                    saveAndRender2();
                }
        });

        resetBtn.addEventListener("click", () => {
            if (confirm("Bạn có muốn đặt lại mật khẩu?"))
                openPopup2("reset", index2);
        });

    });
}

function openPopup2(mode2, index2 = null) {
    customersForm.reset();
    customersPopup.style.display = "flex";
    editingIndex2 = null;

    if (mode2 === "reset" && index2 !== null) {
        const data = customers_data_local[index2];
        customersForm.elements[0].value = data.password;
        editingIndex2 = index2;
    }
}

customersForm.onsubmit = e => {
    e.preventDefault();

    const newData = {
        password: customersForm.elements[0].value.trim()
    };

    if (editingIndex2 !== null)
        customers_data_local[editingIndex2].password = newData.password;

    saveAndRender2();
    alert("Đã cập nhật mật khẩu thành công!");
    customersPopup.style.display = "none";
}

customersCancel.addEventListener("click", () => {
    customersPopup.style.display = "none";
});


function saveAndRender2() {
    localStorage.setItem("customers_data", JSON.stringify(customers_data_local));
    renderCustomers();
}

renderCustomers();
