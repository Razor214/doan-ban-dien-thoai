// ================== LOCALSTORAGE HELPER ==================
function getListUser() {
  // LUÔN lấy từ userList, nếu không có thì trả về mảng rỗng
  const userListFromStorage = JSON.parse(localStorage.getItem("userList")) || [];
  
  // Nếu có dữ liệu từ file data và localStorage trống -> import dữ liệu
  if (userListFromStorage.length === 0 && typeof userList !== 'undefined' && userList.length > 0) {
    console.log('🔄 Import dữ liệu mẫu vào localStorage...');
    const formattedUsers = userList.map(u => ({
      id: u.id,
      fullName: u.fullname || u.fullName,
      username: u.username,
      email: u.email,
      phone: u.sdt || u.phone,
      pass: u.password || u.pass,
      status: u.status || "active",
      role: u.role || "user",
      address: u.address || ""
    }));
    setListUser(formattedUsers);
    return formattedUsers;
  }
  
  console.log('📊 UserList từ localStorage:', userListFromStorage);
  return userListFromStorage;
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
  console.log('👥 Danh sách user hiện tại:', list);

  // kiểm tra trùng
  for (let u of list) {
    if (u.username === username) return showRegisterError("Tên đăng nhập đã tồn tại!");
    if (u.email === email) return showRegisterError("Email đã tồn tại!");
    if (u.phone === phone && phone !== "") return showRegisterError("Số điện thoại đã tồn tại!");
  }

  // Tạo ID mới cho user - tìm ID lớn nhất hiện có
  const userIDs = list.filter(u => u.id && u.id.startsWith("KH")).map(u => parseInt(u.id.replace("KH", "")));
  const maxID = userIDs.length > 0 ? Math.max(...userIDs) : 0;
  const newId = "KH" + String(maxID + 1).padStart(2, "0");

  let newUser = {
    id: newId,
    fullName: fullName,
    username: username,
    email: email,
    pass: pass,
    phone: phone,
    address: address,
    status: "active",
    role: "user"
  };

  console.log('➕ Thêm user mới:', newUser);
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
  console.log('🔐 Đăng nhập với:', userInput);
  console.log('👥 Users trong hệ thống:', list);

  let found = list.find(u =>
    (u.username === userInput || u.email === userInput) && u.pass === pass && u.status === "active"
  );

  if (!found) {
    document.getElementById("login-alert").innerHTML =
      `<div class="alert alert-error">Sai tài khoản hoặc mật khẩu, hoặc tài khoản đã bị khóa!</div>`;
    return;
  }

  setCurrentUser(found);
  console.log('✅ Đăng nhập thành công:', found);

  if (found.role === 'admin') {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
});

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

  // Hiển thị thông tin user
  infoBox.innerHTML = `
    <div class="info-item"><span class="info-label">Họ tên:</span> <span class="info-value">${currentUser.fullName}</span></div>
    <div class="info-item"><span class="info-label">Tên đăng nhập:</span> <span class="info-value">${currentUser.username}</span></div>
    <div class="info-item"><span class="info-label">Email:</span> <span class="info-value">${currentUser.email}</span></div>
    <div class="info-item"><span class="info-label">Số điện thoại:</span> <span class="info-value">${currentUser.phone || 'Chưa cập nhật'}</span></div>
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
    fullName: document.getElementById("profileFullName").value.trim(),
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

// ================== HIỆN / ẨN MẬT KHẨU ==================
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
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    localStorage.removeItem("CurrentUser");
    window.location.href = "index.html";
  }
  return false;
}

// ================== TỰ ĐỘNG MỞ TAB KHI TẢI TRANG ==================
window.onload = function () {
  console.log('🔍 Kiểm tra localStorage...');
  console.log('👥 UserList:', JSON.parse(localStorage.getItem('userList')));
  console.log('👤 CurrentUser:', JSON.parse(localStorage.getItem('CurrentUser')));
  
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

// ================== XỬ LÝ MỞ CART THÔNG MINH ==================
function navigateToCart() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        if (confirm('Bạn cần đăng nhập để xem giỏ hàng. Đăng nhập ngay?')) {
            if (window.location.pathname.includes('user.html') || 
                window.location.href.includes('user.html')) {
                showTab('login');
            } else {
                window.location.href = 'user.html?tab=login';
            }
        }
        return false;
    }
    
    window.location.href = 'cart.html';
    return true;
}

// ================== ÁP DỤNG CHO TẤT CẢ NÚT CART ==================
document.addEventListener('DOMContentLoaded', function() {
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    
    cartLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToCart();
        });
    });
    
    updateHeaderUserStatus();
});

// ================== CẬP NHẬT HEADER ==================
function updateHeaderUserStatus() {
    const currentUser = getCurrentUser();
    const guestLinks = document.getElementById('guest-links');
    const userLinks = document.getElementById('user-links');
    const adminBadge = document.getElementById('admin-badge');
    const adminMenuLink = document.getElementById('admin-menu-link');
    const userNameSpan = document.getElementById('user-name');

    if (currentUser && currentUser.username) {
        if (guestLinks) guestLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';

        const userName = currentUser.fullName || currentUser.username;
        if (userNameSpan) userNameSpan.textContent = userName;

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