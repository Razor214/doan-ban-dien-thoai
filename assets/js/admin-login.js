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

// ===== HÀM KIỂM TRA ĐĂNG NHẬP =====
function adminLogin(username, password) {
    try {
        const list = JSON.parse(localStorage.getItem('ListUser')) || [];
        console.log('🔐 Kiểm tra đăng nhập admin với:', { username, password });

        // Tìm user với role admin
        const adminUser = list.find(u => {
            const usernameMatch = u.username === username || u.email === username;
            const passwordMatch = u.pass === password;
            const roleMatch = u.role === 'admin';
            
            return usernameMatch && passwordMatch && roleMatch;
        });

        console.log('✅ User tìm thấy:', adminUser);
        return adminUser || null;
    } catch (error) {
        console.error('❌ Lỗi khi đăng nhập:', error);
        return null;
    }
}

// ===== HÀM KIỂM TRA ĐÃ ĐĂNG NHẬP CHƯA =====
function isAdminLoggedIn() {
    try {
        const currentUserStr = localStorage.getItem('CurrentUser');
        
        if (!currentUserStr) {
            console.log('❌ Không có CurrentUser trong localStorage');
            return false;
        }
        
        const currentUser = JSON.parse(currentUserStr);
        const isAdmin = !!(currentUser && currentUser.role === 'admin');
        
        console.log('🔍 Kiểm tra đăng nhập admin:', isAdmin);
        return isAdmin;
    } catch (error) {
        console.error('❌ Lỗi khi kiểm tra đăng nhập:', error);
        return false;
    }
}

// ===== HÀM HIỂN THỊ FORM ĐĂNG NHẬP =====
function showAdminLogin() {
    console.log('🎯 Hiển thị form đăng nhập admin...');

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
                        <input type="text" id="adminUsername" placeholder="Tên đăng nhập" required value="admin">
                    </div>
                    <div class="form-group">
                        <input type="password" id="adminPassword" placeholder="Mật khẩu" required value="admin123">
                    </div>
                    <button type="submit" class="login-btn">Đăng nhập</button>
                    <div id="adminLoginError" class="login-error">Sai tài khoản hoặc mật khẩu!</div>
                </form>
                <div style="text-align:center; margin-top:15px; font-size:12px; color:#666;">
                    Tài khoản mẫu: admin / admin123
                </div>
            </div>
        </div>
    `;

    // Thêm vào body
    document.body.insertAdjacentHTML('beforeend', loginHTML);

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

    console.log('🔐 Đang đăng nhập với:', { username, password });

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
        console.log('✅ Đã lưu CurrentUser vào localStorage');
        
        // Ẩn form đăng nhập
        const loginOverlay = document.querySelector('.admin-login-overlay');
        if (loginOverlay) loginOverlay.remove();
        
        // Thông báo thành công
        button.innerHTML = 'Đăng nhập thành công!';
        console.log('✅ ĐĂNG NHẬP THÀNH CÔNG!');
        
        // Reload trang để hiển thị nội dung admin
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
    } else {
        // Hiển thị lỗi
        errorDiv.style.display = 'block';
        document.getElementById('adminPassword').value = '';
        
        // Khôi phục button
        button.innerHTML = originalText;
        button.disabled = false;
        console.log('❌ Đăng nhập thất bại');
    }
}

// ===== HÀM ĐĂNG XUẤT =====
function logoutFromAdmin() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('CurrentUser');
        window.location.href = 'index.html';
    }
}

// ===== TỰ ĐỘNG KIỂM TRA KHI TRANG LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Trang admin đã load');
    
    // Kiểm tra sau 1 giây để đảm bảo mọi thứ đã sẵn sàng
    setTimeout(() => {
        console.log('🔍 Kiểm tra đăng nhập admin...');
        
        if (!isAdminLoggedIn()) {
            console.log('🚨 CHƯA ĐĂNG NHẬP - HIỆN FORM ĐĂNG NHẬP');
            showAdminLogin();
        } else {
            console.log('✅ ĐÃ ĐĂNG NHẬP ADMIN - HIỂN THỊ NỘI DUNG');
        }
    }, 1000);
});