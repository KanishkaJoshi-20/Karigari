import { Link } from "react-router-dom";
import { FaInstagram, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#faf6f2] text-gray-700 mt-16">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/collections/all" className="hover:text-gray-900">All Products</Link></li>
            <li><Link to="/collections/all" className="hover:text-gray-900">Amigurumi Toys</Link></li>
            <li><Link to="/collections/all" className="hover:text-gray-900">Home Décor</Link></li>
            <li><Link to="/collections/all" className="hover:text-gray-900">Accessories</Link></li>
            <li><Link to="/collections/all" className="hover:text-gray-900">Baby Essentials</Link></li>
            <li><Link to="/collections/all" className="hover:text-gray-900">Gift Sets</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-gray-900">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gray-900">Contact Us</Link></li>
            <li><Link to="/my-orders" className="hover:text-gray-900">Track Your Order</Link></li>
            <li><Link to="/custom-crochet" className="hover:text-gray-900">Custom Orders</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Karigari by Nisha Khitoliya</h3>

          <div className="flex items-start gap-3 text-sm mb-3">
            <FaMapMarkerAlt className="mt-1 text-gray-500" />
            <span>Indore, Madhya Pradesh</span>
          </div>

          <div className="flex items-center gap-3 text-sm mb-4">
            <FaPhoneAlt className="text-gray-500" />
            <span>+91 7803963389</span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm font-medium">Connect with us</span>
            <a
              href="https://instagram.com/karigari.crochet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-gray-600">
          © {new Date().getFullYear()} Karigari by Nisha Khitoliya. All rights reserved.
        </p>

        <div className="flex items-center gap-4 text-gray-500">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>UPI</span>
          <span>Net Banking</span>
          <span>COD</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
