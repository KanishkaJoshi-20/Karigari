import { FaPaintBrush, FaHeart, FaRulerCombined, FaClock } from "react-icons/fa";

const steps = [
  { icon: FaPaintBrush, title: "Choose Your Design", desc: "Browse our gallery or share your own idea — a toy, flower, bag, or anything you can imagine." },
  { icon: FaRulerCombined, title: "Pick Size & Colors", desc: "Select the size, yarn colors, and any custom details. We'll work with you on every stitch." },
  { icon: FaClock, title: "We Handcraft It", desc: "Our artisans crochet your item by hand. Most orders are ready within 7–14 days." },
  { icon: FaHeart, title: "Receive & Love It", desc: "Your one-of-a-kind piece is shipped to your doorstep, beautifully packaged." },
];

const CustomCrochet = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Custom Crochet Orders</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Have a special request? We create bespoke crochet pieces made just for you — from amigurumi toys to home décor.
        </p>
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center p-6 rounded-lg bg-white shadow hover:shadow-md transition">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-100 text-pink-600 mb-4">
                <step.icon className="text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pricing</h2>
          <p className="text-gray-600 mb-8">Custom orders start from ₹499. Price depends on size, complexity, and materials used.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Small</h3>
              <p className="text-3xl font-bold text-pink-600 mb-2">₹499+</p>
              <p className="text-gray-500 text-sm">Keychains, hair clips, small toys (up to 10cm)</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-2 border-pink-200">
              <h3 className="font-bold text-lg mb-2">Medium</h3>
              <p className="text-3xl font-bold text-pink-600 mb-2">₹999+</p>
              <p className="text-gray-500 text-sm">Amigurumi toys, bouquets, cushion covers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Large</h3>
              <p className="text-3xl font-bold text-pink-600 mb-2">₹1999+</p>
              <p className="text-gray-500 text-sm">Blankets, bags, large décor pieces</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to create something special?</h2>
        <p className="text-gray-500 mb-6">Reach out to us via our Contact page or DM us on Instagram.</p>
        <a href="/contact" className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition">Contact Us</a>
      </div>
    </div>
  );
};

export default CustomCrochet;
