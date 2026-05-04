# Karigari E-Commerce Platform: File Structure Documentation

This document provides a comprehensive overview of the Karigari project's file structure, explaining the purpose and responsibilities of each directory and file.

## Root Directory Structure

```
c:\Karigari\
├── package.json
├── README.md
├── SECURITY_ALERT.md
├── backend/
├── frontend/
└── uploads/
```

### Root Level Files

- **package.json** - Root package.json (if used for monorepo management or shared scripts)
- **README.md** - Main project documentation, setup instructions, and project overview
- **backend/** - Complete backend application code (Node.js/Express API)
- **frontend/** - Complete frontend application code (React/Vite SPA)
- **uploads/** - Directory for storing uploaded files (images, documents) - may be used for static file serving

## Backend Directory Structure

```
backend/
├── package.json
├── seeder.js
├── server.js
├── vercel.json
├── config/
├── controllers/
├── data/
├── middleware/
├── models/
├── routes/
├── services/
├── uploads/
├── utils/
└── validators/
```

### Backend Core Files

- **package.json** - Backend dependencies, scripts, and project metadata
- **seeder.js** - Database seeding script for populating initial data (products, users, etc.)
- **server.js** - Main application entry point, Express server setup, middleware configuration
- **vercel.json** - Vercel deployment configuration for serverless functions

### Backend Subdirectories

#### config/
- **cloudinary.js** - Cloudinary configuration for image upload and management
- **db.js** - MongoDB database connection configuration and setup
- **passport.js** - Passport.js authentication strategies configuration (Google OAuth, local auth)

#### controllers/
- **googleAuthController.js** - Handles Google OAuth authentication flow and user creation
- **orderController.js** - Manages order creation, retrieval, updates, and status changes
- **paymentController.js** - Handles payment processing, Razorpay integration, and payment verification
- **productController.js** - CRUD operations for products, inventory management
- **userController.js** - User management, profile updates, authentication endpoints

#### data/
- **products.js** - Static product data for seeding the database with initial products

#### middleware/
- **asyncHandler.js** - Wrapper for async route handlers to catch and handle errors
- **authMiddleware.js** - Authentication middleware for protecting routes and verifying JWT tokens
- **errorMiddleware.js** - Global error handling middleware for consistent error responses
- **upload.js** - Multer configuration for file upload handling and validation
- **validate.js** - Input validation middleware using express-validator

#### models/
- **cart.js** - MongoDB schema for shopping cart items and user cart data
- **order.js** - Order schema including items, shipping, payment status
- **payment.js** - Payment transaction records and Razorpay payment data
- **product.js** - Product schema with details, pricing, inventory, ratings
- **user.js** - User schema with authentication, profile, and role information
- **wishlist.js** - User wishlist items and saved products

#### routes/
- **adminOrderRoutes.js** - Admin-only routes for order management and analytics
- **adminRoutes.js** - Administrative routes for system management
- **cartRoutes.js** - Shopping cart operations (add, remove, update items)
- **checkoutRoutes.js** - Checkout process and order placement
- **googleAuthRoutes.js** - Google OAuth authentication routes
- **paymentRoutes.js** - Payment processing and webhook handling
- **productAdminRoutes.js** - Admin product management (CRUD operations)
- **productRoutes.js** - Public product browsing and search
- **uploadRoutes.js** - File upload endpoints for images and documents
- **userRoutes.js** - User authentication, registration, and profile management
- **wishlistRoutes.js** - Wishlist management (add/remove favorite products)

#### services/
- **razorpayServices.js** - Razorpay payment gateway integration and order creation

#### uploads/
- Directory for temporarily storing uploaded files before processing to Cloudinary

#### utils/
- **emailTemplates.js** - Email template functions for order confirmations and notifications
- **generateToken.js** - JWT token generation utility functions
- **sendEmail.js** - Email sending functionality using SMTP or email service

#### validators/
- **productValidators.js** - Validation rules for product data input
- **userValidators.js** - Validation rules for user registration and profile updates

## Frontend Directory Structure

```
frontend/
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── vercel.json
├── vite.config.js
├── public/
└── src/
```

### Frontend Core Files

- **eslint.config.js** - ESLint configuration for code linting and quality rules
- **index.html** - Main HTML template file for the React application
- **package.json** - Frontend dependencies, build scripts, and project metadata
- **README.md** - Frontend-specific documentation and setup instructions
- **vercel.json** - Vercel deployment configuration for static site hosting
- **vite.config.js** - Vite build tool configuration and plugins

### Frontend Subdirectories

#### public/
- **productImg/** - Static product images and assets served directly

#### src/
```
src/
├── App.jsx
├── index.css
├── main.jsx
├── api/
├── assets/
├── components/
├── pages/
├── redux/
└── services/
```

- **App.jsx** - Main React application component with routing setup
- **index.css** - Global CSS styles and Tailwind CSS imports
- **main.jsx** - Application entry point that renders the React app

#### api/
- **axiosConfig.js** - Axios HTTP client configuration with base URL and interceptors

#### assets/
- Static assets like images, fonts, and icons used in the application

#### components/
```
components/
├── ErrorBoundary.jsx
├── Admin/
├── Auth/
├── Cart/
├── Common/
├── Layout/
├── product/
└── Products/
```

- **ErrorBoundary.jsx** - React error boundary component for graceful error handling
- **Admin/** - Admin dashboard components (AdminLayout, AdminSidebar)
- **Auth/** - Authentication components (GoogleLoginButton)
- **Cart/** - Shopping cart components (CartContents, Checkout)
- **Common/** - Reusable UI components (Footer, Header, Navbar, Pagination, SearchBar)
- **Layout/** - Layout components (CartDrawer, Hero, Topbar, UserLayout)
- **product/** - Product detail components (ProductGallery, ProductInfo, ProductReviews, RelatedProducts)
- **Products/** - Product listing and grid components

#### pages/
- **AboutUs.jsx** - About Us page component
- **AdminHomePage.jsx** - Admin dashboard home page
- **AdminOrdersPage.jsx** - Admin orders management page
- **AdminProductsPage.jsx** - Admin products management page
- **AdminUsersPage.jsx** - Admin users management page
- **AuthSuccess.jsx** - Authentication success page
- **CollectionPage.jsx** - Product collection/category page
- **ContactUs.jsx** - Contact information page
- **CustomCrochet.jsx** - Custom order request page
- **Home.jsx** - Main homepage component
- **Login.jsx** - User login page
- **MyOrderPage.jsx** - User order history page
- **OrderConfirmation.jsx** - Order confirmation page
- **OrderDetailPage.jsx** - Individual order details page
- **Profile.jsx** - User profile management page
- **Register.jsx** - User registration page
- **WishlistPage.jsx** - User wishlist page

#### redux/
- **store.js** - Redux store configuration and setup
- **slices/** - Redux slices for different state domains (auth, cart, products, etc.)

#### services/
- **googleAuthService.js** - Google OAuth authentication service functions
- **paymentService.js** - Payment processing service functions

#### utils/
- **getImageUrl.js** - Utility functions for image URL generation and optimization

## Architecture Principles

### Separation of Concerns
- **Backend** handles data logic, authentication, and business rules
- **Frontend** manages UI rendering, user interactions, and state management
- Clear separation between API routes, controllers, and models

### MVC Pattern (Backend)
- **Models** define data structures and database interactions
- **Views** are handled by the frontend React components
- **Controllers** contain business logic and API response handling

### Component-Based Architecture (Frontend)
- Reusable components organized by feature/functionality
- Separation of layout, common, and feature-specific components

### File Organization Benefits
- **Scalability**: Easy to add new features without affecting existing code
- **Maintainability**: Clear structure makes it easy to locate and modify specific functionality
- **Team Collaboration**: Multiple developers can work on different areas simultaneously
- **Testing**: Isolated components and modules are easier to unit test

This file structure follows industry best practices for full-stack MERN applications, providing a solid foundation for development, maintenance, and future enhancements.</content>
<parameter name="filePath">c:\Karigari\File_Structure.md