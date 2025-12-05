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
 * Get placeholder image (SVG Data URI)
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Placeholder data URI
 */
export const getPlaceholderImage = (width = 300, height = 300) => {
    // Generate SVG placeholder instead of external service
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">
                No Image
            </text>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};
