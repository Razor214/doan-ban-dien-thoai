// ===== ADMIN LOGIN STYLES =====
const adminLoginStyles = `
.admin-login-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.admin-login-form {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 400px;
}

.admin-login-form h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #2c3e50;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    box-sizing: border-box;
}

.login-btn {
    width: 100%;
    padding: 12px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
}

.login-btn:hover {
    background: #2980b9;
}

.login-error {
    color: #e74c3c;
    text-align: center;
    margin: 10px 0;
    padding: 10px;
    background: #fde8e6;
    border-radius: 5px;
    display: none;
}
`;
// ===== HÀM HIỂN THỊ FORM ĐĂNG NHẬP =====
function showAdminLogin() {
    // === THÊM ĐOẠN NÀY: ẨN TOÀN BỘ NỘI DUNG ADMIN TRƯỚC KHI HIỆN FORM ===
    const adminContent = document.querySelector('.admin-container, .headerbar, .sidebar, footer');
    if (adminContent) {
        adminContent.style.display = 'none';
    }
    
    // Tạo một div để che toàn bộ trang
    const overlay = document.createElement('div');
    overlay.id = 'fullpage-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 9998;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        color: #333;
    `;
    overlay.innerHTML = '<div>Đang tải...</div>';
    document.body.appendChild(overlay);

    // Thêm CSS vào head
    if (!document.querySelector('#admin-login-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'admin-login-styles';
        styleElement.textContent = adminLoginStyles;
        document.head.appendChild(styleElement);
    }

    // Tạo form đăng nhập
    const loginHTML = `
        <div class="admin-login-overlay">
            <div class="admin-login-form">
                <h2>🔐 Đăng nhập Admin</h2>
                <form id="adminLoginForm">
                    <div class="form-group">
                        <input type="text" id="adminUsername" placeholder="Tên đăng nhập" required>
                    </div>
                    <div class="form-group">
                        <input type="password" id="adminPassword" placeholder="Mật khẩu" required>
                    </div>
                    <button type="submit" class="login-btn">Đăng nhập</button>
                    <div id="adminLoginError" class="login-error">Sai tài khoản hoặc mật khẩu!</div>
                </form>
            </div>
        </div>
    `;

    // Thêm vào body
    document.body.insertAdjacentHTML('beforeend', loginHTML);

    // Xóa overlay loading sau 0.5s
    setTimeout(() => {
        if (document.getElementById('fullpage-overlay')) {
            document.getElementById('fullpage-overlay').remove();
        }
    }, 500);

    // Xử lý sự kiện đăng nhập
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
}
// ===== HÀM XỬ LÝ ĐĂNG NHẬP =====
function handleAdminLogin(e) {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('adminLoginError');
    const button = document.querySelector('.login-btn');

    // Ẩn thông báo lỗi cũ
    errorDiv.style.display = 'none';

    // Hiển thị loading
    const originalText = button.innerHTML;
    button.innerHTML = 'Đang đăng nhập...';
    button.disabled = true;

    // Kiểm tra đăng nhập
    const adminUser = adminLogin(username, password);

    if (adminUser) {
        // Lưu thông tin user
        localStorage.setItem('CurrentUser', JSON.stringify(adminUser));
        
        // === THÊM ĐOẠN NÀY: Ẩn form đăng nhập và hiện admin content ===
        const loginOverlay = document.querySelector('.admin-login-overlay');
        if (loginOverlay) loginOverlay.remove();
        
        // Hiện nội dung admin (nếu có element adminContent)
        const adminContent = document.getElementById('adminContent');
        if (adminContent) {
            adminContent.style.display = 'block';
        }
        
        // Thông báo và reload
        button.innerHTML = 'Đăng nhập thành công!';
        setTimeout(() => {
            window.location.reload(); // Reload để kích hoạt toàn bộ tính năng admin
        }, 1000);
        
    } else {
        // Hiển thị lỗi
        errorDiv.style.display = 'block';
        document.getElementById('adminPassword').value = '';
        
        // Khôi phục button
        button.innerHTML = originalText;
        button.disabled = false;
    }
}
// ===== HÀM KIỂM TRA ĐĂNG NHẬP =====
function adminLogin(username, password) {
    try {
        const list = JSON.parse(localStorage.getItem('ListUser')) || [];

        // Tìm user với role admin
        const adminUser = list.find(u =>
            (u.username === username || u.email === username) &&
            u.pass === password &&
            u.role === 'admin'
        );

        return adminUser || null;
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        return null;
    }
}

// ===== HÀM KIỂM TRA ĐÃ ĐĂNG NHẬP CHƯA =====
function isAdminLoggedIn() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('CurrentUser'));
        return !!(currentUser && currentUser.role === 'admin');
    } catch (error) {
        return false;
    }
}

// ===== HÀM ĐĂNG XUẤT =====
function logoutFromAdmin() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('CurrentUser');
        window.location.href = 'index.html';
    }
}

// ===== HÀM KIỂM TRA VÀ CHUYỂN HƯỚNG =====
function checkAdminAccess() {
    if (!isAdminLoggedIn() && window.location.pathname.includes('admin.html')) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}
