//================
//Quản lý giá bán
//================

//Truy cập phần tử HTML
const priceModal = document.getElementById('popup');
const form = document.getElementById('productadd');
const cancelBtn = document.getElementById('cancelBtn');
const table = document.querySelector('#Bangsp tbody');
const searchInput = document.getElementById('Timkiem')

const idPrice = document.getElementById('id');
const idCatePrice = document.getElementById('categoryId');
const idProPrice = document.getElementById('productId');
const costInput = document.getElementById('cost');
const profitInput = document.getElementById('profit');
const priceInput = document.getElementById('sell');
const brandSelect = document.getElementById('categorySelect');
const productSelect = document.getElementById('productSelect'); 
let editingRow = null;

//LocalStorage
function getLocalPrices() {
  return JSON.parse(localStorage.getItem("priceList")) || [];
}
function getLocalBrands() {
  return getLocal("categoryList");
}
function getLocalProducts() {
  return getLocal("productList");
}
function setLocalPrices(list) {
  localStorage.setItem("priceList", JSON.stringify(list));
}
function syncAndRender() {
  const list = getLocalPrices();
  renderTable(list);
}
if (!localStorage.getItem("priceList")) {
  setLocalPrices(priceList);
}
let list = getLocalPrices();
syncAndRender();

//Hiển thị dữ liệu ra bảng
function renderTable(list) {
  table.innerHTML = list
    .map(
      (sp) => `
        <tr>
            <td>${sp.id}</td>
            <td>${sp.categoryId}</td>
            <td>${sp.productId}</td>
            <td>${Number(sp.cost).toLocaleString("vi-VN")}</td>
            <td>${sp.profit}%</td>
            <td>${Number(sp.price).toLocaleString("vi-VN")}</td>
            <td class="action">
                <button class="edit">Sửa</button> 
                <button class="delete">Xóa</button>
            </td>
        </tr>
    `
    )
    .join("");
}
table.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    openPriceModal("edit", e.target);
  } else if (e.target.classList.contains("delete")) {
    confirmDelete(e.target);
  }
});

//Hàm ràng buộc
//CHECK LỖI
function validateID(code, prefix) {
  return new RegExp(`^${prefix}\\d{2,3}$`).test(code);
}
// Kiểm tra số dương > 0
function validatePositiveNumber(value) {
  const cleanedValue = cleanNumber(value.value || value);
  return cleanedValue > 0;
}
//Xóa viền đỏ khi đúng
function clearValidationStyles() {
    [idPrice, idCatePrice, idProPrice, costInput, profitInput, priceInput].forEach(input => {
        input.style.border = ''; 
    });
}
function checkDuplicatePriceID(newId) {
  const prices = getLocalPrices();
  const isEditing = editingRow !== null;
  let oldId = isEditing ? editingRow.cells[0].innerText : null;
  if (!isEditing && prices.some((p) => p.id === newId)) {
    alert("⚠️ Mã Giá Bán đã tồn tại! Vui lòng làm mới hoặc kiểm tra lại.");
    return true;
  }
  return false;
}
//Mở
function openPriceModal(mode, btn) {
    form.reset();
    priceInput.value = '';
    clearValidationStyles();
    priceModal.style.display = 'flex';
    editingRow = null;

    allBrands = [];
    allProducts = [];
    populateBrandDropdown();
    populateProductDropdown(null);
    if (mode === 'edit' && btn) {
        const row = btn.closest('tr');
        const idPriceValue = row.cells[0].innerText;
        const brandId = row.cells[1].innerText;
        const productId = row.cells[2].innerText;
        const brandExists = allBrands.find(b => b.id === brandId);
        if (brandExists) {
            brandSelect.value = brandId; 
            populateProductDropdown(brandId); // Tải sản phẩm cho brand này
        } else {
            const tempOption = document.createElement('option');
            tempOption.value = brandId;
            tempOption.textContent = `${brandId} (Đã bị xóa)`;
            brandSelect.appendChild(tempOption);
            brandSelect.value = brandId;
        }
        
        // 2. Product: Kiểm tra và tạo option tạm nếu đã bị xóa
        const productExists = allProducts.find(p => p.id === productId);
        if (productExists) {
            productSelect.value = productId;
        } else {
            const tempOption = document.createElement('option');
            tempOption.value = productId;
            tempOption.textContent = `${productId} (Đã bị xóa)`;
            productSelect.appendChild(tempOption);
            productSelect.value = productId;
        }
        idPrice.value = row.cells[0].innerText;
        idCatePrice.value = row.cells[1].innerText;
        idProPrice.value = row.cells[2].innerText;
        costInput.value = row.cells[3].innerText.replace(/,/g, '');
        profitInput.value = parseFloat(row.cells[4].innerText);
        priceInput.value = row.cells[5].innerText.replace(/,/g, '');
        editingRow = row;
        costInput.setAttribute('readonly', true);
        idPrice.setAttribute('readonly', true);
        idProPrice.setAttribute('readonly', true);
        idCatePrice.setAttribute('readonly', true);
        brandSelect.setAttribute('disabled', true);
        productSelect.setAttribute('disabled', true);
    }else{
        costInput.removeAttribute('readonly');  
        idPrice.removeAttribute('readonly');
        idProPrice.removeAttribute('readonly', true);
        idCatePrice.removeAttribute('readonly', true);
        brandSelect.removeAttribute('disabled');
        productSelect.removeAttribute('disabled');
        idCatePrice.value = '';
        idProPrice.value = '';
        autoFillNewCodes();
    }
}
window.openPriceModal = openPriceModal;

