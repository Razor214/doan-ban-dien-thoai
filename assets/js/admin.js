//Quản lý giá bán
const priceModal = document.getElementById('popup');
const form = document.getElementById('productadd');
const cancelBtn = document.getElementById('cancelBtn');
const table = document.querySelector('#Bangsp tbody');
const searchInput = document.getElementById('Timkiem')

const idPrice = document.getElementById('id');
const idCatePrice = document.getElementById('categoryId');
const idProPrice = document.getElementById('productId');
const idImPrice = document.getElementById('importId');
const costInput = document.getElementById('cost');
const profitInput = document.getElementById('profit');
const priceInput = document.getElementById('sell');

let editingRow = null;
//LocalStorage
function getLocalPrices(){return JSON.parse(localStorage.getItem('priceList'))||[];}
function setLocalPrices(list){localStorage.setItem('priceList', JSON.stringify(list));}
function syncAndRender(){const list = getLocalPrices()
    renderTable(list);
}
function renderTable(list){
    table.innerHTML = list.map(sp => `
        <tr>
            <td>${sp.id}</td>
            <td>${sp.categoryId}</td>
            <td>${sp.productId}</td>
            <td>${sp.importId}</td>
            <td>${Number(sp.cost).toLocaleString("vi-VN")}</td>
            <td>${sp.profit}%</td>
            <td>${Number(sp.price).toLocaleString("vi-VN")}</td>
            <td class="action">
                <button class="edit">Sửa</button> 
                <button class="delete">Xóa</button>
            </td>
        </tr>
    `).join("");
}
if(!localStorage.getItem('priceList')){
    setLocalPrices(priceList);
}
let list = getLocalPrices();
syncAndRender();
table.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {openPriceModal("edit", e.target);} 
    else if (e.target.classList.contains("delete")) {confirmDelete(e.target);}
});
//CHECK LỖI
function validateID(code, prefix) {
    return new RegExp(`^${prefix}\\d{3}$`).test(code);
}

// Kiểm tra số dương > 0
function validatePositiveNumber(value) {
    return parseFloat(value) > 0;
}
function openPriceModal(mode, btn) {
    form.reset();
    priceInput.value = '';
    priceModal.style.display = 'flex';
    editingRow = null;

    if (mode === 'edit' && btn) {
        const row = btn.closest('tr');
        idPrice.value = row.cells[0].innerText;
        idCatePrice.value = row.cells[1].innerText;
        idProPrice.value = row.cells[2].innerText;
        idImPrice.value = row.cells[3].innerText;
        costInput.value = row.cells[4].innerText.replace(/,/g, '');
        profitInput.value = parseFloat(row.cells[5].innerText);
        priceInput.value = row.cells[6].innerText.replace(/,/g, '');
        editingRow = row;
        costInput.setAttribute('readonly', true);
    }else{
        costInput.removeAttribute('readonly');
    }
}
window.openPriceModal = openPriceModal;
cancelBtn.onclick = () => {
    form.reset();
    priceInput.value = '';
    [idPrice, idCatePrice, idProPrice, idImPrice, costInput, profitInput, priceInput].forEach(input => {
        input.style.border = '';
    });
    editingRow = null;
    priceModal.style.display = 'none';
};

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

costInput.addEventListener('input', updatePrice);
profitInput.addEventListener('input', updatePrice);
priceInput.addEventListener('input', updateProfit);

costInput.addEventListener('blur', () => {
    let val = cleanNumber(costInput.value);
    costInput.value = val ? formatNumber(val) : '';
});
priceInput.addEventListener('blur', () => {
    let val = cleanNumber(priceInput.value);
    priceInput.value = val ? formatNumber(val) : '';
});

