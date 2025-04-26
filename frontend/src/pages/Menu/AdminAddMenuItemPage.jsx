import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuItemForm from "../../components/menu/MenuItemForm";
import { createMenuItem } from "../../services/menuService";
import DashSidebar from "../../components/DashSidebar";
import { toast } from "react-toastify";

const AddMenuItemPage = () => {
  const { restaurantId } = useParams();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const isRestaurantAdmin = auth.user && auth.user.role === "restaurant_admin";

  const handleSubmit = async (formData) => {
    try {
      // Add authentication verification
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        navigate('/auth');
        return null;
      }
  
      // Use createMenuItem instead of updateMenuItem
      const result = await createMenuItem(restaurantId, formData);
      return result;
    } catch (error) {
      // If it's a 403 error, show a more specific message
      if (error.response && error.response.status === 403) {
        toast.error("You don't have permission to add menu items to this restaurant");
      }
      throw error;
    }
  };

  const handleCancel = () => {
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashSidebar />

      <div className="flex-1 p-4 lg:ml-64">
        <div className="max-w-3xl mx-auto">
          <MenuItemForm
            restaurantId={restaurantId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isRestaurantAdmin={isRestaurantAdmin}
          />
        </div>
      </div>
    </div>
  );
};

export default AddMenuItemPage;