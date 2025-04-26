import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getMenuItems, deleteMenuItem } from '../../services/menuService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const MenuList = ({ restaurantId, isOwner: propIsOwner }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const auth = useSelector(state => state.auth);
  // Only restaurant admins can manage menu
  const isRestaurantAdmin = auth.user && auth.user.role === 'restaurant_admin';
  const canManageMenu = propIsOwner || isRestaurantAdmin;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const data = await getMenuItems(restaurantId);
        setMenuItems(data);
        setError(null);
      } catch (err) {
        setError('Failed to load menu items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const handleDelete = async (menuItemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem(restaurantId, menuItemId);
        setMenuItems(menuItems.filter(item => item._id !== menuItemId));
        toast.success('Menu item deleted successfully');
      } catch (err) {
        toast.error('Failed to delete menu item');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Menu Items</h2>
        <div className="flex space-x-2">
          <Link 
            to={`/restaurants/${restaurantId}/menu`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            View Full Menu
          </Link>
          
          {canManageMenu && (
            <Link 
              to={`/restaurants/${restaurantId}/menu/add`}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              <FaPlus className="mr-2" /> Add Item
            </Link>
          )}
        </div>
      </div>

      {menuItems.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No menu items available.</p>
          {canManageMenu && (
            <Link 
              to={`/restaurants/${restaurantId}/menu/add`}
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Add Your First Menu Item
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.slice(0, 6).map((item) => ( // Only show first 6 items to encourage using full menu page
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="h-48 overflow-hidden">
                {item.image && item.image.url ? (
                  <img 
                    src={item.image.url} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-green-600 font-semibold">${item.price.toFixed(2)}</p>
                </div>
                
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p>
                
                {item.category && (
                  <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {item.category}
                  </span>
                )}
                
                {canManageMenu && (
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => navigate(`/restaurants/${restaurantId}/menu/${item._id}/edit`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      aria-label="Edit menu item"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      aria-label="Delete menu item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {menuItems.length > 6 && (
        <div className="text-center mt-6">
          <Link 
            to={`/restaurants/${restaurantId}/menu`}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            View All Menu Items ({menuItems.length})
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuList;