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
    document.querySelector(".address-section").appendChild(container);
  }

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

// --- Chạy lần đầu ---
let savedAddresses = loadAddresses();
const savedAddressSelect = document.getElementById("savedAddress");
renderAddressOptions();

// --- Khi chọn địa chỉ ---
savedAddressSelect.onchange = () => {
  const idx = savedAddressSelect.value;
  if (idx !== "") {
    const a = savedAddresses[idx];
    newName.value = a.name;
    newPhone.value = a.phone;
    newAddress.value = a.address;
  } else {
    newName.value = "";
    newPhone.value = "";
    newAddress.value = "";
  }
};

// --- Tự điền thông tin từ currentUser nếu có ---
window.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  if (currentUser.name) newName.value = currentUser.name;
  if (currentUser.phone) newPhone.value = currentUser.phone;
  if (currentUser.address) newAddress.value = currentUser.address;
});

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
  
  totalPriceEl.textContent = total.toLocaleString('vi-VN') + "₫";
}

// Hàm thêm sản phẩm vào giỏ hàng (dùng chung cho cả index và cart)
function addToCart(id, name, price) {
  if (!cart[id]) {
    cart[id] = { name, price, qty: 1 };
  } else {
    cart[id].qty++;
  }
  renderCart();
  saveCart();
  alert("Đã thêm " + name + " vào giỏ hàng!");
}

// Sự kiện cho nút thêm vào giỏ hàng trong cart.html
document.querySelectorAll(".btn-add").forEach(btn => {
  btn.onclick = () => {
    const p = btn.closest(".product");
    const id = p.dataset.id;
    const name = p.dataset.name;
    const price = parseInt(p.dataset.price);
    addToCart(id, name, price);
  };
});

// Xử lý sự kiện trong bảng giỏ hàng
cartTableBody.onclick = e => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("btn-plus")) cart[id].qty++;
  if (e.target.classList.contains("btn-minus")) {
    cart[id].qty--;
    if (cart[id].qty <= 0) delete cart[id];
  }
  if (e.target.classList.contains("btn-remove") && confirm("Xóa sản phẩm này?")) delete cart[id];
  renderCart();
  saveCart();
};

cartTableBody.onchange = e => {
  if (e.target.classList.contains("qty-input")) {
    const id = e.target.dataset.id;
    const qty = parseInt(e.target.value);
    if (qty <= 0) delete cart[id];
    else cart[id].qty = qty;
    renderCart();
    saveCart();
  }
};

// --- Đặt hàng ---
document.querySelector(".btn-checkout").onclick = () => {
  if (Object.keys(cart).length === 0) return alert("Giỏ hàng trống!");
  
  const name = newName.value.trim();
  const phone = newPhone.value.trim();
  const address = newAddress.value.trim();
  const payment = paymentMethod.value;
  
  if (!name || !phone || !address) return alert("Vui lòng nhập đầy đủ thông tin!");

  if (confirm(`Xác nhận đặt hàng với hình thức: ${payment}?`)) {
    // Lấy userList từ localStorage (chỉ lấy từ admin)
    const userList = JSON.parse(localStorage.getItem("userList") || "[]");
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    
    // Tạo đơn hàng mới
    const newOrder = {
      id: "DH" + Date.now(),
      userId: getCurrentUserId(),
      date: new Date().toISOString().split('T')[0],
      items: Object.values(cart),
      address: { value: address },
      payment: { 
        method: payment, 
        confirmed: payment === "cash" ? "pending" : "paid" 
      },
      status: "newly ordered"
    };

    orders.push(newOrder);
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

    // 👉 Dùng confirm để cho phép OK hoặc Cancel
    if (confirm(orderText)) {
      // Người dùng bấm OK
      alert("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua tại SaiGonPhone!");
      
      // Lưu địa chỉ mới
      saveNewAddress(name, phone, address);
      
      // Xóa giỏ hàng sau khi đặt hàng thành công
      cart = {};
      saveCart();
      renderCart();
      
      // Reset form
      newName.value = newPhone.value = newAddress.value = "";
      savedAddressSelect.value = "";
    } else {
      // Người dùng bấm Cancel - xóa đơn hàng vừa thêm
      orders.pop();
      localStorage.setItem("orders", JSON.stringify(orders));
      alert("❌ Bạn đã hủy đặt hàng. Vui lòng kiểm tra lại thông tin!");
    }
  }
};

// Hàm lấy ID user hiện tại
function getCurrentUserId() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  return currentUser.id || "GUEST";
}

// Hàm lưu địa chỉ mới
function saveNewAddress(name, phone, address) {
  const isDuplicate = savedAddresses.some(addr => 
    addr.name === name && addr.phone === phone && addr.address === address
  );
  
  if (!isDuplicate) {
    savedAddresses.push({ name, phone, address, isDefault: false });
    saveAddresses();
    renderAddressOptions();
  }
}

// --- Đơn hàng đã mua ---
const ordersModal = document.getElementById("ordersModal");
const ordersList = document.getElementById("ordersList");

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const currentUserId = getCurrentUserId();
  
  // Lọc đơn hàng của user hiện tại (hoặc tất cả nếu là admin)
  let userOrders = orders;
  if (currentUserId !== "admin") {
    userOrders = orders.filter(order => order.userId === currentUserId);
  }
  
  if (userOrders.length === 0) {
    ordersList.innerHTML = "<p>Chưa có đơn hàng nào.</p>";
    return;
  }
  
  ordersList.innerHTML = userOrders.map((o, i) => `
    <div style='border:1px solid #ddd;padding:8px;margin:8px 0;border-radius:6px'>
      <b>🧾 Mã đơn:</b> ${o.id}<br>
      <b>📅 Ngày:</b> ${o.date}<br>
      <b>👤 KH:</b> ${o.address.value}<br>
      <b>💳 Thanh toán:</b> ${o.payment.method} - ${o.payment.confirmed}<br>
      <b>📦 Trạng thái:</b> ${o.status}<br>
      <ul>${o.items.map(it => `<li>${it.name} - SL: ${it.qty} - ${(it.price * it.qty).toLocaleString('vi-VN')}₫</li>`).join("")}</ul>
      ${o.status === "newly ordered" ? `<button class='btn btn-remove btn-del-order' data-id='${o.id}'>Hủy đơn</button>` : ''}
    </div>`).join("");
  
  ordersList.querySelectorAll(".btn-del-order").forEach(btn => {
    btn.onclick = () => {
      if (confirm("Hủy đơn hàng này?")) {
        const orderId = btn.dataset.id;
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const updatedOrders = orders.filter(order => order.id !== orderId);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        renderOrders();
      }
    };
  });
}

document.getElementById("showOrders").onclick = () => {
  ordersModal.style.display = "flex";
  renderOrders();
};

document.getElementById("closeModal").onclick = () => ordersModal.style.display = "none";

document.getElementById("clearAllOrdersBtn").onclick = () => {
  if (confirm("Xóa tất cả đơn hàng?")) {
    localStorage.removeItem("orders");
    renderOrders();
  }
};

window.onclick = e => {
  if (e.target === ordersModal) ordersModal.style.display = "none";
};

// Khởi tạo giỏ hàng
loadCart();

// Export hàm addToCart để sử dụng trong file khác
window.addToCart = addToCart;