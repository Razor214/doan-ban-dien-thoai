
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userArea = document.getElementById('userArea');

  // Helper: render UI cho user area
function renderUserArea() {
  const userArea = document.getElementById("userArea");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && (currentUser.fullName || currentUser.username)) {
    // Đã đăng nhập
    const displayName = currentUser.fullName || currentUser.username;
    userArea.innerHTML = `
      <div class="user-dropdown">
        <div class="user-trigger">
          <i class="fa-solid fa-user"></i>
          <span>${displayName}</span>
        </div>
        <div class="dropdown-content">
          <a href="user.html?tab=profile">Hồ sơ cá nhân</a>
          <a href="#" id="logoutBtn">Đăng xuất</a>
        </div>
      </div>
    `;
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.reload();
    });
  } else {
    // Chưa đăng nhập
    userArea.innerHTML = `
      <a class="icon-btn" href="user.html?tab=login">
        <i class="fa-solid fa-user"></i>
        <span>Đăng nhập</span>
      </a>
    `;
  }
}


  renderUserArea();
});