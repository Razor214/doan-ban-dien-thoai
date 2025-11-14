// ================== LOCALSTORAGE HELPER ==================
// KHÔNG khởi tạo lại localStorage, giữ nguyên dữ liệu hiện có

function getListUser() {
  return JSON.parse(localStorage.getItem("userList")) || [];
}

function setListUser(list) {
  localStorage.setItem("userList", JSON.stringify(list));
}

function getCurrentUser() {
  const userData = localStorage.getItem("CurrentUser") || localStorage.getItem("currentUser");
  return userData ? JSON.parse(userData) : null;
}

function setCurrentUser(u) {
  localStorage.setItem("CurrentUser", JSON.stringify(u));
}

function equalUser(u1, u2) {
  return u1.username === u2.username;
}

function updateListUser(user, newData) {
  let list = getListUser();
  for (let i = 0; i < list.length; i++) {
    if (equalUser(list[i], user)) {
      list[i] = newData ? newData : user;
      break;
    }
  }
  setListUser(list);
}

// ================== TAB CONTROL ==================
function showTab(tab) {
  console.log('🔄 Switching to tab:', tab);
  
  // Ẩn tất cả các trang form
  document.querySelectorAll('.form-page').forEach(p => {
    p.classList.remove('active');
  });

  // Hiển thị trang được chọn
  const targetPage = document.getElementById(tab);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Xử lý riêng cho tab profile
  if (tab === "profile") {
    loadProfile();
  }
}

// ================== REGEX CHECKS ==================
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^0\d{9}$/;
const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// ================== ĐĂNG KÝ ==================
document.getElementById("registerForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  let fullName = document.getElementById("fullName").value.trim();
  let username = document.getElementById("username").value.trim().toLowerCase();
  let email = document.getElementById("email").value.trim().toLowerCase();
  let pass = document.getElementById("password").value;
  let confirmPass = document.getElementById("confirmPassword").value;
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();

  // --- kiểm tra định dạng ---
  if (!usernameRegex.test(username))
    return showRegisterError("Tên đăng nhập chỉ gồm chữ, số, gạch dưới (4-20 ký tự)");

  if (!emailRegex.test(email))
    return showRegisterError("Email không hợp lệ!");

  if (phone && !phoneRegex.test(phone))
    return showRegisterError("Số điện thoại phải gồm 10 số và bắt đầu bằng 0");

  if (!passRegex.test(pass))
    return showRegisterError("Mật khẩu ≥ 8 ký tự, gồm chữ và số");

  if (pass !== confirmPass)
    return showRegisterError("Mật khẩu xác nhận không khớp!");

  let list = getListUser();

  // kiểm tra trùng
  for (let u of list) {
    if (u.username === username) return showRegisterError("Tên đăng nhập đã tồn tại!");
    if (u.email === email) return showRegisterError("Email đã tồn tại!");
    if (u.phone === phone && phone !== "") return showRegisterError("Số điện thoại đã tồn tại!");
  }

  // Tạo ID mới cho user
  const userCount = list.filter(u => u.id && u.id.startsWith("KH")).length;
  const newId = "KH" + String(userCount + 1).padStart(2, "0");

  let newUser = {
    id: newId,
    fullname: fullName, // Sử dụng fullname (chữ thường) để đồng bộ với dữ liệu hiện có
    username: username,
    email: email,
    pass: pass,
    phone: phone,
    address: address,
    status: "active",
    role: "user"
  };

  list.push(newUser);
  setListUser(list);

  document.getElementById("register-alert").innerHTML =
    `<div class="alert alert-success">Đăng ký thành công! Hãy đăng nhập.</div>`;
  document.getElementById("registerForm").reset();
});

function showRegisterError(msg) {
  document.getElementById("register-alert").innerHTML =
    `<div class="alert alert-error">${msg}</div>`;
}

// ================== ĐĂNG NHẬP ==================
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  let userInput = document.getElementById("loginUsername").value.trim().toLowerCase();
  let pass = document.getElementById("loginPassword").value;

  let list = getListUser();
  
  // Tìm user với cả 2 trường password và pass (để tương thích với dữ liệu cũ)
  let found = list.find(u =>
    (u.username === userInput || u.email === userInput)
  );

  if (!found) {
    showLoginError("Sai tài khoản hoặc mật khẩu!");
    clearAndFocusLogin();
    return;
  }

  // Kiểm tra tài khoản bị khóa - SỬA LỖI Ở ĐÂY
  if (found.status && found.status !== "active") {
    showLoginError("Tài khoản bị khoá, vui lòng liên hệ với quản trị viên.");
    clearAndFocusLogin();
    return;
  }

  // Kiểm tra mật khẩu
  if (found.password !== pass && found.pass !== pass) {
    showLoginError("Sai tài khoản hoặc mật khẩu!");
    clearAndFocusLogin();
    return;
  }

  // Chuẩn hóa dữ liệu user trước khi lưu
  const normalizedUser = {
    id: found.id,
    fullName: found.fullname || found.fullName, // Chuẩn hóa thành fullName
    username: found.username,
    email: found.email,
    pass: found.password || found.pass, // Chuẩn hóa thành pass
    phone: found.phone || found.sdt,
    address: found.address,
    status: found.status || "active", // Đảm bảo có status
    role: found.role || "user"
  };

  setCurrentUser(normalizedUser);

  if (normalizedUser.role === 'admin') {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
});

