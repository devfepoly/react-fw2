import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// ===== API CLIENT =====
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Tự động gắn token vào mỗi request
api.interceptors.request.use(
    (config) => {
        try {
            const tokenString = localStorage.getItem('token');
            if (tokenString) {
                // Token được lưu dưới dạng JSON, cần parse
                const token = JSON.parse(tokenString);
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch {
            // Nếu token không parse được, thử lấy trực tiếp
            const token = localStorage.getItem('token');
            if (token && token !== 'undefined' && token !== 'null') {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý lỗi response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Chỉ log lỗi 401, không tự động redirect
        // Để component tự xử lý việc redirect
        if (error.response?.status === 401) {
            console.warn('API 401 Error - Token invalid or expired:', error.config?.url);
            // Không xóa localStorage ở đây vì có thể gây race condition
            // Để AuthContext xử lý việc logout
        }
        return Promise.reject(error);
    }
);

// ===== LOẠI SẢN PHẨM API =====
export const loaiAPI = {
    getAll: () => api.get('/loai'),
    getById: (id) => api.get(`/loai/${id}`),
    create: (data) => api.post('/loai', data),
    update: (id, data) => api.put(`/loai/${id}`, data),
    delete: (id) => api.delete(`/loai/${id}`),
};

// ===== SẢN PHẨM API =====
export const sanPhamAPI = {
    getAll: (params) => api.get('/san-pham', { params }),
    getById: (id) => api.get(`/san-pham/${id}`),
    getByLoai: (idLoai) => api.get(`/san-pham/loai/${idLoai}`),
    create: (data) => api.post('/san-pham', data),
    update: (id, data) => api.put(`/san-pham/${id}`, data),
    delete: (id) => api.delete(`/san-pham/${id}`),
};

// ===== LOẠI TIN API =====
export const loaiTinAPI = {
    getAll: () => api.get('/loai-tin'),
    getById: (id) => api.get(`/loai-tin/${id}`),
    create: (data) => api.post('/loai-tin', data),
    update: (id, data) => api.put(`/loai-tin/${id}`, data),
    delete: (id) => api.delete(`/loai-tin/${id}`),
};

// ===== TIN TỨC API =====
export const tinTucAPI = {
    getAll: () => api.get('/tin-tuc'),
    getById: (id) => api.get(`/tin-tuc/${id}`),
    getByLoai: (idLoai) => api.get(`/tin-tuc/loai/${idLoai}`),
    create: (data) => api.post('/tin-tuc', data),
    update: (id, data) => api.put(`/tin-tuc/${id}`, data),
    delete: (id) => api.delete(`/tin-tuc/${id}`),
};

// ===== ĐỚN HÀNG API =====
export const donHangAPI = {
    getAll: () => api.get('/don-hang'),
    getById: (id) => api.get(`/don-hang/${id}`),
    getByUserId: (userId) => api.get(`/don-hang/user/${userId}`),
    create: (data) => api.post('/don-hang', data),
    update: (id, data) => api.put(`/don-hang/${id}`, data),
    delete: (id) => api.delete(`/don-hang/${id}`),
};

// ===== USERS API =====
export const usersAPI = {
    register: (data) => api.post('/users/register', data),
    login: (data) => api.post('/users/login', data),
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    forgotPassword: (email) => api.post('/users/forgot-password', { email }),
    verifyOTP: (email, otp) => api.post('/users/verify-otp', { email, otp }),
    resetPassword: (resetToken, newPassword) => api.post('/users/reset-password', { resetToken, newPassword }),
};

// ===== UPLOAD API =====
export const uploadAPI = {
    uploadSingle: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload/single', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadMultiple: async (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        return api.post('/upload/multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteImage: (filename) => api.delete(`/upload/${filename}`),
    getAllImages: () => api.get('/upload'),
};

export default api;
