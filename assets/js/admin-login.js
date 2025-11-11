// ===== ADMIN LOGIN STYLES =====
const adminLoginStyles = `
/* ... (giữ nguyên styles) ... */
`;

// ===== QUẢN LÝ TRẠNG THÁI ĐĂNG NHẬP =====
const ADMIN_SESSION_KEY = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 giờ

// Hàm lưu trạng thái đăng nhập ADMIN - KHÔNG ĐỤNG ĐẾN CurrentUser
function saveAdminSession(user) {
    const sessionData = {
        user: user,
        loginTime: new Date().getTime(),
        expires: new Date().getTime() + SESSION_DURATION
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
    
    // 🚨 QUAN TRỌNG: KHÔNG lưu vào CurrentUser để tránh xung đột
    console.log('✅ Đã lưu session admin (không động đến CurrentUser)');
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

// Hàm xóa session - CHỈ XÓA ADMIN SESSION
function clearAdminSession() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    console.log('✅ Đã xóa session admin (giữ nguyên CurrentUser)');
}

// ===== HÀM HIỂN THỊ FORM ĐĂNG NHẬP =====
function showAdminLogin() {
    console.log('🎯 BẮT ĐẦU HIỆN FORM ĐĂNG NHẬP ADMIN...');
    
    // ẨN TOÀN BỘ NỘI DUNG ADMIN
    const adminElements = document.querySelectorAll('.admin-container, .headerbar, .sidebar, footer');
    adminElements.forEach(el => {
        if (el) {
            el.style.display = 'none';
        }
    });

    // THÊM CSS VÀO HEAD
    if (!document.querySelector('#admin-login-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'admin-login-styles';
        styleElement.textContent = adminLoginStyles;
        document.head.appendChild(styleElement);
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
                    <button type="submit" class="login-btn">Đăng nhập Admin</button>
                    <div id="adminLoginError" class="login-error">Sai tài khoản hoặc mật khẩu!</div>
                </form>
                <div style="text-align:center; margin-top:15px; font-size:12px; color:#666;">
                    <p><strong>Lưu ý:</strong> Đây là trang quản trị, không dùng tài khoản người dùng thường</p>
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

    console.log('🔐 Đang đăng nhập ADMIN với:', { username, password });

    // Ẩn thông báo lỗi cũ
    errorDiv.style.display = 'none';

    // Hiển thị loading
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
        style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }

    // Kiểm tra đăng nhập
    const adminUser = adminLogin(username, password);

    if (adminUser) {
        // LƯU SESSION ADMIN - KHÔNG ĐỘNG ĐẾN CurrentUser
        saveAdminSession(adminUser);
        
        console.log('✅ ĐĂNG NHẬP ADMIN THÀNH CÔNG');
        
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
        console.log('❌ Đăng nhập admin thất bại');
    }
}

// ===== HÀM KIỂM TRA ĐĂNG NHẬP ADMIN =====
function adminLogin(username, password) {
    try {
        const userList = JSON.parse(localStorage.getItem('userList')) || [];
        
        console.log('🔍 Tìm admin trong userList:', userList);

        // Tìm user với role admin - CHỈ CHO PHÉP ADMIN
        const adminUser = userList.find(u => {
            const usernameMatch = u.username === username || u.email === username;
            const passwordMatch = u.password === password || u.pass === password;
            const roleMatch = u.role === 'admin'; // 🚨 CHỈ ADMIN
            const statusActive = u.status === 'active' || u.status === undefined;
            
            return usernameMatch && passwordMatch && roleMatch && statusActive;
        });

        if (adminUser) {
            console.log('✅ Tìm thấy admin:', adminUser.username);
            return {
                id: adminUser.id,
                fullName: adminUser.fullname || adminUser.fullName,
                username: adminUser.username,
                email: adminUser.email,
                phone: adminUser.phone,
                password: adminUser.password || adminUser.pass,
                status: adminUser.status || 'active',
                address: adminUser.address || '',
                role: 'admin'
            };
        } else {
            console.log('❌ Không tìm thấy admin hoặc không phải quyền admin');
            return null;
        }
        
    } catch (error) {
        console.error('Lỗi khi đăng nhập admin:', error);
        return null;
    }
}

// ===== HÀM KIỂM TRA ĐÃ ĐĂNG NHẬP ADMIN CHƯA =====
function isAdminLoggedIn() {
    try {
        // Chỉ kiểm tra admin session, không kiểm tra CurrentUser
        if (!isSessionValid()) {
            console.log('❌ Admin session không hợp lệ');
            return false;
        }
        
        const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
        if (!sessionStr) return false;
        
        const session = JSON.parse(sessionStr);
        const isAdmin = !!(session.user && session.user.role === 'admin');
        
        console.log('🔍 Kiểm tra admin login:', {
            cóAdminSession: !!sessionStr,
            role: session.user?.role,
            isAdmin: isAdmin
        });
        
        return isAdmin;
    } catch (error) {
        console.error('Lỗi khi kiểm tra admin login:', error);
        return false;
    }
}

// ===== HÀM ĐĂNG XUẤT ADMIN =====
function logoutFromAdmin() {
    if (confirm('Bạn có chắc muốn đăng xuất khỏi admin?')) {
        clearAdminSession();
        console.log('🚪 Đã đăng xuất admin - Chuyển về trang chủ');
        window.location.href = 'index.html';
    }
}

// ===== KIỂM TRA VÀ KHỞI TẠO TÀI KHOẢN ADMIN MẪU =====
function ensureAdminAccount() {
    const userList = JSON.parse(localStorage.getItem('userList')) || [];
    
    const hasAdmin = userList.some(u => u.role === 'admin');
    
    if (!hasAdmin) {
        const adminAccount = {
            id: "AD01",
            username: 'admin',
            email: 'admin@saigonphone.com',
            password: 'admin123',
            fullname: 'Quản Trị Viên',
            phone: '0123456789',
            status: 'active',
            address: '',
            role: 'admin'
        };
        
        userList.push(adminAccount);
        localStorage.setItem('userList', JSON.stringify(userList));
        
        console.log('👤 Đã tạo tài khoản admin mẫu: admin / admin123');
    } else {
        console.log('✅ Đã có tài khoản admin');
    }
}

// ===== KIỂM TRA TRANG ADMIN VÀ CHUYỂN HƯỚNG =====
function checkAdminPageAccess() {
    // Nếu đang ở trang admin.html mà chưa đăng nhập admin
    if (window.location.pathname.includes('admin.html') && !isAdminLoggedIn()) {
        console.log('🚫 Truy cập trái phép vào admin - Chuyển hướng...');
        window.location.href = 'index.html';
        return false;
    }
    
    // Nếu đang ở trang admin.html và đã đăng nhập admin
    if (window.location.pathname.includes('admin.html') && isAdminLoggedIn()) {
        console.log('✅ Đã đăng nhập admin - Cho phép truy cập');
        return true;
    }
    
    return true;
}

// ===== TỰ ĐỘNG CHẠY KHI TRANG LOAD =====
console.log('=== ADMIN LOGIN JS ĐÃ LOAD ===');

// Đảm bảo có tài khoản admin
ensureAdminAccount();

// Kiểm tra và xử lý khi trang load
window.addEventListener('load', function() {
    console.log('🔄 TRANG ADMIN ĐÃ LOAD HOÀN TOÀN');
    
    // Kiểm tra quyền truy cập trang admin
    if (!checkAdminPageAccess()) {
        return;
    }
    
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