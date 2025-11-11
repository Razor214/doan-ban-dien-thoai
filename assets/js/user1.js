
// ================== KHAI BÁO BIẾN VÀ HÀM CẦN THIẾT ==================
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^0\d{9}$/;
const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// ================== TAB CONTROL ==================
function showTab(tab) {
    document.querySelectorAll('.form-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    document.getElementById(tab).classList.add('active');
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    if (tab === "profile") loadProfile();
}

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
        <div class="info-item"><span class="info-label">Trạng thái:</span> <span class="info-value">${currentUser.status === "active" ? "Đang hoạt động" : "Bị khóa"}</span></div>
    `;

    if (actionsBox) actionsBox.style.display = "flex";
    document.getElementById("profileForm").style.display = "none";

    // ✅ hiển thị lời chào trên header
    let greetingElement = document.getElementById("user-greeting");
    let greetingNameElement = document.getElementById("greeting-name");
    
    if (greetingElement) greetingElement.style.display = "inline";
    if (greetingNameElement) greetingNameElement.innerText = currentUser.fullName;
}

// ================== TOGGLE EDIT PROFILE ==================
function toggleEditProfile() {
    let currentUser = getCurrentUser();
    if (!currentUser) return;

    // Kiểm tra xem tài khoản có bị khóa không
    if (currentUser.status === "blocked") {
        alert("Tài khoản của bạn đã bị khóa. Không thể chỉnh sửa thông tin.");
        return;
    }

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
// ================== LOCALSTORAGE HELPER ==================
function getListUser() {
    // Sử dụng userList từ admin.js
    if (typeof getGlobalUserList === 'function') {
        return getGlobalUserList();
    }
    // Fallback
    return JSON.parse(localStorage.getItem("userList")) || [];
}

function setListUser(list) {
    // Sử dụng hàm từ admin.js
    if (typeof setGlobalUserList === 'function') {
        setGlobalUserList(list);
    } else {
        localStorage.setItem("userList", JSON.stringify(list));
    }
}

function getCurrentUser() {
    if (window.location.pathname.includes('admin.html')) {
        return null;
    }
    return JSON.parse(localStorage.getItem("CurrentUser"));
}

function setCurrentUser(u) {
    if (!window.location.pathname.includes('admin.html') && u.role !== 'admin') {
        localStorage.setItem("CurrentUser", JSON.stringify(u));
    }
}

// ================== HÀM ĐỒNG BỘ USER ==================
function updateListUser(oldUser, newUser) {
    const list = getListUser();
    const index = list.findIndex(u => u.id === oldUser.id);
    if (index !== -1) {
        list[index] = newUser;
        setListUser(list);
    }
}

// ================== ĐĂNG NHẬP USER ==================
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    let userInput = document.getElementById("loginUsername").value.trim().toLowerCase();
    let pass = document.getElementById("loginPassword").value;

    let list = getListUser();

    // 🚨 CHẶN USER THƯỜNG ĐĂNG NHẬP VÀO TRANG ADMIN
    if (window.location.pathname.includes('admin.html')) {
        document.getElementById("login-alert").innerHTML =
            `<div class="alert alert-error">Vui lòng sử dụng trang đăng nhập admin!</div>`;
        return;
    }

    // TÌM USER
    let found = list.find(u =>
        (u.username === userInput || u.email === userInput) && 
        (u.password === pass) && 
        u.status === "active"
    );

    if (!found) {
        document.getElementById("login-alert").innerHTML =
            `<div class="alert alert-error">Sai tài khoản hoặc mật khẩu!</div>`;
        return;
    }

    // 🚨 CHẶN ADMIN ĐĂNG NHẬP Ở TRANG USER
    if (found.role === "admin") {
        document.getElementById("login-alert").innerHTML =
            `<div class="alert alert-error">Tài khoản admin chỉ có thể đăng nhập tại trang admin!</div>`;
        return;
    }

    const normalizedUser = {
        id: found.id,
        fullName: found.fullname,
        username: found.username,
        email: found.email,
        phone: found.phone,
        pass: found.password,
        status: found.status,
        address: found.address || "",
        role: found.role
    };

    setCurrentUser(normalizedUser);
    console.log('✅ User logged in:', normalizedUser);
    window.location.href = "index.html";
});

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
        id: "KH" + (list.length + 1).toString().padStart(2, '0'),
        fullname: fullName,
        username: username,
        email: email,
        phone: phone,
        password: pass,
        status: "active",
        address: "",
        role: "user"
    };

    list.push(newUser);
    setListUser(list); // DÙNG HÀM CHUNG

    document.getElementById("register-alert").innerHTML =
        `<div class="alert alert-success">Đăng ký thành công! Hãy đăng nhập.</div>`;
    document.getElementById("registerForm").reset();
});

// ================== PROFILE FORM SUBMIT ==================
document.getElementById("profileForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    let currentUser = getCurrentUser();
    let list = getListUser();

    let newData = {
        id: currentUser.id,
        fullname: document.getElementById("profileFullName").value.trim(),
        username: currentUser.username,
        email: document.getElementById("profileEmail").value.trim(),
        phone: document.getElementById("profilePhone").value.trim(),
        password: currentUser.pass,
        status: currentUser.status,
        address: currentUser.address || "",
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
        if (u.id !== currentUser.id) {
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
        newData.password = newPassword;
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
    setTimeout(() => {
        cancelEdit();
    }, 1500);
});

  // Chuẩn hóa đối tượng user để cả hai hệ thống
  const normalizedCurrentUser = {
    id: currentUser.id,
    fullname: currentUser.fullName,
    username: currentUser.username,
    email: currentUser.email,
    phone: currentUser.phone,
    password: currentUser.pass,
    status: currentUser.status,
    address: currentUser.address || "",
    role: currentUser.role
  };

  const normalizedNewData = {
    id: newData.id,
    fullname: newData.fullname,
    username: newData.username,
    email: newData.email,
    phone: newData.phone,
    password: newData.password,
    status: newData.status,
    address: newData.address,
    role: newData.role
  };

  // Cập nhật dữ liệu
    setCurrentUser(newData);
    updateListUser(currentUser, newData); // DÙNG HÀM CHUNG

    let successMsg = "Cập nhật thông tin thành công!";
    if (passwordChanged) {
        successMsg = "Cập nhật thông tin và đổi mật khẩu thành công!";
    }

    showProfileAlert(successMsg, "success");
    setTimeout(() => {
        cancelEdit();
    }, 1500);
;
  

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

// ================== ĐỒNG BỘ VỚI ADMIN USERLIST ==================
function syncWithAdminUserList() {
  try {
    // Lấy dữ liệu từ cả hai nguồn
    const listUser = getListUser();
    const adminUserList = JSON.parse(localStorage.getItem("userList")) || [];
    
    // Tạo map để dễ dàng tìm kiếm
    const listUserMap = new Map(listUser.map(user => [user.id, user]));
    const adminUserMap = new Map(adminUserList.map(user => [user.id, user]));
    
    // Merge dữ liệu - ưu tiên dữ liệu mới hơn
    const mergedUsers = [];
    const allUserIds = new Set([...listUserMap.keys(), ...adminUserMap.keys()]);
    
    allUserIds.forEach(id => {
      const listUserData = listUserMap.get(id);
      const adminUserData = adminUserMap.get(id);
      
      if (listUserData && adminUserData) {
        // Nếu có ở cả hai, ưu tiên dữ liệu từ ListUser (user trang chủ)
        mergedUsers.push(listUserData);
      } else if (listUserData) {
        mergedUsers.push(listUserData);
      } else if (adminUserData) {
        mergedUsers.push(adminUserData);
      }
    });
    
    // Cập nhật cả hai localStorage
    setListUser(mergedUsers);
    localStorage.setItem("userList", JSON.stringify(mergedUsers));
    
    console.log('✅ Đã đồng bộ dữ liệu user giữa trang chủ và admin');
  } catch (error) {
    console.error('❌ Lỗi khi đồng bộ dữ liệu user:', error);
  }
}

// ================== KIỂM TRA TRẠNG THÁI TÀI KHOẢN ==================
function checkUserStatus() {
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.status === "blocked") {
    alert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
    localStorage.removeItem("CurrentUser");
    window.location.href = "index.html";
    return false;
  }
  return true;
}

// ================== ĐỒNG BỘ MỌI THỨ ==================
function capNhatMoiThu() {
  let currentUser = getCurrentUser();
  if (!currentUser) return;

  setCurrentUser(currentUser);
  updateListUser(currentUser);
  syncWithAdminUserList();
  loadProfile();

  console.log("✅ Đồng bộ hoàn tất");
}

// ================== TỰ ĐỘNG MỞ TAB KHI TẢI TRANG ==================
window.onload = function () {
  let currentUser = getCurrentUser();
  let query = new URLSearchParams(window.location.search).get('tab');

  // Kiểm tra trạng thái tài khoản
  if (!checkUserStatus()) return;

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
            // Kiểm tra xem đang ở trang nào
            if (window.location.pathname.includes('user.html') || 
                window.location.href.includes('user.html')) {
                // Đang ở user.html -> chuyển tab login
                showTab('login');
            } else {
                // Đang ở trang khác -> chuyển đến user.html
                window.location.href = 'user.html?tab=login';
            }
        }
        return false;
    }
    
    // Kiểm tra trạng thái tài khoản
    if (currentUser.status === "blocked") {
        alert("Tài khoản của bạn đã bị khóa. Không thể truy cập giỏ hàng.");
        return false;
    }
    
    // Đã đăng nhập -> chuyển đến cart.html
    window.location.href = 'cart.html';
    return true;
}

// ================== CHUYỂN TỪ PROFILE SANG CART ==================
function navigateToCartFromProfile() {
    return navigateToCart();
}

// ================== ÁP DỤNG CHO TẤT CẢ NÚT CART ==================
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý cho tất cả link cart
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    
    cartLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToCart();
        });
    });
    
    // Cập nhật trạng thái đăng nhập trên header
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
        // Ẩn guest links, hiển thị user links
        if (guestLinks) guestLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';

        // Hiển thị tên user
        const userName = currentUser.fullName || currentUser.fullname || currentUser.username;
        if (userNameSpan) userNameSpan.textContent = userName;

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

// ================== THÊM HÀM BỊ THIẾU ==================
function logoutFromHome() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem("CurrentUser");
        window.location.href = "index.html";
    }
    return false;
}

// ================== HIỂN THỊ LỖI ĐĂNG KÝ ==================
function showRegisterError(message) {
  const alertDiv = document.getElementById("register-alert");
  alertDiv.innerHTML = `<div class="alert alert-error">${message}</div>`;
  
  setTimeout(() => {
    alertDiv.innerHTML = "";
  }, 3000);
}