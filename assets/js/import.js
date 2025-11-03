/* ====== IMPORTS (Phiếu nhập) ====== */
const importModal = document.getElementById('ImportPopup');
const importForm  = document.getElementById('ImportForm');
const importTbody = document.querySelector('#ImportTable tbody');
const importSearchInput = document.getElementById('searchImport');
const importCancelBtn   = document.getElementById('cancelImport');

// Dữ liệu phiếu nhập lấy từ imports.js (đã <script src="data/imports.js">)
let imports = (typeof importList !== 'undefined') ? [...importList] : [];
let editingImportRow = null;

/* ====== PRODUCTS (Danh mục sản phẩm) ====== */
const productModal = document.getElementById('ProductPopup');
const productForm  = document.getElementById('ProductForm');
const productTbody = document.querySelector('#ProductTable tbody');
const productCancelBtn = document.getElementById('cancelProduct');

let products = JSON.parse(localStorage.getItem('products'))
             || (typeof productList !== 'undefined' ? [...productList] : []);
let editingProductRow = null;
function renderImportTable(data = imports) {
  if (!importTbody) return;
  importTbody.innerHTML = data.map(pn => `
    <tr>
      <td>${pn.id}</td>
      <td>${pn.date}</td>
      <td>${Number(pn.total).toLocaleString('vi-VN')} đ</td>
      <td>${pn.status}</td>
      <td class="action">
        <button class="edit" onclick="openImportModal('edit', this)">Sửa</button>
        <button class="delete" onclick="deleteImport(this)">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function renderProductTable(data = products) {
  if (!productTbody) return;
  productTbody.innerHTML = data.map(p => {
    const imgSrc = p.image || p.img || 'assets/img/logo.png';
    return `
      <tr>
        <td>${p.type}</td>
        <td>${p.code}</td>
        <td>${p.name}</td>
        <td><img src="${imgSrc}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;"></td>
        <td>${p.desc || ''}</td>
        <td class="action">
          <button class="edit" onclick="openProductModal('edit', this)">Sửa</button>
          <button class="delete" onclick="deleteProduct(this)">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Gọi render sau khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  renderImportTable();
  renderProductTable();
});
function openImportModal(mode, btn) {
  importForm.reset();
  importModal.style.display = 'flex';
  editingImportRow = null;

  if (mode === 'edit' && btn) {
    const row = btn.closest('tr');
    document.getElementById('importCode').value  = row.cells[0].innerText.trim();
    document.getElementById('importDate').value  = row.cells[1].innerText.trim();
    document.getElementById('importTotal').value = row.cells[2].innerText.replace(/[^\d]/g,'');
    document.getElementById('importStatus').value= row.cells[3].innerText.trim();
    editingImportRow = row;
  }
}

importCancelBtn?.addEventListener('click', (e) => {
  e.preventDefault();                 // tránh reload
  importModal.style.display = 'none'; // đóng popup
});

importForm?.addEventListener('submit', (e) => {
  e.preventDefault(); // KHÔNG reload trang

  const newPN = {
    id:    document.getElementById('importCode').value.trim(),
    date:  document.getElementById('importDate').value,
    total: Number(document.getElementById('importTotal').value) || 0,
    status:document.getElementById('importStatus').value
  };

  if (!newPN.id || !newPN.date) {
    alert('Vui lòng nhập mã phiếu và ngày nhập!');
    return;
  }

  if (editingImportRow) {
    // update trong mảng theo id
    const idOld = editingImportRow.cells[0].innerText.trim();
    const idx = imports.findIndex(i => i.id === idOld);
    if (idx > -1) imports[idx] = newPN;
  } else {
    // id không trùng
    if (imports.some(i => i.id === newPN.id)) {
      alert('Mã phiếu đã tồn tại!');
      return;
    }
    imports.push(newPN);
  }

  renderImportTable();
  importModal.style.display = 'none';
});

function deleteImport(btn) {
  if (!confirm('Xóa phiếu nhập này?')) return;
  const row = btn.closest('tr');
  const id = row.cells[0].innerText.trim();
  imports = imports.filter(i => i.id !== id);
  renderImportTable();
}

function searchImport() {
  const kw = importSearchInput.value.trim().toLowerCase();
  const filtered = imports.filter(i =>
    i.id.toLowerCase().includes(kw)
    || i.status.toLowerCase().includes(kw)
  );
  renderImportTable(filtered);
}
function openProductModal(mode, btn) {
  productForm.reset();
  productModal.style.display = 'flex';
  editingProductRow = null;

  if (mode === 'edit' && btn) {
    const row = btn.closest('tr');
    document.getElementById('prodType').value = row.cells[0].innerText.trim();
    document.getElementById('prodCode').value = row.cells[1].innerText.trim();
    document.getElementById('prodName').value = row.cells[2].innerText.trim();
    document.getElementById('prodImg').value  = row.cells[3].querySelector('img')?.src || '';
    document.getElementById('prodDesc').value = row.cells[4].innerText.trim();
    editingProductRow = row;
  }
}

productCancelBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  productModal.style.display = 'none';
});

productForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const newProd = {
    type:  document.getElementById('prodType').value.trim(),
    code:  document.getElementById('prodCode').value.trim(),
    name:  document.getElementById('prodName').value.trim(),
    image: document.getElementById('prodImg').value.trim() || 'assets/img/logo.png',
    desc:  document.getElementById('prodDesc').value.trim()
  };
  if (!newProd.type || !newProd.code || !newProd.name) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
    return;
  }

  if (editingProductRow) {
    const oldCode = editingProductRow.cells[1].innerText.trim();
    const idx = products.findIndex(p => (p.code === oldCode));
    if (idx > -1) products[idx] = newProd;
  } else {
    if (products.some(p => p.code === newProd.code)) {
      alert('Mã sản phẩm đã tồn tại!');
      return;
    }
    products.push(newProd);
  }

  localStorage.setItem('products', JSON.stringify(products));
  renderProductTable();
  productModal.style.display = 'none';
});

function deleteProduct(btn) {
  if (!confirm('Xóa sản phẩm này?')) return;
  const code = btn.closest('tr').cells[1].innerText.trim();
  products = products.filter(p => p.code !== code);
  localStorage.setItem('products', JSON.stringify(products));
  renderProductTable();
}

function searchProductCategory() {
  const kw = document.getElementById('searchProductCategory').value.trim().toLowerCase();
  const filtered = products.filter(p =>
    (p.name || '').toLowerCase().includes(kw) ||
    (p.code || '').toLowerCase().includes(kw) ||
    (p.type || '').toLowerCase().includes(kw)
  );
  renderProductTable(filtered);
}
function confirmExit() {
  // chỉ ẩn popup nếu có
  document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
  openSection('home-section');
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
