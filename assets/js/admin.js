document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("adminLoginForm");
  const loginSection = document.getElementById("admin-login");
  const dashboard = document.getElementById("admin-dashboard");
  const message = document.getElementById("loginMessage");

  const adminAccount = { username: "admin", password: "12345" };

  // Xử lý đăng nhập
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("adminUser").value.trim();
    const pass = document.getElementById("adminPass").value.trim();

    if (user === adminAccount.username && pass === adminAccount.password) {
      localStorage.setItem("adminLoggedIn", "true");
      loginSection.style.display = "none";
      dashboard.style.display = "block";
    } else {
      message.textContent = "Sai tên đăng nhập hoặc mật khẩu!";
      message.style.color = "red";
    }
  });

  // Kiểm tra nếu đã đăng nhập trước đó
  if (localStorage.getItem("adminLoggedIn") === "true") {
    loginSection.style.display = "none";
    dashboard.style.display = "block";
  }

  // Đăng xuất
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("adminLoggedIn");
    dashboard.style.display = "none";
    loginSection.style.display = "block";
  });

  // Chuyển giữa các section trong dashboard
  const buttons = document.querySelectorAll(".admin-menu button");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.section;
      document.querySelectorAll(".admin-section").forEach(sec => sec.style.display = "none");
      document.getElementById(`section-${target}`).style.display = "block";
    });
  });
});
