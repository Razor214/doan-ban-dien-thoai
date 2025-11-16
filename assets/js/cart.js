// --- Load & lưu địa chỉ ---
function loadAddresses() {
  const saved = localStorage.getItem("savedAddresses");
  return saved
    ? JSON.parse(saved)
    : [
        { name: "Nguyen Van A", phone: "0901234567", address: "123 Lê Lợi, Q1, TP.HCM", isDefault: true },
        { name: "Tran Thi B", phone: "0912345678", address: "456 Nguyễn Trãi, Q5, TP.HCM", isDefault: false }
      ];
}

function saveAddresses() {
  localStorage.setItem("savedAddresses", JSON.stringify(savedAddresses));
}

// --- Hiển thị danh sách chọn địa chỉ ---
function renderAddressOptions() {
  const savedAddressSelect = document.getElementById("savedAddress");
  if (!savedAddressSelect) return;
  
  savedAddressSelect.innerHTML = "";

  savedAddresses.forEach((a, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${a.isDefault ? "⭐ " : ""}${a.name} - ${a.address}`;
    savedAddressSelect.appendChild(opt);
  });

  renderAddressList();
}

// --- Render danh sách địa chỉ chi tiết ---
function renderAddressList() {
  let container = document.getElementById("addressManager");
  if (!container) {
    container = document.createElement("div");
    container.id = "addressManager";
    const addressSection = document.querySelector(".address-section");
    if (addressSection) {
      addressSection.appendChild(container);
    }
  }

  container.innerHTML = "";
  
  savedAddresses.forEach((a, i) => {
    const div = document.createElement("div");
    div.style.margin = "6px 0";
    div.style.padding = "8px";
    div.style.border = "1px solid #ddd";
    div.style.borderRadius = "5px";
    div.style.background = a.isDefault ? "#eaf8ff" : "#fff";

    div.innerHTML = `
      <b>${a.name}</b> (${a.phone})<br>${a.address}<br>
      <button class="btn-set-default" data-index="${i}" 
        style="background:#27ae60;color:white;border:none;border-radius:4px;padding:3px 8px;cursor:pointer;margin-top:5px;">
        ${a.isDefault ? "✔ Mặc định" : "Đặt mặc định"}
      </button>
      <button class="btn-delete-address" data-index="${i}" 
        style="background:#e74c3c;color:white;border:none;border-radius:4px;padding:3px 8px;margin-left:5px;cursor:pointer;">
        Xóa
      </button>`;

    container.appendChild(div);
  });

  // --- Hành động: đặt mặc định ---
  container.querySelectorAll(".btn-set-default").forEach((btn) => {
    btn.onclick = () => {
      const idx = btn.dataset.index;
      savedAddresses.forEach((a, i) => (a.isDefault = i == idx));
      saveAddresses();
      renderAddressOptions();
    };
  });

  // --- Hành động: xóa địa chỉ ---
  container.querySelectorAll(".btn-delete-address").forEach((btn) => {
    btn.onclick = () => {
      if (confirm("Xóa địa chỉ này?")) {
        savedAddresses.splice(btn.dataset.index, 1);
        saveAddresses();
        renderAddressOptions();
      }
    };
  });
}

// --- Lưu địa chỉ mới ---
function saveNewAddress(name, phone, address) {
  // Kiểm tra xem địa chỉ đã tồn tại chưa
  const exists = savedAddresses.some(addr => 
    addr.name === name && addr.phone === phone && addr.address === address
  );
  
  if (!exists) {
    savedAddresses.push({ name, phone, address, isDefault: false });
    saveAddresses();
    renderAddressOptions();
  }
}

// --- Cập nhật số lượng sản phẩm trong giỏ hàng ---
function updateCartCount() {
  const cartCountEl = document.getElementById("cartCount");
  if (!cartCountEl) return;
  
  let totalItems = 0;
  for (const id in cart) {
    totalItems += cart[id].qty;
  }
  
  cartCountEl.textContent = `${totalItems} sản phẩm`;
}

// --- Xử lý địa chỉ từ user ---
function setupUserAddress() {
  const user = JSON.parse(localStorage.getItem("CurrentUser") || localStorage.getItem("currentUser") || "{}");
  if (!user || !user.fullName) return;

  const savedAddress = document.getElementById("savedAddress");
  const nameInput     = document.getElementById("newName");
  const phoneInput    = document.getElementById("newPhone");
  const addressInput  = document.getElementById("newAddress");

  if (!savedAddress || !nameInput || !phoneInput || !addressInput) return;

  // ---- Tạo option 1: Địa chỉ mặc định ----
  const optDefault = document.createElement("option");
  optDefault.value = "default";
  optDefault.textContent = `${user.fullName} - ${user.phone || ''} - ${user.address || ''}`;
  savedAddress.appendChild(optDefault);

  // ---- Tạo option 2: Nhập địa chỉ mới ----
  const optNew = document.createElement("option");
  optNew.value = "new";
  optNew.textContent = "Nhập địa chỉ mới";
  savedAddress.appendChild(optNew);

  // ---- Hàm fill mặc định ----
  function fillDefault() {
    nameInput.value = user.fullName || '';
    phoneInput.value = user.phone || '';
    addressInput.value = user.address || '';

    nameInput.readOnly = true;
    phoneInput.readOnly = true;
    addressInput.readOnly = true;
  }

  // Auto khi mới vào trang
  fillDefault();
  savedAddress.value = "default";

  // ---- Xử lý đổi lựa chọn ----
  savedAddress.addEventListener("change", () => {
    if (savedAddress.value === "default") {
      fillDefault();
    } 
    else if (savedAddress.value === "new") {
      nameInput.value = user.fullName || '';
      phoneInput.value = user.phone || '';

      nameInput.readOnly = true;
      phoneInput.readOnly = true;

      addressInput.value = "";
      addressInput.readOnly = false;
    }
  });
}

// --- Xử lý thanh toán ngân hàng ---
function setupPaymentMethod() {
  const paymentSelect = document.getElementById("paymentMethod");
  const bankInfo = document.getElementById("bankInfo");
  const bankSelect = document.getElementById("bankSelect");
  const bankDetails = document.getElementById("bankDetails");

  if (!paymentSelect || !bankInfo) return;

  // Ẩn khối ngân hàng khi mới tải trang
  bankInfo.style.display = "none";

  // Hiển thị hoặc ẩn thông tin ngân hàng khi chọn phương thức thanh toán
  paymentSelect.addEventListener("change", () => {
    if (paymentSelect.value === "transfer") {
      bankInfo.style.display = "block";
    } else {
      bankInfo.style.display = "none";
    }
  });

  // Khi chọn ngân hàng, cập nhật thông tin hiển thị
  if (bankSelect && bankDetails) {
    bankSelect.addEventListener("change", () => {
      const bank = bankSelect.value;
      const banks = {
        agribank: { name: "Agribank", stk: "123456789", owner: "Công ty SaiGonPhone" },
        vietcombank: { name: "Vietcombank", stk: "0123456789", owner: "Công ty SaiGonPhone" },
        bidv: { name: "BIDV", stk: "987654321", owner: "Công ty SaiGonPhone" },
        techcombank: { name: "Techcombank", stk: "5566778899", owner: "Công ty SaiGonPhone" },
        mbbank: { name: "MB Bank", stk: "1122334455", owner: "Công ty SaiGonPhone" },
      };
      const b = banks[bank];
      bankDetails.innerHTML = `
        <p><strong>Ngân hàng ${b.name}</strong></p>
        <p>Số TK: <b>${b.stk}</b></p>
        <p>Chủ TK: <b>${b.owner}</b></p>
      `;
    });

    // Kích hoạt sự kiện change lần đầu để hiển thị thông tin mặc định
    bankSelect.dispatchEvent(new Event('change'));
  }
}

// --- Giỏ hàng ---
let cart = {};
const cartTableBody = document.querySelector("#cartTable tbody");
const totalPriceEl = document.getElementById("totalPrice");

function loadCart() {
  const s = localStorage.getItem("cart");
  if (s) cart = JSON.parse(s);
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  if (!cartTableBody) return;
  
  cartTableBody.innerHTML = "";
  let total = 0;
  
  for (const id in cart) {
    const i = cart[id];
    const t = i.price * i.qty;
    total += t;
    cartTableBody.innerHTML += `
      <tr>
        <td>${i.name}</td>
        <td>${i.price.toLocaleString('vi-VN')}₫</td>
        <td><button class='btn btn-minus' data-id='${id}'>-</button></td>
        <td><input type='number' class='qty-input' value='${i.qty}' min='1' data-id='${id}'></td>
        <td><button class='btn btn-plus' data-id='${id}'>+</button></td>
        <td>${t.toLocaleString('vi-VN')}₫</td>
        <td><button class='btn btn-remove' data-id='${id}'>Xóa</button></td>
      </tr>`;
  }
  
  if (totalPriceEl) {
    totalPriceEl.textContent = total.toLocaleString('vi-VN') + "₫";
  }
  
  // Cập nhật số lượng sản phẩm
  updateCartCount();
}

// --- Xử lý sự kiện thêm sản phẩm ---
function setupProductEvents() {
  document.querySelectorAll(".btn-add").forEach(btn => {
    btn.onclick = () => {
      const p = btn.closest(".product");
      const id = p.dataset.id;
      const name = p.dataset.name;
      const price = parseInt(p.dataset.price);
      
      if (!cart[id]) {
        cart[id] = { name, price, qty: 1 };
      } else {
        cart[id].qty++;
      }
      
      renderCart();
      saveCart();
      alert("Đã thêm " + name + " vào giỏ hàng!");
    };
  });
}

// --- Xử lý sự kiện giỏ hàng ---
function setupCartEvents() {
  if (!cartTableBody) return;
  
  cartTableBody.onclick = e => {
    const id = e.target.dataset.id;
    if (!id) return;
    
    if (e.target.classList.contains("btn-plus")) {
      cart[id].qty++;
    }
    if (e.target.classList.contains("btn-minus")) {
      cart[id].qty--;
      if (cart[id].qty <= 0) delete cart[id];
    }
    if (e.target.classList.contains("btn-remove") && confirm("Xóa sản phẩm này?")) {
      delete cart[id];
    }
    renderCart();
    saveCart();
  };
  
  cartTableBody.onchange = e => {
    if (e.target.classList.contains("qty-input")) {
      const id = e.target.dataset.id;
      const qty = parseInt(e.target.value);
      if (qty <= 0) {
        delete cart[id];
      } else {
        cart[id].qty = qty;
      }
      renderCart();
      saveCart();
    }
  };
}

// --- Đặt hàng ---
function setupCheckout() {
  const checkoutBtn = document.querySelector(".btn-checkout");
  if (!checkoutBtn) return;
  
  checkoutBtn.onclick = () => {
    if (Object.keys(cart).length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }
    
    const name = document.getElementById("newName").value.trim();
    const phone = document.getElementById("newPhone").value.trim();
    const address = document.getElementById("newAddress").value.trim();
    const payment = document.getElementById("paymentMethod").value;
    
    if (!name || !phone || !address) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    
    if (confirm(`Xác nhận đặt hàng với hình thức: ${payment}?`)) {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      
      // Tạo order ID theo định dạng giống admin (ORD + timestamp)
      const orderId = "ORD" + Date.now();
      
      orders.push({
        id: orderId,
        date: new Date().toLocaleString(),
        items: Object.values(cart),
        customer: { name, phone, address },
        payment,
        status: "newly ordered" // Trạng thái mặc định
      });
      
      localStorage.setItem("orders", JSON.stringify(orders));
      
      // Tạo nội dung xác nhận
      let orderText = 
        "VUI LÒNG XÁC NHẬN LẠI ĐƠN HÀNG!\n\n" +
        "👤 Khách hàng: " + name + "\n" +
        "📞 SĐT: " + phone + "\n" +
        "🏠 Địa chỉ: " + address + "\n" +
        "💳 Thanh toán: " + payment + "\n\n" +
        "🛒 Sản phẩm đã đặt:\n";

      Object.values(cart).forEach(item => {
        orderText += `- ${item.name} (x${item.qty}) - ${(item.price * item.qty).toLocaleString('vi-VN')}₫\n`;
      });

      let totalCost = Object.values(cart)
        .reduce((sum, item) => sum + item.price * item.qty, 0);

      orderText += `\n💵 Tổng tiền: ${totalCost.toLocaleString('vi-VN')}₫\n\n`;
      orderText += "📦 Bạn có chắc muốn đặt đơn này không?";

      if (confirm(orderText)) {
        alert("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua tại SaiGonPhone!");
        
        saveNewAddress(name, phone, address);
        cart = {};
        saveCart();
        renderCart();
        
        // Reset form
        document.getElementById("newName").value = "";
        document.getElementById("newPhone").value = "";
        document.getElementById("newAddress").value = "";
        const savedAddressSelect = document.getElementById("savedAddress");
        if (savedAddressSelect) savedAddressSelect.value = "";
      } else {
        alert("❌ Bạn đã hủy đặt hàng. Vui lòng kiểm tra lại thông tin!");
      }
    }
  };
}

// --- Đơn hàng đã mua ---
function setupOrdersModal() {
  const ordersModal = document.getElementById("ordersModal");
  const ordersList = document.getElementById("ordersList");
  const showOrdersBtn = document.getElementById("showOrders");
  const closeModalBtn = document.getElementById("closeModal");
  const clearAllOrdersBtn = document.getElementById("clearAllOrdersBtn");
  
  if (!ordersModal || !ordersList) return;

  function renderOrders() {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    if (orders.length === 0) {
      ordersList.innerHTML = "<p>Chưa có đơn hàng nào.</p>";
      return;
    }
    
    ordersList.innerHTML = orders.map((o, i) => `
      <div style='border:1px solid #ddd;padding:8px;margin:8px 0;border-radius:6px'>
        <b>🧾 Mã đơn:</b> ${o.id}<br>
        <b>📅 Ngày:</b> ${o.date}<br>
        <b>👤 KH:</b> ${o.customer.name} - ${o.customer.phone}<br>
        <b>🏠 Địa chỉ:</b> ${o.customer.address}<br>
        <b>💳 Thanh toán:</b> ${o.payment || "Tiền mặt"}<br>
        <b>📊 Trạng thái:</b> ${o.status || "newly ordered"}<br>
        <ul>${o.items.map(it => `<li>${it.name} - SL: ${it.qty} - ${(it.price * it.qty).toLocaleString('vi-VN')}₫</li>`).join("")}</ul>
        <button class='btn btn-remove btn-del-order' data-index='${i}'>Hủy đơn</button>
      </div>`).join("");
    
    ordersList.querySelectorAll(".btn-del-order").forEach(btn => {
      btn.onclick = () => {
        if (confirm("Hủy đơn hàng này?")) {
          orders.splice(btn.dataset.index, 1);
          localStorage.setItem("orders", JSON.stringify(orders));
          renderOrders();
        }
      };
    });
  }

  if (showOrdersBtn) {
    showOrdersBtn.onclick = () => {
      ordersModal.style.display = "flex";
      renderOrders();
    };
  }
  
  if (closeModalBtn) {
    closeModalBtn.onclick = () => ordersModal.style.display = "none";
  }
  
  if (clearAllOrdersBtn) {
    clearAllOrdersBtn.onclick = () => {
      if (confirm("Xóa tất cả đơn hàng?")) {
        localStorage.removeItem("orders");
        renderOrders();
      }
    };
  }
  
  window.onclick = e => {
    if (e.target === ordersModal) ordersModal.style.display = "none";
  };
}

// --- Khởi tạo ---
let savedAddresses = loadAddresses();

document.addEventListener("DOMContentLoaded", function() {
  // Khởi tạo các sự kiện
  loadCart();
  renderAddressOptions();
  setupUserAddress();
  setupPaymentMethod();
  setupProductEvents();
  setupCartEvents();
  setupCheckout();
  setupOrdersModal();

  // Khi chọn địa chỉ
  const savedAddressSelect = document.getElementById("savedAddress");
  if (savedAddressSelect) {
    savedAddressSelect.onchange = () => {
      const idx = savedAddressSelect.value;
      if (idx !== "") {
        const a = savedAddresses[idx];
        const newName = document.getElementById("newName");
        const newPhone = document.getElementById("newPhone");
        const newAddress = document.getElementById("newAddress");
        
        if (newName) newName.value = a.name;
        if (newPhone) newPhone.value = a.phone;
        if (newAddress) newAddress.value = a.address;
      } else {
        const newName = document.getElementById("newName");
        const newPhone = document.getElementById("newPhone");
        const newAddress = document.getElementById("newAddress");
        
        if (newName) newName.value = "";
        if (newPhone) newPhone.value = "";
        if (newAddress) newAddress.value = "";
      }
    };
  }
});