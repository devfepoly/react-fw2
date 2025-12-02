/**
 * Routes Configuration
 * Cấu trúc routes theo chuẩn React-Express với phân quyền rõ ràng
 */

// ============ HOME TEMPLATE ROUTES ============
export const homeRoutes = [
    { path: '/', name: 'Home', component: 'Home' },
    { path: 'products', name: 'Products', component: 'Products' },
    { path: 'category/:id', name: 'CategoryProducts', component: 'Products' },
    { path: 'product/:id', name: 'ProductDetail', component: 'ProductDetail' },
    { path: 'news', name: 'News', component: 'News' },
    { path: 'news/:id', name: 'NewsDetail', component: 'News' },
    { path: 'cart', name: 'Cart', component: 'Cart' },
    { path: 'compare', name: 'Compare', component: 'Compare' },
    { path: 'order-history', name: 'OrderHistory', component: 'OrderHistory', requireAuth: true },
    { path: 'contact', name: 'Contact', component: 'Contact' },
    { path: 'about', name: 'About', component: 'About' },
    { path: '*', name: 'NotFound', component: 'NotFound' }
];

// ============ AUTH TEMPLATE ROUTES ============
export const authRoutes = [
    { path: 'login', name: 'Login', component: 'Login', guestOnly: true },
    { path: 'register', name: 'Register', component: 'Register', guestOnly: true },
    { path: 'forgot-password', name: 'ForgotPassword', component: 'ForgotPassword', guestOnly: true }
];

// ============ ADMIN TEMPLATE ROUTES ============
export const adminRoutes = [
    { path: '', name: 'Dashboard', component: 'Dashboard', requireAuth: true, requiredRole: 'admin' },
    { path: 'products', name: 'AdminProducts', component: 'Products', requireAuth: true, requiredRole: 'admin' },
    { path: 'products/create', name: 'AdminProductCreate', component: 'Products/ProductForm', requireAuth: true, requiredRole: 'admin' },
    { path: 'products/edit/:id', name: 'AdminProductEdit', component: 'Products/ProductForm', requireAuth: true, requiredRole: 'admin' },
    { path: 'orders', name: 'AdminOrders', component: 'Orders', requireAuth: true, requiredRole: 'admin' },
    { path: 'orders/:id', name: 'AdminOrderDetail', component: 'Orders/OrderDetail', requireAuth: true, requiredRole: 'admin' },
    { path: 'categories', name: 'AdminCategories', component: 'Categories', requireAuth: true, requiredRole: 'admin' },
    { path: 'news', name: 'AdminNews', component: 'News', requireAuth: true, requiredRole: 'admin' },
    { path: 'news/create', name: 'AdminNewsCreate', component: 'News/NewsForm', requireAuth: true, requiredRole: 'admin' },
    { path: 'news/edit/:id', name: 'AdminNewsEdit', component: 'News/NewsForm', requireAuth: true, requiredRole: 'admin' },
    { path: 'users', name: 'AdminUsers', component: 'Users', requireAuth: true, requiredRole: 'admin' }
];

// ============ ROUTE ROLES CONFIG ============
export const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
};

export default {
    homeRoutes,
    authRoutes,
    adminRoutes,
    ROLES
};
