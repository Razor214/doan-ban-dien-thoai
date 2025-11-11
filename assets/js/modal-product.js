class ProductModal {
  constructor() {
    this.modal = document.getElementById("productModal");
    this.currentProduct = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupProductModalTriggers();
  }

  setupEventListeners() {
    document
      .querySelector(".close-modal")
      .addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.style.display === "block")
        this.closeModal();
    });
    document
      .getElementById("modalAddToCartBtn")
      .addEventListener("click", () => this.addToCart());
  }

  setupProductModalTriggers() {
    document.addEventListener("click", (e) => {
      const productLink = e.target.closest(".product-link");
      if (productLink) {
        e.preventDefault();
        const productId = productLink.getAttribute("data-product-id");
        this.openProductModal(productId);
      }
    });

    document.querySelectorAll(".product-modal-trigger").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = e.target.getAttribute("data-product-id");
        this.openProductModal(productId);
      });
    });
  }

  openProductModal(productId) {
    const productData = JSON.parse(localStorage.getItem("productList")) || [];
    const priceData = JSON.parse(localStorage.getItem("priceList")) || [];

    const product = productData.find((p) => p.id === productId);
    if (!product) {
      alert("Không tìm thấy sản phẩm trong dữ liệu hiện tại!");
      return;
    }

    const priceInfo = priceData.find((price) => price.productId === productId);

    this.currentProduct = {
      id: product.id,
      name: product.name,
      brand: this.getBrandFromCategory(product.categoryId),
      price: priceInfo ? priceInfo.price : 0,
      image: product.img,
      ram: product.ram,
      storage: product.storage,
      cpu: product.chip,
      display: product.display,
      camera: product.camera,
      battery: product.battery,
      os: product.os,
      color: product.color,
    };

    this.renderModalContent();
    this.showModal();
  }

  renderModalContent() {
    if (!this.currentProduct) return;

    document.getElementById("modalProductName").textContent =
      this.currentProduct.name;
    document.getElementById("modalCurrentPrice").textContent = this.formatPrice(
      this.currentProduct.price
    );

    this.renderModalImage();
    this.renderSpecifications();
    this.renderQuantitySelector();
  }

  renderModalImage() {
    const mainImage = document.getElementById("modalProductMainImage");
    if (mainImage) {
      mainImage.src = this.currentProduct.image;
      mainImage.alt = this.currentProduct.name;
    }
  }

  renderSpecifications() {
    const specsList = document.getElementById("modalSpecsList");
    if (!specsList) return;

    const specs = [
      { label: "Thương hiệu", value: this.currentProduct.brand },
      { label: "Màu sắc", value: this.currentProduct.color },
      { label: "Chip xử lý (CPU)", value: this.currentProduct.cpu },
      { label: "RAM", value: this.currentProduct.ram },
      { label: "Bộ nhớ trong", value: this.currentProduct.storage },
      { label: "Màn hình", value: this.currentProduct.display },
      { label: "Camera", value: this.currentProduct.camera },
      { label: "Pin", value: this.currentProduct.battery },
      { label: "Hệ điều hành", value: this.currentProduct.os },
    ];

    specsList.innerHTML = specs
      .map(
        (spec) => `
            <div class="spec-item">
                <span class="spec-label">${spec.label}:</span>
                <span class="spec-value">${spec.value}</span>
            </div>
        `
      )
      .join("");
  }

  renderQuantitySelector() {
    // Tìm hoặc tạo phần tử chứa số lượng
    let quantitySection = document.querySelector(".product-quantity");

    if (!quantitySection) {
      quantitySection = document.createElement("div");
      quantitySection.className = "product-quantity";

      // Chèn vào trước phần tử product-actions
      const productActions = document.querySelector(".product-actions");
      if (productActions) {
        productActions.parentNode.insertBefore(quantitySection, productActions);
      }
    }

    quantitySection.innerHTML = `
      <div class="quantity-selector">
        <label for="modalQuantity">Số lượng:</label>
        <div class="quantity-controls">
          <button type="button" class="quantity-btn minus" id="modalQuantityMinus">-</button>
          <input type="number" id="modalQuantity" name="quantity" value="1" min="1" max="99" class="quantity-input">
          <button type="button" class="quantity-btn plus" id="modalQuantityPlus">+</button>
        </div>
      </div>
    `;

    // Thêm sự kiện cho nút +/-
    document
      .getElementById("modalQuantityMinus")
      .addEventListener("click", () => {
        this.adjustQuantity(-1);
      });

    document
      .getElementById("modalQuantityPlus")
      .addEventListener("click", () => {
        this.adjustQuantity(1);
      });

    // Thêm sự kiện cho input
    document.getElementById("modalQuantity").addEventListener("change", (e) => {
      this.validateQuantity(e.target);
    });
  }

  adjustQuantity(change) {
    const quantityInput = document.getElementById("modalQuantity");
    let currentValue = parseInt(quantityInput.value) || 1;
    let newValue = currentValue + change;

    // Đảm bảo số lượng không nhỏ hơn 1 và không lớn hơn 99
    if (newValue < 1) newValue = 1;
    if (newValue > 99) newValue = 99;

    quantityInput.value = newValue;
  }

  validateQuantity(input) {
    let value = parseInt(input.value) || 1;

    if (value < 1) value = 1;
    if (value > 99) value = 99;

    input.value = value;
  }

  getBrandFromCategory(categoryId) {
    // Lấy dữ liệu loại sản phẩm mới nhất từ localStorage
    const categories = JSON.parse(localStorage.getItem("categoryList")) || [];
    const category = categories.find((c) => c.id === categoryId);

    if (category) {
      return category.brand;
    }

    const brandMap = {
      TH01: "Apple",
      TH02: "Samsung",
      TH03: "Xiaomi",
      TH04: "Huawei",
      TH05: "Sony",
      TH06: "LG",
      TH07: "Nokia",
      TH08: "OnePlus",
      TH09: "Google",
    };
    return brandMap[categoryId] || categoryId || "Unknown";
  }

  showModal() {
    this.modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    this.modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  addToCart() {
    if (!this.checkLogin()) {
      this.showNotification(
        "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!",
        "info"
      );
      return;
    }

    if (!this.currentProduct) return;

    const quantityInput = document.getElementById("modalQuantity");
    const quantity = parseInt(quantityInput.value) || 1;

    const productToAdd = {
      id: this.currentProduct.id,
      name: this.currentProduct.name,
      brand: this.currentProduct.brand,
      price: this.currentProduct.price,
      image: this.currentProduct.image,
      quantity: quantity,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === productToAdd.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(productToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    this.showNotification(
      `Đã thêm ${quantity} ${this.currentProduct.name} vào giỏ hàng!`
    );
  }

  checkLogin() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null;
  }

  showNotification(message, type = "success") {
    const colors = {
      success: { bg: "#4CAF50", border: "#388E3C" },
      info: { bg: "#2196F3", border: "#1976D2" },
    };

    const colorConfig = colors[type] || colors.success;
    const notification = document.createElement("div");

    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colorConfig.bg};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-weight: 500;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    border-left: 4px solid ${colorConfig.border};
  `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => (notification.style.transform = "translateX(0)"), 100);
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.productModal = new ProductModal();
});
