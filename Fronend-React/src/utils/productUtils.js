export const getEffectivePrice = (product = {}) => {
    const salePrice = Number(product.gia_km);
    const basePrice = Number(product.gia);

    if (!Number.isNaN(salePrice) && salePrice > 0) {
        return salePrice;
    }

    if (Number.isNaN(basePrice) || basePrice <= 0) {
        return 0;
    }

    return basePrice;
};

export const filterProducts = (products = [], {
    categoryId = null,
    minPrice = '',
    maxPrice = '',
    searchTerm = '',
    onlyHot = false,
    onlyDiscount = false,
} = {}) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const min = minPrice !== '' ? Number(minPrice) : null;
    const max = maxPrice !== '' ? Number(maxPrice) : null;

    return products.filter((product) => {
        const matchesCategory = categoryId ? product.id_loai === categoryId : true;
        const price = getEffectivePrice(product);
        const matchesMin = min !== null ? price >= min : true;
        const matchesMax = max !== null ? price <= max : true;
        const matchesSearch = normalizedSearch
            ? product.ten_sp?.toLowerCase().includes(normalizedSearch)
            : true;
        const matchesHot = onlyHot ? product.hot === 1 : true;
        const matchesDiscount = onlyDiscount ? (Number(product.gia_km) || 0) > 0 : true;

        return matchesCategory && matchesMin && matchesMax && matchesSearch && matchesHot && matchesDiscount;
    });
};

export const sortProducts = (products = [], sortBy = 'newest') => {
    const sorted = [...products];

    switch (sortBy) {
        case 'price-asc':
            return sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        case 'price-desc':
            return sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        case 'popular':
            return sorted.sort((a, b) => (b.luot_xem || 0) - (a.luot_xem || 0));
        case 'name-asc':
            return sorted.sort((a, b) => a.ten_sp.localeCompare(b.ten_sp));
        case 'name-desc':
            return sorted.sort((a, b) => b.ten_sp.localeCompare(a.ten_sp));
        case 'newest':
        default:
            return sorted.sort((a, b) => new Date(b.ngay) - new Date(a.ngay));
    }
};
