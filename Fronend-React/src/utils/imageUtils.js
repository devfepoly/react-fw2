// API Base URL
export const API_BASE_URL = 'http://localhost:3000';
export const API_URL = `${API_BASE_URL}/api`;

/**
 * Get full image URL from relative path
 * @param {string} imagePath - Relative image path (e.g., "/uploads/image.jpg" or "image.jpg")
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';

    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If starts with /, add base URL
    if (imagePath.startsWith('/')) {
        return `${API_BASE_URL}${imagePath}`;
    }

    // If just a filename (no path), assume it's in /images/ folder (legacy)
    if (!imagePath.includes('/')) {
        return `${API_BASE_URL}/images/${imagePath}`;
    }

    // Otherwise, add base URL with /
    return `${API_BASE_URL}/${imagePath}`;
};

/**
 * Get placeholder image URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Placeholder URL
 */
export const getPlaceholderImage = (width = 300, height = 300) => {
    return `https://via.placeholder.com/${width}x${height}?text=No+Image`;
};
