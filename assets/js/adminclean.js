"use strict";

/* ======================================================
   🔹 HÀM CHUNG: CHUYỂN GIỮA CÁC SECTION
====================================================== */
function openSection(id) {
  // Ẩn tất cả section
  document.querySelectorAll(".admin-section").forEach(sec => {
    sec.style.display = "none";
  });

  // Ẩn popup/modal nếu có
  document.querySelectorAll(".modal, .popup").forEach(p => {
    p.style.display = "none";
    p.classList.remove("show");
  });

  // Hiện section được chọn
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
}

/* ======================================================
   🔹 SIDEBAR ĐIỀU HƯỚNG
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".sidebar-menu a");
  menuItems.forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      const target = item.dataset.section;
      openSection(`${target}-section`);
    });
  });

  openSection("home-section");
});

function openSection(id) {
  document.querySelectorAll(".admin-section").forEach(sec => sec.style.display = "none");
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
}

/* ======================================================
   🔹 QUẢN LÝ GIÁ BÁN
====================================================== */
const priceModal = document.getElementById('popup');
const form = document.getElementById('productadd');
const cancelBtn = document.getElementById('cancelBtn');
const table = document.querySelector('#Bangsp tbody');
const khungbang = document.getElementById('khungbang');
const searchInput = document.getElementById('Timkiem');
const categoryInput = document.getElementById('category');
const nameInput = document.getElementById('name');
const costInput = document.getElementById('cost');
const profitInput = document.getElementById('profit');
const priceInput = document.getElementById('sell');

let editingRow = null;

if (typeof manageproduct !== "undefined") {
  khungbang.innerHTML = manageproduct.map(sp => `
    <tr>
      <td>${sp.brand}</td>
      <td>${sp.name}</td>
      <td>${sp.cost.toLocaleString("vi-VN")}</td>
      <td>${sp.profit}%</td>
      <td>${sp.price.toLocaleString("vi-VN")}</td>
      <td class="action">
        <button class="edit" onclick="openPriceModal('edit', this)">Sửa</button>
        <button class="delete" onclick="confirmDelete(this)">Xóa</button>
      </td>
    </tr>
  `).join("");
} else {
  console.warn("⚠️ manageproduct.js chưa được nạp.");
}

// --- Sự kiện sửa / xóa ---
if (table) {
  table.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {
      openPriceModal("edit", e.target);
    } else if (e.target.classList.contains("delete")) {
      confirmDelete(e.target);
    }
  });
}

// --- Modal ---
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

// --- Hàm tính giá ---
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

