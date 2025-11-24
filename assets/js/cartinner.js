// --- Lấy user từ localStorage ---
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    if (!user) return;

    const savedAddress = document.getElementById("savedAddress");
    const nameInput     = document.getElementById("newName");
    const phoneInput    = document.getElementById("newPhone");
    const addressInput  = document.getElementById("newAddress");

    // ---- Tạo option 1: Địa chỉ mặc định ----
    const optDefault = document.createElement("option");
    optDefault.value = "default";
    optDefault.textContent = `${user.fullName} - ${user.phone} - ${user.address}`;
    savedAddress.appendChild(optDefault);

    // ---- Tạo option 2: Nhập địa chỉ mới ----
    const optNew = document.createElement("option");
    optNew.value = "new";
    optNew.textContent = "Nhập địa chỉ mới";
    savedAddress.appendChild(optNew);

    // ---- Hàm fill mặc định ----
function fillDefault() {
        nameInput.value = user.fullName;
        phoneInput.value = user.phone;
        addressInput.value = user.address;

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
            nameInput.value = user.fullName;
            phoneInput.value = user.phone;

            nameInput.readOnly = true;
            phoneInput.readOnly = true;

            addressInput.value = "";
            addressInput.readOnly = false;
        }
    });
});
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const product = productList.find(p => p.id === productId);
    if (!product) {
        console.error("Không tìm thấy sản phẩm:", productId);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            img: product.img,
            price: product.price ?? 0,
            color: product.color,
            storage: product.storage,
            ram: product.ram,
            quantity: 1
        });
      }

    localStorage.setItem("cartItems", JSON.stringify(cart));

    alert("Đã thêm sản phẩm vào giỏ hàng!");
}
  const paymentSelect = document.getElementById("paymentMethod");
  const bankInfo = document.getElementById("bankInfo");
  const bankSelect = document.getElementById("bankSelect");
  const bankDetails = document.getElementById("bankDetails");

  // Ẩn khối ngân hàng khi mới tải trang
  bankInfo.style.display = "none";

  // Hiển thị hoặc ẩn thông tin ngân hàng khi chọn phương thức thanh toán
  paymentSelect.addEventListener("change", () => {
    if (paymentSelect.value === "Chuyển khoản") {
      bankInfo.style.display = "block";
    } else {
      bankInfo.style.display = "none";
    }
  });

  // Khi chọn ngân hàng, cập nhật thông tin hiển thị
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
