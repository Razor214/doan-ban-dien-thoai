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
  // Ẩn tất cả tab content
  document.querySelectorAll(".form-page").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));

  // Hiện tab được chọn
  const page = document.getElementById(tab);
  const button = document.querySelector(`.tab[data-tab="${tab}"]`);

  if (page) page.classList.add("active");
  if (button) button.classList.add("active");

  // Nếu là tab profile, load thông tin user
  if (tab === "profile") {
    loadProfileInfo();
  }
}

// ========== HÀM LOAD THÔNG TIN HỒ SƠ ==========
function loadProfileInfo() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const profileInfo = document.getElementById("profile-info");
  const profileForm = document.getElementById("profileForm");
  const logoutBtn = document.querySelector(".logout-btn");
  const editProfileBtn = document.getElementById("editProfileBtn");

  if (!currentUser) {
    // Chưa đăng nhập
    profileInfo.innerHTML = `<p>Vui lòng đăng nhập để xem thông tin</p>`;
    profileForm.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (editProfileBtn) editProfileBtn.style.display = "none";
    return;
  }

  // Đã đăng nhập - hiển thị thông tin
  profileInfo.innerHTML = `
    <div class="info-item">
      <span class="info-label">Họ và Tên:</span>
      <span class="info-value">${currentUser.fullName || "Chưa cập nhật"}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Tên đăng nhập:</span>
      <span class="info-value">${currentUser.username}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Email:</span>
      <span class="info-value">${currentUser.email}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Số điện thoại:</span>
      <span class="info-value">${currentUser.phone || "Chưa cập nhật"}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Vai trò:</span>
      <span class="info-value">${currentUser.role === "admin" ? "Quản trị viên" : "Người dùng"}</span>
    </div>
  `;
  
  profileForm.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "block";
  if (editProfileBtn) editProfileBtn.style.display = "block";
}

// ========== HÀM ĐĂNG XUẤT ==========
function logout() {
  localStorage.removeItem("currentUser");
  alert("Đã đăng xuất!");
  showTab("login");
}

// ========== XỬ LÝ URL ==========
function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab") || "login";
  showTab(tab);
}

// ========== HÀM CHỈNH SỬA HỒ SƠ ==========
function toggleEditProfile() {
  const profileInfo = document.getElementById("profile-info");
  const profileForm = document.getElementById("profileForm");
  
  if (profileForm.style.display === "none") {
    // Hiện form chỉnh sửa
    profileInfo.style.display = "none";
    profileForm.style.display = "block";
    
    // Điền thông tin hiện tại vào form
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    document.getElementById("profileFullName").value = currentUser.fullName || "";
    document.getElementById("profileEmail").value = currentUser.email || "";
    document.getElementById("profilePhone").value = currentUser.phone || "";
  } else {
    // Ẩn form chỉnh sửa
    profileInfo.style.display = "block";
    profileForm.style.display = "none";
  }
}