// --- Lưu sản phẩm ---
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
        <button class="edit">Sửa</button>
        <button class="delete">Xóa</button>
      </td>`;
  }
  priceModal.style.display = 'none';
};

// --- Xóa sản phẩm ---
function confirmDelete(btn) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    btn.closest("tr").remove();
  }
}

// --- Xuất file ---
function exportData() {
  alert("Xuất dữ liệu thành công!");
}

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
      <td><img src="${p.image || 'assets/img/logo.png'}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;"></td>
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

document.addEventListener('DOMContentLoaded', renderProductTable);

//Quản lý tồn kho

const tableBody = document.querySelector('#Table tbody');
const Modal = document.getElementById('detailModal');
const summaryModal = document.getElementById('popup-modal');
const btnSearch = document.getElementById('Btnsearch');
const exportBtn = document.getElementById('exportBtn');
const viewDetails = document.querySelector('.view-details');
const closeBtns = document.querySelectorAll('.close-btn, .closepopup');
const nameSearch = document.getElementById('Namesearch');
const nhanhieuSelect = document.getElementById('danhsach');
const cuahangSelect = document.getElementById('kho');
let inventory =[];
let filterData=[];

const stockTable = document.querySelector("#Table tbody");

if (typeof inventoryList !== "undefined") {
  stockTable.innerHTML = inventoryList.map(item => {
    let statusText = "Còn hàng", statusClass = "ok";
    if (item.slTon === 0) { statusText = "Hết hàng"; statusClass = "out"; }
    else if (item.slTon <= item.minTon) { statusText = "Sắp hết"; statusClass = "low"; }

    return `
      <tr>
        <td>${item.maSP}</td>
        <td>${item.nhanHieu}</td>
        <td>${item.tenSP}</td>
        <td>${item.slNhap.toLocaleString()}</td>
        <td>${item.slXuat.toLocaleString()}</td>
        <td>${item.slTon.toLocaleString()}</td>
        <td>${item.ngayCapNhat}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
      </tr>
    `;
  }).join("");
} else {
  console.warn("⚠️ tonkho.js chưa được nạp.");
}

function renderTable(data){
    if(!tableBody) return;
    tableBody.innerHTML='';
    if(data.length===0){
        tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Không tìm thấy sản phẩm.</td></tr>';
        return;
    }
    data.forEach(item=>{
        const row = document.createElement('tr');
        let statusText = 'Còn hàng', statusClass = 'ok';
        if(item.slTon===0){statusText = 'Hết hàng';statusClass = 'out';}
        else if(item.slTon<=item.minTon){statusText = 'Sắp hết';statusClass = 'low';}
        row.innerHTML=`
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
function renderSummary(data){
    document.getElementById('outcount').textContent = data.filter(i => i.slTon === 0).length;
    document.getElementById('lowcount').textContent = data.filter(i => i.slTon >0 && i.slTon <= i.minTon).length;
    document.getElementById('okcount').textContent = data.filter(i => i.slTon > i.minTon).length;
}
function openModal(item){
    if(!Modal) return;
    document.getElementById('modalMaSP').textContent=item.maSP;
    document.getElementById('modalTenSP').textContent=item.tenSP;
    document.getElementById('modalNhanhieuSP').textContent=item.nhanHieu;
    document.getElementById('modalKhoSP').textContent=item.khoHang;
    document.getElementById('modalGhichuSP').textContent=item.ghiChu || 'Không có ghi chú';

    const historyBody = document.getElementById('modalHistoryBody');
    historyBody.innerHTML='';
    if (item.history && item.history.length > 0) {
        item.history
            .sort((a,b) => new Date(b.ngay) - new Date(a.ngay))
            .slice(0,5)
            .forEach(hist => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${hist.ngay}</td>
                    <td class="${hist.hanhDong === 'Xuất' ? 'action-xuat':'action-nhap'}">${hist.hanhDong}</td>
                    <td>${hist.soLuong.toLocaleString()}</td>
                    <td>${hist.nguoiThucHien}</td>
                `;
            historyBody.appendChild(row);
        });
    } else {
         historyBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Không có lịch sử nhập/xuất gần đây.</td></tr>';
    }
    Modal.classList.add('show');
} 
function openSummaryModal(){
    if(!summaryModal) return;
    const outOfStock = inventory.filter(item=>item.slTon === 0);
    const lowStock = inventory.filter(item=>item.slTon>0 && item.slTon <= item.minTon);
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
if(btnSearch) {
    btnSearch.addEventListener('click', () => {
        const keyword = nameSearch.value.toLowerCase();
        const nhanHieu = nhanhieuSelect.value;
        const kho = cuahangSelect.value;
        let startDate = null, endDate = null;
        const startInput = document.getElementById("startDate").value;
        const endInput = document.getElementById("endDate").value;
        filterData = inventory.filter(item => {
            const itemDate = new Date(item.ngayCapNhat);
            return (
                (item.maSP.toLowerCase().includes(keyword) || item.tenSP.toLowerCase().includes(keyword)) &&
                (!nhanHieu || item.nhanHieu === nhanHieu) &&
                (!kho || item.khoHang === kho) &&
                (!startDate || !endDate || (itemDate >= startDate && itemDate <= endDate))
            );
        });
        renderTable(filterData);
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
    btn.onclick = function() {
        if(Modal) Modal.classList.remove('show');
        if(summaryModal) summaryModal.classList.remove('show');
    }
});
function closeInventory(){
    const stockSection = document.getElementById("stock-section");
    if (stockSection) stockSection.style.display = "none";
    const modal = document.getElementById("detailModal");
    const popup = document.getElementById("popup-modal");
    if (modal) modal.classList.remove("show");
    if (popup) popup.classList.remove("show");
    openSection("home-section");

}
function openDetailModal(item) {
    Modal.classList.add('show');
}
function closeModal() {
    Modal.classList.remove('show');
}
function openminiPU() {
    summaryModal.classList.add('show');
}
function closeMiniPU() {
    summaryModal.classList.remove('show');
}