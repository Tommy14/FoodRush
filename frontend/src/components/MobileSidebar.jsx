// src/components/MobileSidebar.jsx
import { Link } from 'react-router-dom';
import { HiX } from 'react-icons/hi';

export default function MobileSidebar({ isOpen, setIsOpen }) {
  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-green-600">FoodRush</h2>
          <button onClick={() => setIsOpen(false)}>
            <HiX className="text-3xl text-gray-600" />
          </button>
        </div>

        <nav className="flex flex-col gap-6 p-6 text-gray-700 text-lg font-medium">
          <Link to="/" className="hover:text-green-600 transition" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="hover:text-green-600 transition" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/menu" className="hover:text-green-600 transition" onClick={() => setIsOpen(false)}>Menu</Link>
          <Link to="/contact" className="hover:text-green-600 transition" onClick={() => setIsOpen(false)}>Contact</Link>

          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
            <Link to="/auth">Sign Up</Link>
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
