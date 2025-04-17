import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

import Navbar from '../components/Navbar';
import About from '../pages/About';
import DeliveryDashboard from '../pages/DeliveryDashboard';
import CompletedDeliveries from '../pages/CompletedDeliveries';
import RestaurantList from '../pages/Restaurants';
import MenuPage from '../pages/MenuPage';

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />} />
        <Route path="/delivery-panel" element={<DeliveryDashboard />} />
        <Route path="/delivery/completed" element={<CompletedDeliveries />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:restaurantId/menu" element={<MenuPage />} />


      </Routes>
    </>
  );
}