form.onsubmit = (e) => {
    e.preventDefault();
    const ID = idPrice.value;
    const categoryPrice = idCatePrice.value;
    const productPrice = idProPrice.value;
    const importPrice = idImPrice.value;
    const cost = cleanNumber(costInput.value);
    const profit = parseFloat(profitInput.value);
    const price = cleanNumber(priceInput.value);

    if (!validateID(idPrice.value, 'GN')) {
        idPrice.style.border = '2px solid red';
        alert('Mã sản phẩm phải bắt đầu GN và 3 số!');
        idPrice.focus();
        return;
    }
    if (!validateID(idCatePrice.value, 'TH')) {
        idCatePrice.style.border = '2px solid red';
        alert('Mã danh mục phải bắt đầu TH và 3 số!');
        idCatePrice.focus();
        return;
    }
    if (!validateID(idProPrice.value, 'SP')) {
        idProPrice.style.border = '2px solid red';
        alert('Mã sản phẩm phải bắt đầu SP và 3 số!');
        idProPrice.focus();
        return;
    }
    if (!validateID(idImPrice.value, 'PN')) {
        idImPrice.style.border = '2px solid red';
        alert('Mã nhập phải bắt đầu PN và 3 số!');
        idImPrice.focus();
        return;
    }
    if (!validatePositiveNumber(costInput)) {
        costInput.style.border = '2px solid red'; 
        alert('Giá nhập phải lớn hơn 0!'); 
        return; }
    if (!validatePositiveNumber(profitInput)) {
        profitInput.style.border = '2px solid red'; 
        alert('Lợi nhuận phải lớn hơn 0!'); 
        return; }
    if (!validatePositiveNumber(priceInput)) { 
        priceInput.style.border = '2px solid red';
        alert('Giá bán phải lớn hơn 0!'); 
        return; }
    if (!ID || !categoryPrice || !productPrice || !importPrice || !cost || !profit) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    if (editingRow) {
        editingRow.cells[0].innerText = ID;
        editingRow.cells[1].innerText = categoryPrice;
        editingRow.cells[2].innerText = productPrice;
        editingRow.cells[3].innerText = importPrice;
        editingRow.cells[4].innerText = cost;
        editingRow.cells[5].innerText = profit + '%';
        editingRow.cells[6].innerText = price;
        const index = list.findIndex(item => item.id === ID);
        if(index !== -1){
            list[index] = {id: ID, categoryId: categoryPrice, productId: productPrice, importId: importPrice, cost, profit, price };
        }
    } else {
        const row = table.insertRow();
        row.innerHTML = `
                <td>${idPrice.value}</td>
                <td>${idCatePrice.value}</td>
                <td>${idProPrice.value}</td>
                <td>${idImPrice.value}</td>
                <td>${cost}</td>
                <td>${profit}%</td>
                <td>${price}</td>
                <td class="action">
                    <button class="edit">Sửa</button>
                    <button class="delete">Xóa</button>
                </td>
            `;
        list.push({ id: ID, categoryId: categoryPrice, productId: productPrice, importId: importPrice, cost, profit, price });
    }
    setLocalPrices(list);
    syncAndRender();
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
function confirmDelete(btn) {
    const popup = document.getElementById('xacnhan');
    popup.style.display = 'flex';
    const row = btn.closest('tr');
    const ID = row.cells[0].innerText;
    document.getElementById('xacnhanxoa').onclick = () => {
        list = list.filter(sp => sp.id !==ID);
        setLocalPrices(list);
        syncAndRender();
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
window.confirmExit = confirmExit;
//Quản lý đơn đặt hàng 
function getLocalOrders() {
    return JSON.parse(localStorage.getItem('orderList')) || [];
}

function setLocalOrders(list) {
    localStorage.setItem('orderList', JSON.stringify(list));
}
function syncAndRenderOrders() {
    const list = getLocalOrders(); // lấy từ LocalStorage
    displayOrder(list);             // vẽ lại bảng
}
// Khởi tạo dữ liệu nếu chưa có
if (!localStorage.getItem('orderList')) {
    setLocalOrders(orders); // dùng orderData mặc định
}

let orderList = getLocalOrders();
syncAndRenderOrders();

function displayOrder(orders) {
    const tableBody = document.getElementById("orderTable");
    tableBody.innerHTML = "";

    orders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.userId}</td>
            <td>${order.date}</td>
            <td>${order.status}</td>
            <td><button class="detail-btn" data-id="${order.id}">Xem chi tiết</button></td>
        `;
        tableBody.appendChild(row);
    });
    tableBody.querySelectorAll(".detail-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.dataset.id;
            showDetails(id);
        });
    });

}
function Orders() {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const status = document.getElementById("status").value;

    const filtered = orderList.filter(order => {
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
    const order = orderList.find(o => o.id === orderId);
    if(!order) return;
    const popup = document.getElementById("details");

    document.getElementById("detail-id").textContent = order.id;
    document.getElementById("detail-cus").textContent = order.userId;
    document.getElementById("detail-date").textContent = order.date;
    document.getElementById("detail-product").textContent = order.address.value || "";
    const methodTableBody = document.querySelector("#methodtable tbody");
    methodTableBody.innerHTML = `
    <tr>
        <td>${order.payment.method}</td>
        <td>${order.payment.confirmed}</td>
    </tr>
    `;
    const select = document.getElementById("detailsstatus");
    select.value = order.status;
    const statusFlow = [
        "newly ordered",
        "processed",
        "delivered",
        "cancelled",
    ];
    const current = statusFlow.indexOf(order.status);
    for (let option of select.options) {
        const optionIndex = statusFlow.indexOf(option.value);
        if (order.status == "delivered" || order.status == "cancelled") {
            option.disabled = option.value !== order.status;
        } else {
            option.disabled = optionIndex < current;
        }
    }
    const listBody = document.querySelector("#list tbody");
    listBody.innerHTML = order.items.map(d => `
        <tr>
            <td>${d.productId}</td>
            <td>${d.quantity}</td>
        </tr>
    `).join("");
    popup.style.display = "flex";
}
window.update = update;
window.showDetails = showDetails;
window.closeDetails = closeDetails;
window.closeMain = closeMain;
function closeDetails() {
    document.getElementById("details").style.display = "none";
}
function closeMain() {
    openSection("home-section");
}
function update() {
    const id = document.getElementById("detail-id").textContent;
    const newStatus = document.getElementById("detailsstatus").value;

    const order = orderList.find(o => o.id === id);
    if (order) {
        order.status = newStatus;
        setLocalOrders(orderList);
        syncAndRenderOrders();// Cập nhật lại bảng
        alert("Đã cập nhật trạng thái đơn hàng!");
        closeDetails();
    } else {
        alert("Không tìm thấy đơn hàng để cập nhật!");
    }
}
function ResetDate() {
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    document.getElementById("status").value = "";
    displayOrder(orderList); // load lại tất cả đơn hàng
}
window.Orders = Orders;
window.ResetDate = ResetDate; 
//Quản lý tồn kho
function getInventory() {
    return JSON.parse(localStorage.getItem('inventoryList')) || [];
}

function setInventory(list) {
    localStorage.setItem('inventoryList', JSON.stringify(list));
}
if (!localStorage.getItem('inventoryList')) { 
    setInventory(inventoryList); 
}
const tableBody = document.querySelector('#Table tbody');
const cancelStock = document.getElementById('cancelStock');
const tonkhoModal = document.getElementById('detailModal');
const StockModal = document.getElementById('StockPopup');
const summaryModal = document.getElementById('popup-modal');
const btnSearch = document.getElementById('Btnsearch');
const exportBtn = document.getElementById('exportBtn');
const viewDetails = document.querySelector('.view-details');
const closeBtns = document.querySelectorAll('.close-modal, .close-popup');
const nameSearch = document.getElementById('Namesearch');
const searchSP = document.getElementById('Prosearch');
const searchCate = document.getElementById('Catesearch');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const formStock = document.getElementById('StockFormADD');
const MIN_TON = 10;
function displayTon(data) {
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
            <td>${item.id}</td>
            <td>${item.productId}</td>
            <td>${item.categoryId}</td>
            <td>${item.slNhap !== undefined ? item.slNhap.toLocaleString() : 0}</td> 
            <td>${item.slXuat !== undefined ? item.slXuat.toLocaleString() : 0}</td>
            <td>${item.slTon !== undefined ? item.slTon.toLocaleString() : 0}</td>
            <td>${item.ngayCapNhat}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td class="action">
                <button class="inout">Tạo phiếu</button>
                <button class="delete">Xóa</button>
            </td>
        `;
        row.addEventListener('click', (e) => {
            if(!e.target.classList.contains('inout') && !e.target.classList.contains('delete')){
                openModal(item);
            }
        });
        tableBody.appendChild(row);
    }); // lưu LocalStorage
    renderSummary(data);
}
let inventory=getInventory();
function syncAndRenderInventory() {
    inventory = getInventory();  // đồng bộ biến inventory với LocalStorage
    displayTon(inventory);       // vẽ lại bảng
    renderSummary(inventory);    // cập nhật thống kê
}
function renderSummary(data) {
    document.getElementById('outcount').textContent = data.filter(i => i.slTon === 0).length;
    document.getElementById('lowcount').textContent = data.filter(i => i.slTon > 0 && i.slTon <= i.minTon).length;
    document.getElementById('okcount').textContent = data.filter(i => i.slTon > i.minTon).length;
}
function openModal(item) {
    if (!tonkhoModal) return;
    document.getElementById('modalMaSP').textContent = item.id;
    document.getElementById('modalTenSP').textContent = item.productId;
    document.getElementById('modalNhanhieuSP').textContent = item.categoryId;
    document.getElementById('minTonLimit').textContent = item.minTon;
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
     const inventory = getInventory();
    const outOfStock = inventory.filter(item => item.slTon === 0);
    const lowStock = inventory.filter(item => item.slTon > 0 && item.slTon <= item.minTon);
    const inStock = inventory.filter(item => item.slTon > item.minTon);
    document.getElementById('sum-outcount').textContent = `(${outOfStock.length})`;
    document.getElementById('sum-lowcount').textContent = `(${lowStock.length})`;
    document.getElementById('sum-okcount').textContent = `(${inStock.length})`;
    const renderList = (list) => list.map(i => `<li><span class="summary-code">[${i.productId}]</span> Mã DM: ${i.categoryId}</li>`).join('');
    document.getElementById('sum-outList').innerHTML = outOfStock.length? renderList(outOfStock):'<li>Không có sản phẩm nào.</li>';
    document.getElementById('sum-lowlist').innerHTML = lowStock.length? renderList(lowStock):'<li>Không có sản phẩm nào.</li>';
    document.getElementById('sum-oklist').innerHTML = inStock.length? renderList(inStock):'<li>Không có sản phẩm nào.</li>';

    summaryModal.classList.add('show');
}
if (btnSearch) {
    btnSearch.addEventListener('click', () => {
        const keyword = nameSearch.value.trim().toLowerCase();
        const Pro = searchSP.value.trim().toLowerCase();
        const Cate = searchCate.value.trim().toLowerCase();
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
        let filterData = inventory.filter(item => {
            const itemDate = new Date(item.ngayCapNhat);
            const keywordMatch = !keyword || 
                item.id.toLowerCase().includes(keyword) || 
                item.productId.toLowerCase().includes(keyword) ||
                item.categoryId.toLowerCase().includes(keyword);
            const ProMatch = !Pro || item.stockPro.toLowerCase().includes(Pro); 
            const CateMatch = !Cate || item.stockCate.toLowerCase().includes(Cate); 
            const dateStartMatch = !startDate || itemDate >= startDate;
            const dateEndMatch = !endDate || itemDate <= endDate;

            return keywordMatch && ProMatch && CateMatch && dateStartMatch && dateEndMatch;
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
        tonkhoModal.classList.remove('show');
        summaryModal.classList.remove('show');
        document.getElementById('xacnhanStock').style.display='none';
        StockModal.style.display='none';
        phieuStock.style.display='none';
    }
});
function closeInventory() {
    document.getElementById('stock-section').style.display='none';
    tonkhoModal.classList.remove('show');
    summaryModal.classList.remove('show');
}
window.closeInventory=closeInventory;

function openStockModal() {
    StockModal.style.display = 'flex';
}
cancelStock.onclick = () => {
    StockModal.style.display = 'none';
    formStock.reset();
};
//Tạo phiếu nhập/xuất
const phieuStock = document.getElementById("FormStockPopup");
const phieuForm = document.getElementById("IntOut");
const actionSelect = document.getElementById("inorout");
const nhapSection = document.getElementById("input-section");
const xuatSection = document.getElementById("out-section");
const cancelPhieu = document.getElementById("cancelForm");
const stockInInput = document.getElementById("stockFormIn");
const stockOutInput = document.getElementById("stockFormOut");
tableBody.addEventListener('click', (e) => {
    if(e.target.classList.contains('inout')){
        e.stopPropagation();
        const MA = e.target.closest('tr').children[0].textContent;
        const SP = inventory.find(sp=>sp.id === MA);
        if(SP) {
            openphieuStock(SP);
        }
    }else if(e.target.classList.contains('delete')) {
        e.stopPropagation();
        confirmDeleteStock(e.target);
    }
});
function updateStockFormVisibility() {
    const selectedValue = actionSelect.value;

    if (selectedValue === "Nhập") {
        nhapSection.classList.remove("disabled-section");
        xuatSection.classList.add("disabled-section");
        stockOutInput.value = ""; 

    } else if (selectedValue === "Xuất") {
        nhapSection.classList.add("disabled-section");
        xuatSection.classList.remove("disabled-section");
        stockInInput.value = ""; 

        stockOutInput.required = true;
    } else {
        nhapSection.classList.add("disabled-section");
        xuatSection.classList.add("disabled-section");
        stockInInput.value = "";
        stockOutInput.value = "";
    }
    stockInInput.disabled = nhapSection.classList.contains("disabled-section");
    stockOutInput.disabled = xuatSection.classList.contains("disabled-section");
}
actionSelect.addEventListener("change", updateStockFormVisibility);
function openphieuStock(sp){
    phieuStock.style.display ="flex";
    phieuForm.dataset.maSP = sp.id;
    phieuForm.reset();
    actionSelect.value="";
    updateStockFormVisibility();
}
cancelPhieu.addEventListener("click", () => {
    phieuStock.style.display = "none";
    phieuForm.reset();
});
phieuForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const mãSP = phieuForm.dataset.maSP;
    const hànhĐộng = actionSelect.value;
    const ngày = document.getElementById("inoutdate").value;
    const sốNhập = Number(document.getElementById("stockFormIn").value);
    const sốXuất = Number(document.getElementById("stockFormOut").value);
    const sp = inventory.find(i => i.id === mãSP);
    if (!hànhĐộng || !ngày) {
         alert("Vui lòng chọn Hành động, nhập Người thực hiện và Ngày!");
         return; // Thoát nếu thiếu thông tin cơ bản
    }
    if (!sp) return alert("Không tìm thấy sản phẩm!");
    if (hànhĐộng === "Nhập" && (isNaN(sốNhập) || sốNhập <= 0)) {
        alert("Vui lòng nhập số lượng Nhập hợp lệ (lớn hơn 0)!");
        return;
    }
    if (hànhĐộng === "Xuất" && (isNaN(sốXuất) || sốXuất <= 0)) {
        alert("Vui lòng nhập số lượng Xuất hợp lệ (lớn hơn 0)!");
        return;
    }
    const slHanhDong = hànhĐộng === "Nhập" ? sốNhập : sốXuất;
    if (hànhĐộng === "Nhập") {
        sp.slNhap += slHanhDong;
        sp.slTon += slHanhDong;
    } else {
        if (slHanhDong > sp.slTon) {
             alert(`Không đủ hàng tồn (${sp.slTon}) để xuất ${slHanhDong}!`);
             return;
        }
        sp.slXuat += slHanhDong;
        sp.slTon -= slHanhDong;
    }
    sp.ngayCapNhat = ngày;
    if (sp.slTon === 0) sp.trangThai = "out";
    else if (sp.slTon <= sp.minTon) sp.trangThai = "low";
    else sp.trangThai = "ok";

    sp.history.unshift({
        ngay: ngày,
        hanhDong: hànhĐộng,
        soLuong: slHanhDong
    });
    if (sp.history.length > 5) {
    sp.history = sp.history.slice(0, 5);
    }
    displayTon(inventory);
    renderSummary(inventory); 
    const currentMa = document.getElementById('modalMaSP')?.textContent;
    if (tonkhoModal.classList.contains('show') && currentMa === sp.maSP) {
        openModal(sp); // refresh lại modal với history mới
    }
    setInventory(inventory);
    syncAndRenderInventory();
    phieuStock.style.display = "none";
    phieuForm.reset();
    alert("Đã lưu phiếu và cập nhật tồn kho!");
});
function confirmDeleteStock(btn) {
    const deleteStock = document.getElementById('xacnhanStock');
    deleteStock.style.display = 'flex';
    const rowStock = btn.closest('tr');
    document.getElementById('xacnhanxoaStock').onclick = () => {
        const maSP = rowStock.children[0].textContent;
        inventory = inventory.filter(i => i.id !== maSP);
        setInventory(inventory);
        syncAndRenderInventory();
        deleteStock.style.display = 'none';
    };
    document.getElementById('xacnhankhongStock').onclick = () => deleteStock.style.display = 'none';
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
if(formStock){
    formStock.onsubmit = (e) => {
        e.preventDefault();
        const inputSLNhap = document.getElementById('stockIn');
        const inputSLXuat = document.getElementById('stockOut');
        const inputSLTon = document.getElementById('stockStill');
        const MaSP = document.getElementById('stockMa').value.trim();
        const TenSP = document.getElementById('stockPro').value.trim();
        const MaCate = document.getElementById('stockCate').value.trim();
        const SLNhapValue = inputSLNhap.value.trim(); // Dùng Value
        const SLXuatValue = inputSLXuat.value.trim(); // Dùng Value
        const SLTonValue = inputSLTon.value.trim();
        const Ngay = document.getElementById('stockUpdate').value.trim();
        if (!MaSP || !MaCate || !TenSP || !SLNhapValue || !SLXuatValue || !SLTonValue || !Ngay) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        let hasNegative = false;
        
        // Reset border cho tất cả trước
        inputSLNhap.style.border = '';
        inputSLXuat.style.border = '';
        inputSLTon.style.border = '';
        if (!validateID(MaSP, 'TK')) {
            alert('Mã phải bắt đầu bằng TK (VD: TK01)');
            document.getElementById('stockMa').style.border = '2px solid red';
            return;
        }
        if (!validateID(TenSP, 'SP')) {
            alert('Mã sản phẩm phải bắt đầu bằng SP (VD: SP01)');
            document.getElementById('stockPro').style.border = '2px solid red';
            return;
        }   
        if (!validateID(MaCate, 'TH')) {
            alert('Mã danh mục phải bắt đầu bằng TH (VD: TH001)');
            document.getElementById('stockCate').style.border = '2px solid red';
            return;
        }   
        if (Number(SLNhapValue) < 0) {
            inputSLNhap.style.border = '2px solid red'; // Dùng element
            hasNegative = true;
        }
        if (Number(SLXuatValue) < 0) {
            inputSLXuat.style.border = '2px solid red'; // Dùng element
            hasNegative = true;
        }
        if (Number(SLTonValue) < 0) {
            inputSLTon.style.border = '2px solid red'; // Dùng element
            hasNegative = true;
        }
        
        if (hasNegative) {
            alert('Số lượng không được âm!');
            return;
        }
        let statusText = 'Còn hàng';
        let statusClass = 'ok';
        const ton = Number(SLTonValue);

        if (ton === 0) {
            statusText = 'Hết hàng';
            statusClass = 'out';
        } else if (ton <= MIN_TON) {
            statusText = 'Sắp hết';
            statusClass = 'low';
        }

        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${MaSP}</td>
            <td>${TenSP}</td>
            <td>${MaCate}</td>
            <td>${SLNhapValue}</td>
            <td>${SLXuatValue}</td>
            <td>${SLTonValue}</td>
            <td>${Ngay}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td class="action">
                <button class="inout">Tạo phiếu</button>
                <button class="delete" onclick="confirmDeleteStock(this)">Xóa</button>
            </td>
        `;
        const newItem = {
            id: MaSP,
            productId: TenSP,
            categoryId: MaCate,
            slNhap: Number(SLNhapValue||0),
            slXuat: Number(SLXuatValue||0),
            slTon: Number(SLTonValue||0),
            ngayCapNhat: Ngay,
            trangThai: statusClass,
            minTon: MIN_TON,
            history: []
        };
        inventory.push(newItem);
        setInventory(inventory);
        syncAndRenderInventory();
        StockModal.style.display = 'none'; // Đóng modal
        formStock.reset();                 // Reset form
        alert('Đã thêm sản phẩm thành công!');
    };
}
window.syncAndRenderInventory = syncAndRenderInventory;
window.openModal = openModal; 
window.openDetailModal = openDetailModal;       
window.openSummaryModal = openSummaryModal;
window.closeModal = closeModal;            
window.openminiPU = openminiPU;            
window.closeMiniPU = closeMiniPU; 
window.openStockModal = openStockModal; 
window.openphieuStock = openphieuStock;  
window.confirmDeleteStock = confirmDeleteStock;
syncAndRenderInventory();
// sidebar
document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".sidebar-menu a");

    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            const target = item.dataset.section;
            openSection(`${target}-section`);
        });
    });

    // Hiển thị mặc định
    openSection("product-section");
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

function closeData1() {
    document.getElementById("category-section").style.display = "none";
    document.getElementById("home-section").style.display = "block";
}


const savedCategorys = localStorage.getItem("categoryList");
categorys_data_local = savedCategorys ? JSON.parse(savedCategorys) : categoryList;

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

function attachEventHandlers() {
    const rows = categoryTable.querySelectorAll("tr");

    rows.forEach(row => {
        const index = row.dataset.index;
        const toggleBtn = row.querySelector(".toggle");
        const deleteBtn = row.querySelector(".delete");
        const editBtn = row.querySelector(".edit");

        toggleBtn.addEventListener("click", () => {
            const isActive = categorys_data_local[index].status === "active";
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

        deleteBtn.addEventListener("click", () => {
            if (confirm("Bạn có chắc muốn xóa loại sản phẩm này không?")) {
                categorys_data_local.splice(index, 1);
                saveAndRender();
            }
        });

        editBtn.addEventListener("click", () => {
            openPopup("edit", index);
        });
    });
}

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
    categoryPopup.style.display = "none";
    alert("Đã cập nhật thành công!");

};

categoryCancel.onclick = () => {
    categoryPopup.style.display = "none";
};

addBtn.onclick = () => {
    openPopup("add");
};

function saveAndRender() {
    localStorage.setItem("categoryList", JSON.stringify(categorys_data_local));
    renderCategorys();
}

renderCategorys();

// Quan ly khach hangg
function closeData2() {
    document.getElementById("customers-section").style.display = "none";
    document.getElementById("home-section").style.display = "block";
}

const customersTable = document.getElementById("data2");

let customers_data_local = [];
let editingIndex2 = null;

const savedCustomers = localStorage.getItem("userList");
customers_data_local = savedCustomers ? JSON.parse(savedCustomers) : userList;

function renderCustomers() {
    customersTable.innerHTML = customers_data_local.map((cm, index2) => {
        const isBlocked = cm.status === "blocked";

        return `
            <tr data-index2="${index2}" class="${isBlocked ? 'fade-out' : ''}">
                <td>${isBlocked ? "Đã khóa" : cm.id}</td>
                <td>${isBlocked ? "Đã khóa" : cm.fullname}</td>
                <td>${isBlocked ? "Đã khóa" : cm.username}</td>
                <td>${isBlocked ? "Đã khóa" : cm.email}</td>
                <td>${isBlocked ? "Đã khóa" : cm.sdt}</td> 
                <td>${cm.status}</td>
                <td class = "action1">
                    <div class = "wrapper-button"><button class="unlock">${cm.status === "active" ? "Khóa" : "Mở khóa"}</button></div>
                    <button class="reset" ${isBlocked ? "disabled" : ""}>Đặt lại mật khẩu</button>
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
                if (confirm("Bạn có muốn khóa tài khoản người dùng này không?")) {
                    customers_data_local[index2].status = "blocked";
                    saveAndRender2();
                }
            if (!isActive)
                if (confirm("Bạn có muốn mở khóa tài khoản người dùng này không?")) {
                    customers_data_local[index2].status = "active";
                    saveAndRender2();
                }
        });

        resetBtn.addEventListener("click", () => {
            if (confirm("Bạn có muốn đặt lại mật khẩu?")) {
                customers_data_local[index2].password = "12345";
                saveAndRender2();
                alert("Đã đặt lại mật khẩu mặc định: '12345'");
            }
        });

    });
}

