import { usersAPI } from './api';

// Storage helpers
const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return localStorage.getItem(key);
        }
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },
    clear: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
};

// Auth service
export const authService = {
    // Login
    login: async (email, password) => {
        try {
            const response = await usersAPI.login({ email, password });

            if (response.data?.success) {
                const { user, accessToken } = response.data.data;
                storage.set('user', user);
                storage.set('token', accessToken);
                return { success: true, user };
            }

            return { success: false, message: response.data?.message || 'Đăng nhập thất bại' };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập'
            };
        }
    },

    // Register
    register: async (userData) => {
        try {
            const response = await usersAPI.register({
                email: userData.email,
                mat_khau: userData.password,
                ho_ten: userData.ho_ten,
                dien_thoai: userData.dien_thoai || '',
                dia_chi: userData.dia_chi || ''
            });

            if (response.data?.success) {
                const { user, accessToken } = response.data.data;
                storage.set('user', user);
                storage.set('token', accessToken);
                return { success: true, user };
            }

            return { success: false, message: response.data?.message || 'Đăng ký thất bại' };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký'
            };
        }
    },

    // Logout
    logout: () => {
        storage.clear();
    },

    // Get current user
    getCurrentUser: () => {
        return storage.get('user');
    },

    // Get token
    getToken: () => {
        return storage.get('token');
    },

    // Check if authenticated
    isAuthenticated: () => {
        return !!(storage.get('user') && storage.get('token'));
    },

    // Check if user is admin
    isAdmin: () => {
        const user = storage.get('user');
        return user?.vai_tro === 1;
    }
};

export default authService;
