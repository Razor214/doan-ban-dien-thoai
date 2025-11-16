document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    console.log("isLoggedIn =", isLoggedIn);
    const loginScreen = document.getElementById("login-screen");

    if (isLoggedIn === "true") {
        loginScreen.classList.add("fade-out");
        setTimeout(() => {
            loginScreen.style.display = "none";
            loginScreen.classList.remove("fade-out");
        }, 500);
    } else {
        loginScreen.style.display = "flex";
    }
});

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const loginScreen = document.getElementById("login-screen");

    if (username === "admin" && password === "admin123") {
        localStorage.setItem("isLoggedIn", "true");
        loginScreen.classList.add("fade-out");
        setTimeout(() => {
            loginScreen.style.display = "none";
            loginScreen.classList.remove("fade-out");
        }, 500);
    } else {
        alert("Sai tên đăng nhập hoặc mật khẩu");
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("username").focus();
    }
}

function logout() {
    const loginScreen = document.getElementById("login-screen");

    if (confirm("Bạn có muốn đăng xuất?")) {
        localStorage.removeItem("isLoggedIn");
        loginScreen.style.display = "flex";
        location.reload();
    }
}

function togglePassword(inputId, iconElement) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = iconElement.querySelector('i');

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
        iconElement.classList.add('active');
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
        iconElement.classList.remove('active');
    }

    passwordInput.focus();
}