function saveAndRender2() {
    localStorage.setItem("userList", JSON.stringify(customers_data_local));
    renderCustomers();
}

renderCustomers();
/* ======================================================
               QUẢN LÝ SẢN PHẨM
====================================================== */

// --- DOM ELEMENTS ---
const productModal = document.getElementById("ProductPopup");
const productForm = document.getElementById("ProductForm");
const productTbody = document.querySelector("#ProductTable tbody");
const productSearchInput = document.getElementById("searchProductCategory");
const productCancelBtn = document.getElementById("cancelProduct");
const prodImgInput = document.getElementById("prodImg");
const previewImg = document.getElementById("previewImg");

// Popup chi tiết
const detailPopup = document.getElementById("ProductDetailPopup");
const detailContent = document.getElementById("ProductDetailContent");
const closeDetailBtn = document.getElementById("closeDetail");

let editingProductRow = null;

// --- LOCAL STORAGE WRAPPER ---
function getLocal(key, def = []) {
    return JSON.parse(localStorage.getItem(key)) || def;
}
function setLocal(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

// --- KHỞI TẠO DỮ LIỆU MẶC ĐỊNH ---
if (!localStorage.getItem("productList"))
    setLocal("productList", productList);
if (!localStorage.getItem("categoryList"))
    setLocal("categoryList", categoryList);
if (!localStorage.getItem("priceList"))
    setLocal("priceList", priceList);

let products = getLocal("productList");
const categories = getLocal("categoryList");
const prices = getLocal("priceList");

// --- LIÊN KẾT ---
function getCategoryName(id) {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.brand : id;
}

function getPriceByProductId(productId) {
    const price = prices.find((p) => p.productId === productId);
    return price ? Number(price.price).toLocaleString("vi-VN") + " ₫" : "Chưa có giá";
}

// --- RENDER TABLE ---
function renderProductTable(data = products) {
    productTbody.innerHTML = data
        .map(
        (p) => `
        <tr>
        <td>${getCategoryName(p.categoryId)}</td>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>
            <img src="${p.img || "assets/img/logo.png"}"
                style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
        </td>
        <td>${p.desc}</td>
        <td class="action">
            <button class="edit" onclick="openProductModal('edit', this)">Sửa</button>
            <button class="delete" onclick="deleteProduct(this)">Xóa</button>
            <button class="view" onclick="viewProductDetail('${p.id}')">Chi tiết</button>
        </td>
        </tr>`
        )
        .join("");
}

// --- MỞ POPUP THÊM/SỬA ---
function openProductModal(mode, btn) {
    productForm.reset();
    previewImg.src = "assets/img/logo.png";
    productModal.style.display = "flex";
    editingProductRow = null;

    if (mode === "edit" && btn) {
        const row = btn.closest("tr");
        const id = row.cells[1].innerText.trim();
        const product = products.find((p) => p.id === id);
        if (product) {
        document.getElementById("prodType").value = product.categoryId;
        document.getElementById("prodCode").value = product.id;
        document.getElementById("prodName").value = product.name;
        document.getElementById("prodDesc").value = product.desc;
        document.getElementById("prodColor").value = product.color;
        document.getElementById("prodStorage").value = product.storage;
        document.getElementById("prodRam").value = product.ram;
        document.getElementById("prodDisplay").value = product.display;
        document.getElementById("prodCamera").value = product.camera;
        document.getElementById("prodBattery").value = product.battery;
        document.getElementById("prodChip").value = product.chip;
        document.getElementById("prodOS").value = product.os;
        previewImg.src = product.img;
        editingProductRow = product;
        }
    }
}

window.openProductModal = openProductModal;

// --- POPUP CHI TIẾT SẢN PHẨM ---
function viewProductDetail(id) {
    const product = products.find((p) => p.id === id);
    if (!product) return alert("Không tìm thấy sản phẩm!");

    detailContent.innerHTML = `
        <h3>${product.name}</h3>
        <img src="${product.img}" style="width:200px;border-radius:10px;margin-bottom:10px">
        <p><strong>Màu sắc:</strong> ${product.color}</p>
        <p><strong>Dung lượng:</strong> ${product.storage}</p>
        <p><strong>RAM:</strong> ${product.ram}</p>
        <p><strong>Màn hình:</strong> ${product.display}</p>
        <p><strong>Camera:</strong> ${product.camera}</p>
        <p><strong>Pin:</strong> ${product.battery}</p>
        <p><strong>Chip:</strong> ${product.chip}</p>
        <p><strong>Hệ điều hành:</strong> ${product.os}</p>
    `;
    detailPopup.style.display = "flex";
}

window.viewProductDetail = viewProductDetail;
closeDetailBtn.addEventListener("click", () => (detailPopup.style.display = "none"));

// --- HỦY BỎ POPUP ---
productCancelBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    productModal.style.display = "none";
});