// ================== XỬ LÝ LỖI ĐĂNG NHẬP ==================
function showLoginError(msg) {
  document.getElementById("login-alert").innerHTML =
    `<div class="alert alert-error">${msg}</div>`;
}

function clearAndFocusLogin() {
  // Xóa mật khẩu
  document.getElementById("loginPassword").value = "";
  
  // Focus vào trường tên đăng nhập/email
  setTimeout(() => {
    document.getElementById("loginUsername").focus();
  }, 100);
}

// ================== HIỂN THỊ PROFILE ==================
function loadProfile() {
  let currentUser = getCurrentUser();
  let infoBox = document.getElementById("profile-info");
  let actionsBox = document.getElementById("profileActions");
  let profileForm = document.getElementById("profileForm");

  if (!currentUser) {
    infoBox.innerHTML = `<p>Vui lòng đăng nhập để xem thông tin</p>`;
    if (actionsBox) actionsBox.style.display = "none";
    if (profileForm) profileForm.style.display = "none";
    return;
  }

  // Sử dụng cả fullname và fullName để tương thích
  const displayName = currentUser.fullName || currentUser.fullname;

  // Hiển thị thông tin user
  infoBox.innerHTML = `
    <div class="info-item"><span class="info-label">Họ tên:</span> <span class="info-value">${displayName || 'Chưa cập nhật'}</span></div>
    <div class="info-item"><span class="info-label">Tên đăng nhập:</span> <span class="info-value">${currentUser.username}</span></div>
    <div class="info-item"><span class="info-label">Email:</span> <span class="info-value">${currentUser.email}</span></div>
    <div class="info-item"><span class="info-label">Số điện thoại:</span> <span class="info-value">${currentUser.phone || currentUser.sdt || 'Chưa cập nhật'}</span></div>
    <div class="info-item"><span class="info-label">Địa chỉ:</span> <span class="info-value">${currentUser.address || 'Chưa cập nhật'}</span></div>
  `;

  // Hiển thị nút hành động
  if (actionsBox) {
    actionsBox.style.display = "flex";
  }
  
  // Ẩn form chỉnh sửa
  if (profileForm) {
    profileForm.style.display = "none";
  }

  // Hiển thị thông tin profile
  infoBox.style.display = "block";
}

// ================== TOGGLE EDIT PROFILE ==================
function toggleEditProfile() {
  let currentUser = getCurrentUser();
  if (!currentUser) return;

  // Ẩn thông tin và nút hành động
  document.getElementById("profile-info").style.display = "none";
  document.getElementById("profileActions").style.display = "none";

  // Hiển thị form chỉnh sửa
  document.getElementById("profileForm").style.display = "block";

  // Điền thông tin hiện tại (sử dụng cả fullname và fullName)
  document.getElementById("profileFullName").value = currentUser.fullName || currentUser.fullname || "";
  document.getElementById("profileEmail").value = currentUser.email || "";
  document.getElementById("profilePhone").value = currentUser.phone || currentUser.sdt || "";
  document.getElementById("profileAddress").value = currentUser.address || "";

  // Reset các field mật khẩu
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmNewPassword").value = "";
}

// ================== CANCEL EDIT ==================
function cancelEdit() {
  // Ẩn form chỉnh sửa
  document.getElementById("profileForm").style.display = "none";

  // Hiển thị lại thông tin và nút hành động
  document.getElementById("profile-info").style.display = "block";
  document.getElementById("profileActions").style.display = "flex";

  // Load lại thông tin profile
  loadProfile();
}

