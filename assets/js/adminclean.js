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
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.dataset.section;
      openSection(`${target}-section`);
    });
  });

  // Mặc định hiển thị trang chủ
  openSection("home-section");
});


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

// --- Nạp dữ liệu JSON (nếu chạy local thì fallback) ---
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

let products = JSON.parse(localStorage.getItem('products')) || [];

function renderProductTable(data = products) {
  if (!productTable) return;
  productTable.innerHTML = data.map(p => `
    <tr>
      <td>${p.type}</td>
      <td>${p.code}</td>
      <td>${p.name}</td>
      <td><img src="${p.image || 'assets/img/logo.png'}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;"></td>
      <td>${p.desc}</td>
      <td>
        <button onclick="openProductModal('edit', this)">Sửa</button>
        <button onclick="deleteProduct(this)">Xóa</button>
      </td>
    </tr>
  `).join('');
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