// --- XỬ LÝ ẢNH XEM TRƯỚC ---
prodImgInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
        previewImg.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
});

// --- THÊM / SỬA ---
productForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const newProd = {
        id: document.getElementById("prodCode").value.trim(),
        categoryId: document.getElementById("prodType").value.trim(),
        name: document.getElementById("prodName").value.trim(),
        img: previewImg.src || "assets/img/logo.png",
        desc: document.getElementById("prodDesc").value.trim(),
        color: document.getElementById("prodColor").value.trim(),
        storage: document.getElementById("prodStorage").value.trim(),
        ram: document.getElementById("prodRam").value.trim(),
        display: document.getElementById("prodDisplay").value.trim(),
        camera: document.getElementById("prodCamera").value.trim(),
        battery: document.getElementById("prodBattery").value.trim(),
        chip: document.getElementById("prodChip").value.trim(),
        os: document.getElementById("prodOS").value.trim(),
        status: "active",
    };

    // --- RÀNG BUỘC DỮ LIỆU ---
    for (const [key, val] of Object.entries(newProd)) {
        if (!val && key !== "img") {
        alert("⚠️ Vui lòng nhập đầy đủ thông tin sản phẩm!");
        return;
        }
    }

    const existingIndex = products.findIndex((p) => p.id === newProd.id);
    if (editingProductRow && existingIndex > -1) {
        products[existingIndex] = newProd;
    } else {
        if (existingIndex !== -1) {
        alert("⚠️ Mã sản phẩm đã tồn tại!");
        return;
        }
        products.unshift(newProd);
    }

    setLocal("productList", products);
    renderProductTable();
    productModal.style.display = "none";
});

