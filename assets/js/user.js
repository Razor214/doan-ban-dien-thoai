// ========== KHỞI TẠO DỮ LIỆU NGƯỜI DÙNG ==========
let usersData = JSON.parse(localStorage.getItem('users')) || [
  {
    username: "dang",
    password: "123456",
    role: "user",
    email: "dang@gmail.com",
    fullName: "Võ Khải Đăng",
    phone: "0901234567"
  },
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    email: "admin@gmail.com",
    fullName: "Quản Trị Viên",
    phone: "0900000000"
  }
];

if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(usersData));
}

// ========== KHI TRANG LOAD ==========
document.addEventListener("DOMContentLoaded", () => {
  setupForms();
  handleUrlParams();
});

// ========== SỰ KIỆN CÁC FORM ==========
function setupForms() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm)
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleLogin();
    });

  if (registerForm)
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleRegister();
    });
}

// ========== HÀM ĐĂNG NHẬP ==========
function handleLogin() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const user = usersData.find(
    (u) =>
      (u.username === username || u.email === username) &&
      u.password === password
  );

  if (!user) {
    alert("Sai tên đăng nhập hoặc mật khẩu!");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  // Đăng nhập thành công
  if (user.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
}

// ========== HÀM ĐĂNG KÝ ==========
function handleRegister() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm = document.getElementById("confirmPassword").value.trim();
  const fullName = document.getElementById("fullName").value.trim();

  if (!username || !email || !password || !confirm) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  if (password !== confirm) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  if (usersData.find((u) => u.username === username)) {
    alert("Tên đăng nhập đã tồn tại!");
    return;
  }

  if (usersData.find((u) => u.email === email)) {
    alert("Email đã được dùng!");
    return;
  }

  const newUser = {
    username,
    email,
    password,
    fullName,
    role: "user"
  };

  usersData.push(newUser);
  localStorage.setItem("users", JSON.stringify(usersData));

  alert("Đăng ký thành công! Vui lòng đăng nhập.");
  showTab("login");
}

// ========== HÀM CHUYỂN TAB ==========
function showTab(tab) {
  document.querySelectorAll(".form-page").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));

  const page = document.getElementById(tab);
  const button = document.querySelector(`.tab[data-tab="${tab}"]`);

  if (page) page.classList.add("active");
  if (button) button.classList.add("active");
}

// ========== XỬ LÝ URL ==========
function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab") || "login";
  showTab(tab);
}
