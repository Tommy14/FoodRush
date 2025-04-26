import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuItemForm from "../../components/menu/MenuItemForm";
import { getMenuItemById, updateMenuItem } from "../../services/menuService";
import DashSidebar from "../../components/DashSidebar";
import { toast } from "react-toastify";

const EditMenuItemPage = () => {
  const { restaurantId, menuItemId } = useParams();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = useSelector((state) => state.auth);
  const isRestaurantAdmin = auth.user && auth.user.role === "restaurant_admin";

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        const data = await getMenuItemById(restaurantId, menuItemId);
        setMenuItem(data);
        setError(null);
      } catch (err) {
        setError("Failed to load menu item");
        toast.error("Failed to load menu item");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [restaurantId, menuItemId]);

  const handleSubmit = async (formData) => {
    try {
      // Add authentication verification
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        navigate('/auth');
        return null;
      }
  
      // Pass the token and handle the update
      const result = await updateMenuItem(restaurantId, menuItemId, formData);
      return result;
    } catch (error) {
      // If it's a 403 error, show a more specific message
      if (error.response && error.response.status === 403) {
        toast.error("You don't have permission to edit this menu item");
      }
      throw error;
    }
  };

  const handleCancel = () => {
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isRestaurantAdmin && <DashSidebar />}

      <div className={`flex-1 p-4 ${isRestaurantAdmin ? "lg:ml-64" : ""}`}>
        <div className="max-w-3xl mx-auto">
          <MenuItemForm
            restaurantId={restaurantId}
            menuItem={menuItem}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={true}
            isRestaurantAdmin={isRestaurantAdmin}
          />
        </div>
      </div>
    </div>
  );
};

export default EditMenuItemPage;