// --- XÓA ---
function deleteProduct(btn) {
    if (!confirm("Xóa sản phẩm này?")) return;
    const row = btn.closest("tr");
    const id = row.cells[1].innerText.trim();
    products = products.filter((p) => p.id !== id);
    setLocal("productList", products);
    renderProductTable();
}
window.deleteProduct = deleteProduct;

// --- TÌM KIẾM ---
function searchProductCategory() {
    const keyword = productSearchInput.value.trim().toLowerCase();
    const filtered = products.filter(
        (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.id.toLowerCase().includes(keyword) ||
        getCategoryName(p.categoryId).toLowerCase().includes(keyword)
    );
    renderProductTable(filtered);
}
window.searchProductCategory = searchProductCategory;

// --- KHỞI TẠO ---
document.addEventListener("DOMContentLoaded", () => {
    renderProductTable();
});

/* ======================================================
               QUẢN LÝ NHẬP SẢN PHẨM
====================================================== */

const importModal = document.getElementById("ImportPopup");
const importForm = document.getElementById("ImportForm");
const importTbody = document.querySelector("#ImportTable tbody");
const importSearchInput = document.getElementById("searchImport");
const importCancelBtn = document.getElementById("cancelImport");
const importDetailPopup = document.getElementById("ImportDetailPopup");
const importDetailContent = document.getElementById("ImportDetailContent");
const closeImportDetail = document.getElementById("closeImportDetail");

// Dữ liệu gốc
if (!localStorage.getItem("importList")) setLocal("importList", importList);
if (!localStorage.getItem("productList")) setLocal("productList", productList);
if (!localStorage.getItem("priceList")) setLocal("priceList", priceList);

let imports = getLocal("importList");
const productData = getLocal("productList");
const priceData   = getLocal("priceList");

let editingImportRow = null;

// Hiển thị bảng phiếu nhập
function renderImportTable(data = imports) {
    importTbody.innerHTML = data
        .map(
        (i) => `
        <tr>
            <td>${i.id}</td>
            <td>${i.date}</td>
            <td>${Number(i.total).toLocaleString("vi-VN")} ₫</td>
            <td>${i.status}</td>
            <td class="action">
            <button class="view" onclick="viewImportDetail('${i.id}')">👁 Chi tiết</button>
            <button class="edit" onclick="openImportModal('edit', this)">Sửa</button>
            <button class="delete" onclick="deleteImport(this)">Xóa</button>
            </td>
        </tr>`
        )
        .join("");
}

// Mở form thêm / sửa
function openImportModal(mode, btn) {
    importForm.reset();
    importModal.style.display = "flex";
    editingImportRow = null;
    document.getElementById("importTotal").readOnly = true; // không cho nhập thủ công

    if (mode === "add") {
        document.getElementById("importCode").value = "";
        document.getElementById("importStatus").value = "Đang xử lý";
        loadProductItems([]);
        document.getElementById("importTotal").value = 0;
        document.getElementById("importCode").readOnly = false;
        return;
    }

    if (mode === "edit" && btn) {
        const row = btn.closest("tr");
        const idToEdit = row.cells[0].innerText.trim();
        const record = imports.find((i) => i.id === idToEdit);

        if (!record) return;
        if (record.status === "Hoàn thành") {
        alert("❌ Phiếu nhập đã hoàn thành, không thể chỉnh sửa!");
        importModal.style.display = "none";
        return;
        }

        document.getElementById("importCode").value = record.id;
        document.getElementById("importDate").value = record.date;
        document.getElementById("importTotal").value = record.total;
        document.getElementById("importStatus").value = record.status;
        loadProductItems(record.items || []);
        document.getElementById("importCode").readOnly = true;

        editingImportRow = row;
    }
}
window.openImportModal = openImportModal;

// Nút Hủy
importCancelBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    importModal.style.display = "none";
});

