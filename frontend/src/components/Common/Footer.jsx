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
            <li><a href="#" className="hover:text-gray-900">Crochet Bouquets</a></li>
            <li><a href="#" className="hover:text-gray-900">Crochet Keychains</a></li>
            <li><a href="#" className="hover:text-gray-900">Hair Accessories</a></li>
            <li><a href="#" className="hover:text-gray-900">Crochet Pots</a></li>
            <li><a href="#" className="hover:text-gray-900">Crochet Bags</a></li>
            <li><a href="#" className="hover:text-gray-900">Winter Needs</a></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gray-900">Store Policies</a></li>
            <li><a href="#" className="hover:text-gray-900">Track Your Order</a></li>
            <li><a href="#" className="hover:text-gray-900">Return Policy</a></li>
            <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
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
              href="#"
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
          <span>Wallet</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
