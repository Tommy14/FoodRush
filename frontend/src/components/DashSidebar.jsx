// src/components/DashSidebar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import {
  FaStore,
  FaClipboardList,
  FaPlusCircle,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

const DashSidebar = () => {
  const { pathname } = useLocation();
  const [role, setRole] = useState('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // for mobile toggle
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role || 'guest');
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Invalid token:', err.message);
        setRole('guest');
        setIsAuthenticated(false);
      }
    } else {
      setRole('guest');
      setIsAuthenticated(false);
    }
  }, []);

  const guestLinks = [
    { label: 'Login', path: '/u', icon: <FaUserCircle className="mr-2" /> },
    { label: 'Sign Up', path: '/auth', icon: <FaUserCircle className="mr-2" /> }
  ];

  const baseLinks = [
    {
      label: "Logout",
      action: () => {
        dispatch(logout());
        navigate("/");
      },
      icon: <FaSignOutAlt className="mr-2" />
    }
  ];

  const roleBasedLinks = {
    customer: [{ label: 'My Orders', path: '/my-orders', icon: <FaClipboardList className="mr-2" /> }],
    restaurant_admin: [
      { label: 'My Restaurants', path: '/manage-restaurants', icon: <FaStore className="mr-2" /> },
      { label: 'Orders', path: '/restaurant-orders', icon: <FaClipboardList className="mr-2" /> },
    ],
    delivery_person: [
      { label: 'My Deliveries', path: '/delivery-panel', icon: <FaClipboardList className="mr-2" /> },
      { label: 'Completed', path: '/delivery/completed', icon: <FaClipboardList className="mr-2" /> }
    ],
    admin: [
      { label: 'Manage Restaurant Status', path: '/restaurant-status', icon: <FaClipboardList className="mr-2" /> },   
      { label: 'Manage Users', path: '/user-management', icon: <FaUserCircle className="mr-2" /> }   
     ],

    guest: guestLinks
  };

  const navLinks = [
    ...(roleBasedLinks[role] || []),
    ...(isAuthenticated ? baseLinks : [])
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-16 left-4 z-50 md:hidden text-white bg-gray-800 p-2 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay on mobile when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-100 top-0 left-0 min-h-screen w-42 md:w-48 lg:w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white px-8 pt-28 pb-28 shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        {/* Nav Links */}
        <nav className="flex flex-col space-y-4">
          {navLinks.map((link) =>
            link.action ? (
              <button
                key={link.label}
                onClick={link.action}
                className="px-4 py-2 text-left rounded-lg w-full transition-all duration-300 hover:bg-gray-600 text-gray-300"
              >
                <FaSignOutAlt className="mr-2 inline" />
                {link.label}
              </button>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                  pathname === link.path
                    ? 'bg-blue-500 text-white shadow-md font-semibold'
                    : 'hover:bg-gray-600 text-gray-300'
                }`}
                onClick={() => setIsOpen(false)} // close menu on mobile
              >
                {link.icon}
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-gray-600 text-sm text-center text-gray-400">
          © {new Date().getFullYear()} FoodRush
        </div>
      </div>
    </>
  );
};

export default DashSidebar;