// Submit Form
importForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const itemRows = document.querySelectorAll("#productItems .item-row");
    const items = [];

    itemRows.forEach((row) => {
        const productId = row.querySelector(".item-name").value.trim();
        const quantity = Number(row.querySelector(".item-qty").value);
        const price = Number(row.querySelector(".item-price").value);

        if (productId && quantity > 0 && price > 0)
        items.push({ productId, quantity, price });
    });

    const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    const newImport = {
        id: document.getElementById("importCode").value.trim(),
        date: document.getElementById("importDate").value,
        total,
        status: document.getElementById("importStatus").value,
        items,
    };

    if (!newImport.id || !newImport.date) {
        alert("⚠️ Vui lòng nhập mã phiếu và ngày nhập!");
        return;
    }
    if (items.length === 0) {
        alert("⚠️ Phiếu nhập phải có ít nhất 1 sản phẩm!");
        return;
    }

    // Nếu đang sửa
    const existingIdx = imports.findIndex((i) => i.id === newImport.id);
    if (editingImportRow && existingIdx !== -1) {
        imports[existingIdx] = newImport;
    } else {
        if (existingIdx !== -1) {
        alert("⚠️ Mã phiếu đã tồn tại!");
        return;
        }
        imports.unshift(newImport);
    }

    setLocal("importList", imports);
    renderImportTable();
    importModal.style.display = "none";
});

