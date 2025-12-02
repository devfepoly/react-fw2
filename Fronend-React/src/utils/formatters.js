// ===== FORMAT FUNCTIONS =====

// Format số tiền VND
export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
};

// Tính % giảm giá
export const calculateDiscountPercent = (originalPrice, discountPrice) => {
    if (!discountPrice || discountPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

// Lấy giá cuối cùng (ưu tiên giá KM)
export const getFinalPrice = (product) => {
    return product?.gia_km > 0 ? product.gia_km : product?.gia || 0;
};

// Format ngày
export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

// Format ngày giờ
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN');
};

// Rút gọn text
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// ===== VALIDATION FUNCTIONS =====

// Validate email
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate SĐT Việt Nam
export const isValidPhone = (phone) => {
    return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone);
};

// Validate mật khẩu (min 6 ký tự)
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

// ===== STORAGE FUNCTIONS =====

export const getFromStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
};

export const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
};

export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
};
