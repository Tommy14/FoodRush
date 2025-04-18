import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import MobileSidebar from './MobileSidebar';
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";



export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };


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
          <Link to="/restaurants" className="hover:text-green-600 transition">Restaurants </Link>
          <Link to="/contact" className="hover:text-green-600 transition">Contact</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          {!isAuthenticated ? (
            <Link
              to="/auth"
              className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
            >
              Sign Up
            </Link>
          ) : (
            <div className="relative group">
              <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
                {user?.name?.split(" ")[0] || "User"}
              </button>

              <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md top-10 right-0 min-w-[140px] text-sm border">
                <Link
                  to="/profile"
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  Profile
                </Link>
                {user?.role === 'delivery_person' && (
                  <Link
                    to="/delivery-panel"
                    className="px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Delivery
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-left w-full px-4 py-2 hover:bg-red-100 text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
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