// Xóa phiếu nhập
function deleteImport(btn) {
    if (!confirm("Xóa phiếu nhập này?")) return;
    const row = btn.closest("tr");
    const id = row.cells[0].innerText.trim();
    imports = imports.filter((i) => i.id !== id);
    setLocal("importList", imports);
    renderImportTable();
}
window.deleteImport = deleteImport;

// Tìm kiếm
function searchImport() {
    const keyword = importSearchInput.value.trim().toLowerCase();
    const filtered = imports.filter(
        (i) =>
        i.id.toLowerCase().includes(keyword) ||
        i.status.toLowerCase().includes(keyword)
    );
    renderImportTable(filtered);
}
window.searchImport = searchImport;

// Hiển thị danh sách sản phẩm trong form nhập
function loadProductItems(items) {
    const container = document.getElementById("productItems");
    container.innerHTML = "";

    items.forEach((item) => {
        const row = document.createElement("div");
        row.className = "item-row";
        row.innerHTML = `
        <select class="item-name" required>
            ${products
            .map(
                (p) =>
                `<option value="${p.id}" ${
                    p.id === item.productId ? "selected" : ""
                }>${p.name}</option>`
            )
            .join("")}
        </select>
        <input type="number" class="item-qty" min="1" value="${
            item.quantity || 1
        }" oninput="calculateTotal()">
        <input type="number" class="item-price" min="0" value="${
            item.price || 0
        }" oninput="calculateTotal()">
        <button type="button" class="remove-item" onclick="removeProductItem(this)">Xóa</button>
        `;
        container.appendChild(row);
    });

    calculateTotal();
}
window.loadProductItems = loadProductItems;

