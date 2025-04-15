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
    <div className="min-h-screen bg-gray-800 text-white w-60 p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">🚚 DeliverIt</h2>
      <nav className="flex flex-col gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`p-2 rounded hover:bg-gray-700 transition ${
              pathname === link.path ? 'bg-gray-700 font-semibold' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DashSidebar;