cancelBtn.onclick = () => {
    form.reset();
    priceInput.value = '';
    [idPrice, idCatePrice, idProPrice, costInput, profitInput, priceInput].forEach(input => {
        input.style.border = '';
    });
    editingRow = null;
    priceModal.style.display = 'none';
};
// Khi chọn thương hiệu
brandSelect.addEventListener("change", () => {
  const selectedBrandId = brandSelect.value;
  // Gán Mã Thương hiệu vào input ẩn
  idCatePrice.value = selectedBrandId;
  // Lọc và cập nhật danh sách sản phẩm
  populateProductDropdown(selectedBrandId);
  productSelect.value = "";
  idProPrice.value = "";
});
productSelect.addEventListener("change", () => {
  const selectedProductId = productSelect.value;
  // Gán Mã Sản phẩm vào input ẩn
  idProPrice.value = selectedProductId;
});
//đề xuất mã kế tiếp
const generateCode = (prefix, colIndex) => {
  const rows = Array.from(table.rows);
  const maxNum = rows
    .map((r) => r.cells[colIndex].innerText)
    .filter((c) => c.startsWith(prefix))
    .map((c) => parseInt(c.slice(2)) || 0)
    .reduce((a, b) => Math.max(a, b), 0);
  return prefix + String(maxNum + 1).padStart(2, "0");
};
function autoFillNewCodes() {
  idPrice.value = generateCode("GN", 0); // Cột 0 là Mã GN
}
//Giá và lợi
function cleanNumber(value) {
  return parseFloat(value.replace(/[.,\s]/g, "")) || 0;
}
function formatNumber(num) {
  return num.toLocaleString("vi-VN");
}
function updatePrice() {
  const cost = cleanNumber(costInput.value);
  const profit = parseFloat(profitInput.value);
  if (cost > 0 && !isNaN(profit)) {
    const price = cost + (cost * profit) / 100;
    priceInput.value = formatNumber(Math.round(price));
  } else {
    priceInput.value = "";
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

costInput.addEventListener("input", updatePrice);
profitInput.addEventListener("input", updatePrice);
priceInput.addEventListener("input", updateProfit);

costInput.addEventListener("blur", () => {
  let val = cleanNumber(costInput.value);
  costInput.value = val ? formatNumber(val) : "";
});
priceInput.addEventListener("blur", () => {
  let val = cleanNumber(priceInput.value);
  priceInput.value = val ? formatNumber(val) : "";
});
//Lưu cập nhật
form.onsubmit = (e) => {
    e.preventDefault();
    const ID = idPrice.value;
    const categoryPrice = idCatePrice.value;
    const productPrice = idProPrice.value;
    const cost = cleanNumber(costInput.value);
    const profit = parseFloat(profitInput.value);
    const price = cleanNumber(priceInput.value);
    
    
    if (!validateID(idPrice.value, 'GN')) {
        idPrice.style.border = '2px solid red';
        alert('Mã phải có dạng GN01 hoặc GN001!');
        idPrice.focus();
        return;
    }
    if (!validatePositiveNumber(costInput)) {
        costInput.style.border = '2px solid red'; 
        alert('Giá vốn phải lớn hơn 0!'); 
        return; }
    if (!validatePositiveNumber(profitInput)) {
        profitInput.style.border = '2px solid red'; 
        alert('Lợi nhuận phải lớn hơn 0!'); 
        return; }
    if (!validatePositiveNumber(priceInput)) { 
        priceInput.style.border = '2px solid red';
        alert('Giá bán phải lớn hơn 0!'); 
        return; }
    if (!ID || !categoryPrice || !productPrice || !cost || !profit) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    //Thêm hoặc sửa
    if (editingRow) {
        editingRow.cells[0].innerText = ID;
        editingRow.cells[1].innerText = categoryPrice;
        editingRow.cells[2].innerText = productPrice;
        editingRow.cells[3].innerText = cost;
        editingRow.cells[4].innerText = profit + '%';
        editingRow.cells[5].innerText = price;
        const index = list.findIndex(item => item.id === ID);
        if(index !== -1){
            list[index] = {id: ID, categoryId: categoryPrice, productId: productPrice, cost, profit, price };
        }
    } else {
        const row = table.insertRow();
        if (checkDuplicatePriceID(ID)) return;
        row.innerHTML = `
                <td>${idPrice.value}</td>
                <td>${idCatePrice.value}</td>
                <td>${idProPrice.value}</td>
                <td>${cost}</td>
                <td>${profit}%</td>
                <td>${price}</td>
                <td class="action">
                    <button class="edit">Sửa</button>
                    <button class="delete">Xóa</button>
                </td>
            `;
    list.push({
      id: ID,
      categoryId: categoryPrice,
      productId: productPrice,
      cost,
      profit,
      price,
    });
  }
  setLocalPrices(list);
  syncAndRender();
  priceModal.style.display = "none";
};

function searchProduct() {
    const keyword = searchInput.value.trim().toLowerCase();
    for (let row of table.getElementsByTagName('tr')) {
        // Kiểm tra ký tự đầu của tất cả các ô trong hàng
        const match = Array.from(row.cells).some((cell, index) => {
            if (index === row.cells.length - 1) return false;
            return cell.innerText.trim().toLowerCase().startsWith(keyword);
        });

    row.style.display = match || keyword === "" ? "" : "none";
  }
}
searchInput.addEventListener("input", searchProduct);

//Xóa dòng
function confirmDelete(btn) {
  const popup = document.getElementById("xacnhan");
  popup.style.display = "flex";
  const row = btn.closest("tr");
  const ID = row.cells[0].innerText;
  document.getElementById("xacnhanxoa").onclick = () => {
    list = list.filter((sp) => sp.id !== ID);
    setLocalPrices(list);
    syncAndRender();
    popup.style.display = "none";
  };
  document.getElementById("xacnhankhong").onclick = () =>
    (popup.style.display = "none");
}
function confirmExit() {
  openSection("home-section");
  document.getElementById("xacnhanthoat").style.display = "none";
  document.getElementById("price-section").style.display = "none";
  document.getElementById("home-section").style.display = "block";
  document.getElementById("confirmno").onclick = () =>
    (document.getElementById("xacnhanthoat").style.display = "none");
}
window.confirmExit = confirmExit;
//Liên kết sản phẩm và loại sản phẩm
// Biến đệm (cache) toàn bộ dữ liệu để dùng cho Dropdown
let allBrands = [];
let allProducts = [];

// Khởi tạo Local Storage (Chỉ chạy 1 lần nếu chưa có dữ liệu)
function getLocal(key, def = []) {
  return JSON.parse(localStorage.getItem(key)) || def;
}
function setLocal(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
// Hàm đọc dữ liệu cụ thể
function getLocalBrands() {
  return getLocal("categoryList"); // Đọc từ key 'categoryList'
}
function getLocalProducts() {
  return getLocal("productList"); // Đọc từ key 'productList'
}
function getLocalPrices() {
  return getLocal("priceList"); // Đọc từ key 'priceList'
}
/**
 * Hàm chung để điền options vào một thẻ select
 */
function populateDropdown(selectElement, items, valueKey, textKey) {
  const currentValue = selectElement.value;
  selectElement.innerHTML = '<option value="">-- Chọn --</option>';

  for (const item of items) {
    const option = document.createElement("option");
    option.value = item[valueKey];
    option.textContent = item[textKey];
    selectElement.appendChild(option);
  }

  // Giữ lại giá trị cũ nếu nó vẫn còn trong danh sách
  if (
    Array.from(selectElement.options).some((opt) => opt.value === currentValue)
  ) {
    selectElement.value = currentValue;
  }
}

// Hàm điền dropdown Thương hiệu
function populateBrandDropdown() {
  // Tải brand và chỉ lấy những brand đang "active"
  allBrands = getLocalBrands()
    .filter((b) => b.status === "active")
    .map((brand) => ({
      id: brand.id, // Key trong data của bạn
      name: brand.brand, // Tên hiển thị trong data của bạn
    }));

  populateDropdown(brandSelect, allBrands, "id", "name");
}

// Hàm điền dropdown Sản phẩm (lọc theo ID thương hiệu)
function populateProductDropdown(selectedBrandId) {
  // Tải danh sách sản phẩm (chỉ 1 lần khi allProducts rỗng)
  if (!allProducts.length) {
    // Tải toàn bộ sản phẩm từ Local Storage
    allProducts = getLocalProducts().map((product) => ({
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
    }));
  }

  // Lọc sản phẩm dựa trên 'categoryId'
  const filteredProducts = selectedBrandId
    ? allProducts.filter((p) => p.categoryId === selectedBrandId)
    : [];

  populateDropdown(productSelect, filteredProducts, "id", "name");
}
//=====================
//Quản lý đơn đặt hàng
//=====================
function getLocalOrders() {
  return JSON.parse(localStorage.getItem("orderList")) || [];
}
function setLocalOrders(list) {
  localStorage.setItem("orderList", JSON.stringify(list));
}
function syncAndRenderOrders() {
  const list = getLocalOrders(); // lấy từ LocalStorage
  displayOrder(list); // vẽ lại bảng
}
// Khởi tạo dữ liệu nếu chưa có
if (!localStorage.getItem("orderList")) {
  setLocalOrders(orders); // dùng orderData mặc định
}

let orderList = getLocalOrders();
syncAndRenderOrders();

function displayOrder(orders) {
  const tableBody = document.getElementById("orderTable");
  tableBody.innerHTML = "";

  orders.forEach((order) => {
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
  tableBody.querySelectorAll(".detail-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      showDetails(id);
    });
  });
}
function Orders() {
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;
  const status = document.getElementById("status").value;

  const filtered = orderList.filter((order) => {
    const orderDate = new Date(order.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const inDateRange =
      (!from || orderDate >= from) && (!to || orderDate <= to);
    const statusMatch = !status || order.status === status;
    return inDateRange && statusMatch;
  });
  displayOrder(filtered);
}
function showDetails(orderId) {
  const order = orderList.find((o) => o.id === orderId);
  if (!order) return;
  const popup = document.getElementById("details");

  document.getElementById("detail-id").textContent = order.id;
  document.getElementById("detail-cus").textContent = order.userId;
  document.getElementById("detail-date").textContent = order.date;
  document.getElementById("detail-product").textContent =
    order.address.value || "";
  const methodTableBody = document.querySelector("#methodtable tbody");
  methodTableBody.innerHTML = `
    <tr>
        <td>${order.payment.method}</td>
        <td>${order.payment.confirmed}</td>
    </tr>
    `;
  const select = document.getElementById("detailsstatus");
  select.value = order.status;
  const statusFlow = ["newly ordered", "processed", "delivered", "cancelled"];
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
  listBody.innerHTML = order.items
    .map(
      (d) => `
        <tr>
            <td>${d.productId}</td>
            <td>${d.quantity}</td>
        </tr>
    `
    )
    .join("");
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

  const order = orderList.find((o) => o.id === id);
  if (order) {
    const oldStatus = order.status;
    if (newStatus === "delivered" && oldStatus !== "delivered") {
      if (typeof updateInventoryFromOrder === "function") {
        updateInventoryFromOrder(order); // Gọi hàm cập nhật tồn kho
      } else {
        console.error("Hàm updateInventoryFromOrder không được tìm thấy!");
        alert(
          "Lỗi: Không thể cập nhật tồn kho. Hàm 'updateInventoryFromOrder' bị thiếu."
        );
      }
    }
    order.status = newStatus;
    setLocalOrders(orderList);
    syncAndRenderOrders(); // Cập nhật lại bảng
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
function addOrderToAdminList(customer, cartItems, paymentMethod) {
    const adminOrderList = getLocalOrders();

    // 1. TẠO ID MỚI (Logic Tự Tăng ID DHxx hợp lệ)
    const dhIds = adminOrderList
        // Lọc: Chỉ lấy đơn hàng có ID là chuỗi và bắt đầu bằng "DH"
        .filter(order => order.id && typeof order.id === 'string' && order.id.startsWith("DH") && order.id.length <=5)
        .map(order => parseInt(order.id.replace("DH", "")))
        .filter(num => !isNaN(num)); 

    let maxNum = 0;
    if (dhIds.length > 0) {
        maxNum = Math.max(...dhIds);
    }
    const newIdNum = maxNum + 1;
    // Format ID: DHxx
    const newOrderId = "DH" + String(newIdNum).padStart(2, '0');
    // Format UserID: KHxx
    const newUserId = "KH" + String(newIdNum).padStart(2, '0');

    // 2. FORMAT NGÀY (Chỉ lấy YYYY-MM-DD)
    const newDate = new Date().toISOString().split('T')[0];

    const adminItems = Object.keys(cartItems).map(productId => {
        const item = cartItems[productId];
        return {
            productId: item.id || item.productId || item.name, // Mã SP (được lấy từ key trong object cartItems)
            quantity: item.qty
        };
    });

    const isConfirmed = false; 

    const newOrder = {
        id: newOrderId, // Đã sửa lỗi dãy số dài
        userId: newUserId, // Đã sửa lỗi dãy số dài
        date: newDate, // Đã sửa lỗi định dạng ngày
        status: "newly ordered",
        
        // Cấu trúc bắt buộc cho showDetails
        address: { 
            value: customer.address 
        },
        
        // Cấu trúc bắt buộc cho showDetails
        payment: {
            method: paymentMethod,
            confirmed: isConfirmed // Đã sửa lỗi set mặc định
        },
        
        items: adminItems, // Đã sửa lỗi mã SP và SL
        customer: customer // Thông tin KH đầy đủ
    };

    adminOrderList.push(newOrder);
    setLocalOrders(adminOrderList);
    syncAndRenderOrders();

    // Cập nhật lại orders của khách hàng
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    
    // Đơn hàng của khách hàng nên giữ nguyên format đầy đủ (bao gồm tên SP, giá)
    orders.push({
      id: newOrderId, // Dùng ID mới để đồng bộ giữa 2 bảng
      date: new Date().toLocaleString(), // Dùng toLocaleString() cho giao diện khách hàng
      items: Object.values(cartItems),
      customer: customer,
      payment: paymentMethod
    });
    localStorage.setItem("orders", JSON.stringify(orders));
}
//==============
//Quản lý tồn kho
//=============
function getInventory() {
  return JSON.parse(localStorage.getItem("inventoryList")) || [];
}

function setInventory(list) {
  localStorage.setItem("inventoryList", JSON.stringify(list));
}
if (!localStorage.getItem("inventoryList")) {
  setInventory(inventoryList);
}
const tableBody = document.querySelector("#Table tbody");
const tonkhoModal = document.getElementById("detailModal");
const summaryModal = document.getElementById("popup-modal");
const btnSearch = document.getElementById("Btnsearch");
const viewDetails = document.querySelector(".view-details");
const closeBtns = document.querySelectorAll(".close-modal, .close-popup");
const nameSearch = document.getElementById("Namesearch");
const searchSP = document.getElementById("Prosearch");
const searchCate = document.getElementById("Catesearch");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const MIN_TON = 10;
function displayTon(data) {
  tableBody.innerHTML = "";
  if (data.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="9" style="text-align:center;">Không tìm thấy sản phẩm.</td></tr>';
    return;
  }
  data.forEach((item) => {
    const row = document.createElement("tr");
    let statusText = "Còn hàng",
      statusClass = "ok";
    if (item.slTon === 0) {
      statusText = "Hết hàng";
      statusClass = "out";
    } else if (item.slTon <= item.minTon) {
      statusText = "Sắp hết";
      statusClass = "low";
    }
    row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.productId}</td>
            <td>${item.categoryId}</td>
            <td>${
              item.slNhap !== undefined ? item.slNhap.toLocaleString() : 0
            }</td> 
            <td>${
              item.slBan !== undefined ? item.slBan.toLocaleString() : 0
            }</td>
            <td>${
              item.slTon !== undefined ? item.slTon.toLocaleString() : 0
            }</td>
            <td>${item.ngayCapNhat}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td class="action">
                <button class="delete">Xóa</button>
            </td>
        `;
    row.addEventListener("click", (e) => {
      if (!e.target.classList.contains("delete")) {
        openModal(item);
      }
    });
    tableBody.appendChild(row);
  }); // lưu LocalStorage
  renderSummary(data);
}
let inventory = getInventory();
function syncAndRenderInventory() {
  inventory = getInventory(); // đồng bộ biến inventory với LocalStorage
  displayTon(inventory); // vẽ lại bảng
  renderSummary(inventory); // cập nhật thống kê
}
function renderSummary(data) {
  document.getElementById("outcount").textContent = data.filter(
    (i) => i.slTon === 0
  ).length;
  document.getElementById("lowcount").textContent = data.filter(
    (i) => i.slTon > 0 && i.slTon <= i.minTon
  ).length;
  document.getElementById("okcount").textContent = data.filter(
    (i) => i.slTon > i.minTon
  ).length;
}
function openModal(item) {
  if (!tonkhoModal) return;
  document.getElementById("modalMaSP").textContent = item.id;
  document.getElementById("modalTenSP").textContent = item.productId;
  document.getElementById("modalNhanhieuSP").textContent = item.categoryId;
  document.getElementById("minTonLimit").textContent = item.minTon;
  const historyBody = document.getElementById("modalHistoryBody");
  historyBody.innerHTML = "";
  if (item.history && item.history.length > 0) {
    item.history
      .sort((a, b) => new Date(b.ngay) - new Date(a.ngay))
      .slice(0, 5)
      .forEach((hist) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${hist.ngay}</td>
                    <td class="${
                      ["Bán", "Xuất"].includes(hist.hanhDong)
                        ? "action-xuat"
                        : "action-nhap"
                    }">${hist.hanhDong}</td>
                    <td>${hist.soLuong.toLocaleString()}</td>
                `;
        historyBody.appendChild(row);
      });
  } else {
    historyBody.innerHTML =
      '<tr><td colspan="4" style="text-align:center;">Không có lịch sử nhập/xuất gần đây.</td></tr>';
  }
  tonkhoModal.classList.add("show");
}
function openSummaryModal(data = getInventory()) {
  if (!summaryModal) return;
  const inventory = data;
  const outOfStock = inventory.filter((item) => item.slTon === 0);
  const lowStock = inventory.filter(
    (item) => item.slTon > 0 && item.slTon <= item.minTon
  );
  const inStock = inventory.filter((item) => item.slTon > item.minTon);
  document.getElementById(
    "sum-outcount"
  ).textContent = `(${outOfStock.length})`;
  document.getElementById("sum-lowcount").textContent = `(${lowStock.length})`;
  document.getElementById("sum-okcount").textContent = `(${inStock.length})`;
  const renderList = (list) =>
    list
      .map(
        (i) =>
          `<li><span class="summary-code">[${i.productId}]</span> Mã thương hiệu: ${i.categoryId}</li>`
      )
      .join("");
  document.getElementById("sum-outList").innerHTML = outOfStock.length
    ? renderList(outOfStock)
    : "<li>Không có sản phẩm nào.</li>";
  document.getElementById("sum-lowlist").innerHTML = lowStock.length
    ? renderList(lowStock)
    : "<li>Không có sản phẩm nào.</li>";
  document.getElementById("sum-oklist").innerHTML = inStock.length
    ? renderList(inStock)
    : "<li>Không có sản phẩm nào.</li>";

  summaryModal.classList.add("show");
}
if (btnSearch) {
  btnSearch.addEventListener("click", () => {
    const keyword = nameSearch.value.trim().toLowerCase();
    const Pro = searchSP.value.trim().toLowerCase();
    const Cate = searchCate.value.trim().toLowerCase();
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;
    // Hàm chuẩn hóa ngày (dd/mm/yyyy -> yyyy-mm-dd)
    const normalizeDate = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateStr;
    };
    // Chuẩn hóa và tạo đối tượng Date
    const startDate = normalizeDate(start)
      ? new Date(normalizeDate(start))
      : null;
    let endDate = normalizeDate(end) ? new Date(normalizeDate(end)) : null;

    // Đẩy giờ lên cuối ngày cho ngày kết thúc
    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }
    let filterData = inventory.filter((item) => {
      const itemDate = new Date(item.ngayCapNhat);
      const keywordMatch =
        !keyword ||
        item.id.toLowerCase().includes(keyword) ||
        item.productId.toLowerCase().includes(keyword) ||
        item.categoryId.toLowerCase().includes(keyword);
      const ProMatch = !Pro || item.productId.toLowerCase().includes(Pro);
      const CateMatch = !Cate || item.categoryId.toLowerCase().includes(Cate);
      const dateStartMatch = !startDate || itemDate >= startDate;
      const dateEndMatch = !endDate || itemDate <= endDate;

      return (
        keywordMatch && ProMatch && CateMatch && dateStartMatch && dateEndMatch
      );
    });
    displayTon(filterData);
    renderSummary(filterData);
    window.currentFilterData=filterData;
  });
}

if (viewDetails) {
  viewDetails.addEventListener("click", (e) => {
    e.preventDefault();
    openSummaryModal(window.currentFilterData||inventory);
  });
}
closeBtns.forEach((btn) => {
  btn.onclick = function () {
    tonkhoModal.classList.remove("show");
    summaryModal.classList.remove("show");
    document.getElementById("xacnhanStock").style.display = "none";
  };
});
function closeInventory() {
  document.getElementById("stock-section").style.display = "none";
  tonkhoModal.classList.remove("show");
  summaryModal.classList.remove("show");
}
window.closeInventory = closeInventory;
tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.stopPropagation();
    const MA = e.target.closest("tr").children[0].textContent;
    const SP = inventory.find((sp) => sp.id === MA);
    if (e) {
      confirmDeleteStock(e.target);
    }
  }
});

