class ProductDetails {
  constructor() {
    this.currentProduct = null;
    this.selectedColor = null;
    this.selectedImage = null;
    this.currentImageIndex = 0;
    this.init();
  }

  init() {
    this.loadProductDetails();
    this.setupEventListeners();
  }

  setupTopMenuNavigation() {
    document
      .querySelectorAll('.topmenu a[href*="product-details.html"]')
      .forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();

          // Lấy ID sản phẩm từ href
          const href = link.getAttribute("href");
          const urlParams = new URLSearchParams(href.split("?")[1]);
          const productId = urlParams.get("id");

          if (productId) {
            window.location.href = `product-details.html?id=${productId}`;
          }
        });
      });
  }

  loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id") || 1;

    // Dữ liệu 10 sản phẩm
    const products = [
      {
        id: 1,
        name: "iPhone 15 Pro 512GB",
        brand: "Apple",
        price: 32000000,
        stock: 5,
        colors: [
          {
            name: "Titan Trắng",
            images: [
              "iphone/iphone15pro-White Titanium.jpg",
              "iphone/iphone15pro-White Titanium-2.jpg",
              "iphone/iphone15pro-White Titanium-3.jpg",
              "iphone/iphone15pro-White Titanium-4.jpg",
              "iphone/iphone15pro.jpg",
            ],
          },
          {
            name: "Titan Đen",
            images: [
              "iphone/iphone15pro-Black Titanium.jpg",
              "iphone/iphone15pro-Black Titanium-2.jpg",
              "iphone/iphone15pro-Black Titanium-3.jpg",
              "iphone/iphone15pro-Black Titanium-4.jpg",
              "iphone/iphone15pro.jpg",
            ],
          },
          {
            name: "Titan Xanh",
            images: [
              "iphone/iphone15pro-Blue Titanium.jpg",
              "iphone/iphone15pro-Blue Titanium-2.jpg",
              "iphone/iphone15pro-Blue Titanium-3.jpg",
              "iphone/iphone15pro-Blue Titanium-4.jpg",
              "iphone/iphone15pro.jpg",
            ],
          },
          {
            name: "Titan Tự nhiên",
            images: [
              "iphone/iphone15pro-Natural Titanium.jpg",
              "iphone/iphone15pro-Natural Titanium-2.jpg",
              "iphone/iphone15pro-Natural Titanium-3.jpg",
              "iphone/iphone15pro-Natural Titanium-4.jpg",
              "iphone/iphone15pro.jpg",
            ],
          },
        ],
        ram: 8,
        storage: 512,
        screen: "6.1 inch Super Retina XDR",
        camera: "48MP + 12MP + 12MP",
        battery: "3274 mAh",
        os: "iOS 17",
        cpu: "Apple A17 Pro 6 nhân",
        cameraRear: "Chính 48 MP & Phụ 12 MP, 12 MP",
        cameraFront: "12 MP",
        material: "Khung Titan & Mặt lưng kính cường lực",
        waterResistance: "IP68",
        chargingPort: "Type-C",
        launchDate: "09/2023",
      },
      {
        id: 2,
        name: "iPhone 16 Pro Max 256GB",
        brand: "Apple",
        price: 30590000,
        stock: 10,
        colors: [
          {
            name: "Desert Titanium",
            images: [
              "iphone/iphone16promax-Desert Titanium.jpg",
              "iphone/iphone16promax-Desert Titanium-2.jpg",
              "iphone/iphone16promax-Desert Titanium-3.jpg",
              "iphone/iphone16promax-Desert Titanium-4.jpg",
              "iphone/iphone16promax.jpg",
            ],
          },
          {
            name: "Black Titanium",
            images: [
              "iphone/iphone16promax-Black Titanium.jpg",
              "iphone/iphone16promax-Black Titanium-2.jpg",
              "iphone/iphone16promax-Black Titanium-3.jpg",
              "iphone/iphone16promax-Black Titanium-4.jpg",
              "iphone/iphone16promax.jpg",
            ],
          },
          {
            name: "Natural Titanium",
            images: [
              "iphone/iphone16promax-Natural Titanium.jpg",
              "iphone/iphone16promax-Natural Titanium-2.jpg",
              "iphone/iphone16promax-Natural Titanium-3.jpg",
              "iphone/iphone16promax-Natural Titanium-4.jpg",
              "iphone/iphone16promax.jpg",
            ],
          },
          {
            name: "White Titanium",
            images: [
              "iphone/iphone16promax-White Titanium.jpg",
              "iphone/iphone16promax-White Titanium-2.jpg",
              "iphone/iphone16promax-White Titanium-3.jpg",
              "iphone/iphone16promax-White Titanium-4.jpg",
              "iphone/iphone16promax.jpg",
            ],
          },
        ],
        ram: 8,
        storage: 256,
        screen: "6.7 inch Super Retina XDR",
        camera: "48MP + 12MP + 12MP + LiDAR",
        battery: "4422 mAh",
        os: "iOS 18",
        cpu: "Apple A18 Pro 6 nhân",
        cameraRear: "Chính 48 MP & Phụ 48 MP, 12 MP, LiDAR",
        cameraFront: "12 MP",
        material: "Khung Titan & Mặt lưng kính cường lực",
        waterResistance: "IP68",
        chargingPort: "Type-C",
        launchDate: "09/2024",
      },
      {
        id: 3,
        name: "Samsung Galaxy S24 5G 8GB/256GB",
        brand: "Samsung",
        price: 25000000,
        stock: 7,
        colors: [
          {
            name: "Amber Yellow",
            images: [
              "Samsung/samsungs24-5g-Amber Yellow.jpg",
              "Samsung/samsungs24-5g-Amber Yellow-2.jpg",
              "Samsung/samsungs24-5g-Amber Yellow-3.jpg",
              "Samsung/samsungs24-5g-1.jpg",
              "Samsung/samsungs24-5g-2.jpg",
              "Samsung/samsungs24-5g-3.jpg",
              "Samsung/samsungs24-5g-4.jpg",
              "Samsung/samsungs24-5g-5.jpg",
            ],
          },
          {
            name: "Cobalt Violet",
            images: [
              "Samsung/samsungs24-5g-Cobalt Violet.jpg",
              "Samsung/samsungs24-5g-Cobalt Violet-2.jpg",
              "Samsung/samsungs24-5g-Cobalt Violet-3.jpg",
            ],
          },
          {
            name: "Marble Gray",
            images: [
              "Samsung/samsungs24-5g-Marble Gray.jpg",
              "Samsung/samsungs24-5g-Marble Gray-2.jpg",
              "Samsung/samsungs24-5g-Marble Gray-3.jpg",
            ],
          },
          {
            name: "Onyx Black",
            images: [
              "Samsung/samsungs24-5g-Onyx Black.jpg",
              "Samsung/samsungs24-5g-Onyx Black-2.jpg",
              "Samsung/samsungs24-5g-Onyx Black-3.jpg",
            ],
          },
        ],
        ram: 8,
        storage: 256,
        screen: "6.2 inch Dynamic AMOLED 2X",
        camera: "50MP + 10MP + 12MP",
        battery: "4000 mAh",
        os: "Android 14",
        cpu: "Snapdragon 8 Gen 3",
        cameraRear: "Chính 50 MP & Phụ 10 MP, 12 MP",
        cameraFront: "12 MP",
        material: "Khung nhôm & Mặt lưng kính cường lực",
        waterResistance: "IP68",
        chargingPort: "Type-C",
        launchDate: "01/2024",
      },
      {
        id: 4,
        name: "Samsung Galaxy A55 5G 8GB/128GB",
        brand: "Samsung",
        price: 8490000,
        stock: 3,
        colors: [
          {
            name: "Violet",
            images: [
              "Samsung/samsunga55-5g-violet.jpg",
              "Samsung/samsunga55-5g-violet-2.jpg",
              "Samsung/samsunga55-5g-violet-3.jpg",
              "Samsung/samsunga55.jpg",
              "Samsung/samsunga55-1.jpg",
              "Samsung/samsunga55-2.jpg",
              "Samsung/samsunga55-3.jpg",
            ],
          },
          {
            name: "Black",
            images: [
              "Samsung/samsunga55-5g-black.jpg",
              "Samsung/samsunga55-5g-black-2.jpg",
              "Samsung/samsunga55-5g-black-3.jpg",
              "Samsung/samsunga55.jpg",
            ],
          },
          {
            name: "Lemon",
            images: [
              "Samsung/samsunga55-5g-lemonjpg.jpg",
              "Samsung/samsunga55-5g-lemonjpg-2.jpg",
              "Samsung/samsunga55.jpg",
            ],
          },
          {
            name: "Navy",
            images: [
              "Samsung/samsunga55-5g-navy.jpg",
              "Samsung/samsunga55-5g-navy-2.jpg",
              "Samsung/samsunga55-5g-navy-3.jpg",
              "Samsung/samsunga55.jpg",
            ],
          },
        ],
        ram: 8,
        storage: 128,
        screen: "6.6 inch Super AMOLED",
        camera: "50MP + 12MP + 5MP",
        battery: "5000 mAh",
        os: "Android 14",
        cpu: "Exynos 1480",
        cameraRear: "Chính 50 MP & Phụ 12 MP, 5 MP",
        cameraFront: "32 MP",
        material: "Khung nhôm & Mặt lưng nhựa",
        waterResistance: "IP67",
        chargingPort: "Type-C",
        launchDate: "03/2024",
      },
      {
        id: 5,
        name: "Xiaomi 14 Ultra 5G 16GB/512GB",
        brand: "Xiaomi",
        price: 21000000,
        stock: 2,
        colors: [
          {
            name: "Blue",
            images: [
              "Xiaomi/xiaomi14ultra-5g-blue.jpg",
              "Xiaomi/xiaomi14ultra-5g-blue-2.jpg",
              "Xiaomi/xiaomi14ultra-5g.jpg",
              "Xiaomi/xiaomi14ultra-5g-1.jpg",
              "Xiaomi/xiaomi14ultra-5g-2.jpg",
              "Xiaomi/xiaomi14ultra-5g-3.jpg",
              "Xiaomi/xiaomi14ultra-5g-4.jpg",
              "Xiaomi/xiaomi14ultra-5g-5.jpg",
            ],
          },
          {
            name: "Black",
            images: [
              "Xiaomi/xiaomi14ultra-5g-black.jpg",
              "Xiaomi/xiaomi14ultra-5g-black-2.jpg",
              "Xiaomi/xiaomi14ultra-5g-black-3.jpg",
              "Xiaomi/xiaomi14ultra-5g.jpg",
            ],
          },
          {
            name: "White",
            images: [
              "Xiaomi/xiaomi14ultra-5g-white.jpg",
              "Xiaomi/xiaomi14ultra-5g-white-2.jpg",
              "Xiaomi/xiaomi14ultra-5g-white-3.jpg",
              "Xiaomi/xiaomi14ultra-5g.jpg",
            ],
          },
        ],
        ram: 16,
        storage: 512,
        screen: "6.73 inch LTPO AMOLED",
        camera: "50MP + 50MP + 50MP + 50MP",
        battery: "5300 mAh",
        os: "Android 14",
        cpu: "Snapdragon 8 Gen 3",
        cameraRear: "Chính 50 MP & Phụ 50 MP, 50 MP, 50 MP",
        cameraFront: "32 MP",
        material: "Khung nhôm & Mặt lưng da/ceramic",
        waterResistance: "IP68",
        chargingPort: "Type-C",
        launchDate: "02/2024",
      },
      {
        id: 6,
        name: "iPhone 14 Pro Max 128GB",
        brand: "Apple",
        price: 25590000,
        stock: 14,
        colors: [
          {
            name: "Deep Purple",
            images: [
              "iphone/iphone14promax-Deep Purple.jpg",
              "iphone/iphone14promax-Deep Purple-2.jpg",
              "iphone/iphone14promax-Deep Purple-3.jpg",
              "iphone/iphone14promax-Deep Purple-4.jpg",
              "iphone/iphone14promax.jpg",
            ],
          },
          {
            name: "Gold",
            images: [
              "iphone/iphone14promax-Gold.jpg",
              "iphone/iphone14promax-Gold-2.jpg",
              "iphone/iphone14promax-Gold-3.jpg",
              "iphone/iphone14promax.jpg",
            ],
          },
          {
            name: "Silver",
            images: [
              "iphone/iphone14promax-Silver.jpg",
              "iphone/iphone14promax-Silver-2.jpg",
              "iphone/iphone14promax-Silver-3.jpg",
              "iphone/iphone14promax.jpg",
            ],
          },
          {
            name: "Space Black",
            images: [
              "iphone/iphone14promax-Space Black.jpg",
              "iphone/iphone14promax-Space Black-2.jpg",
              "iphone/iphone14promax-Space Black-3.jpg",
              "iphone/iphone14promax.jpg",
            ],
          },
        ],
        ram: 6,
        storage: 128,
        screen: "6.7 inch Super Retina XDR",
        camera: "48MP + 12MP + 12MP",
        battery: "4323 mAh",
        os: "iOS 16",
        cpu: "Apple A16 Bionic 6 nhân",
        cameraRear: "Chính 48 MP & Phụ 12 MP, 12 MP",
        cameraFront: "12 MP",
        material: "Khung thép không gỉ & Mặt lưng kính cường lực",
        waterResistance: "IP68",
        chargingPort: "Lightning",
        launchDate: "09/2022",
      },
      {
        id: 7,
        name: "iPhone 13 Pro Max 128GB",
        brand: "Apple",
        price: 22990000,
        stock: 8,
        colors: [
          {
            name: "Graphite",
            images: [
              "iphone/iphone13promax-Graphite.jpg",
              "iphone/iphone13promax-Graphite-2.jpg",
              "iphone/iphone13promax-Graphite-3.jpg",
              "iphone/iphone13promax-Graphite-4.jpg",
              "iphone/iphone13promax-Graphite-5.jpg",
              "iphone/iphone13promax.jpg",
            ],
          },
          {
            name: "Gold",
            images: [
              "iphone/iphone13promax-Gold.jpg",
              "iphone/iphone13promax-Gold-2.jpg",
              "iphone/iphone13promax-Gold-3.jpg",
              "iphone/iphone13promax.jpg",
            ],
          },
          {
            name: "Silver",
            images: [
              "iphone/iphone13promax-Silver.jpg",
              "iphone/iphone13promax-Silver-2.jpg",
              "iphone/iphone13promax-Silver-3.jpg",
              "iphone/iphone13promax.jpg",
            ],
          },
          {
            name: "Sierra Blue",
            images: [
              "iphone/iphone13promax-Sierra.jpg",
              "iphone/iphone13promax-Sierra-2.jpg",
              "iphone/iphone13promax-Sierra-3.jpg",
              "iphone/iphone13promax.jpg",
            ],
          },
          {
            name: "Green",
            images: [
              "iphone/iphone13promax-Green.jpg",
              "iphone/iphone13promax-Green-2.jpg",
              "iphone/iphone13promax-Green-3.jpg",
              "iphone/iphone13promax.jpg",
            ],
          },
        ],
        ram: 6,
        storage: 128,
        screen: "6.7 inch Super Retina XDR",
        camera: "12MP + 12MP + 12MP",
        battery: "4352 mAh",
        os: "iOS 15",
        cpu: "Apple A15 Bionic 6 nhân",
        cameraRear: "Chính 12 MP & Phụ 12 MP, 12 MP",
        cameraFront: "12 MP",
        material: "Khung thép không gỉ & Mặt lưng kính cường lực",
        waterResistance: "IP68",
        chargingPort: "Lightning",
        launchDate: "09/2021",
      },
      {
        id: 8,
        name: "Samsung Z Fold 5 12GB/256GB",
        brand: "Samsung",
        price: 27990000,
        stock: 9,
        colors: [
          {
            name: "Icy Blue",
            images: [
              "Samsung/samsunggalaxyz-fone5-5g-Icy Blue.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-Icy Blue-2.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-Icy Blue-3.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-Icy Blue-4.jpg",
              "Samsung/samsunggalaxyz-fone5-5g.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-1.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-2.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-3.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-4.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-5.jpg",
            ],
          },
          {
            name: "Phantom Black",
            images: [
              "Samsung/samsunggalaxyz-fone5-5g-Phantom Black.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-Phantom Black-2.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-Phantom Black-3.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-Phantom Black-4.jpg",
              "Samsung/samsunggalaxyz-fone5-5g.jpg",
            ],
          },
          {
            name: "Cream",
            images: [
              "Samsung/samsunggalaxyz-fone5-5g-Cream.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-Cream-2.jpg",
              "Samsung/samsunggalaxyz-fone5-5g-Cream-3.jpg",
              "Samsung/samsunggalaxyz-fone5-5g.jpg",
            ],
          },
        ],
        ram: 12,
        storage: 256,
        screen: "7.6 inch Dynamic AMOLED 2X",
        camera: "50MP + 12MP + 10MP",
        battery: "4400 mAh",
        os: "Android 13",
        cpu: "Snapdragon 8 Gen 2",
        cameraRear: "Chính 50 MP & Phụ 12 MP, 10 MP",
        cameraFront: "10 MP + 4 MP",
        material: "Khung nhôm & Mặt lưng kính cường lực",
        waterResistance: "IPX8",
        chargingPort: "Type-C",
        launchDate: "08/2023",
      },
      {
        id: 9,
        name: "Xiaomi 15T 5G 12GB/256GB",
        brand: "Xiaomi",
        price: 14690000,
        stock: 1,
        colors: [
          {
            name: "Rose Gold",
            images: [
              "Xiaomi/xiaomi15t-5g-rose gold.jpg",
              "Xiaomi/xiaomi15t-5g-rose gold-2.jpg",
              "Xiaomi/xiaomi15t-5g-rose gold-3.jpg",
              "Xiaomi/xiaomi15t-5g.jpg",
            ],
          },
          {
            name: "Black",
            images: [
              "Xiaomi/xiaomi15t-5g-black.jpg",
              "Xiaomi/xiaomi15t-5g-black-2.jpg",
              "Xiaomi/xiaomi15t-5g-black-3.jpg",
              "Xiaomi/xiaomi15t-5g.jpg",
            ],
          },
          {
            name: "Gray",
            images: [
              "Xiaomi/xiaomi15t-5g-gray.jpg",
              "Xiaomi/xiaomi15t-5g-gray-2.jpg",
              "Xiaomi/xiaomi15t-5g-gray-3.jpg",
              "Xiaomi/xiaomi15t-5g.jpg",
            ],
          },
        ],
        ram: 12,
        storage: 256,
        screen: "6.67 inch AMOLED",
        camera: "50MP + 8MP + 2MP",
        battery: "5000 mAh",
        os: "Android 14",
        cpu: "Dimensity 8300",
        cameraRear: "Chính 50 MP & Phụ 8 MP, 2 MP",
        cameraFront: "16 MP",
        material: "Khung nhựa & Mặt lưng kính",
        waterResistance: "IP53",
        chargingPort: "Type-C",
        launchDate: "09/2024",
      },
      {
        id: 10,
        name: "Xiaomi 15T Pro 5G 12GB/256GB",
        brand: "Xiaomi",
        price: 19190000,
        stock: 4,
        colors: [
          {
            name: "Black",
            images: [
              "Xiaomi/xiaomi15tpro-5g-black.jpg",
              "Xiaomi/xiaomi15tpro-5g-black-2.jpg",
            ],
          },
          {
            name: "Gray",
            images: [
              "Xiaomi/xiaomi15tpro-5g-gray.jpg",
              "Xiaomi/xiaomi15tpro-5g-gray-2.jpg",
              "Xiaomi/xiaomi15tpro-5g-gray-3.jpg",
            ],
          },
        ],
        ram: 12,
        storage: 256,
        screen: "6.67 inch AMOLED",
        camera: "50MP + 50MP + 50MP",
        battery: "5000 mAh",
        os: "Android 14",
        cpu: "Snapdragon 8 Gen 3",
        cameraRear: "Chính 50 MP & Phụ 50 MP, 50 MP",
        cameraFront: "20 MP",
        material: "Khung nhôm & Mặt lưng kính cường lực",
        waterResistance: "IP68",
        chargingPort: "Type-C",
        launchDate: "10/2024",
      },
    ];

    this.currentProduct =
      products.find((p) => p.id === parseInt(productId)) || products[0];
    this.selectedColor = this.currentProduct.colors[0];
    this.selectedImage = this.selectedColor.images[0];
    this.currentImageIndex = 0;
    this.renderProductDetails();
  }

  renderProductDetails() {
    if (!this.currentProduct) return;

    document.getElementById("productName").textContent =
      this.currentProduct.name;
    this.renderProductImages();
    document.getElementById("currentPrice").textContent = this.formatPrice(
      this.currentProduct.price
    );
    this.renderColorOptions();
    this.renderSpecifications();
    this.updateNavigationButtons();
  }

  renderProductImages() {
    const mainImage = document.getElementById("productMainImage");
    const thumbnailsContainer = document.querySelector(".image-thumbnails");

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

  selectImage(image, index) {
    this.selectedImage = image;
    this.currentImageIndex = index;

    this.fadeToNewImage(image);

    document.querySelectorAll(".thumbnail").forEach((thumb) => {
      thumb.classList.remove("active");
    });

    document.querySelectorAll(".thumbnail").forEach((thumb, idx) => {
      if (idx === index) {
        thumb.classList.add("active");
      }
    });

    // Cập nhật nút điều hướng
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

  updateNavigationButtons() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn && nextBtn) {
      // Nút previous
      if (this.currentImageIndex === 0) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = "0.5";
      } else {
        prevBtn.disabled = false;
        prevBtn.style.opacity = "1";
      }

      // Nút next
      if (this.currentImageIndex === this.selectedColor.images.length - 1) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = "0.5";
      } else {
        nextBtn.disabled = false;
        nextBtn.style.opacity = "1";
      }
    }
  }

  updateImageCounter() {
    // Tạo counter mới
    const mainImageContainer = document.querySelector(".main-image");
    const counter = document.createElement("div");
    counter.className = "image-counter";
    counter.textContent = `${this.currentImageIndex + 1} / ${
      this.selectedColor.images.length
    }`;

    mainImageContainer.appendChild(counter);
  }

  selectColor(colorName) {
    const selectedColorObj = this.currentProduct.colors.find(
      (color) => color.name === colorName
    );
    if (!selectedColorObj) return;

    this.selectedColor = selectedColorObj;
    this.currentImageIndex = 0;

    // Hiệu ứng chuyển ảnh
    this.fadeToNewImage(selectedColorObj.images[0]);

    document.querySelectorAll(".color-option").forEach((option) => {
      option.classList.remove("selected");
      if (option.dataset.color === colorName) {
        option.classList.add("selected");
      }
    });

    this.updateNavigationButtons();
  }

  fadeToNewImage(newImage) {
    const mainImage = document.getElementById("productMainImage");
    const mainImageContainer = mainImage.parentElement;

    mainImageContainer.classList.add("loading");

    mainImage.classList.add("fade-out");

    setTimeout(() => {
      // Đổi hình ảnh
      this.selectedImage = newImage;
      mainImage.src = `assets/img/${newImage}`;
      mainImage.alt = `${this.currentProduct.name} - ${this.selectedColor.name}`;

      this.renderProductImages();

      mainImage.classList.remove("fade-out");
      mainImage.classList.add("fade-in");

      mainImageContainer.classList.remove("loading");

      setTimeout(() => {
        mainImage.classList.remove("fade-in");
      }, 300);
    }, 300);
  }

  renderColorOptions() {
    const colorOptionsContainer = document.getElementById("colorOptions");
    if (!colorOptionsContainer || !this.currentProduct.colors) return;

    colorOptionsContainer.innerHTML = this.currentProduct.colors
      .map(
        (colorObj, index) => `
                <div class="color-option ${index === 0 ? "selected" : ""}" 
                     data-color="${colorObj.name}"
                     onclick="productDetails.selectColor('${colorObj.name}')">
                    ${colorObj.name}
                </div>
            `
      )
      .join("");

    this.selectedColor = this.currentProduct.colors[0];
  }

  renderSpecifications() {
    const specsList = document.getElementById("specsList");
    if (!specsList) return;

    const specs = [
      { label: "Thương hiệu", value: this.currentProduct.brand },
      { label: "Chip xử lý (CPU)", value: this.currentProduct.cpu },
      { label: "RAM", value: `${this.currentProduct.ram}GB` },
      {
        label: "Bộ nhớ trong",
        value: this.formatStorage(this.currentProduct.storage),
      },
      { label: "Hệ điều hành", value: this.currentProduct.os },
      { label: "Màn hình", value: this.currentProduct.screen },
      { label: "Camera sau", value: this.currentProduct.cameraRear },
      { label: "Camera trước", value: this.currentProduct.cameraFront },
      { label: "Pin", value: this.currentProduct.battery },
      { label: "Cổng kết nối/sạc", value: this.currentProduct.chargingPort },
      { label: "Kháng nước, bụi", value: this.currentProduct.waterResistance },
      { label: "Chất liệu", value: this.currentProduct.material },
      { label: "Thời điểm ra mắt", value: this.currentProduct.launchDate },
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

  setupEventListeners() {
    // Nút thêm vào giỏ hàng
    document.getElementById("addToCartBtn").addEventListener("click", () => {
      this.addToCart();
    });

    // Nút điều hướng hình ảnh
    document.getElementById("prevBtn").addEventListener("click", () => {
      this.prevImage();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
      this.nextImage();
    });

    // Điều hướng bằng bàn phím
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.prevImage();
      } else if (e.key === "ArrowRight") {
        this.nextImage();
      }
    });

    // Swipe cho mobile
    this.setupSwipeEvents();
  }

  setupSwipeEvents() {
    const mainImage = document.getElementById("productMainImage");
    let startX = 0;
    let endX = 0;

    mainImage.addEventListener("touchstart", (e) => {
      startX = e.changedTouches[0].screenX;
    });

    mainImage.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].screenX;
      this.handleSwipe(startX, endX);
    });
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 50;

    if (startX - endX > swipeThreshold) this.nextImage();
    else if (endX - startX > swipeThreshold) this.prevImage();
  }

  addToCart() {
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
            z-index: 1000;
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
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  }

  formatStorage(storage) {
    if (storage >= 1024) {
      return "1TB";
    }
    return `${storage}GB`;
  }
}

// Khởi tạo
let productDetails;

document.addEventListener("DOMContentLoaded", () => {
  productDetails = new ProductDetails();
});
