const PRODUCTS_DATA = [
  {
    id: 1,
    name: "iPhone 15 Pro 512GB",
    brand: "Apple",
    price: 32000000,
    stock: 5,
    image: "iphone/iphone15pro-White Titanium.jpg",
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
    cpu: "Apple A17 Pro 6 nhân",
  },
  {
    id: 2,
    name: "iPhone 16 Pro Max 256GB",
    brand: "Apple",
    price: 30590000,
    stock: 10,
    image: "iphone/iphone16promax-Desert Titanium.jpg",
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
    cpu: "Apple A18 Pro 6 nhân",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 5G 8GB/256GB",
    brand: "Samsung",
    price: 25000000,
    stock: 7,
    image: "Samsung/samsungs24-5g-Amber Yellow.jpg",
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
    cpu: "Snapdragon 8 Gen 3",
  },
  {
    id: 4,
    name: "Samsung Galaxy A55 5G 8GB/128GB",
    brand: "Samsung",
    price: 8490000,
    stock: 3,
    image: "Samsung/samsunga55-5g-violet.jpg",
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
    cpu: "Exynos 1480",
  },
  {
    id: 5,
    name: "Xiaomi 14 Ultra 5G 16GB/512GB",
    brand: "Xiaomi",
    price: 21000000,
    stock: 2,
    image: "Xiaomi/xiaomi14ultra-5g-blue.jpg",
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
    cpu: "Snapdragon 8 Gen 3",
  },
  {
    id: 6,
    name: "iPhone 14 Pro Max 128GB",
    brand: "Apple",
    price: 25590000,
    stock: 14,
    image: "iphone/iphone14promax-Deep Purple.jpg",
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
    cpu: "Apple A16 Bionic 6 nhân",
  },
  {
    id: 7,
    name: "iPhone 13 Pro Max 128GB",
    brand: "Apple",
    price: 22990000,
    stock: 8,
    image: "iphone/iphone13promax-Graphite.jpg",
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
    cpu: "Apple A15 Bionic 6 nhân",
  },
  {
    id: 8,
    name: "Samsung Z Fold 5 12GB/256GB",
    brand: "Samsung",
    price: 27990000,
    stock: 9,
    image: "Samsung/samsunggalaxyz-fone5-5g-Icy Blue.jpg",
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
    cpu: "Snapdragon 8 Gen 2",
  },
  {
    id: 9,
    name: "Xiaomi 15T 5G 12GB/256GB",
    brand: "Xiaomi",
    price: 14690000,
    stock: 1,
    image: "Xiaomi/xiaomi15t-5g-rose gold.jpg",
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
    cpu: "Dimensity 8300",
  },
  {
    id: 10,
    name: "Xiaomi 15T Pro 5G 12GB/256GB",
    brand: "Xiaomi",
    price: 19190000,
    stock: 4,
    image: "Xiaomi/xiaomi15tpro-5g-gray.jpg",
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
    cpu: "Snapdragon 8 Gen 3",
  },
];

// Export để sử dụng cho file khác
if (typeof module !== "undefined" && module.exports) {
  module.exports = PRODUCTS_DATA;
} else {
  window.PRODUCTS_DATA = PRODUCTS_DATA;
}
