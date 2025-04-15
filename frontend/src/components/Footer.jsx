import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-50 text-gray-700 mt-16 pt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Tagline */}
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-3">FoodRush</h2>
          <p className="text-sm text-gray-600">
            Bringing your favorite meals to your doorstep — fresh, fast, and just a tap away.
          </p>
          <div className="flex gap-4 mt-5 text-xl">
            <a href="#" className="text-green-600 hover:text-blue-500"><FaFacebookF /></a>
            <a href="#" className="text-green-600 hover:text-pink-500"><FaInstagram /></a>
            <a href="#" className="text-green-600 hover:text-sky-500"><FaTwitter /></a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-600">Menu</a></li>
            <li><a href="#" className="hover:text-green-600">Offers</a></li>
            <li><a href="#" className="hover:text-green-600">Track Order</a></li>
            <li><a href="#" className="hover:text-green-600">Blog</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-600">About Us</a></li>
            <li><a href="#" className="hover:text-green-600">Careers</a></li>
            <li><a href="#" className="hover:text-green-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-green-600">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
          <p className="text-sm text-gray-600">Colombo, Sri Lanka</p>
          <p className="text-sm text-gray-600">+94 77 123 4567</p>
          <p className="text-sm text-gray-600">contact@foodrush.lk</p>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} FoodRush. All rights reserved.
      </div>
    </footer>
  );
}
