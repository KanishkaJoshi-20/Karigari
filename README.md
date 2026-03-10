# Karigari - E-commerce Full-Stack Platform

Karigari is a full-stack e-commerce application designed to sell handcrafted crochet items. Developed with the MERN stack (MongoDB, Express.js, React, Node.js) and powered by Redux Toolkit for state management, it provides a seamless shopping experience for artisans to showcase and sell their creations.

## 🚀 Features

*   **User Authentication:** Secure JWT-based registration and login system.
*   **Product Catalog & Search:** Dynamic product display fetching data live from the MongoDB database.
*   **Shopping Cart:** Persistent cart management using Redux and Local Storage.
*   **Checkout & Orders:** Complete order flow, including capturing shipping information securely.
*   **Responsive Design:** Beautiful, dynamic UI built with Tailwind CSS, `framer-motion`, and React.
*   **Admin Utilities (Backend):** Protected routes for inventory, users, and order tracking.

## 💻 Tech Stack

**Frontend:**
*   React, Vite, React Router DOM
*   Redux Toolkit (`react-redux`, `@reduxjs/toolkit`)
*   Axios (for API integration)
*   Tailwind CSS, Framer Motion, Lucide React (UI & Styling)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose
*   JSON Web Tokens (JWT) & bcryptjs (Auth)
*   Cors & dotenv

## 🛠️ Installation & Setup

### Prerequisites

*   Node.js (v18+ recommended)
*   MongoDB (local or Atlas cluster)

### Environment Variables

You need to create a `.env` file in the **backend** directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Create a `.env` file in the **frontend** directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Quick Run (Concurrent Mode)

To run both the frontend and backend simultaneously, use the root directory:

```bash
# Install root dependencies (concurrently)
npm install

# Install all sub-directory dependencies & start the dev environment
npm run build
npm run dev
```

The app will compile and the frontend will run at `http://localhost:5173/`, while the backend API runs at `http://localhost:5000/`.

---
*Crafted for Karigari*
