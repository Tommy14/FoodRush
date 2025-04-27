import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Navbar from '../components/Navbar';
import About from '../pages/About';
import DeliveryDashboard from '../pages/delivery/DeliveryDashboard';
import CompletedDeliveries from '../pages/delivery/CompletedDeliveries';
import RestaurantList from '../pages/restaurants/Restaurants';
import AuthPage from '../pages/Auth/AuthPage';
import OrderStatus from '../pages/OrderStatus';
import ProfileRedirect from '../pages/ProfileRedirect';
import CreateRestaurant from '../pages/restaurants/CreateRestaurant';
import ManageRestaurants from '../pages/restaurants/ManageRestaurants';
import RestaurantDetailsPage from '../pages/restaurants/RestaurantDetailsPage';
import RestaurantOrdersPage from '../pages/RestaurantOrdersPage';
import ContactUs from '../pages/ContactUs';
import RestaurantStatusPage from '../pages/restaurants/RestaurantStatusPage';
import UserManagement from '../pages/Auth/UserManagementPage';
import AddMenuItemPage from '../pages/Menu/AdminAddMenuItemPage';
import EditMenuItemPage from '../pages/Menu/AdminEditMenuItemPage';
import MenuPage from '../pages/Menu/AdminMenuPage';
import ProtectedRoute from '../components/ProtectedRoute'; 
import PlaceOrder from '../pages/order/PlaceOrder';



export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/delivery-panel" element={<DeliveryDashboard />} />
        <Route path="/delivery/completed" element={<CompletedDeliveries />} />
        <Route path="/auth" element={<AuthPage />} /> 
        <Route path="/my-orders" element={<OrderStatus />} />
        <Route path="/profile" element={<ProfileRedirect />} />

        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:restaurantId" element={<RestaurantDetailsPage />} />
        <Route path="/create-restaurant" element={<CreateRestaurant />} />
        <Route path="/manage-restaurants" element={<ManageRestaurants />} />
        <Route path="/restaurant-orders" element={<RestaurantOrdersPage />} />
        <Route path="/restaurant-status" element={<RestaurantStatusPage />} />
        <Route path="/user-management" element={<UserManagement />} />

        <Route path="/restaurants/:restaurantId/menu" element={<MenuPage />} />
        <Route path="/restaurants/:restaurantId/menu/add" element={ <ProtectedRoute allowedRoles={['restaurant_admin']}> <AddMenuItemPage /></ProtectedRoute>} />
        <Route path="/restaurants/:restaurantId/menu/:menuItemId/edit" element={ <ProtectedRoute allowedRoles={['restaurant_admin']}><EditMenuItemPage /></ProtectedRoute> } /> 

        <Route path="/place-order" element={<PlaceOrder/>} />       
      </Routes>
    </>
  );
}
