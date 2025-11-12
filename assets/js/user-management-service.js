// ===== SERVICE QUẢN LÝ NGƯỜI DÙNG CHO ADMIN =====
const UserManagementService = {
    // Lấy tất cả users (ẩn password)
    getAllUsers() {
        const users = StorageManager.getUsers();
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    },

    // Khóa/mở tài khoản
    toggleUserStatus(userId) {
        const users = StorageManager.getUsers();
        const userIndex = users.findIndex(user => user.id === parseInt(userId));
        
        if (userIndex === -1) return false;

        const user = users[userIndex];
        
        // Không cho khóa admin
        if (user.role === 'admin') {
            alert('Không thể khóa tài khoản quản trị viên!');
            return false;
        }

        const newStatus = user.status === 'locked' ? 'active' : 'locked';
        users[userIndex].status = newStatus;
        StorageManager.saveUsers(users);

        // Đăng xuất user nếu bị khóa
        if (newStatus === 'locked') {
            const currentUser = StorageManager.getCurrentUser();
            if (currentUser && currentUser.id === parseInt(userId)) {
                StorageManager.clearCurrentUser();
                // Chuyển hướng về trang chủ nếu đang ở admin
                if (window.location.pathname.includes('admin.html')) {
                    window.location.href = 'index.html';
                }
            }
        }

        return true;
    },

    // Thống kê users
    getUserStats() {
        const users = this.getAllUsers();
        return {
            total: users.length,
            active: users.filter(u => u.status === 'active').length,
            locked: users.filter(u => u.status === 'locked').length,
            admins: users.filter(u => u.role === 'admin').length,
            customers: users.filter(u => u.role === 'user').length
        };
    }
};

window.UserManagementService = UserManagementService;