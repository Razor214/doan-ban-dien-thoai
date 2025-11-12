// ===== SERVICE XỬ LÝ ĐĂNG NHẬP/ĐĂNG KÝ =====
const AuthService = {
    // Đăng nhập với kiểm tra trạng thái tài khoản
    login(credentials) {
        const user = StorageManager.getUserByUsernameOrEmail(credentials.username);
        
        if (!user) {
            return { success: false, message: 'Tên đăng nhập hoặc email không tồn tại!' };
        }

        if (!StorageManager.verifyPassword(credentials.password, user.password)) {
            return { success: false, message: 'Mật khẩu không đúng!' };
        }

        if (user.status === 'locked') {
            return { success: false, message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' };
        }

        // Đăng nhập thành công
        StorageManager.setCurrentUser(user);
        return { success: true, user };
    },

    // Đăng ký tài khoản mới
    register(userData) {
        const existingUser = StorageManager.getUserByUsernameOrEmail(userData.username) || 
                           StorageManager.getUserByUsernameOrEmail(userData.email);
        
        if (existingUser) {
            return { success: false, message: 'Tên đăng nhập hoặc email đã tồn tại!' };
        }

        const newUser = {
            id: StorageManager.generateId(),
            ...userData,
            password: StorageManager.hashPassword(userData.password),
            role: 'user',
            status: 'active',
            createdAt: new Date().toISOString()
        };

        const users = StorageManager.getUsers();
        users.push(newUser);
        StorageManager.saveUsers(users);

        return { success: true, user: newUser };
    },

    logout() {
        StorageManager.clearCurrentUser();
        return { success: true };
    },

    // Cập nhật thông tin user
    updateProfile(userId, updates) {
        const users = StorageManager.getUsers();
        const userIndex = users.findIndex(user => user.id === parseInt(userId));
        
        if (userIndex === -1) {
            return { success: false, message: 'Người dùng không tồn tại!' };
        }

        users[userIndex] = { ...users[userIndex], ...updates };
        StorageManager.saveUsers(users);

        // Cập nhật currentUser nếu đang chỉnh sửa chính mình
        const currentUser = StorageManager.getCurrentUser();
        if (currentUser && currentUser.id === parseInt(userId)) {
            StorageManager.setCurrentUser(users[userIndex]);
        }

        return { success: true };
    },

    // Đổi mật khẩu
    changePassword(userId, currentPassword, newPassword) {
        const users = StorageManager.getUsers();
        const userIndex = users.findIndex(user => user.id === parseInt(userId));
        
        if (userIndex === -1) {
            return { success: false, message: 'Người dùng không tồn tại!' };
        }

        const user = users[userIndex];
        if (!StorageManager.verifyPassword(currentPassword, user.password)) {
            return { success: false, message: 'Mật khẩu hiện tại không đúng!' };
        }

        users[userIndex].password = StorageManager.hashPassword(newPassword);
        StorageManager.saveUsers(users);

        return { success: true };
    }
};

window.AuthService = AuthService;