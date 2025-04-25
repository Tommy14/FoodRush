import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';


import Navbar from '../components/Navbar';
import About from '../pages/About';
import DeliveryDashboard from '../pages/DeliveryDashboard';
import CompletedDeliveries from '../pages/CompletedDeliveries';
import RestaurantList from '../pages/restaurants/Restaurants';
import MenuPage from '../pages/MenuPage';
import AuthPage from '../pages/Auth/AuthPage';
import OrderStatus from '../pages/OrderStatus';
import ProfileRedirect from '../pages/ProfileRedirect';
import CreateRestaurant from '../pages/restaurants/CreateRestaurant';
import ManageRestaurants from '../pages/restaurants/ManageRestaurants';
import RestaurantDetailsPage from '../pages/restaurants/RestaurantDetailsPage';
import RestaurantOrdersPage from '../pages/RestaurantOrdersPage';
import ContactUs from '../pages/ContactUs';
import RestaurantStatusPage from '../pages/restaurants/RestaurantStatusPage';




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
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:restaurantId" element={<RestaurantDetailsPage />} />
        <Route path="/restaurants/:restaurantId/menu" element={<MenuPage />} />
        <Route path="/auth" element={<AuthPage />} /> 
        <Route path="/my-orders" element={<OrderStatus />} />
        <Route path="/profile" element={<ProfileRedirect />} />

        <Route path="/create-restaurant" element={<CreateRestaurant />} />
        <Route path="/manage-restaurants" element={<ManageRestaurants />} />
        <Route path="/restaurant-orders" element={<RestaurantOrdersPage />} />
        <Route path="/restaurant-status" element={<RestaurantStatusPage />} />

        {/* <Route path="/edit-restaurant/:restaurantId" element={<EditRestaurant />} /> */}
      </Routes>
    </>
  );
}
