// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Cache API responses
const cache = new Map();

export const getCachedData = (key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        // 5 minutes
        return cached.data;
    }
    return null;
};

export const setCachedData = (key, data) => {
    cache.set(key, {
        data,
        timestamp: Date.now(),
    });
};

export const clearCache = (key) => {
    if (key) {
        cache.delete(key);
    } else {
        cache.clear();
    }
};
