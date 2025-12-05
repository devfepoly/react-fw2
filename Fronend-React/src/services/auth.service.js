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
        const hasAuth = !!(storage.get('user') && storage.get('token'));
        console.log('isAuthenticated check:', {
            hasAuth,
            user: storage.get('user'),
            token: storage.get('token') ? 'exists' : 'missing'
        });
        return hasAuth;
    },

    // Check if user is admin
    isAdmin: () => {
        const user = storage.get('user');

        // Nếu không có user, chắc chắn không phải admin
        if (!user) {
            console.log('isAdmin check: No user found');
            return false;
        }

        const vaiTro = user?.vai_tro;
        const isAdminResult = vaiTro === 1 || vaiTro === '1' || Number(vaiTro) === 1;

        console.log('🔍 isAdmin check:', {
            userKeys: Object.keys(user),
            email: user.email,
            vai_tro: vaiTro,
            type: typeof vaiTro,
            isAdminResult,
            fullUser: user
        });

        return isAdminResult;
    },

    // Debug helper - remove in production
    debugAuth: () => {
        const user = storage.get('user');
        const token = storage.get('token');
        console.log('🐛 Debug Auth:', {
            hasUser: !!user,
            hasToken: !!token,
            user: user,
            isAuth: authService.isAuthenticated(),
            isAdmin: authService.isAdmin()
        });
    }
};

export default authService;