// ================== PROFILE FORM SUBMIT ==================
document.getElementById("profileForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  let currentUser = getCurrentUser();
  let list = getListUser();

  let newData = {
    id: currentUser.id,
    fullname: document.getElementById("profileFullName").value.trim(), // Sử dụng fullname để đồng bộ
    username: currentUser.username,
    email: document.getElementById("profileEmail").value.trim(),
    phone: document.getElementById("profilePhone").value.trim(),
    address: document.getElementById("profileAddress").value.trim(),
    pass: currentUser.pass,
    status: currentUser.status,
    role: currentUser.role
  };

  // Lấy thông tin mật khẩu
  let currentPassword = document.getElementById("currentPassword").value;
  let newPassword = document.getElementById("newPassword").value;
  let confirmNewPassword = document.getElementById("confirmNewPassword").value;

  // Kiểm tra email
  if (!emailRegex.test(newData.email)) {
    showProfileAlert("Email không hợp lệ!", "error");
    return;
  }

  // Kiểm tra số điện thoại
  if (newData.phone && !phoneRegex.test(newData.phone)) {
    showProfileAlert("Số điện thoại phải gồm 10 số và bắt đầu bằng 0", "error");
    return;
  }

  // Kiểm tra trùng email và số điện thoại
  for (let u of list) {
    if (u.username !== currentUser.username) { // So sánh bằng username thay vì equalUser
      if (u.email === newData.email) {
        showProfileAlert("Email đã tồn tại!", "error");
        return;
      }
      if (u.phone === newData.phone && newData.phone !== "") {
        showProfileAlert("Số điện thoại đã tồn tại!", "error");
        return;
      }
    }
  }

  // Xử lý đổi mật khẩu nếu có nhập
  let passwordChanged = false;
  if (currentPassword || newPassword || confirmNewPassword) {
    if (!currentPassword) {
      showProfileAlert("Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu", "error");
      return;
    }

    if (currentPassword !== currentUser.pass) {
      showProfileAlert("Mật khẩu hiện tại không đúng!", "error");
      return;
    }

    if (!passRegex.test(newPassword)) {
      showProfileAlert("Mật khẩu mới phải ≥ 8 ký tự và gồm chữ + số!", "error");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showProfileAlert("Xác nhận mật khẩu mới không khớp!", "error");
      return;
    }

    // Cập nhật mật khẩu mới
    newData.pass = newPassword;
    passwordChanged = true;
  }

  // Cập nhật dữ liệu
  setCurrentUser(newData);
  updateListUser(currentUser, newData);

  let successMsg = "Cập nhật thông tin thành công!";
  if (passwordChanged) {
    successMsg = "Cập nhật thông tin và đổi mật khẩu thành công!";
  }

  showProfileAlert(successMsg, "success");

  // Đóng form và load lại
  setTimeout(() => {
    cancelEdit();
  }, 1500);
});

// ================== PROFILE ALERT ==================
function showProfileAlert(msg, type) {
  const alertDiv = document.getElementById("profile-alert");
  alertDiv.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;

  setTimeout(() => {
    alertDiv.innerHTML = "";
  }, 3000);
}

// ================== HIỆN / ẨN MẬT KHẨU ==================
function togglePassword(inputId, icon) {
  let input = document.getElementById(inputId);
  let eyeIcon = icon.querySelector('i');
  
  if (input.type === "password") {
    input.type = "text";
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');
    icon.classList.add('active');
  } else {
    input.type = "password";
    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');
    icon.classList.remove('active');
  }
  
  // Thêm hiệu ứng focus cho input
  input.focus();
}

// ================== ĐĂNG XUẤT ==================
function logout() {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    localStorage.removeItem("CurrentUser");
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  }
  return false;
}

// ================== TỰ ĐỘNG MỞ TAB KHI TẢI TRANG ==================
window.onload = function () {
  let currentUser = getCurrentUser();
  let query = new URLSearchParams(window.location.search).get('tab');

  if (currentUser && (!query || query === "profile")) {
    showTab("profile");
  } else if (query) {
    showTab(query);
  } else {
    showTab("login");
  }
};

// ================== CẬP NHẬT HEADER ==================
function updateHeaderUserStatus() {
    const currentUser = getCurrentUser();
    const guestLinks = document.getElementById('guest-links');
    const userLinks = document.getElementById('user-links');
    const adminBadge = document.getElementById('admin-badge');
    const adminMenuLink = document.getElementById('admin-menu-link');
    const userNameSpan = document.getElementById('user-name');

    if (currentUser && currentUser.username) {
        // Ẩn guest links, hiển thị user links
        if (guestLinks) guestLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';

        // Hiển thị fullName (ưu tiên fullName, sau đó fullname) thay vì username
        const displayName = currentUser.fullName || currentUser.fullname || currentUser.username;
        if (userNameSpan) userNameSpan.textContent = displayName;

        // Kiểm tra và hiển thị badge admin + menu item nếu là admin
        const isAdmin = currentUser.role && currentUser.role.toLowerCase() === 'admin';
        if (adminBadge) {
            adminBadge.style.display = isAdmin ? 'inline-block' : 'none';
        }
        if (adminMenuLink) {
            adminMenuLink.style.display = isAdmin ? 'flex' : 'none';
        }
    } else {
        if (guestLinks) guestLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
    }
}