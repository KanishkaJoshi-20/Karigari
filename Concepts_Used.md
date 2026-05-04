# Karigari E-Commerce Platform: Key Concepts & Patterns

This document explains the core programming concepts, design patterns, and library implementations used throughout the Karigari e-commerce platform.

## Backend Concepts

### 1. Express.js Middleware Architecture

**Concept**: Express middleware functions that process requests before they reach route handlers.

**Implementation in Karigari**:
```javascript
// Security middleware stack in server.js
app.use(helmet({...}));           // Security headers
app.use(cors());                  // Cross-origin requests
app.use(express.json());          // JSON body parsing
app.use(express.urlencoded());    // Form data parsing
app.use(session({...}));          // Session management
```

**Purpose**: Creates a processing pipeline where each middleware can modify the request/response or end the cycle.

### 2. JWT (JSON Web Tokens) Authentication

**Concept**: Stateless authentication using signed tokens containing user identity.

**Implementation**:
```javascript
// Token generation in generateToken.js
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Usage in controllers
res.json(userResponse(user, generateToken(user._id)));
```

**Purpose**: Enables stateless authentication without server-side sessions, improving scalability.

### 3. Password Hashing with bcrypt

**Concept**: One-way password hashing to securely store user credentials.

**Implementation**:
```javascript
// In user model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Verification
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

**Purpose**: Protects user passwords even if database is compromised.

### 4. OAuth 2.0 with Passport.js

**Concept**: Third-party authentication allowing users to login with Google accounts.

**Implementation**:
```javascript
// Passport strategy configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  // User creation/lookup logic
}));
```

**Purpose**: Simplifies user registration and provides social login functionality.

### 5. Rate Limiting

**Concept**: Prevents abuse by limiting the number of requests from a single IP address.

**Implementation**:
```javascript
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests from this IP"
});
app.use("/api/", apiLimiter);
```

**Purpose**: Protects against DDoS attacks and API abuse.

### 6. Input Validation with express-validator

**Concept**: Server-side validation of user input to ensure data integrity.

**Implementation**:
```javascript
// In validation middleware
const validateProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  // ... more validations
];

// Usage in routes
router.post('/', validateProduct, productController.createProduct);
```

**Purpose**: Prevents invalid data from entering the database and provides meaningful error messages.

## Frontend Concepts

### 1. React Hooks

**Concept**: Functions that let you use state and lifecycle features in functional components.

**Implementation**:
```javascript
// useState for local state
const [cartItems, setCartItems] = useState([]);

// useEffect for side effects
useEffect(() => {
  if (user) {
    dispatch(fetchWishlist());
  }
}, [dispatch, user]);
```

**Purpose**: Enables stateful logic in functional components without class components.

### 2. Redux State Management

**Concept**: Predictable state container using actions and reducers.

**Implementation**:
```javascript
// Redux slice pattern
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('userToken');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
    });
  }
});
```

**Purpose**: Centralized state management for complex applications with predictable updates.

### 3. Axios Interceptors

**Concept**: Global request/response interceptors for common functionality.

**Implementation**:
```javascript
// Request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Purpose**: Automatically adds authentication headers to all API requests.

### 4. React Router Navigation

**Concept**: Client-side routing for single-page applications.

**Implementation**:
```javascript
// Route configuration
<BrowserRouter>
  <Routes>
    <Route path="/" element={<UserLayout />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/collections/:collection" element={<CollectionPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Purpose**: Enables navigation without full page reloads, creating a smooth user experience.

### 5. Error Boundaries

**Concept**: React components that catch JavaScript errors in the component tree.

**Implementation**:
```javascript
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

**Purpose**: Prevents the entire app from crashing due to component errors.

## Database Concepts

### 1. Mongoose Schemas & Models

**Concept**: Schema definitions for MongoDB collections with built-in validation.

**Implementation**:
```javascript
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
```

**Purpose**: Provides structure, validation, and helper methods for database operations.

### 2. Document Relationships

**Concept**: Referencing documents between collections (similar to foreign keys in SQL).

**Implementation**:
```javascript
// Order references User and Products
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    qty: { type: Number, required: true }
  }]
});
```

**Purpose**: Creates relationships between data entities while maintaining MongoDB's flexibility.

## Security Concepts

### 1. Content Security Policy (CSP)

**Concept**: Security standard that helps prevent cross-site scripting (XSS) attacks.

**Implementation**:
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://res.cloudinary.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
```

**Purpose**: Restricts which resources can be loaded, reducing XSS attack vectors.

### 2. CORS (Cross-Origin Resource Sharing)

**Concept**: Mechanism that allows restricted resources to be requested from another domain.

**Implementation**:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000'],
  credentials: true
}));
```

**Purpose**: Controls which external domains can access your API.

### 3. CSRF Protection

**Concept**: Prevents Cross-Site Request Forgery attacks using tokens.

**Implementation**:
```javascript
app.use(csurf({
  cookie: { httpOnly: true, secure: true }
}));
```

**Purpose**: Ensures that state-changing operations are only performed by legitimate users.

## Payment Integration Concepts

### 1. Razorpay Payment Gateway

**Concept**: Third-party payment processing for secure online transactions.

**Implementation**:
```javascript
// Create order
const options = {
  amount: totalAmount * 100, // Amount in paisa
  currency: "INR",
  receipt: `receipt_${orderId}`
};
const razorpayOrder = await razorpay.orders.create(options);

// Verify payment
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(orderId + "|" + paymentId)
  .digest('hex');
```

**Purpose**: Handles payment processing, fraud detection, and settlement.

## File Upload Concepts

### 1. Multer Middleware

**Concept**: Node.js middleware for handling multipart/form-data (file uploads).

**Implementation**:
```javascript
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});
```

**Purpose**: Processes file uploads before they reach route handlers.

### 2. Cloudinary Integration

**Concept**: Cloud-based image management and optimization service.

**Implementation**:
```javascript
const result = await cloudinary.uploader.upload(file.path, {
  folder: 'products',
  transformation: [
    { width: 800, height: 600, crop: 'limit' },
    { quality: 'auto' }
  ]
});
```

**Purpose**: Provides image storage, optimization, and delivery with CDN.

## Design Patterns

### 1. MVC (Model-View-Controller)

**Backend Structure**:
- **Models**: Database schemas and data logic
- **Views**: Frontend React components (handled by frontend)
- **Controllers**: Business logic and API response handling

### 2. Repository Pattern

**Implementation**: Controllers act as repositories, abstracting database operations.

### 3. Middleware Pattern

**Express.js**: Chain of responsibility pattern for request processing.

### 4. Container/Presentational Components

**React**: Separation of data logic (containers) from UI rendering (presentational components).

## Performance Concepts

### 1. Lazy Loading

**React**: Code splitting to load components only when needed.

### 2. Memoization

**React**: `React.memo` and `useMemo` to prevent unnecessary re-renders.

### 3. Database Indexing

**MongoDB**: Indexes on frequently queried fields for faster lookups.

## Error Handling Concepts

### 1. Async Error Handling

**Implementation**:
```javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

**Purpose**: Catches async errors and passes them to error middleware.

### 2. Global Error Middleware

**Implementation**:
```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
```

**Purpose**: Centralized error handling with appropriate responses.

These concepts form the foundation of the Karigari platform, ensuring it's secure, scalable, maintainable, and provides an excellent user experience.</content>
<parameter name="filePath">c:\Karigari\Concepts_Used.md