// src/components/DashSidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";


const DashSidebar = () => {
  const { pathname } = useLocation();
  const [role, setRole] = useState('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    { label: 'Login', path: '/u' },
    { label: 'Sign Up', path: '/auth' }
  ];

  const baseLinks = [
    {
      label: "Logout",
      action: () => {
        dispatch(logout());
        navigate("/auth");
      }
    }
  ];
  

  const roleBasedLinks = {
    customer: [{ label: 'My Orders', path: '/my-orders' }],
    restaurant_admin: [
      { label: 'Manage Restaurants', path: '/restaurants' },
      { label: 'Orders', path: '/orders' }
    ],
    delivery_person: [
      { label: 'My Deliveries', path: '/delivery-panel' },
      { label: 'Completed', path: '/delivery/completed' }
    ],
    guest: guestLinks
  };

  const navLinks = [
    ...(roleBasedLinks[role] || []),
    ...(isAuthenticated ? baseLinks : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white w-64 p-6 pt-24 shadow-lg flex flex-col">
      <nav className="flex flex-col space-y-3">
      {navLinks.map((link) =>
        link.action ? (
          <button
            key={link.label}
            onClick={link.action}
            className="px-4 py-2 text-left rounded-lg w-full transition-all duration-300 hover:bg-gray-600 text-gray-300"
          >
            {link.label}
          </button>
        ) : (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              pathname === link.path
                ? 'bg-blue-500 text-white shadow-md font-semibold'
                : 'hover:bg-gray-600 text-gray-300'
            }`}
          >
            {link.label}
          </Link>
        )
      )}

      </nav>

      <div className="mt-auto pt-6 border-t border-gray-600 text-sm text-center text-gray-400">
        © {new Date().getFullYear()} FoodRush
      </div>
    </div>
  );
};

export default DashSidebar;
