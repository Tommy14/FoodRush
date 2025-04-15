// src/components/DashSidebar.jsx
import { Link, useLocation } from 'react-router-dom';

const DashSidebar = () => {
  const { pathname } = useLocation();

  const navLinks = [
    { label: 'My Deliveries', path: '/delivery-panel' },
    { label: 'Completed', path: '/delivery/completed' },
    { label: 'Settings', path: '/delivery/settings' },
    { label: 'Logout', path: '/logout' },
  ];

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
