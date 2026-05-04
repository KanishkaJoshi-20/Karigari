# Karigari E-Commerce Platform: Technology Stack

This document outlines all the technologies, libraries, and tools used in the Karigari e-commerce platform, along with their specific purposes and usage.

## Frontend Technologies

### Core Framework
- **React 19** - Main UI library for building the user interface with component-based architecture
- **Vite** - Fast build tool and development server for React applications

### State Management
- **Redux Toolkit** - Simplified Redux implementation for managing global application state (user auth, cart, products)

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework for responsive and consistent styling
- **Framer Motion** - Animation library for smooth UI transitions and interactive elements
- **Lucide React** - Icon library providing consistent, customizable icons throughout the UI
- **React Icons** - Additional icon set for various UI elements

### Routing & Navigation
- **React Router DOM** - Client-side routing for single-page application navigation

### HTTP Client
- **Axios** - Promise-based HTTP client for making API requests to the backend

### Notifications
- **Sonner** - Toast notification library for user feedback (success, error messages)

### Development Tools
- **ESLint** - Code linting tool to maintain code quality and consistency

## Backend Technologies

### Runtime & Framework
- **Node.js** - JavaScript runtime environment for server-side execution
- **Express.js** - Minimalist web framework for building RESTful APIs and handling HTTP requests

### Database & ODM
- **MongoDB** - NoSQL document database for storing application data
- **Mongoose** - Object Data Modeling (ODM) library for MongoDB, providing schema validation and data modeling

### Authentication & Security
- **JWT (jsonwebtoken)** - JSON Web Tokens for stateless authentication and session management
- **bcryptjs** - Password hashing library for secure password storage
- **Passport.js** - Authentication middleware supporting multiple strategies (local and OAuth)
- **express-session** - Session middleware for managing user sessions
- **Helmet** - Security middleware that sets various HTTP headers for security
- **CSRF (csurf)** - Cross-Site Request Forgery protection middleware
- **express-rate-limit** - Rate limiting middleware to prevent abuse and DoS attacks

### File Upload & Image Management
- **Multer** - Middleware for handling multipart/form-data (file uploads)
- **Cloudinary** - Cloud-based image management service for uploading, storing, and optimizing product images

### Validation & Middleware
- **express-validator** - Middleware for validating and sanitizing user input
- **cookie-parser** - Parse Cookie header and populate req.cookies
- **CORS** - Cross-Origin Resource Sharing middleware for handling cross-origin requests

### Environment & Configuration
- **dotenv** - Loads environment variables from .env file for configuration management

### Development Tools
- **Nodemon** - Development utility that automatically restarts the server when file changes are detected

## Third-Party Integrations

### Payment Processing
- **Razorpay** - Payment gateway integration for secure online transactions, handling payment orders and verification

### Social Authentication
- **Google OAuth (@react-oauth/google)** - Google sign-in integration for seamless user authentication

## Deployment & Hosting

### Platform
- **Vercel** - Cloud platform for deploying both frontend (static site) and backend (serverless functions) applications

## Development Workflow

### Version Control
- **Git** - Distributed version control system for tracking changes and collaboration

### Package Management
- **npm** - Node Package Manager for installing and managing project dependencies

## Architecture Overview

### Frontend Architecture
- Component-based architecture with React
- Centralized state management with Redux
- Responsive design with Tailwind CSS
- Client-side routing with React Router

### Backend Architecture
- RESTful API design with Express.js
- MVC-like structure with routes, controllers, and models
- Middleware-based request processing pipeline
- JWT-based authentication system

### Database Design
- Document-based data model with MongoDB
- Schema validation and relationships with Mongoose
- Separate collections for users, products, orders, payments, cart, and wishlist

### Security Implementation
- Password hashing with bcrypt
- JWT token-based authentication
- CSRF protection
- Rate limiting
- Input validation and sanitization
- HTTPS enforcement in production

### File Management
- Image upload handling with Multer
- Cloud storage and optimization with Cloudinary
- CDN delivery for fast image loading

### Payment Flow
- Order creation on backend
- Razorpay checkout integration on frontend
- Server-side payment verification
- Order status updates post-payment

This technology stack provides a robust, scalable, and secure foundation for the e-commerce platform, enabling features like user authentication, product management, shopping cart functionality, secure payments, and admin controls.</content>
<parameter name="filePath">c:\Karigari\Tech_Stack.md