// Thêm dòng sản phẩm mới
function addProductItem() {
  const container = document.getElementById("productItems");
  if (!container) return;

  const div = document.createElement("div");
  div.classList.add("item-row");

  div.innerHTML = `
    <select class="item-name" required>
      <option value="">-- Chọn sản phẩm --</option>
      ${productData.map(p => `<option value="${p.id}">${p.name}</option>`).join("")}
    </select>
    <input type="number" class="item-qty" min="1" value="1" oninput="calculateTotal()">
    <input type="number" class="item-price" min="0" placeholder="Giá nhập" oninput="calculateTotal()">
    <button type="button" class="remove-item" onclick="removeProductItem(this)">Xóa</button>
  `;

  container.appendChild(div);
  calculateTotal();
}
window.addProductItem = addProductItem;


// Xóa dòng sản phẩm
function removeProductItem(btn) {
    btn.parentElement.remove();
    calculateTotal();
}
window.removeProductItem = removeProductItem;

// Tính tổng giá trị phiếu
function calculateTotal() {
    let total = 0;
    document.querySelectorAll("#productItems .item-row").forEach((row) => {
        const qty = Number(row.querySelector(".item-qty").value) || 0;
        const price = Number(row.querySelector(".item-price").value) || 0;
        total += qty * price;
    });
    document.getElementById("importTotal").value = total.toLocaleString("vi-VN");
}
window.calculateTotal = calculateTotal;

// Xem chi tiết phiếu nhập
function viewImportDetail(importId) {
    const record = imports.find((i) => i.id === importId);
    if (!record) return;

    const detailHTML = `
        <p><strong>Mã phiếu:</strong> ${record.id}</p>
        <p><strong>Ngày nhập:</strong> ${record.date}</p>
        <p><strong>Tổng giá trị:</strong> ${Number(
        record.total
        ).toLocaleString("vi-VN")} ₫</p>
        <p><strong>Trạng thái:</strong> ${record.status}</p>
        <h4>Danh sách sản phẩm:</h4>
        <table style="width:100%;border-collapse:collapse;">
        <tr><th>Tên sản phẩm</th><th>Số lượng</th><th>Giá nhập</th><th>Thành tiền</th></tr>
        ${record.items
            .map((it) => {
            const prod = productData.find((p) => p.id === it.productId);
            const name = prod ? prod.name : it.productId;
            const total = it.quantity * it.price;
            return `<tr>
                <td>${name}</td>
                <td>${it.quantity}</td>
                <td>${Number(it.price).toLocaleString("vi-VN")} ₫</td>
                <td>${Number(total).toLocaleString("vi-VN")} ₫</td>
            </tr>`;
            })
            .join("")}
        </table>
    `;

    importDetailContent.innerHTML = detailHTML;
    importDetailPopup.style.display = "flex";
}
window.viewImportDetail = viewImportDetail;

closeImportDetail.addEventListener("click", () => {
    importDetailPopup.style.display = "none";
});

// --- Khi load trang
document.addEventListener("DOMContentLoaded", () => renderImportTable());
