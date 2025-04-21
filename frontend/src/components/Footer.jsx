import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-50 text-gray-800 mt-20 pt-12">
      <div className="max-w-7xl mx-auto px-6 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand Section */}
        <div>
          <h2 className="text-3xl font-bold text-green-600 mb-3">FoodRush</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Delicious meals from top restaurants. Delivered hot & fresh to your doorstep.
          </p>
          <div className="flex gap-4 mt-5 text-xl">
            <a href="#" aria-label="Facebook" className="text-green-600 hover:text-blue-600 transition">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram" className="text-green-600 hover:text-pink-600 transition">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Twitter" className="text-green-600 hover:text-sky-600 transition">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-green-600">Menu</a></li>
            <li><a href="#" className="hover:text-green-600">Offers</a></li>
            <li><a href="#" className="hover:text-green-600">Track Order</a></li>
            <li><a href="#" className="hover:text-green-600">Blog</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-green-600">About Us</a></li>
            <li><a href="#" className="hover:text-green-600">Careers</a></li>
            <li><a href="#" className="hover:text-green-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-green-600">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>📍 Colombo, Sri Lanka</li>
            <li>📞 +94 77 123 4567</li>
            <li>📧 contact@foodrush.lk</li>
          </ul>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-12 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-green-600">FoodRush</span>. All rights reserved.
      </div>
    </footer>
  );
}
