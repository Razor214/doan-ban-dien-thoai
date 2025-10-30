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

    // Tải dữ liệu trực tiếp
    this.loadProductsDirect();
    this.setupEventListeners();
    this.applyFilters();
  }

  loadProductsDirect() {
    console.log("🔄 Đang tải dữ liệu trực tiếp...");

    this.products = [
      {
        id: 1,
        name: "iPhone 15 Pro 512GB",
        brand: "Apple",
        price: 32000000,
        stock: 5,
        image: "iphone15promax.png",
        ram: 8,
        storage: 512,
      },
      {
        id: 2,
        name: "iPhone 16 Pro Max 256GB",
        brand: "Apple",
        price: 30590000,
        stock: 10,
        image: "iphone16promax.jpg",
        ram: 8,
        storage: 256,
      },
      {
        id: 3,
        name: "Samsung Galaxy S24 5G 8GB/256GB",
        brand: "Samsung",
        price: 25000000,
        stock: 7,
        image: "samsunggalaxys24.jpg",
        ram: 8,
        storage: 256,
      },
      {
        id: 4,
        name: "Samsung Galaxy A55 5G 8GB/128GB",
        brand: "Samsung",
        price: 8490000,
        stock: 3,
        image: "samsunggalaxyA55-5g.jpg",
        ram: 8,
        storage: 128,
      },
      {
        id: 5,
        name: "Xiaomi 14 Ultra 5G 16GB|512GB",
        brand: "Xiaomi",
        price: 21000000,
        stock: 2,
        image: "xiaomi14ultra.jpg",
        ram: 16,
        storage: 512,
      },
      {
        id: 6,
        name: "iPhone 14 Pro Max 128GB",
        brand: "Apple",
        price: 25590000,
        stock: 14,
        image: "iphone14promax.jpg",
        ram: 6,
        storage: 128,
      },
      {
        id: 7,
        name: "iPhone 13 Pro Max 128GB",
        brand: "Apple",
        price: 22990000,
        stock: 8,
        image: "iphone13promax.jpg",
        ram: 6,
        storage: 128,
      },
      {
        id: 8,
        name: "Samsung Z Fold 5 12GB/256GB",
        brand: "Samsung",
        price: 27990000,
        stock: 9,
        image: "samsungzfold5.jpg",
        ram: 12,
        storage: 256,
      },
      {
        id: 9,
        name: "Xiaomi 15T 5G 12GB/256GB",
        brand: "Xiaomi",
        price: 14690000,
        stock: 1,
        image: "xiaomi15t-5g.jpg",
        ram: 12,
        storage: 256,
      },
      {
        id: 10,
        name: "Xiaomi 15T Pro 5G 12GB/256GB",
        brand: "Xiaomi",
        price: 19190000,
        stock: 4,
        image: "xiaomi15Tpro.jpg",
        ram: 12,
        storage: 256,
      },
    ];

    this.filteredProducts = [...this.products];
    console.log(`✅ Đã tải ${this.products.length} sản phẩm`);
  }

  setupEventListeners() {
    console.log("🔄 Đang thiết lập event listeners...");

    // Sự kiện cho bộ lọc
    const brandFilter = document.getElementById("brandFilter");
    const ramFilter = document.getElementById("ramFilter");
    const storageFilter = document.getElementById("storageFilter");
    const priceRangeFilter = document.getElementById("priceRangeFilter");
    const sortFilter = document.getElementById("sortFilter");
    const resetBtn = document.getElementById("resetFilters");

    if (brandFilter) {
      brandFilter.addEventListener("change", (e) => {
        this.filters.brand = e.target.value;
        this.currentPage = 1;
        this.applyFilters();
      });
    }

    if (ramFilter) {
      ramFilter.addEventListener("change", (e) => {
        this.filters.ram = e.target.value;
        this.currentPage = 1;
        this.applyFilters();
      });
    }

    if (storageFilter) {
      storageFilter.addEventListener("change", (e) => {
        this.filters.storage = e.target.value;
        this.currentPage = 1;
        this.applyFilters();
      });
    }

    if (priceRangeFilter) {
      priceRangeFilter.addEventListener("change", (e) => {
        this.filters.priceRange = e.target.value;
        this.currentPage = 1;
        this.applyFilters();
      });
    }

    if (sortFilter) {
      sortFilter.addEventListener("change", (e) => {
        this.filters.sort = e.target.value;
        this.currentPage = 1;
        this.applyFilters();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetAllFilters());
    }

    // Tìm kiếm
    document
      .getElementById("headerSearchBtn")
      ?.addEventListener("click", () => this.performHeaderSearch());
    document
      .getElementById("headerSearch")
      ?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.performHeaderSearch();
      });

    console.log("✅ Event listeners đã được thiết lập");
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

    // Đặt lại giá trị form
    document.getElementById("brandFilter").value = "all";
    document.getElementById("ramFilter").value = "all";
    document.getElementById("storageFilter").value = "all";
    document.getElementById("priceRangeFilter").value = "all";
    document.getElementById("sortFilter").value = "default";
    document.getElementById("headerSearch").value = "";

    this.filteredProducts = [...this.products];
    this.renderProducts();
    this.renderPagination();
  }

  performHeaderSearch() {
    const searchInput = document.getElementById("headerSearch");
    if (!searchInput) return;

    this.searchQuery = searchInput.value.trim().toLowerCase();
    this.isSearching = true;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    console.log("🔄 Đang áp dụng bộ lọc...", this.filters);

    let filtered = [...this.products];

    // Bộ lọc tìm kiếm
    if (this.isSearching && this.searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery)
      );
    }

    // Bộ lọc thương hiệu
    if (this.filters.brand !== "all") {
      filtered = filtered.filter(
        (product) => product.brand === this.filters.brand
      );
    }

    // Bộ lọc RAM
    if (this.filters.ram !== "all") {
      const ramValue = parseInt(this.filters.ram);
      filtered = filtered.filter((product) => product.ram === ramValue);
    }

    // Bộ lọc dung lượng lưu trữ
    if (this.filters.storage !== "all") {
      const storageValue = parseInt(this.filters.storage);
      filtered = filtered.filter((product) => product.storage === storageValue);
    }

    // Bộ lọc khoảng giá
    if (this.filters.priceRange !== "all") {
      const [minPrice, maxPrice] = this.filters.priceRange
        .split("-")
        .map(Number);
      filtered = filtered.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    // Sắp xếp
    if (this.filters.sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.filters.sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    this.filteredProducts = filtered;
    console.log(`📊 Sau khi lọc: ${this.filteredProducts.length} sản phẩm`);

    this.renderProducts();
    this.renderPagination();
  }

  renderProducts() {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) {
      console.error("❌ KHÔNG TÌM THẤY #productGrid");
      return;
    }

    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const productsToShow = this.filteredProducts.slice(
      startIndex,
      startIndex + this.productsPerPage
    );

    console.log("🔄 Đang render sản phẩm:", productsToShow.length);

    if (productsToShow.length === 0) {
      const message = this.getNoProductsMessage();
      productGrid.innerHTML = `<p class="no-products">${message}</p>`;
      return;
    }

    productGrid.innerHTML = productsToShow
      .map(
        (product) => `
      <div class="product-card">
        <img src="assets/img/${product.image}" alt="${product.name}" 
             onerror="this.src='assets/img/placeholder.jpg'">
        <h4>${product.name}</h4>
        <p class="price">${this.formatPrice(product.price)}đ</p>
        <button class="add-to-cart">Thêm vào giỏ</button>
      </div>
    `
      )
      .join("");

    console.log("✅ Đã render sản phẩm thành công");
  }

  formatStorage(storage) {
    if (storage >= 1024) {
      return "1TB";
    }
    return `${storage}GB`;
  }

  getNoProductsMessage() {
    if (this.isSearching) {
      return "Không tìm thấy sản phẩm phù hợp với từ khóa tìm kiếm.";
    }
    if (
      this.filters.brand !== "all" ||
      this.filters.priceRange !== "all" ||
      this.filters.ram !== "all" ||
      this.filters.storage !== "all"
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
      });
    });
  }

  formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price);
  }
}

// Khởi tạo
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Đang khởi tạo ProductManager...");
  window.productManager = new ProductManager();
});