function confirmDeleteStock(btn) {
  const deleteStock = document.getElementById("xacnhanStock");
  deleteStock.style.display = "flex";
  const rowStock = btn.closest("tr");
  document.getElementById("xacnhanxoaStock").onclick = () => {
    const maSP = rowStock.children[0].textContent;
    inventory = inventory.filter((i) => i.id !== maSP);
    setInventory(inventory);
    syncAndRenderInventory();
    deleteStock.style.display = "none";
  };
  document.getElementById("xacnhankhongStock").onclick = () =>
    (deleteStock.style.display = "none");
}
function ResetDateStock() {
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("Namesearch").value = "";
  document.getElementById("Prosearch").value = "";
  document.getElementById("Catesearch").value = "";
  const inventory = getInventory();
  displayTon(inventory);
  renderSummary(inventory);
}
function openDetailModal(item) {
  tonkhoModal.classList.add("show");
}
function closeModal() {
  tonkhoModal.classList.remove("show");
}
function openminiPU() {
  summaryModal.classList.add("show");
}
function closeMiniPU() {
  summaryModal.classList.remove("show");
}
//Liên kế phiếu nhập
// --- Hàm tạo Mã Tồn kho (TKxx) ---
function generateInventoryCode() {
  const inventoryList = getInventory();
  const prefix = "TK";
  // Tìm số lớn nhất hiện có
  const maxNum = inventoryList
    .map((item) => parseInt(item.id.slice(2)) || 0)
    .reduce((max, current) => Math.max(max, current), 0);

  // Mã mới: TK01, TK02, ...
  return prefix + String(maxNum + 1).padStart(2, "0");
}
/**
 ================================
 * @param {object | null} newSlip - Dữ liệu phiếu nhập MỚI (sau khi lưu). 
 * Là NULL nếu đây là hành động XÓA.
 * @param {object | null} oldSlip - Dữ liệu phiếu nhập CŨ (trước khi lưu). 
 * Là NULL nếu đây là hành động TẠO MỚI.
 */
