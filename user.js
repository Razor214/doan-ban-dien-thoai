document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const homeSection = document.getElementById('home-section');
    const logoutBtn = document.getElementById('logout-btn');
    const messageDiv = document.getElementById('login-message');
    const welcomeText = document.getElementById('welcome-text');

    // Kiểm tra đã đăng nhập chưa
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const username = localStorage.getItem('username');
        showHomePage(username);
    }

    // Xử lý đăng nhập
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Kiểm tra đăng nhập (tạm thời dùng tài khoản mẫu)
        if ((username === 'admin' && password === '123456') || 
            (username === 'user' && password === 'password')) {
            
            // Lưu trạng thái đăng nhập
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Hiển thị trang chủ
            showHomePage(username);
            
        } else {
            showMessage('Sai tên đăng nhập hoặc mật khẩu!', 'error');
        }
    });

    // Xử lý đăng xuất
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        homeSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
        loginForm.reset();
    });

    function showHomePage(username) {
        loginSection.classList.add('hidden');
        homeSection.classList.remove('hidden');
        welcomeText.textContent = `Xin chào, ${username}!`;
    }

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type;
    }
});