import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import MobileSidebar from './MobileSidebar';
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CartSidebar from './CartSidebar';



export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const dashboardPaths = ["/restaurant-dashboard", "/delivery-panel", "/admin", "/delivery/completed"];
  const isDashboard = dashboardPaths.includes(location.pathname);
  const [cartOpen, setCartOpen] = useState(false);


  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };


  return (
    <>
      <nav className="w-full fixed top-0 z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">

        {/* Left - Logo */}
        <div className="text-3xl font-bold text-green-600 tracking-wide">
          <Link to="/">FoodRush</Link>
        </div>

        {/* Center - Links */}
        {!isDashboard && (
          <div className="hidden md:flex gap-8 text-gray-700 font-medium text-xl justify-center flex-1">
            <Link to="/" className="hover:text-green-600 transition">Home</Link>
            <Link to="/about" className="hover:text-green-600 transition">About</Link>
            <Link to="/restaurants" className="hover:text-green-600 transition">Restaurants</Link>
            <Link to="/contact" className="hover:text-green-600 transition">Contact</Link>
          </div>
        )}

        {/* Right - Cart + Auth */}
        <div className="items-center gap-4 hidden md:flex">
          {/* Cart Icon */}
          {!isDashboard && (
            <button onClick={() => setCartOpen(true)} className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700 hover:text-green-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 001 1.5h12a1 1 0 001-1.5L17 13M7 13H5M17 13h2M9 21h.01M15 21h.01" />
              </svg>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
            </button>
          )}

          {/* Auth */}
          {!isAuthenticated ? (
            <Link to="/auth" className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition">
              Sign In
            </Link>
          ) : (
            <div className="relative group">
              <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
                {user?.name?.split(" ")[0] || "User"}
              </button>
              <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md top-10 right-0 min-w-[140px] text-sm border">
                {user?.role === "customer" && (
                  <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 transition">
                    Profile
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



        {/* Mobile Cart + Menu */}
        {!isDashboard && (
          <div className="md:hidden flex items-center gap-4">
            {/* Cart Icon in Mobile */}
            <button onClick={() => setCartOpen(true)} className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700 hover:text-green-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 001 1.5h12a1 1 0 001-1.5L17 13M7 13H5M17 13h2M9 21h.01M15 21h.01" />
              </svg>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
            </button>

            {/* Hamburger Menu */}
            <button onClick={() => setIsOpen(true)}>
              <HiMenu className="text-3xl text-gray-700" />
            </button>
          </div>
        )}
        
      </nav>

      {/* Sidebar Component */}
      {!isDashboard && (
          <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      
      <CartSidebar isOpen={cartOpen} onClose={setCartOpen} />


    </>
  );
}
