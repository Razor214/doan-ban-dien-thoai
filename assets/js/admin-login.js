// ===== QUẢN LÝ TRẠNG THÁI ĐĂNG NHẬP =====
const ADMIN_SESSION_KEY = 'admin_session';
const ADMIN_LOGIN_TIME = 'admin_login_time';
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
            // Session hết hạn
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

// ===== HÀM KIỂM TRA ĐÃ ĐĂNG NHẬP CHƯA ===== (SỬA LẠI)
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

// ===== HÀM XỬ LÝ ĐĂNG NHẬP ===== (SỬA LẠI)
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
    console.log('Kết quả adminLogin:', adminUser);

    if (adminUser) {
        // LƯU SESSION VÀ TRẠNG THÁI ĐĂNG NHẬP
        saveAdminSession(adminUser);
        
        console.log('✅ ĐĂNG NHẬP THÀNH CÔNG - ĐÃ LƯU SESSION');
        console.log('Kiểm tra lại isAdminLoggedIn():', isAdminLoggedIn());
        
        // === HIỆN LẠI TOÀN BỘ NỘI DUNG ADMIN ===
        const adminElements = document.querySelectorAll('.admin-container, .headerbar, .sidebar, footer');
        adminElements.forEach(el => {
            if (el) el.style.display = '';
        });
        
        // Ẩn form đăng nhập
        const loginOverlay = document.querySelector('.admin-login-overlay');
        if (loginOverlay) loginOverlay.remove();
        
        // Thông báo thành công
        button.innerHTML = 'Đăng nhập thành công!';
        
        // Tự động chuyển sau 1 giây
        setTimeout(() => {
            console.log('🔄 Tự động vào admin...');
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

// ===== HÀM ĐĂNG XUẤT ===== (SỬA LẠI)
function logoutFromAdmin() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        clearAdminSession();
        console.log('🚪 Đã đăng xuất - Chuyển về trang chủ');
        window.location.href = 'index.html';
    }
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

// ===== TỰ ĐỘNG CHẠY KHI TRANG LOAD ===== (SỬA LẠI)
console.log('=== ADMIN LOGIN JS ĐÃ LOAD ===');

window.addEventListener('load', function() {
    console.log('🔄 TRANG ĐÃ LOAD HOÀN TOÀN');
    
    // Đảm bảo có tài khoản admin
    ensureAdminAccount();
    
    // Kiểm tra trạng thái đăng nhập
    setTimeout(() => {
        console.log('🔍 KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP...');
        console.log('isAdminLoggedIn():', isAdminLoggedIn());
        
        if (!isAdminLoggedIn()) {
            console.log('🚨 CHƯA ĐĂNG NHẬP - HIỆN FORM ĐĂNG NHẬP');
            showAdminLogin();
        } else {
            console.log('✅ ĐÃ ĐĂNG NHẬP - HIỆN NỘI DUNG ADMIN');
            // Đảm bảo nội dung admin được hiển thị
            const adminElements = document.querySelectorAll('.admin-container, .headerbar, .sidebar, footer');
            adminElements.forEach(el => {
                if (el) el.style.display = '';
            });
        }
    }, 1000);
});

// Backup - kiểm tra lại sau 3 giây
setTimeout(() => {
    console.log('🕒 KIỂM TRA BACKUP SAU 3 GIÂY...');
    if (!isAdminLoggedIn() && !document.querySelector('.admin-login-overlay')) {
        console.log('🚨 VẪN CHƯA ĐĂNG NHẬP - HIỆN FORM LẦN 2');
        showAdminLogin();
    }
}, 3000);