// ================== LOCALSTORAGE HELPER ==================
function getListUser() {
  return JSON.parse(localStorage.getItem("ListUser")) || [];
}

function setListUser(list) {
  localStorage.setItem("ListUser", JSON.stringify(list));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("CurrentUser"));
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
  document.querySelectorAll('.form-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  document.getElementById(tab).classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

  if (tab === "profile") loadProfile();
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

  let newUser = {
    fullName,
    username,
    email,
    pass,
    phone,
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

  let found = list.find(u =>
    (u.username === userInput || u.email === userInput) && u.pass === pass
  );

  if (!found) {
    document.getElementById("login-alert").innerHTML =
      `<div class="alert alert-error">Sai tài khoản hoặc mật khẩu!</div>`;
    return;
  }

  setCurrentUser(found);
  console.log('✅ User logged in:', found);

  // Kiểm tra nếu là admin
  if (found.role === 'admin') {
    console.log('👑 Admin logged in - redirecting to admin page');
    window.location.href = "admin.html";
  } else {
    console.log('👤 User logged in - redirecting to home');
    window.location.href = "index.html";
  }
});

// ================== HIỂN THỊ PROFILE ==================
function loadProfile() {
  let currentUser = getCurrentUser();
  let infoBox = document.getElementById("profile-info");
  let actionsBox = document.getElementById("profileActions");

  if (!currentUser) {
    infoBox.innerHTML = `<p>Vui lòng đăng nhập để xem thông tin</p>`;
    if (actionsBox) actionsBox.style.display = "none";
    document.getElementById("profileForm").style.display = "none";
    return;
  }

  infoBox.innerHTML = `
        <div class="info-item"><span class="info-label">Họ tên:</span> <span class="info-value">${currentUser.fullName}</span></div>
        <div class="info-item"><span class="info-label">Tên đăng nhập:</span> <span class="info-value">${currentUser.username}</span></div>
        <div class="info-item"><span class="info-label">Email:</span> <span class="info-value">${currentUser.email}</span></div>
        <div class="info-item"><span class="info-label">Số điện thoại:</span> <span class="info-value">${currentUser.phone}</span></div>
    `;

  if (actionsBox) actionsBox.style.display = "flex";
  document.getElementById("profileForm").style.display = "none";

  // ✅ hiển thị lời chào trên header
  document.getElementById("user-greeting").style.display = "inline";
  document.getElementById("greeting-name").innerText = currentUser.fullName;
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

  // Điền thông tin hiện tại
  document.getElementById("profileFullName").value = currentUser.fullName;
  document.getElementById("profileEmail").value = currentUser.email;
  document.getElementById("profilePhone").value = currentUser.phone;

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

// ================== PROFILE FORM SUBMIT (GỘP CHUNG) ==================
document.getElementById("profileForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  let currentUser = getCurrentUser();
  let list = getListUser();

  let newData = {
    fullName: document.getElementById("profileFullName").value.trim(),
    username: currentUser.username,
    email: document.getElementById("profileEmail").value.trim(),
    phone: document.getElementById("profilePhone").value.trim(),
    pass: currentUser.pass, // Giữ mật khẩu cũ mặc định
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
    if (!equalUser(u, currentUser)) {
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

// ================== HIỆN / ẨN MẬT KHẨU (icon mắt) ==================
function togglePassword(inputId, icon) {
  let input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    icon.style.opacity = "0.5";
  } else {
    input.type = "password";
    icon.style.opacity = "1";
  }
}

// ================== ĐĂNG XUẤT ==================
function logout() {
  localStorage.removeItem("CurrentUser");
  document.getElementById("user-greeting").style.display = "none";
  showTab("login");
}

// ================== ĐỒNG BỘ MỌI THỨ ==================
function capNhatMoiThu() {
  let currentUser = getCurrentUser();
  if (!currentUser) return;

  setCurrentUser(currentUser);
  updateListUser(currentUser);
  loadProfile();

  console.log("✅ Đồng bộ hoàn tất");
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