function updateInventoryFromImport(newSlip, oldSlip) {
  const inventoryList = getInventory();
  let hasChanges = false;
  if (oldSlip && oldSlip.status === "completed") {
    oldSlip.items.forEach((item) => {
      const inventoryItem = inventoryList.find(
        (inv) => inv.productId === item.productId
      );
      if (inventoryItem) {
        const Int = parseInt(item.quantity);
        // Đảm bảo không trừ số lượng âm
        inventoryItem.slNhap = Math.max(
          0,
          parseInt(inventoryItem.slNhap) - Int
        );
        inventoryItem.slTon = Math.max(0, parseInt(inventoryItem.slTon) - Int);
        inventoryItem.trangThai =
          inventoryItem.slTon <= (window.MIN_TON || 10)
            ? "Sắp hết"
            : "Còn hàng";
        // Xóa lịch sử nhập hàng liên quan đến phiếu này
        inventoryItem.history = inventoryItem.history.filter(
          (h) => h.importId !== oldSlip.id
        );
        hasChanges = true;
      }
    });
  }
  if (newSlip && newSlip.status === "completed") {
    const ngayCapNhatTonKho = newSlip.date;

    newSlip.items.forEach((item) => {
      let inventoryItem = inventoryList.find(
        (inv) => inv.productId === item.productId
      );
      const itemQuantity = parseInt(item.quantity) || 0; // Chuyển sang số
      if (itemQuantity === 0) return;
      // Tạo mục lịch sử mới
      const historyEntry = {
        ngay: ngayCapNhatTonKho,
        hanhDong: "Nhập",
        soLuong: item.quantity,
        importId: newSlip.id, // Rất quan trọng để theo dõi
      };
      if (inventoryItem) {
        // --- Cập nhật cho mục tồn kho đã có ---
        const currentSlNhap = parseInt(inventoryItem.slNhap) || 0;
        const currentSlTon = parseInt(inventoryItem.slTon) || 0;
        inventoryItem.slNhap = currentSlNhap + itemQuantity;
        inventoryItem.slTon = currentSlTon + itemQuantity;
        inventoryItem.ngayCapNhat = ngayCapNhatTonKho;
        // Thêm vào đầu mảng lịch sử (để hiện 5 cái gần nhất)
        inventoryItem.trangThai =
          inventoryItem.slTon <= (window.MIN_TON || 10)
            ? "Sắp hết"
            : "Còn hàng";
        inventoryItem.history.unshift(historyEntry);
        hasChanges = true;
      } else {
        // --- Tạo mới mục tồn kho ---
        const allProduct =
          JSON.parse(localStorage.getItem("productList")) || [];
        const allCategories =
          JSON.parse(localStorage.getItem("categoryList")) || [];
        const productInfo = allProduct.find((p) => p.id === item.productId);
        if (productInfo) {
          const categoryInfo = allCategories.find(
            (c) => c.id === productInfo.categoryId
          );
          const categoryName = categoryInfo
            ? categoryInfo.brand
            : productInfo.categoryId;
          const newInventoryCode = generateInventoryCode();
          const newInventoryItem = {
            id: newInventoryCode,
            productId: item.productId,
            categoryId: productInfo.categoryId,
            slNhap: item.quantity,
            slBan: 0,
            slTon: item.quantity,
            minTon: window.MIN_TON || 10,
            stockPro: productInfo.name,
            stockCate: categoryName,
            ngayCapNhat: ngayCapNhatTonKho,
            trangThai:
              item.quantity > (window.MIN_TON || 10) ? "Còn hàng" : "Sắp hết",
            history: [historyEntry],
          };
          inventoryList.push(newInventoryItem);
          hasChanges = true;
        } else {
          console.error(
            `Lỗi Tồn Kho: Không tìm thấy sản phẩm ${item.productId} trong localStorage. Phiếu nhập ${newSlip.id}`
          );
        }
      }
    });
  }
  if (hasChanges) {
    setInventory(inventoryList); // Lưu vào localStorage
    syncAndRenderInventory(); // Vẽ lại bảng tồn kho

    // CẬP NHẬT MODAL
    const tonkhoModal = document.getElementById("detailModal");
    if (tonkhoModal && tonkhoModal.classList.contains("show")) {
      const modalInventoryId = document.getElementById("modalMaSP").textContent;
      if (modalInventoryId) {
        const updatedItem = getInventory().find(
          (i) => i.id === modalInventoryId
        );
        if (updatedItem) {
          openModal(updatedItem); // Cập nhật nội dung modal đang mở
        } else {
          tonkhoModal.classList.remove("show");
        }
      }
    }
  }
}
//Liên kết với đơn hàng
function updateInventoryFromOrder(order) {
  console.log("Đang cập nhật tồn kho cho đơn hàng:", order.id);
  const inventoryList = getInventory(); // Lấy tồn kho hiện tại
  let hasChanges = false;

  // Lấy ngày của đơn hàng, hoặc ngày hôm nay nếu không có
  const today = new Date();
  const ngayDelivered =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  // Lặp qua từng sản phẩm trong đơn hàng
  order.items.forEach((item) => {
    const itemQuantity = parseInt(item.quantity) || 0;
    if (itemQuantity === 0) return; // Bỏ qua nếu số lượng là 0

    // Tìm sản phẩm tương ứng trong kho
    const inventoryItem = inventoryList.find(
      (inv) => inv.productId === item.productId
    );

    if (inventoryItem) {
      // --- Cập nhật mục tồn kho đã có ---
      const currentSlBan = parseInt(inventoryItem.slBan) || 0;
      const currentSlTon = parseInt(inventoryItem.slTon) || 0;

      inventoryItem.slBan = currentSlBan + itemQuantity; // Tăng số lượng BÁN
      inventoryItem.slTon = Math.max(0, currentSlTon - itemQuantity); // Giảm số lượng TỒN (không để âm)
      inventoryItem.ngayCapNhat = ngayDelivered; // Cập nhật ngày
      // Tạo mục lịch sử mới
      const historyEntry = {
        ngay: ngayDelivered,
        hanhDong: "Bán",
        soLuong: itemQuantity,
        orderId: order.id, // Thêm ID đơn hàng để tham chiếu
      };

      // Thêm vào đầu mảng lịch sử
      if (!inventoryItem.history) {
        inventoryItem.history = [];
      }
      inventoryItem.history.unshift(historyEntry);

      // Cập nhật trạng thái
      if (inventoryItem.slTon === 0) {
        inventoryItem.trangThai = "Hết hàng";
      } else if (inventoryItem.slTon <= inventoryItem.minTon) {
        inventoryItem.trangThai = "Sắp hết";
      } else {
        inventoryItem.trangThai = "Còn hàng";
      }

      hasChanges = true;
    } else {
      // --- Trường hợp không tìm thấy SP trong kho ---
      console.error(
        `Lỗi Tồn Kho: Không tìm thấy sản phẩm ${item.productId} (từ đơn hàng ${order.id}) trong kho.`
      );
    }
  });

  if (hasChanges) {
    setInventory(inventoryList); // Lưu lại vào localStorage

    // Tự động cập nhật bảng tồn kho
    if (typeof syncAndRenderInventory === "function") {
      syncAndRenderInventory();
    }

    // Cập nhật modal chi tiết tồn kho nếu đang mở
    const tonkhoModal = document.getElementById("detailModal");
    if (tonkhoModal && tonkhoModal.classList.contains("show")) {
      const modalInventoryId = document.getElementById("modalMaSP").textContent;
      const updatedItem = inventoryList.find((i) => i.id === modalInventoryId);
      if (updatedItem && typeof openModal === "function") {
        openModal(updatedItem); // Cập nhật nội dung modal
      }
    }
  }
}
window.getInventory = getInventory;
window.setInventory = setInventory;
window.MIN_TON = MIN_TON;
window.updateInventoryFromImport = updateInventoryFromImport;
window.syncAndRenderInventory = syncAndRenderInventory;
window.openModal = openModal;
window.openDetailModal = openDetailModal;
window.openSummaryModal = openSummaryModal;
window.closeModal = closeModal;
window.openminiPU = openminiPU;
window.closeMiniPU = closeMiniPU;
window.confirmDeleteStock = confirmDeleteStock;
syncAndRenderInventory();

