// ================== LOCALSTORAGE HELPER ==================
// ====== KHỞI TẠO DỮ LIỆU USER VÀO LOCALSTORAGE ======
if (!localStorage.getItem("userList")) {
    if (typeof userList !== "undefined") { 
        const syncedUsers = userList.map(u => ({
            ...u,
            password: u.password || u.pass || "",
            fullname: u.fullname || u.fullName || "",
            sdt: u.sdt || u.phone || "",
            role: u.role || "user",
            status: u.status || "active"
        }));
        localStorage.setItem("userList", JSON.stringify(syncedUsers));
        console.log("Đã sync dữ liệu user từ data/user.js vào LocalStorage!");
    } else {
        localStorage.setItem("userList", JSON.stringify([]));
    }
}

function getListUser() {
  return JSON.parse(localStorage.getItem("userList")) || [];
}

function setListUser(list) {
  localStorage.setItem("userList", JSON.stringify(list));
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
  document.getElementById(tab)?.classList.add('active');
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

  let fullname = document.getElementById("fullName").value.trim();
  let username = document.getElementById("username").value.trim().toLowerCase();
  let email = document.getElementById("email").value.trim().toLowerCase();
  let password = document.getElementById("password").value;
  let confirmPass = document.getElementById("confirmPassword").value;
  let sdt = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();

  if (!usernameRegex.test(username)) return showRegisterError("Tên đăng nhập chỉ gồm chữ, số, gạch dưới (4-20 ký tự)");
  if (!emailRegex.test(email)) return showRegisterError("Email không hợp lệ!");
  if (sdt && !phoneRegex.test(sdt)) return showRegisterError("Số điện thoại phải gồm 10 số và bắt đầu bằng 0");
  if (!passRegex.test(password)) return showRegisterError("Mật khẩu ≥ 8 ký tự, gồm chữ và số");
  if (password !== confirmPass) return showRegisterError("Mật khẩu xác nhận không khớp!");

  let list = getListUser();

  for (let u of list) {
    if (u.username === username) return showRegisterError("Tên đăng nhập đã tồn tại!");
    if (u.email === email) return showRegisterError("Email đã tồn tại!");
    if (u.sdt === sdt && sdt !== "") return showRegisterError("Số điện thoại đã tồn tại!");
  }

  const userIDs = list.filter(u => u.id?.startsWith("KH"))
    .map(u => parseInt(u.id.replace("KH", "")));
  const newId = "KH" + String((userIDs.length ? Math.max(...userIDs) + 1 : 1)).padStart(2, "0");

  let newUser = {
    id: newId,
    fullname,
    username,
    email,
    password,
    sdt,
    address,
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
  let found = list.find(u =>
    (u.username === userInput || u.email === userInput) &&
    u.password === pass &&
    u.status === "active"
  );

  if (!found) {
    document.getElementById("login-alert").innerHTML =
      `<div class="alert alert-error">Sai thông tin hoặc tài khoản đã khóa!</div>`;
    return;
  }

  setCurrentUser(found);

  // Cập nhật header sau khi đăng nhập
  updateHeaderUserStatus();

  if (found.role === "admin") window.location.href = "admin.html";
  else window.location.href = "index.html";
});

// ================== PROFILE ==================
function loadProfile() {
  let currentUser = getCurrentUser();
  if (!currentUser) return;

  document.getElementById("profile-info").innerHTML = `
    <div class="info-item"><span class="info-label">Họ tên:</span> ${currentUser.fullname}</div>
    <div class="info-item"><span class="info-label">Tên đăng nhập:</span> ${currentUser.username}</div>
    <div class="info-item"><span class="info-label">Email:</span> ${currentUser.email}</div>
    <div class="info-item"><span class="info-label">Số điện thoại:</span> ${currentUser.sdt || 'Chưa cập nhật'}</div>
    <div class="info-item"><span class="info-label">Địa chỉ:</span> ${currentUser.address || 'Chưa cập nhật'}</div>
  `;
}

function toggleEditProfile() {
  let user = getCurrentUser();
  if (!user) return;

  document.getElementById("profile-info").style.display = "none";
  document.getElementById("profileActions").style.display = "none";
  let form = document.getElementById("profileForm");
  form.style.display = "block";

  // Sửa lỗi: sử dụng document.getElementById thay vì truy cập trực tiếp
  document.getElementById("profileFullName").value = user.fullname;
  document.getElementById("profileEmail").value = user.email;
  document.getElementById("profilePhone").value = user.sdt || "";
  document.getElementById("profileAddress").value = user.address || "";
}

function cancelEdit() {
  document.getElementById("profileForm").style.display = "none";
  document.getElementById("profile-info").style.display = "block";
  document.getElementById("profileActions").style.display = "flex";
  document.getElementById("profile-alert").innerHTML = "";
}

