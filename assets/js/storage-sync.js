// ===== QUẢN LÝ DỮ LIỆU TẬP TRUNG =====
const StorageManager = {
    // Keys cho từng loại dữ liệu
    KEYS: {
        USERS: 'saigonphone_users',
        CURRENT_USER: 'saigonphone_current_user',
        PRODUCTS: 'saigonphone_products',
        CATEGORIES: 'saigonphone_categories',
        ORDERS: 'saigonphone_orders',
        IMPORTS: 'saigonphone_imports',
        INVENTORY: 'saigonphone_inventory'
    },

    // ===== KHỞI TẠO DỮ LIỆU MẶC ĐỊNH =====
    initDefaultData() {
        // Chỉ tạo dữ liệu mặc định nếu chưa tồn tại
        if (!this.getUsers().length) {
            const defaultUsers = [
                {
                    id: 1,
                    username: 'admin',
                    email: 'admin@saigonphone.vn',
                    password: this.hashPassword('admin123'),
                    fullName: 'Quản Trị Viên',
                    phone: '0123456789',
                    role: 'admin',
                    status: 'active',
                    createdAt: new Date().toISOString()
                }
            ];
            this.save(this.KEYS.USERS, defaultUsers);
        }

        // Khởi tạo các dữ liệu mặc định khác nếu cần
        if (!this.getProducts().length) {
            this.save(this.KEYS.PRODUCTS, []);
        }
        if (!this.getOrders().length) {
            this.save(this.KEYS.ORDERS, []);
        }
    },

    // ===== CÁC HÀM GET/SET CƠ BẢN =====
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        this.triggerStorageEvent(key, data);
    },

    // ===== QUẢN LÝ USERS =====
    getUsers() {
        return this.get(this.KEYS.USERS) || [];
    },

    saveUsers(users) {
        this.save(this.KEYS.USERS, users);
    },

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === parseInt(id));
    },

    getUserByUsernameOrEmail(identifier) {
        const users = this.getUsers();
        return users.find(user => 
            user.username === identifier || user.email === identifier
        );
    },

    // ===== QUẢN LÝ ĐĂNG NHẬP =====
    getCurrentUser() {
        return this.get(this.KEYS.CURRENT_USER);
    },

    setCurrentUser(user) {
        // Loại bỏ password trước khi lưu
        const { password, ...userWithoutPassword } = user;
        this.save(this.KEYS.CURRENT_USER, userWithoutPassword);
    },

    clearCurrentUser() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
        this.triggerStorageEvent(this.KEYS.CURRENT_USER, null);
    },

    // ===== QUẢN LÝ SẢN PHẨM & ĐƠN HÀNG =====
    getProducts() {
        return this.get(this.KEYS.PRODUCTS) || [];
    },

    saveProducts(products) {
        this.save(this.KEYS.PRODUCTS, products);
    },

    getOrders() {
        return this.get(this.KEYS.ORDERS) || [];
    },

    saveOrders(orders) {
        this.save(this.KEYS.ORDERS, orders);
    },

    // ===== HÀM BỔ TRỢ =====
    hashPassword(password) {
        // Hash đơn giản (trong thực tế dùng bcrypt)
        return btoa(unescape(encodeURIComponent(password)));
    },

    verifyPassword(inputPassword, storedPassword) {
        return this.hashPassword(inputPassword) === storedPassword;
    },

    generateId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    },

    // ===== ĐỒNG BỘ GIỮA CÁC TAB =====
    triggerStorageEvent(key, newValue) {
        // Kích hoạt sự kiện storage để đồng bộ giữa các tab
        window.dispatchEvent(new StorageEvent('storage', {
            key: key,
            newValue: JSON.stringify(newValue),
            oldValue: localStorage.getItem(key),
            storageArea: localStorage
        }));
    },

    // Lắng nghe thay đổi từ các tab khác
    onDataChange(callback) {
        window.addEventListener('storage', function(e) {
            if (e.key && e.key.startsWith('saigonphone_')) {
                callback(e.key, e.newValue ? JSON.parse(e.newValue) : null);
            }
        });
    }
};

// Khởi tạo dữ liệu mặc định khi load
StorageManager.initDefaultData();

// Export toàn cục
window.StorageManager = StorageManager;