// sidebar
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".sidebar-menu a");

  menuItems.forEach((item) => {
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
  document.querySelectorAll(".admin-section").forEach((sec) => {
    sec.style.display = "none";
  });

  // Ẩn tất cả popup/modal nếu có
  document.querySelectorAll(".modal, .popup").forEach((p) => {
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
categorys_data_local = savedCategorys
  ? JSON.parse(savedCategorys)
  : categoryList;

// Cập nhật dropdown loại sản phẩm trong form thêm sản phẩm
function updateProductCategoryDropdown() {
  const categorySelect = document.getElementById("prodType");
  if (!categorySelect) return;

  const categories = getLocal("categoryList");
  categorySelect.innerHTML =
    '<option value="">-- Chọn loại --</option>' +
    categories
      .map((c) => `<option value="${c.id}">${c.brand}</option>`)
      .join("");
}
function updateHomePageBrandFilter() {
  // Lưu thông tin vào localStorage
  const categories = JSON.parse(localStorage.getItem("categoryList")) || [];
  localStorage.setItem("categoryList", JSON.stringify(categories));

  // Trigger storage event để các tab khác cập nhật
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "categoryList",
      newValue: JSON.stringify(categories),
    })
  );

  // Gọi hàm cập nhật nếu đang ở trang chủ
  if (
    window.productManager &&
    typeof window.productManager.updateBrandFilter === "function"
  ) {
    window.productManager.updateBrandFilter();
  }
}

function renderCategorys() {
  categoryTable.innerHTML = categorys_data_local
    .map((ct, index) => {
      const isHidden = ct.status === "inactive";

      return `
            <tr data-index="${index}" class="${isHidden ? "fade-out" : ""}">
                <td>${isHidden ? "Đã ẩn" : ct.id}</td>
                <td>${isHidden ? "Đã ẩn" : ct.brand}</td>
                <td>${isHidden ? "Đã ẩn" : ct.country}</td>
                <td>${isHidden ? "Đã ẩn" : ct.desc}</td>
                <td class="status1">${ct.status}</td>
                <td class="action1">
                    <button class="toggle">${
                      ct.status === "active" ? "Ẩn" : "Hiện"
                    }</button>
                    <button class="delete" ${
                      isHidden ? "disabled" : ""
                    }>Xóa</button>
                    <button class="edit" ${
                      isHidden ? "disabled" : ""
                    }>Sửa</button> 
                </td>
            </tr>
        `;
    })
    .join("");

  attachEventHandlers();

  // CẬP NHẬT DROPDOWN KHI RENDER LẠI
  updateProductCategoryDropdown();
}

function attachEventHandlers() {
  const rows = categoryTable.querySelectorAll("tr");

  rows.forEach((row) => {
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

categoryForm.onsubmit = (e) => {
  e.preventDefault();

  const newData = {
    id: categoryForm.elements[0].value.trim(),
    brand: categoryForm.elements[1].value.trim(),
    country: categoryForm.elements[2].value.trim(),
    desc: categoryForm.elements[3].value.trim(),
    status: categoryForm.elements[4].value,
  };
  /*
    if (editingIndex !== null) {
      categorys_data_local[editingIndex] = newData;
    } else {
      categorys_data_local.push(newData);
    } */

  // Kiểm tra định dạng ID: phải là TH + 2 chữ số
  const idPattern = /^TH\d{2}$/;
  if (!idPattern.test(newData.id)) {
    alert("ID phải có định dạng THXX, trong đó XX là số");
    return;
  }

  // Kiểm tra trùng ID nếu đang thêm mới
  if (editingIndex === null) {
    const isDuplicate = categorys_data_local.some(
      (item) => item.id === newData.id
    );
    if (isDuplicate) {
      alert("ID đã tồn tại! Vui lòng nhập ID khác.");
      return;
    }
    categorys_data_local.push(newData);
  } else {
    categorys_data_local[editingIndex] = newData;
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

  updateProductCategoryDropdown();
  updateHomePageBrandFilter();
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

if (!localStorage.getItem("userList")) {
  localStorage.setItem("userList", JSON.stringify(userList));
}
customers_data_local = JSON.parse(localStorage.getItem("userList"));

function renderCustomers() {
  customersTable.innerHTML = customers_data_local
    .map((cm, index2) => {
      const isBlocked = cm.status === "blocked";

      return `
            <tr data-index2="${index2}" class="${isBlocked ? "fade-out" : ""}">
                <td>${isBlocked ? "Đã khóa" : cm.id}</td>
                <td>${isBlocked ? "Đã khóa" : cm.fullname}</td>
                <td>${isBlocked ? "Đã khóa" : cm.username}</td>
                <td>${isBlocked ? "Đã khóa" : cm.email}</td>
                <td>${isBlocked ? "Đã khóa" : cm.sdt}</td> 
                <td>${cm.status}</td>
                <td class = "action1">
                    <div class = "wrapper-button"><button class="unlock">${
                      cm.status === "active" ? "Khóa" : "Mở khóa"
                    }</button></div>
                    <button class="reset" ${
                      isBlocked ? "disabled" : ""
                    }>Đặt lại mật khẩu</button>
                </td>
            </tr>
        `;
    })
    .join("");

  attachEventHandlers2();
}

function attachEventHandlers2() {
  const rows2 = customersTable.querySelectorAll("tr");

  rows2.forEach((row2) => {
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
if (!localStorage.getItem("productList")) setLocal("productList", productList);
if (!localStorage.getItem("categoryList"))
  setLocal("categoryList", categoryList);
if (!localStorage.getItem("priceList")) setLocal("priceList", priceList);

let products = getLocal("productList");
const categories = getLocal("categoryList");
const prices = getLocal("priceList");

// --- LIÊN KẾT ---
function getCategoryName(id) {
  const cat = categories.find((c) => c.id === id);
  return cat ? cat.brand : id;
}

// --- RENDER TABLE (SẢN PHẨM) ---
function renderProductTable(data = products) {
  productTbody.innerHTML = data
    .map((p) => {
      const isBlocked = p.status === "inactive";

      return `
    <tr class="${isBlocked ? "fade-out" : ""}">
      <td>${getCategoryName(p.categoryId)}</td>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>
        <img src="${p.img || "assets/img/logo.png"}"
             style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
      </td>
      <td>${p.desc}</td>
      <td>${p.status === "active" ? "Active" : "Hidden"}</td>
      <td class="action">
        <button class="edit" onclick="openProductModal('edit', this)">Sửa</button>
        <button class="delete" onclick="deleteProduct(this)">Xóa</button>
        <button class="toggle" onclick="toggleProductStatus('${p.id}')">
          ${p.status === "active" ? "Ẩn" : "Hiện"}
        </button>
        <button class="view" onclick="viewProductDetail('${
          p.id
        }')">Chi tiết</button>
      </td>
    </tr>
  `;
    })
    .join("");
}

// --- MỞ POPUP THÊM/SỬA ---
function openProductModal(mode, btn) {
  productForm.reset();
  previewImg.src = "assets/img/logo.png";
  productModal.style.display = "flex";
  editingProductRow = null;
  document.getElementById("prodCode").readOnly = false;

  if (mode === "edit" && btn) {
    const row = btn.closest("tr");
    const id = row.cells[1].innerText.trim();
    const product = products.find((p) => p.id === id);
    if (product) {
      document.getElementById("prodCode").readOnly = true;
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
closeDetailBtn.addEventListener(
  "click",
  () => (detailPopup.style.display = "none")
);

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
  const required = ["id","categoryId","name","desc","color","storage","ram","display","camera","battery","chip","os"];
  for (const k of required) {
    if (!newProd[k] || (typeof newProd[k] === 'string' && newProd[k].trim() === '')) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  }
  if (!validateProductForm(newProd)) return;
  if (!checkDuplicateProduct(newProd)) return;

  const existingIndex = products.findIndex((p) => p.id === newProd.id);
  if (editingProductRow && existingIndex > -1) {
    products[existingIndex] = newProd;
  } else {
    if (existingIndex !== -1) {
      alert("Mã sản phẩm đã tồn tại!");
      return;
    }
    products.unshift(newProd);
  }

  setLocal("productList", products);
  renderProductTable();
  productModal.style.display = "none";
});
function populateCategoryDropdown() {
  const select = document.getElementById("prodType");
  const cats = getLocal("categoryList");
  select.innerHTML = cats
    .map((c) => `<option value="${c.id}">${c.brand}</option>`)
    .join("");
}

function populateRamDropdown() {
  const ramSelect = document.getElementById("prodRam");
  const ramOptions = [4, 6, 8, 12, 16];
  ramSelect.innerHTML = ramOptions
    .map((r) => `<option value="${r}GB">${r}GB</option>`)
    .join("");
}

function populateStorageDropdown() {
  const storageSelect = document.getElementById("prodStorage");
  const storageOptions = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
  storageSelect.innerHTML = storageOptions
    .map((s) => `<option value="${s}">${s}</option>`)
    .join("");
}
document.addEventListener("DOMContentLoaded", () => {
  populateCategoryDropdown();
  populateRamDropdown();
  populateStorageDropdown();
  renderProductTable();
});

function toggleProductStatus(id) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return alert("Không tìm thấy sản phẩm!");

  const current = products[index];
  const newStatus = current.status === "active" ? "inactive" : "active";
  products[index].status = newStatus;

  setLocal("productList", products);
  renderProductTable();

  alert(
    `Sản phẩm "${current.name}" đã được ${
      newStatus === "inactive" ? "ẩn" : "hiển thị"
    }!`
  );
}
window.toggleProductStatus = toggleProductStatus;

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
const priceData = getLocal("priceList");

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
            <button class="view" onclick="viewImportDetail('${
              i.id
            }')">👁 Chi tiết</button>
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
    document.getElementById("importStatus").value = "pending";
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
    if (record.status === "completed") {
      alert("Phiếu nhập đã hoàn thành, không thể chỉnh sửa!");
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

  if (!validateImportForm(newImport)) return;

  const idOld = editingImportRow
    ? editingImportRow.cells[0].innerText.trim()
    : null;
  const exists = imports.some((i) => i.id === newImport.id && i.id !== idOld);
  if (exists) {
    alert("⚠️ Mã phiếu nhập đã tồn tại!");
    return;
  }
  let oldImport = null;
  const existingIdx = imports.findIndex((i) => i.id === idOld);

  if (editingImportRow && existingIdx !== -1) {
    oldImport = { ...imports[existingIdx] };
    imports[existingIdx] = newImport;
  } else {
    imports.unshift(newImport);
    isNewRecord = true;
  }

  setLocal("importList", imports);
  if (typeof updateInventoryFromImport === "function") {
    updateInventoryFromImport(newImport, oldImport);
  }

  renderImportTable();
  importModal.style.display = "none";
});

// Xóa phiếu nhập
function deleteImport(btn) {
  if (!confirm("Xóa phiếu nhập này?")) return;
  const row = btn.closest("tr");
  const id = row.cells[0].innerText.trim();
  const oldImportIndex = imports.findIndex((i) => i.id === id);
  if (oldImportIndex === -1) return;
  const oldImport = imports[oldImportIndex]; // Lấy dữ liệu CŨ trước khi xóa
  imports.splice(oldImportIndex, 1);
  if (typeof updateInventoryFromImport === "function") {
    updateInventoryFromImport(null, oldImport);
  }
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
      ${productData
        .map((p) => `<option value="${p.id}">${p.name}</option>`)
        .join("")}
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
        <p><strong>Tổng giá trị:</strong> ${Number(record.total).toLocaleString(
          "vi-VN"
        )} ₫</p>
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
