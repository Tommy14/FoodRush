import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import MobileSidebar from './MobileSidebar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="w-full fixed top-0 z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl font-bold text-green-600 tracking-wide">
          <Link to="/">FoodRush</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium text-xl">
          <Link to="/" className="hover:text-green-600 transition">Home</Link>
          <Link to="/about" className="hover:text-green-600 transition">About</Link>
          <Link to="/menu" className="hover:text-green-600 transition">Menu</Link>
          <Link to="/contact" className="hover:text-green-600 transition">Contact</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition">
            <Link to="/signup">Sign Up</Link>
          </button>
        </div>

        {/* Mobile Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(true)}>
            <HiMenu className="text-3xl text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Sidebar Component */}
      <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
