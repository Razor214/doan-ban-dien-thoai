class ProductManager {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentPage = 1;
    this.productsPerPage = 6;
    this.filters = {
      brand: "all",
      ram: "all",
      storage: "all",
      priceRange: "all",
      sort: "default",
    };
    this.searchQuery = "";
    this.isSearching = false;

    this.loadProducts();
    this.updateBrandFilter();
    this.setupStorageListener();
    this.setupEventListeners();
    this.applyFilters();
  }
  updateBrandFilter() {
    const brandFilter = document.getElementById("brandFilter");
    if (!brandFilter) return;

    // Lấy danh sách thương hiệu từ localStorage
    const categories = JSON.parse(localStorage.getItem("categoryList")) || [];

    // Lọc chỉ những thương hiệu đang active
    const activeBrands = categories.filter((cat) => cat.status === "active");

    // Giữ option "Thương hiệu" đầu tiên và lưu giá trị đang chọn
    const currentValue = brandFilter.value;
    brandFilter.innerHTML = '<option value="all">Thương hiệu</option>';

    // Thêm các thương hiệu từ dữ liệu
    activeBrands.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.brand;
      option.textContent = category.brand;
      brandFilter.appendChild(option);
    });

    // Khôi phục giá trị đang chọn nếu có
    if (
      currentValue &&
      Array.from(brandFilter.options).some((opt) => opt.value === currentValue)
    )
      brandFilter.value = currentValue;
  }
  setupStorageListener() {
    // Lắng nghe thay đổi trong localStorage để tự động cập nhật
    window.addEventListener("storage", (e) => {
      if (e.key === "categoryList") {
        this.updateBrandFilter();
      }
    });
    // Lắng nghe custom event (cho cùng tab)
    window.addEventListener("brandFilterUpdate", () => {
      this.updateBrandFilter();
    });
  }
  loadProducts() {
    const storedProducts = JSON.parse(localStorage.getItem("productList"));
    const storedPrices = JSON.parse(localStorage.getItem("priceList"));

    console.log("Stored products:", storedProducts);
    console.log("Stored prices:", storedPrices);
    console.log(
      "Global productList:",
      typeof productList !== "undefined" ? productList : "UNDEFINED"
    );
    console.log(
      "Global priceList:",
      typeof priceList !== "undefined" ? priceList : "UNDEFINED"
    );
    console.log(
      "Global categoryList:",
      typeof categoryList !== "undefined" ? categoryList : "UNDEFINED"
    );

    const productsData =
      storedProducts || (typeof productList !== "undefined" ? productList : []);
    const pricesData =
      storedPrices || (typeof priceList !== "undefined" ? priceList : []);

    console.log("Products data to use:", productsData);
    console.log("Prices data to use:", pricesData);

    // Gán dữ liệu
    this.products = productsData.map((product) => {
      const priceInfo = pricesData.find(
        (price) => price.productId === product.id
      );
      console.log(`Product ${product.id} - Price info:`, priceInfo);

      return {
        id: product.id,
        name: product.name,
        brand: this.getBrandFromCategory(product.categoryId),
        price: priceInfo ? priceInfo.price : 0,
        image: product.img,
        ram: parseInt(product.ram) || 0,
        storage: parseInt(product.storage) || 0,
        cpu: product.chip,
        display: product.display,
        camera: product.camera,
        battery: product.battery,
        os: product.os,
        color: product.color,
        status: product.status || "active",
      };
    });
    this.products = this.products.filter((p) => p.status === "active");

    this.filteredProducts = [...this.products];

    console.log("Final products:", this.products);

    // Cập nhật localStorage nếu chưa có
    if (!storedProducts && productsData.length > 0) {
      localStorage.setItem("productList", JSON.stringify(productsData));
    }
    if (!storedPrices && pricesData.length > 0) {
      localStorage.setItem("priceList", JSON.stringify(pricesData));
    }
    if (
      !localStorage.getItem("categoryList") &&
      typeof categoryList !== "undefined"
    ) {
      localStorage.setItem("categoryList", JSON.stringify(categoryList));
    }

    this.filteredProducts = [...this.products];
  }
  getBrandFromCategory(categoryId) {
    // Lấy dữ liệu loại sản phẩm mới nhất từ localStorage
    const categories = JSON.parse(localStorage.getItem("categoryList")) || [];
    const category = categories.find((c) => c.id === categoryId);

    if (category) return category.brand;
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

    return brandMap[categoryId] || "Unknown";
  }
  setupEventListeners() {
    const filterIds = [
      "brandFilter",
      "ramFilter",
      "storageFilter",
      "priceRangeFilter",
      "sortFilter",
    ];

    filterIds.forEach((filterId) => {
      const element = document.getElementById(filterId);
      if (element) {
        element.addEventListener("change", (e) => {
          this.filters[this.getFilterKey(filterId)] = e.target.value;
          this.currentPage = 1;
          this.applyFilters();
        });
      }
    });
    //nếu element nhận resetFilters thì khi click vào sẽ ...
    document
      .getElementById("resetFilters")
      ?.addEventListener("click", () => this.resetAllFilters());
    document
      .getElementById("headerSearchBtn")
      ?.addEventListener("click", () => this.performHeaderSearch());
    document
      .getElementById("headerSearch")
      ?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.performHeaderSearch();
      });
  }

  getFilterKey(filterId) {
    const map = {
      brandFilter: "brand",
      ramFilter: "ram",
      storageFilter: "storage",
      priceRangeFilter: "priceRange",
      sortFilter: "sort",
    };
    return map[filterId];
  }
  resetAllFilters() {
    this.filters = {
      brand: "all",
      ram: "all",
      storage: "all",
      priceRange: "all",
      sort: "default",
    };
    this.searchQuery = "";
    this.isSearching = false;
    this.currentPage = 1;

    document.getElementById("brandFilter").value = "all";
    document.getElementById("ramFilter").value = "all";
    document.getElementById("storageFilter").value = "all";
    document.getElementById("priceRangeFilter").value = "all";
    document.getElementById("sortFilter").value = "default";

    const searchInput = document.getElementById("headerSearch");
    if (searchInput) searchInput.value = "";

    this.filteredProducts = [...this.products];
    this.renderProducts();
    this.renderPagination();

    this.showNotification("Đã thiết lập lại tất cả bộ lọc!");
  }

  performHeaderSearch() {
    const searchInput = document.getElementById("headerSearch");
    if (!searchInput) return;

    this.searchQuery = searchInput.value.trim().toLowerCase();
    this.isSearching = this.searchQuery.length > 0;
    this.currentPage = 1;
    this.applyFilters();
    setTimeout(() => this.scrollToProducts(), 300);
  }

  scrollToProducts() {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  applyFilters() {
    let filtered = [...this.products];

    if (this.isSearching && this.searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery)
      );
    }

    if (this.filters.brand !== "all") {
      filtered = filtered.filter(
        (product) => product.brand === this.filters.brand
      );
    }

    if (this.filters.ram !== "all") {
      const ramValue = parseInt(this.filters.ram);
      filtered = filtered.filter((product) => product.ram === ramValue);
    }

    if (this.filters.storage !== "all") {
      const storageValue = parseInt(this.filters.storage);
      filtered = filtered.filter((product) => product.storage === storageValue);
    }

    if (this.filters.priceRange !== "all") {
      const [minPrice, maxPrice] = this.filters.priceRange
        .split("-")
        .map(Number);
      filtered = filtered.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    if (this.filters.sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.filters.sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    this.filteredProducts = filtered;
    this.renderProducts();
    this.renderPagination();
  }

  renderProducts() {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;

    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const productsToShow = this.filteredProducts.slice(
      startIndex,
      startIndex + this.productsPerPage
    );

    if (productsToShow.length === 0) {
      productGrid.innerHTML = `<p class="no-products">${this.getNoProductsMessage()}</p>`;
      return;
    }

    productGrid.innerHTML = productsToShow
      .map(
        (product) => `
            <div class="product-card">
                <a href="#" class="product-link" data-product-id="${
                  product.id
                }" style="text-decoration: none; color: inherit;">
                    <img src="${product.image}" alt="${
          product.name
        }" onerror="this.src='assets/img/logo.png'">
                    <h4>${product.name}</h4>
                    <p class="price">${this.formatPrice(product.price)}đ</p>
                </a>
                <button class="add-to-cart" data-product-id="${
                  product.id
                }">Thêm vào giỏ</button>
            </div>
        `
      )
      .join("");

    this.setupAddToCartButtons();
  }

  setupAddToCartButtons() {
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = button.getAttribute("data-product-id");
        this.addToCart(productId);
      });
    });
  }

  addToCart(productId) {
    if (!this.checkLogin()) {
      this.showNotification(
        "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!",
        "info"
      );
      return;
    }

    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const productToAdd = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === productToAdd.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(productToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    this.showNotification(`Đã thêm ${product.name} vào giỏ hàng!`);
  }

  checkLogin() {
    const currentUser =
      JSON.parse(localStorage.getItem("CurrentUser")) ||
      JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null;
  }

  getNoProductsMessage() {
    if (this.isSearching && this.searchQuery) {
      return "Không tìm thấy sản phẩm phù hợp với từ khóa tìm kiếm.";
    }
    if (
      Object.values(this.filters).some(
        (filter) => filter !== "all" && filter !== "default"
      )
    ) {
      return "Không có sản phẩm nào phù hợp với bộ lọc đã chọn.";
    }
    return "Không có sản phẩm nào.";
  }

  renderPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    const totalPages = Math.ceil(
      this.filteredProducts.length / this.productsPerPage
    );
    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let paginationHTML = "";

    if (this.currentPage > 1) {
      paginationHTML += `<a href="#" class="page-btn" data-page="${
        this.currentPage - 1
      }">‹</a>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === this.currentPage ? "active" : "";
      paginationHTML += `<a href="#" class="page-btn ${activeClass}" data-page="${i}">${i}</a>`;
    }

    if (this.currentPage < totalPages) {
      paginationHTML += `<a href="#" class="page-btn" data-page="${
        this.currentPage + 1
      }">›</a>`;
    }

    pagination.innerHTML = paginationHTML;

    pagination.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.currentPage = parseInt(e.target.dataset.page);
        this.renderProducts();
        this.renderPagination();
        document
          .getElementById("products")
          ?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  showNotification(message, type = "success") {
    const colors = {
      success: { bg: "#4CAF50", border: "#388E3C" },
      info: { bg: "#2196F3", border: "#1976D2" },
    };

    const colorConfig = colors[type] || colors.success;
    const notification = document.createElement("div");

    notification.className = `filter-notification ${type}`;
    notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
    </div>
  `;

    notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${colorConfig.bg};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-weight: 500;
    transform: translateX(400px);
    transition: transform 0.4s ease;
    max-width: 350px;
    border-left: 4px solid ${colorConfig.border};
  `;

    document.body.appendChild(notification);

    setTimeout(() => (notification.style.transform = "translateX(0)"), 100);
    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => notification.remove(), 400);
    }, 3000);
  }

  formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.productManager = new ProductManager();
});
