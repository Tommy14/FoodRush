import { Link, useNavigate } from 'react-router-dom';
import { HiX, HiUserCircle, HiLogout } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function MobileSidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-green-600">FoodRush</h2>
          <button onClick={() => setIsOpen(false)}>
            <HiX className="text-3xl text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-6 p-6 text-gray-700 text-lg font-medium">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-green-600 transition">Home</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-green-600 transition">About</Link>
          <Link to="/restaurants" onClick={() => setIsOpen(false)} className="hover:text-green-600 transition">Restaurants</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-green-600 transition">Contact</Link>

          {!isAuthenticated ? (
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
              <Link to="/auth" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </button>
          ) : (
            user?.role === "customer" && (
              <div className="mt-6 border-t pt-4 flex flex-col gap-4 text-gray-700">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 text-left hover:text-green-600 transition"
                >
                  <HiUserCircle className="text-2xl" />
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-left hover:text-red-600 transition"
                >
                  <HiLogout className="text-2xl" />
                  Logout
                </button>
              </div>
            )
          )}
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
