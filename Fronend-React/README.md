# E-commerce Frontend

> React 19 + Vite + TailwindCSS - Modern e-commerce web application

## 🚀 Quick Start
Email: admin01@gmail.com
Password: Admin12345!

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📋 Tech Stack

- **React 19** - Latest React with new features
- **Vite 7** - Next generation frontend tooling
- **TailwindCSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client

## ⚙️ Environment Setup

Tạo file `.env` trong thư mục gốc:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📁 Cấu trúc dự án

```
Fronend-React/
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images, fonts, icons
│   ├── components/         # Reusable components
│   │   ├── common/        # Common UI components
│   │   ├── layout/        # Layout components
│   │   ├── news/          # News related components
│   │   └── product/       # Product related components
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── CompareContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/             # Page components
│   │   └── HomeTemplate/ # User-facing pages
│   │       ├── Home.jsx
│   │       ├── Products.jsx
│   │       ├── ProductDetail.jsx
│   │       ├── Cart.jsx
│   │       ├── News.jsx
│   │       ├── About.jsx
│   │       ├── Contact.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── ForgotPassword.jsx
│   │       ├── Compare.jsx
│   │       ├── OrderHistory.jsx
│   │       └── NotFound.jsx
│   ├── routes/            # Route configuration
│   │   └── AppRoutes.jsx
│   ├── services/          # API services
│   │   └── api.js
│   ├── utils/             # Utility functions
│   │   ├── formatters.js
│   │   ├── productUtils.js
│   │   └── themeUtils.js
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎯 Features

### Implemented
- ✅ Product catalog with filtering
- ✅ Product detail pages
- ✅ Shopping cart
- ✅ Product comparison
- ✅ User authentication
- ✅ Order history
- ✅ News section
- ✅ Responsive design
- ✅ Dark/Light theme
- ✅ State management with Context API & Redux

### Planned
- 🔜 Admin dashboard (AdminTemplate)
- 🔜 Payment integration
- 🔜 Real-time notifications
- 🔜 Advanced search & filters

## 🔌 API Integration

Frontend kết nối với Backend API:
- Base URL: `http://localhost:3000/api`
- Xem Backend documentation để biết chi tiết endpoints

## 🎨 Component Structure

### Common Components
- `Loading` - Loading spinner
- `Pagination` - Pagination component

### Layout Components
- `Header` - Top navigation bar
- `Footer` - Page footer

### Product Components
- `ProductCard` - Product card display
- `CategoryFilter` - Category filtering

### News Components
- `NewsCard` - News article card

## 🌐 Routes

```
/ - Trang chủ
/products - Danh sách sản phẩm
/products/:id - Chi tiết sản phẩm
/cart - Giỏ hàng
/compare - So sánh sản phẩm
/news - Tin tức
/about - Giới thiệu
/contact - Liên hệ
/login - Đăng nhập
/register - Đăng ký
/forgot-password - Quên mật khẩu
/order-history - Lịch sử đơn hàng
```

## 🔒 Context Providers

- **AuthContext** - Authentication state
- **CartContext** - Shopping cart state
- **CompareContext** - Product comparison state
- **ThemeContext** - Theme (dark/light) state

## 🛠️ Development

```bash
# Development với HMR
npm run dev

# Production build
npm run build

# Lint code
npm run lint
```

## 📱 Responsive Breakpoints

TailwindCSS breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔧 Vite Configuration

- React plugin với Fast Refresh
- TailwindCSS plugin
- Path aliases (nếu cần)

## 📦 Build Output

Build files sẽ được tạo trong thư mục `dist/`

```bash
npm run build
```

## 🎯 Code Quality

ESLint được cấu hình với:
- React hooks rules
- React refresh rules
- Modern JavaScript standards

## 📝 Notes

- Sử dụng React 19 features (use, actions, optimistic updates)
- Component structure theo atomic design pattern
- Pages được tổ chức theo template (HomeTemplate cho user, AdminTemplate cho admin)
- State management kết hợp Context API và Redux Toolkit

## 🚧 Future Development

Folder `pages/AdminTemplate` sẽ được tạo sau cho:
- Admin dashboard
- Product management
- Order management
- User management
- Analytics & reports

---

**Version:** 1.0.0  
**Last Updated:** November 23, 2025