document.getElementById("profileForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  let user = getCurrentUser();
  let list = getListUser();

  // Sửa lỗi: sử dụng document.getElementById thay vì truy cập trực tiếp
  let newData = {
    ...user,
    fullname: document.getElementById("profileFullName").value.trim(),
    email: document.getElementById("profileEmail").value.trim().toLowerCase(),
    sdt: document.getElementById("profilePhone").value.trim(),
    address: document.getElementById("profileAddress").value.trim()
  };

  let currentPass = document.getElementById("currentPassword").value;
  let newPass = document.getElementById("newPassword").value;
  let confirmNewPass = document.getElementById("confirmNewPassword").value;

  // Kiểm tra email
  if (!emailRegex.test(newData.email)) {
    showProfileAlert("Email không hợp lệ!", "error");
    return;
  }

  // Kiểm tra số điện thoại
  if (newData.sdt && !phoneRegex.test(newData.sdt)) {
    showProfileAlert("Số điện thoại phải gồm 10 số và bắt đầu bằng 0", "error");
    return;
  }

  // Kiểm tra trùng email và số điện thoại
  for (let u of list) {
    if (!equalUser(u, user)) {
      if (u.email === newData.email) {
        showProfileAlert("Email đã tồn tại!", "error");
        return;
      }
      if (u.sdt === newData.sdt && newData.sdt !== "") {
        showProfileAlert("Số điện thoại đã tồn tại!", "error");
        return;
      }
    }
  }

  // Xử lý đổi mật khẩu
  if (newPass) {
    if (!passRegex.test(newPass))
      return showProfileAlert("Mật khẩu mới ≥ 8 ký tự gồm chữ + số!", "error");

    if (newPass !== confirmNewPass)
      return showProfileAlert("Xác nhận mật khẩu không khớp!", "error");

    if (currentPass !== user.password)
      return showProfileAlert("Mật khẩu hiện tại không đúng!", "error");

    newData.password = newPass;
  }

  setCurrentUser(newData);
  updateListUser(user, newData);
  
  // Cập nhật header sau khi chỉnh sửa
  updateHeaderUserStatus();
  
  showProfileAlert("Cập nhật thành công!", "success");

  setTimeout(() => {
    cancelEdit();
    loadProfile();
  }, 1500);
});

function showProfileAlert(msg, type) {
  const alertDiv = document.getElementById("profile-alert");
  alertDiv.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
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
    // Cập nhật header sau khi đăng xuất
    updateHeaderUserStatus();
    window.location.href = "index.html";
  }
}

// ================== HIỂN THỊ TÊN NGƯỜI DÙNG TRONG HEADER ==================
function updateHeaderUserStatus() {
  const currentUser = getCurrentUser();
  const navbar = document.querySelector('.navbar');
  
  if (!navbar) return;

  if (currentUser) {
    // Tạo hoặc cập nhật user info trong header
    let userInfo = document.querySelector('.user-info');
    if (!userInfo) {
      userInfo = document.createElement('div');
      userInfo.className = 'user-info';
      userInfo.style.marginLeft = 'auto';
      userInfo.style.marginRight = '20px';
      userInfo.style.display = 'flex';
      userInfo.style.alignItems = 'center';
      userInfo.style.gap = '10px';
      
      // Chèn vào trước navbar
      navbar.parentNode.insertBefore(userInfo, navbar);
    }

    // Hiển thị thông tin user
    userInfo.innerHTML = `
      <span style="font-weight: bold; color: #333;">Xin chào, ${currentUser.fullname || currentUser.username}</span>
      <div style="display: flex; gap: 10px;">
        <a href="index.html" style="text-decoration: none; color: #333; padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px;">Trang chủ</a>
        <a href="user.html?tab=profile" style="text-decoration: none; color: #333; padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px;">Hồ sơ</a>
        <a href="#" onclick="logout()" style="text-decoration: none; color: #333; padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px;">Đăng xuất</a>
      </div>
    `;

    // Ẩn các link đăng nhập/đăng ký trong navbar
    const loginLink = document.querySelector('a[href="user.html?tab=login"]');
    const registerLink = document.querySelector('a[href="user.html?tab=register"]');
    const profileLink = document.querySelector('a[href="user.html?tab=profile"]');
    
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (profileLink) profileLink.style.display = 'none';

    // Hiển thị admin link nếu là admin
    const adminLink = document.querySelector('.admin-link');
    if (adminLink) {
      adminLink.style.display = currentUser.role === 'admin' ? 'inline-block' : 'none';
    }
  } else {
    // Ẩn user info
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
      userInfo.style.display = 'none';
    }

    // Hiển thị các link đăng nhập/đăng ký
    const loginLink = document.querySelector('a[href="user.html?tab=login"]');
    const registerLink = document.querySelector('a[href="user.html?tab=register"]');
    const profileLink = document.querySelector('a[href="user.html?tab=profile"]');
    
    if (loginLink) loginLink.style.display = 'inline-block';
    if (registerLink) registerLink.style.display = 'inline-block';
    if (profileLink) profileLink.style.display = 'none';

    // Ẩn admin link
    const adminLink = document.querySelector('.admin-link');
    if (adminLink) {
      adminLink.style.display = 'none';
    }
  }
}

// Load khi mở trang
window.onload = () => {
  let user = getCurrentUser();
  let query = new URLSearchParams(window.location.search).get("tab");
  
  // Cập nhật header
  updateHeaderUserStatus();
  
  if (user) showTab(query || "profile");
  else showTab(query || "login");
};