class ProductModal {
  constructor() {
    this.modal = document.getElementById("productModal");
    this.currentProduct = null;
    this.selectedColor = null;
    this.selectedImage = null;
    this.currentImageIndex = 0;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupProductModalTriggers();
  }

  setupEventListeners() {
    document.querySelector(".close-modal").addEventListener("click", () => {
      this.closeModal();
    });

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    document.getElementById("modalPrevBtn").addEventListener("click", () => {
      this.prevImage();
    });

    document.getElementById("modalNextBtn").addEventListener("click", () => {
      this.nextImage();
    });

    document
      .getElementById("modalAddToCartBtn")
      .addEventListener("click", () => {
        this.addToCart();
      });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.style.display === "block") {
        this.closeModal();
      }
    });
  }

  setupProductModalTriggers() {
    document.addEventListener("click", (e) => {
      const productLink = e.target.closest(".product-link");
      if (productLink) {
        e.preventDefault();
        const productId = parseInt(productLink.getAttribute("data-product-id"));
        this.openProductModal(productId);
      }
    });

    document.querySelectorAll(".product-modal-trigger").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = parseInt(e.target.getAttribute("data-product-id"));
        this.openProductModal(productId);
      });
    });
  }

  openProductModal(productId) {
    console.log("Opening modal for product ID:", productId);

    this.currentProduct = PRODUCTS_DATA.find((p) => p.id === productId);

    if (!this.currentProduct) {
      console.error("Product not found with ID:", productId);
      return;
    }

    this.selectedColor = this.currentProduct.colors[0];
    this.selectedImage = this.selectedColor.images[0];
    this.currentImageIndex = 0;

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

    this.renderModalImages();
    this.renderColorOptions();
    this.renderSpecifications();
    this.updateNavigationButtons();
  }

  renderModalImages() {
    const mainImage = document.getElementById("modalProductMainImage");
    const thumbnailsContainer = document.getElementById("modalThumbnails");

    if (!mainImage || !thumbnailsContainer) return;

    mainImage.src = `assets/img/${this.selectedImage}`;
    mainImage.alt = `${this.currentProduct.name} - ${this.selectedColor.name}`;

    thumbnailsContainer.innerHTML = "";

    this.selectedColor.images.forEach((image, index) => {
      const thumbnail = document.createElement("div");
      thumbnail.className = `thumbnail ${
        image === this.selectedImage ? "active" : ""
      }`;
      thumbnail.innerHTML = `<img src="assets/img/${image}" alt="${
        this.currentProduct.name
      } - ${this.selectedColor.name} ${index + 1}">`;

      thumbnail.addEventListener("click", () => {
        this.selectImage(image, index);
      });

      thumbnailsContainer.appendChild(thumbnail);
    });

    this.updateImageCounter();
  }

  renderColorOptions() {
    const colorOptionsContainer = document.getElementById("modalColorOptions");
    if (!colorOptionsContainer || !this.currentProduct.colors) return;

    colorOptionsContainer.innerHTML = this.currentProduct.colors
      .map(
        (colorObj, index) => `
                    <div class="color-option ${index === 0 ? "selected" : ""}" 
                         data-color="${colorObj.name}"
                         onclick="productModal.selectColor('${colorObj.name}')">
                        ${colorObj.name}
                    </div>
                `
      )
      .join("");

    this.selectedColor = this.currentProduct.colors[0];
  }

  renderSpecifications() {
    const specsList = document.getElementById("modalSpecsList");
    if (!specsList) return;

    const specs = [
      { label: "Thương hiệu", value: this.currentProduct.brand },
      { label: "Chip xử lý (CPU)", value: this.currentProduct.cpu },
      { label: "RAM", value: `${this.currentProduct.ram}GB` },
      {
        label: "Bộ nhớ trong",
        value: this.formatStorage(this.currentProduct.storage),
      },
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

  selectColor(colorName) {
    const selectedColorObj = this.currentProduct.colors.find(
      (color) => color.name === colorName
    );
    if (!selectedColorObj) return;

    this.selectedColor = selectedColorObj;
    this.selectedImage = selectedColorObj.images[0];
    this.currentImageIndex = 0;

    this.fadeToNewImage(this.selectedImage);

    document.querySelectorAll(".color-option").forEach((option) => {
      option.classList.remove("selected");
      if (option.dataset.color === colorName) {
        option.classList.add("selected");
      }
    });

    this.renderModalImages();
    this.updateNavigationButtons();
  }

  selectImage(image, index) {
    this.selectedImage = image;
    this.currentImageIndex = index;

    this.fadeToNewImage(image);

    document
      .querySelectorAll("#modalThumbnails .thumbnail")
      .forEach((thumb, idx) => {
        thumb.classList.remove("active");
        if (idx === index) {
          thumb.classList.add("active");
        }
      });

    this.updateNavigationButtons();
    this.updateImageCounter();
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      const prevImage = this.selectedColor.images[this.currentImageIndex];
      this.selectImage(prevImage, this.currentImageIndex);
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.selectedColor.images.length - 1) {
      this.currentImageIndex++;
      const nextImage = this.selectedColor.images[this.currentImageIndex];
      this.selectImage(nextImage, this.currentImageIndex);
    }
  }

  fadeToNewImage(newImage) {
    const mainImage = document.getElementById("modalProductMainImage");
    const mainImageContainer = mainImage.parentElement;

    mainImageContainer.classList.add("loading");
    mainImage.classList.add("fade-out");

    setTimeout(() => {
      mainImage.src = `assets/img/${newImage}`;
      mainImage.alt = `${this.currentProduct.name} - ${this.selectedColor.name}`;

      mainImage.classList.remove("fade-out");
      mainImage.classList.add("fade-in");
      mainImageContainer.classList.remove("loading");

      setTimeout(() => {
        mainImage.classList.remove("fade-in");
      }, 300);
    }, 300);
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById("modalPrevBtn");
    const nextBtn = document.getElementById("modalNextBtn");

    if (prevBtn && nextBtn) {
      prevBtn.style.opacity = this.currentImageIndex === 0 ? "0.5" : "1";
      prevBtn.style.cursor =
        this.currentImageIndex === 0 ? "not-allowed" : "pointer";

      nextBtn.style.opacity =
        this.currentImageIndex === this.selectedColor.images.length - 1
          ? "0.5"
          : "1";
      nextBtn.style.cursor =
        this.currentImageIndex === this.selectedColor.images.length - 1
          ? "not-allowed"
          : "pointer";
    }
  }

  updateImageCounter() {}

  showModal() {
    this.modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    this.modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  addToCart() {
    if (!this.currentProduct) return;

    const productToAdd = {
      id: this.currentProduct.id,
      name: this.currentProduct.name,
      brand: this.currentProduct.brand,
      price: this.currentProduct.price,
      selectedColor: this.selectedColor.name,
      selectedImage: this.selectedImage,
      quantity: 1,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(
      (item) =>
        item.id === productToAdd.id &&
        item.selectedColor === productToAdd.selectedColor
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(productToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    this.showNotification(
      `Đã thêm ${this.currentProduct.name} (${this.selectedColor.name}) vào giỏ hàng!`
    );
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price);
  }

  formatStorage(storage) {
    if (storage >= 1024) {
      return "1TB";
    }
    return `${storage}GB`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Initializing ProductModal...");
  window.productModal = new ProductModal();
});
