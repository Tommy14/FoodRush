// src/components/DashSidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // 👈 your custom hook for auth context

const DashSidebar = () => {
   const { pathname } = useLocation();
//   const { auth } = useAuth(); // 👈 assuming auth = { token, role, userId }

//   const role = auth?.role || 'guest';
const role = 'delivery_person';

  const baseLinks = [
    { label: 'Logout', path: '/logout' },
  ];

  const roleBasedLinks = {
    customer: [],
    restaurant_admin: [
      { label: 'Manage Restaurants', path: '/restaurants' },
      { label: 'Orders', path: '/orders' }
    ],
    delivery_person: [
      { label: 'My Deliveries', path: '/delivery-panel' },
      { label: 'Completed', path: '/delivery/completed' }
    ],
    guest: []
  };

  const navLinks = [...(roleBasedLinks[role] || []), ...baseLinks];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white w-64 p-6 pt-24 shadow-lg flex flex-col">
    <nav className="flex flex-col space-y-3">
        {navLinks.map((link) => (
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
        ))}
    </nav>

    <div className="mt-auto pt-6 border-t border-gray-600 text-sm text-center text-gray-400">
        © {new Date().getFullYear()} FoodRush
    </div>
    </div>
  );  
};

export default DashSidebar;
