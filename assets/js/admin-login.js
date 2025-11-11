// ===== ADMIN LOGIN STYLES =====
const adminLoginStyles = `
/* === RESET & OVERRIDE === */
.admin-login-overlay * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.admin-login-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    z-index: 10000 !important;
}

.admin-login-form {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    padding: 2.5rem !important;
    border-radius: 15px !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
    width: 90% !important;
    max-width: 420px !important;
    position: relative !important;
    z-index: 10001 !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.admin-login-form h2 {
    text-align: center !important;
    margin-bottom: 2rem !important;
    color: #2c3e50 !important;
    font-size: 1.8rem !important;
    font-weight: 600 !important;
    background: linear-gradient(135deg, #3498db, #2c3e50) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
}

.form-group {
    margin-bottom: 1.5rem !important;
    width: 100% !important;
}

.form-group input {
    width: 100% !important;
    padding: 15px !important;
    border: 2px solid #e9ecef !important;
    border-radius: 8px !important;
    font-size: 16px !important;
    box-sizing: border-box !important;
    display: block !important;
    transition: all 0.3s ease !important;
    background: #f8f9fa !important;
}

.form-group input:focus {
    border-color: #3498db !important;
    outline: none !important;
    background: white !important;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1) !important;
    transform: translateY(-2px) !important;
}

.login-btn {
    width: 100% !important;
    padding: 15px !important;
    background: linear-gradient(135deg, #3498db, #2980b9) !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    font-size: 16px !important;
    cursor: pointer !important;
    margin-top: 10px !important;
    font-weight: 600 !important;
    display: block !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3) !important;
}

.login-btn:hover {
    background: linear-gradient(135deg, #2980b9, #2573a7) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4) !important;
}

.login-btn:active {
    transform: translateY(0) !important;
}

.login-btn:disabled {
    background: #95a5a6 !important;
    cursor: not-allowed !important;
    transform: none !important;
    box-shadow: none !important;
}

.login-error {
    color: #e74c3c !important;
    text-align: center !important;
    margin: 15px 0 !important;
    padding: 12px !important;
    background: #fde8e6 !important;
    border-radius: 8px !important;
    display: none !important;
    border: 1px solid #e74c3c !important;
    font-weight: 500 !important;
}

/* === RESPONSIVE === */
@media (max-width: 480px) {
    .admin-login-form {
        margin: 20px !important;
        padding: 2rem 1.5rem !important;
        width: 95% !important;
    }
    
    .admin-login-form h2 {
        font-size: 1.5rem !important;
        margin-bottom: 1.5rem !important;
    }
    
    .form-group input {
        padding: 12px !important;
    }
    
    .login-btn {
        padding: 12px !important;
    }
}
`;

// ===== TÀI KHOẢN ADMIN LẤY TỪ USERLIST =====
function getAdminAccount() {
    const userList = typeof getGlobalUserList === 'function' ? getGlobalUserList() : JSON.parse(localStorage.getItem("userList")) || [];
    const admin = userList.find(user => user.role === 'admin');
    return admin || { username: 'admin', password: 'admin123' }; // Fallback
}

// ===== HÀM XỬ LÝ ĐĂNG NHẬP ADMIN =====
function handleAdminLogin(e) {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('adminLoginError');
    const button = document.querySelector('.login-btn');

    console.log('🔐 Thử đăng nhập admin:', { username, password });

    // Ẩn thông báo lỗi cũ
    errorDiv.style.display = 'none';

    // Hiển thị loading
    const originalText = button.innerHTML;
    button.innerHTML = 'Đang đăng nhập...';
    button.disabled = true;

    // Kiểm tra đăng nhập từ userList
    const adminAccount = getAdminAccount();
    if (username === adminAccount.username && password === adminAccount.password) {
        console.log('✅ ĐĂNG NHẬP ADMIN THÀNH CÔNG');
        
        // Lưu trạng thái đăng nhập
        setAdminLoggedIn(true);
        
        // Ẩn form đăng nhập
        const loginOverlay = document.querySelector('.admin-login-overlay');
        if (loginOverlay) loginOverlay.remove();
        
        // HIỆN LẠI TOÀN BỘ NỘI DUNG ADMIN
        const adminElements = document.querySelectorAll('.admin-container, .headerbar, .sidebar, footer');
        adminElements.forEach(el => {
            if (el) el.style.display = '';
        });
        
        console.log('✅ ĐÃ HIỆN NỘI DUNG ADMIN');
        
    } else {
        // Hiển thị lỗi
        errorDiv.style.display = 'block';
        document.getElementById('adminPassword').value = '';
        
        // Khôi phục button
        button.innerHTML = originalText;
        button.disabled = false;
        console.log('❌ Đăng nhập admin thất bại');
    }
}

// ===== QUẢN LÝ TRẠNG THÁI ĐĂNG NHẬP ADMIN =====
const ADMIN_SESSION_KEY = 'admin_logged_in';

