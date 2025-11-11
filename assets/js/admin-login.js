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
    
`
`
/* ... (giữ nguyên CSS cũ) ... */

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
    
    #adminLogoutBtn {
        top: 10px !important;
        right: 10px !important;
        padding: 10px 15px !important;
        font-size: 12px !important;
    }
}
`;

// ===== QUẢN LÝ TRẠNG THÁI ĐĂNG NHẬP =====
const ADMIN_SESSION_KEY = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 giờ

// Hàm lưu trạng thái đăng nhập
function saveAdminSession(user) {
    const sessionData = {
        user: user,
        loginTime: new Date().getTime(),
        expires: new Date().getTime() + SESSION_DURATION
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem('CurrentUser', JSON.stringify(user));
    console.log('✅ Đã lưu session admin');
}

// Hàm kiểm tra session còn hiệu lực không
function isSessionValid() {
    try {
        const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
        if (!sessionStr) return false;
        
        const session = JSON.parse(sessionStr);
        const now = new Date().getTime();
        
        if (now > session.expires) {
            clearAdminSession();
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Lỗi kiểm tra session:', error);
        return false;
    }
}

// Hàm xóa session
function clearAdminSession() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem('CurrentUser');
    console.log('✅ Đã xóa session admin');
}

// ===== HÀM HIỂN THỊ FORM ĐĂNG NHẬP =====
function showAdminLogin() {
    console.log('🎯 BẮT ĐẦU HIỆN FORM ĐĂNG NHẬP...');
    
    // ẨN TOÀN BỘ NỘI DUNG ADMIN
    const adminElements = document.querySelectorAll('.admin-container, .headerbar, .sidebar, footer');
    adminElements.forEach(el => {
        if (el) {
            el.style.display = 'none';
            console.log('✅ Đã ẩn:', el.className || el.tagName);
        }
    });

    // THÊM CSS VÀO HEAD
    if (!document.querySelector('#admin-login-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'admin-login-styles';
        styleElement.textContent = adminLoginStyles;
        document.head.appendChild(styleElement);
        console.log('✅ Đã thêm CSS vào head');
    }

    // TẠO FORM ĐĂNG NHẬP
    const loginHTML = `
        <div class="admin-login-overlay" id="adminLoginOverlay">
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
                </div>
            </div>
        </div>
    `;

    // Thêm vào body
    document.body.insertAdjacentHTML('beforeend', loginHTML);
    console.log('✅ Đã thêm form đăng nhập vào body');

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

    // Hiển thị loading với hiệu ứng đẹp
    const originalText = button.innerHTML;
    button.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <div class="loading-spinner" style="
                width: 18px;
                height: 18px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top: 2px solid white;
                animation: spin 1s linear infinite;
            "></div>
            Đang đăng nhập...
        </div>
    `;
    button.disabled = true;

    // Thêm CSS animation cho loading
    if (!document.querySelector('#loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Kiểm tra đăng nhập
    const adminUser = adminLogin(username, password);
    console.log('Kết quả adminLogin:', adminUser);

    if (adminUser) {
        // LƯU SESSION VÀ TRẠNG THÁI ĐĂNG NHẬP
        saveAdminSession(adminUser);
        
        console.log('✅ ĐĂNG NHẬP THÀNH CÔNG - ĐÃ LƯU SESSION');
        
        // HIỆN LẠI TOÀN BỘ NỘI DUNG ADMIN
        const adminElements = document.querySelectorAll('.admin-container, .headerbar, .sidebar, footer');
        adminElements.forEach(el => {
            if (el) el.style.display = '';
        });
        
        // Ẩn form đăng nhập
        const loginOverlay = document.querySelector('.admin-login-overlay');
        if (loginOverlay) loginOverlay.remove();
        
        // Thông báo thành công
        button.innerHTML = 'Đăng nhập thành công!';
        
        // Reload để kích hoạt toàn bộ tính năng admin
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
// ===== HÀM KIỂM TRA ĐĂNG NHẬP =====
function adminLogin(username, password) {
    try {
        const list = JSON.parse(localStorage.getItem('ListUser')) || [];
        console.log('Danh sách user từ localStorage:', list);

        // Tìm user với role admin
        const adminUser = list.find(u => {
            const usernameMatch = u.username === username || u.email === username;
            const passwordMatch = u.pass === password;
            const roleMatch = u.role === 'admin';
            
            return usernameMatch && passwordMatch && roleMatch;
        });

        console.log('User tìm thấy:', adminUser);
        return adminUser || null;
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        return null;
    }
}

// ===== HÀM KIỂM TRA ĐÃ ĐĂNG NHẬP CHƯA =====
function isAdminLoggedIn() {
    try {
        // Kiểm tra session trước
        if (!isSessionValid()) {
            console.log('❌ Session không hợp lệ hoặc đã hết hạn');
            return false;
        }
        
        const currentUserStr = localStorage.getItem('CurrentUser');
        if (!currentUserStr) {
            console.log('❌ Không có CurrentUser trong localStorage');
            return false;
        }
        
        const currentUser = JSON.parse(currentUserStr);
        const isAdmin = !!(currentUser && currentUser.role === 'admin');
        
        console.log('🔍 Kiểm tra đăng nhập:', {
            cóCurrentUser: !!currentUserStr,
            role: currentUser?.role,
            isAdmin: isAdmin
        });
        
        return isAdmin;
    } catch (error) {
        console.error('Lỗi khi kiểm tra đăng nhập:', error);
        return false;
    }
}

// ===== HÀM ĐĂNG XUẤT =====
function logoutFromAdmin() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        clearAdminSession();
        console.log('🚪 Đã đăng xuất - Chuyển về trang chủ');
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

// ===== KIỂM TRA VÀ KHỞI TẠO TÀI KHOẢN ADMIN MẪU =====
function ensureAdminAccount() {
    const list = JSON.parse(localStorage.getItem('ListUser')) || [];
    const hasAdmin = list.some(u => u.role === 'admin');
    
    if (!hasAdmin) {
        const adminAccount = {
            username: 'admin',
            email: 'admin@saigonphone.com',
            pass: 'admin123',
            role: 'admin',
            fullName: 'Quản Trị Viên'
        };
        list.push(adminAccount);
        localStorage.setItem('ListUser', JSON.stringify(list));
        console.log('👤 Đã tạo tài khoản admin mẫu: admin / admin123');
    } else {
        console.log('✅ Đã có tài khoản admin');
    }
}

// ===== TỰ ĐỘNG CHẠY KHI TRANG LOAD =====
console.log('=== ADMIN LOGIN JS ĐÃ LOAD ===');

// Đảm bảo có tài khoản admin
ensureAdminAccount();

// Kiểm tra trạng thái đăng nhập khi trang load
window.addEventListener('load', function() {
    console.log('🔄 TRANG ĐÃ LOAD HOÀN TOÀN');
    
    setTimeout(() => {
        console.log('🔍 KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP...');
        console.log('isAdminLoggedIn():', isAdminLoggedIn());
        
        if (!isAdminLoggedIn()) {
            console.log('🚨 CHƯA ĐĂNG NHẬP - HIỆN FORM ĐĂNG NHẬP');
            showAdminLogin();
        } else {
            console.log('✅ ĐÃ ĐĂNG NHẬP - HIỆN NỘI DUNG ADMIN');
        }
    }, 500);
});

// Backup - kiểm tra lại sau 2 giây
setTimeout(() => {
    console.log('🕒 KIỂM TRA BACKUP SAU 2 GIÂY...');
    if (!isAdminLoggedIn() && !document.querySelector('.admin-login-overlay')) {
        console.log('🚨 VẪN CHƯA ĐĂNG NHẬP - HIỆN FORM LẦN 2');
        showAdminLogin();
    }
}, 2000);
// ===== TẠO NÚT ĐĂNG XUẤT TRÊN GIAO DIỆN ADMIN =====
function addLogoutButton() {
    // Kiểm tra xem đã có nút đăng xuất chưa
    if (document.getElementById('adminLogoutBtn')) return;
    
    // Tạo nút đăng xuất
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'adminLogoutBtn';
    logoutBtn.innerHTML = '🚪 Đăng xuất';
    logoutBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        z-index: 9999;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        transition: all 0.3s ease;
        border: 2px solid rgba(255, 255, 255, 0.1);
    `;
    
    // Hiệu ứng hover
    logoutBtn.onmouseover = function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)';
    };
    
    logoutBtn.onmouseout = function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.3)';
    };
    
    logoutBtn.onclick = function() {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            clearAdminSession();
            window.location.reload();
        }
    };
    
    document.body.appendChild(logoutBtn);
}
// Thêm vào cuối file
if (isAdminLoggedIn()) {
    setTimeout(addLogoutButton, 1000);
}