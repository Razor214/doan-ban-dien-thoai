// DỮ LIỆU USERS (mẫu nếu chưa có trong localStorage)
let usersData = JSON.parse(localStorage.getItem('users')) || [
    {
        "username": "dang",
        "password": "123456",
        "role": "user",
        "email": "dang@gmail.com",
        "fullName": "Võ Khải Đăng",
        "phone": "0901234567"
    },
    {
        "username": "admin",
        "password": "admin123",
        "role": "admin",
        "email": "admin@gmail.com",
        "fullName": "Quản Trị Viên",
        "phone": "0900000000"
    }
];

// Lưu usersData vào localStorage nếu chưa có
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(usersData));
}

// Khởi tạo ứng dụng khi DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('User.js loaded successfully!');
    initializeApp();
    setupEventListeners();
    handleUrlParams();
});

function initializeApp() {
    // Kiểm tra nếu đã đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        loadProfileData();
    }
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const profileForm = document.getElementById('profileForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleProfileUpdate();
        });
    }
    
    // Tab click events
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });

    // Các link nội bộ (ví dụ "Đăng ký ngay" / "Đăng nhập") sử dụng onclick trực tiếp trong HTML,
    // nhưng để đảm bảo nếu là link động, lắng nghe sự kiện cho các .form-link
    document.querySelectorAll('.form-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // nếu có data-tab trên element thì dùng showTab
            const target = this.getAttribute('data-tab');
            if (target) {
                showTab(target);
            }
        });
    });
}

// Xử lý tham số URL để chuyển tab tự động
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'login' || tabParam === 'register' || tabParam === 'profile') {
        showTab(tabParam);
    } else {
        // Mặc định hiển thị tab đăng nhập
        showTab('login');
    }
}

// Tab management
function showTab(tabName) {
    // Hide all pages
    document.querySelectorAll('.form-page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected page and activate tab
    const targetPage = document.getElementById(tabName);
    const targetTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
    
    if (targetPage) {
        targetPage.classList.add('active');
    }
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Nếu chuyển đến tab profile, load dữ liệu
    if (tabName === 'profile') {
        loadProfileData();
    }
}

// Register form validation
function validateRegisterForm() {
    let isValid = true;
    
    document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
    
    const username = document.getElementById('username').value.trim();
    if (username.length < 6) {
        const usernameError = document.getElementById('usernameError');
        if (usernameError) usernameError.textContent = 'Tên đăng nhập phải có ít nhất 6 ký tự';
        isValid = false;
    }
    
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const emailError = document.getElementById('emailError');
        if (emailError) emailError.textContent = 'Email không hợp lệ';
        isValid = false;
    }
    
    const password = document.getElementById('password').value;
    if (password.length < 8) {
        const passwordError = document.getElementById('passwordError');
        if (passwordError) passwordError.textContent = 'Mật khẩu phải có ít nhất 8 ký tự';
        isValid = false;
    }
    
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        if (confirmPasswordError) confirmPasswordError.textContent = 'Mật khẩu xác nhận không khớp';
        isValid = false;
    }
    
    return isValid;
}

// Hàm xử lý đăng nhập (chuyển hướng ngay lập tức theo role)
function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    try {
        // Tìm user khớp trong dữ liệu
        const user = usersData.find(u => 
            (u.username === username || u.email === username) && 
            u.password === password
        );
        
        if (user) {
            // Lưu currentUser
            localStorage.setItem('currentUser', JSON.stringify(user));
            showAlert('login-alert', 'Đăng nhập thành công!', 'success');
            
            // Reset form
            document.getElementById('loginForm').reset();
            
            // CHUYỂN HƯỚNG NGAY (không delay)
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            showAlert('login-alert', 'Sai tên đăng nhập hoặc mật khẩu!', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('login-alert', 'Lỗi hệ thống!', 'error');
    }
}

// Hàm xử lý đăng ký (sang tab login ngay lập tức)
function handleRegister() {
    if (!validateRegisterForm()) {
        return;
    }
    
    const newUser = {
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value,
        email: document.getElementById('email').value.trim(),
        fullName: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        role: 'user'
    };
    
    // Kiểm tra username/email tồn tại
    if (usersData.find(u => u.username === newUser.username)) {
        showAlert('register-alert', 'Tên đăng nhập đã tồn tại!', 'error');
        return;
    }
    
    if (usersData.find(u => u.email === newUser.email)) {
        showAlert('register-alert', 'Email đã tồn tại!', 'error');
        return;
    }
    
    // Thêm user mới
    usersData.push(newUser);
    localStorage.setItem('users', JSON.stringify(usersData));
    
    showAlert('register-alert', 'Đăng ký thành công! Vui lòng đăng nhập.', 'success');
    
    // Chuyển ngay sang tab login và reset form
    showTab('login');
    if (document.getElementById('registerForm')) document.getElementById('registerForm').reset();
}

// Hàm xử lý cập nhật profile
function handleProfileUpdate() {
    const newFullName = document.getElementById('profileFullName').value.trim();
    const newEmail = document.getElementById('profileEmail').value.trim();
    const newPhone = document.getElementById('profilePhone').value.trim();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        // Cập nhật thông tin
        currentUser.fullName = newFullName;
        currentUser.email = newEmail;
        currentUser.phone = newPhone;
        
        // Lưu vào localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Cập nhật trong usersData
        const userIndex = usersData.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            usersData[userIndex].fullName = newFullName;
            usersData[userIndex].email = newEmail;
            usersData[userIndex].phone = newPhone;
            localStorage.setItem('users', JSON.stringify(usersData));
        }
        
        showAlert('profile-alert', 'Cập nhật thông tin thành công!', 'success');
    }
}

// Utility functions
function showAlert(containerId, message, type) {
    const alertDiv = document.getElementById(containerId);
    if (alertDiv) {
        alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        setTimeout(() => alertDiv.innerHTML = '', 3000);
    }
}

function loadProfileData() {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
        document.getElementById('profile-info').style.display = 'none';
        document.getElementById('profileForm').style.display = 'block';
        document.querySelector('.logout-btn').style.display = 'block';
        
        // Điền thông tin HIỆN TẠI từ localStorage (có thể đã được cập nhật)
        document.getElementById('profileFullName').value = userData.fullName || '';
        document.getElementById('profileEmail').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        
        // Ẩn thông báo "Vui lòng đăng nhập"
        const p = document.querySelector('#profile-info p');
        if (p) p.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('profileForm').style.display = 'none';
    document.querySelector('.logout-btn').style.display = 'none';
    document.getElementById('profile-info').style.display = 'block';
    const p = document.querySelector('#profile-info p');
    if (p) p.style.display = 'block';
    showAlert('profile-alert', 'Đã đăng xuất!', 'success');
    showTab('login');
}