// Hàm kiểm tra đăng nhập admin
function isAdminLoggedIn() {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

// Hàm lưu trạng thái đăng nhập admin
function setAdminLoggedIn(status) {
    if (status) {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
        localStorage.removeItem(ADMIN_SESSION_KEY);
    }
}

// ===== HÀM HIỂN THỊ FORM ĐĂNG NHẬP ADMIN =====
// Trong hàm showAdminLogin(), cập nhật phần hiển thị:
const adminAccount = getAdminAccount();
const loginHTML = `
    <div class="admin-login-overlay" id="adminLoginOverlay">
        <div class="admin-login-form">
            <h2>🔐 Đăng nhập Admin</h2>
            <form id="adminLoginForm">
                <div class="form-group">
                    <input type="text" id="adminUsername" placeholder="Tên đăng nhập" required value="${adminAccount.username}">
                </div>
                <div class="form-group">
                    <input type="password" id="adminPassword" placeholder="Mật khẩu" required value="${adminAccount.password}">
                </div>
                <button type="submit" class="login-btn">Đăng nhập Admin</button>
                <div id="adminLoginError" class="login-error">Sai tài khoản hoặc mật khẩu!</div>
            </form>
            <div style="text-align:center; margin-top:15px; font-size:12px; color:#666;">
                <p><strong>Tài khoản admin:</strong> ${adminAccount.username} / ${adminAccount.password}</p>
            </div>
        </div>
    </div>
`;
// ===== HÀM XỬ LÝ ĐĂNG NHẬP ADMIN =====
function handleAdminLogin(e) {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('adminLoginError');
    const button = document.querySelector('.login-btn');

    console.log('🔐 Thử đăng nhập admin:', { username, password });

    // Ẩn thông báo lỗi cũ
    errorDiv.style.display = 'none';

    // Hiển thị loading
    const originalText = button.innerHTML;
    button.innerHTML = 'Đang đăng nhập...';
    button.disabled = true;

    // Kiểm tra đăng nhập đơn giản
    if (username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password) {
        console.log('✅ ĐĂNG NHẬP ADMIN THÀNH CÔNG');
        
        // Lưu trạng thái đăng nhập
        setAdminLoggedIn(true);
        
        // Ẩn form đăng nhập
        const loginOverlay = document.querySelector('.admin-login-overlay');
        if (loginOverlay) loginOverlay.remove();
        
        // HIỆN LẠI TOÀN BỘ NỘI DUNG ADMIN
        const adminElements = document.querySelectorAll('.admin-container, .headerbar, .sidebar, footer');
        adminElements.forEach(el => {
            if (el) el.style.display = '';
        });
        
        console.log('✅ ĐÃ HIỆN NỘI DUNG ADMIN');
        
    } else {
        // Hiển thị lỗi
        errorDiv.style.display = 'block';
        document.getElementById('adminPassword').value = '';
        
        // Khôi phục button
        button.innerHTML = originalText;
        button.disabled = false;
        console.log('❌ Đăng nhập admin thất bại');
    }
}

// ===== HÀM ĐĂNG XUẤT ADMIN =====
function logoutFromAdmin() {
    if (confirm('Bạn có chắc muốn đăng xuất khỏi admin?')) {
        setAdminLoggedIn(false);
        console.log('🚪 Đã đăng xuất admin');
        window.location.href = 'index.html';
    }
}

// ===== KIỂM TRA VÀ XỬ LÝ KHI TRANG LOAD =====
console.log('=== ADMIN LOGIN JS ĐÃ LOAD ===');

// Kiểm tra khi trang load
window.addEventListener('load', function() {
    console.log('🔄 TRANG ADMIN ĐÃ LOAD');
    
    // Nếu là trang admin và chưa đăng nhập, hiện form
    if (window.location.pathname.includes('admin.html') && !isAdminLoggedIn()) {
        console.log('🚨 CHƯA ĐĂNG NHẬP ADMIN - HIỆN FORM');
        setTimeout(() => {
            showAdminLogin();
        }, 100);
    } else if (window.location.pathname.includes('admin.html') && isAdminLoggedIn()) {
        console.log('✅ ĐÃ ĐĂNG NHẬP ADMIN - HIỆN NỘI DUNG');
        // Đảm bảo hiển thị đầy đủ nội dung admin
        const adminElements = document.querySelectorAll('.admin-container, .headerbar, .sidebar, footer');
        adminElements.forEach(el => {
            if (el) el.style.display = '';
        });
    }
});

// Backup - kiểm tra lại sau 1 giây
setTimeout(() => {
    if (window.location.pathname.includes('admin.html') && 
        !isAdminLoggedIn() && 
        !document.querySelector('.admin-login-overlay')) {
        console.log('🕒 KIỂM TRA BACKUP - HIỆN FORM ĐĂNG NHẬP');
        showAdminLogin();
    }
}, 1000);