import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/user.js";
import Product from "./models/product.js";
import Order from "./models/order.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const products = [
  {
    name: "Crochet Teddy Bear",
    image: "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=500",
    brand: "Karigari",
    category: "Amigurumi Toys",
    description: "Adorable handcrafted crochet teddy bear, perfect as a gift or nursery décor. Made with premium cotton yarn.",
    price: 899,
    countInStock: 15,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: "Crochet Bunny",
    image: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=500",
    brand: "Karigari",
    category: "Amigurumi Toys",
    description: "Cute crochet bunny with floppy ears. A wonderful companion for little ones. Handmade with love.",
    price: 799,
    countInStock: 10,
    rating: 4.8,
    numReviews: 8,
  },
  {
    name: "Crochet Sunflower Bouquet",
    image: "https://images.unsplash.com/photo-1551945326-df678d67f0b1?w=500",
    brand: "Karigari",
    category: "Home Décor",
    description: "Beautiful handcrafted crochet sunflower bouquet that never wilts. Perfect for brightening any room.",
    price: 599,
    countInStock: 20,
    rating: 4.7,
    numReviews: 15,
  },
  {
    name: "Crochet Cushion Cover",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    brand: "Karigari",
    category: "Home Décor",
    description: "Elegant handmade crochet cushion cover with intricate floral patterns. Adds a rustic charm to your living space.",
    price: 699,
    countInStock: 12,
    rating: 4.3,
    numReviews: 6,
  },
  {
    name: "Crochet Tote Bag",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
    brand: "Karigari",
    category: "Accessories",
    description: "Stylish and sturdy crochet tote bag, perfect for everyday use. Eco-friendly and handcrafted.",
    price: 1299,
    countInStock: 8,
    rating: 4.6,
    numReviews: 10,
  },
  {
    name: "Crochet Beanie Cap",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500",
    brand: "Karigari",
    category: "Accessories",
    description: "Warm and cozy handmade crochet beanie cap. Available in multiple colors. Perfect for winters.",
    price: 499,
    countInStock: 25,
    rating: 4.4,
    numReviews: 18,
  },
  {
    name: "Crochet Baby Booties",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500",
    brand: "Karigari",
    category: "Baby Essentials",
    description: "Soft and snug crochet baby booties made with hypoallergenic yarn. Perfect for newborns.",
    price: 399,
    countInStock: 30,
    rating: 4.9,
    numReviews: 22,
  },
  {
    name: "Crochet Baby Blanket",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500",
    brand: "Karigari",
    category: "Baby Essentials",
    description: "Ultra-soft handmade crochet baby blanket. Lightweight, breathable, and perfect for all seasons.",
    price: 1499,
    countInStock: 6,
    rating: 4.8,
    numReviews: 14,
  },
  {
    name: "Crochet Gift Hamper",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500",
    brand: "Karigari",
    category: "Gift Sets",
    description: "Curated gift hamper with crochet flower, keychain, and coaster set. Beautifully packaged for gifting.",
    price: 1999,
    countInStock: 5,
    rating: 4.7,
    numReviews: 9,
  },
  {
    name: "Crochet Hair Clip Set",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
    brand: "Karigari",
    category: "Accessories",
    description: "Set of 3 handmade crochet hair clips with floral designs. Lightweight and comfortable to wear.",
    price: 299,
    countInStock: 40,
    rating: 4.5,
    numReviews: 20,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create admin user
    const adminUser = new User({
      name: "Karigari Admin",
      email: "admin@karigari.com",
      password: "admin123",
      isAdmin: true,
    });
    await adminUser.save();

    // Create sample customer
    const customer = new User({
      name: "Test Customer",
      email: "customer@test.com",
      password: "customer123",
      isAdmin: false,
    });
    await customer.save();

    // Insert products
    await Product.insertMany(products);

    console.log("\n✅ Database seeded successfully!");
    console.log("─────────────────────────────────────");
    console.log("🔑 Admin Login:");
    console.log("   Email:    admin@karigari.com");
    console.log("   Password: admin123");
    console.log("─────────────────────────────────────");
    console.log("👤 Test Customer:");
    console.log("   Email:    customer@test.com");
    console.log("   Password: customer123");
    console.log("─────────────────────────────────────");
    console.log(`📦 ${products.length} products inserted.`);
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
