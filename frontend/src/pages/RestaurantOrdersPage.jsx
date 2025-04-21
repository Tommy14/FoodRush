import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'; 
import RestaurantOrdersCard from '../components/RestaurantOrdersCard';
import DashSidebar from '../components/DashSidebar';
import { getRestaurantsByOwnerId } from '../services/restaurantService';

const RestaurantOrdersPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Use the existing method from your service
        const response = await axios.get('/bff/restaurants/owner', {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        
        // Add mock statistics to each restaurant
        const restaurantsWithStats = response.data.map(restaurant => ({
          ...restaurant,
          stats: {
            ordersToday: Math.floor(Math.random() * 50) + 10,
            revenueToday: Math.floor(Math.random() * 50000) + 5000,
            deliveredOrders: Math.floor(Math.random() * 40) + 5,
            pendingOrders: Math.floor(Math.random() * 10) + 1,
            cancelledOrders: Math.floor(Math.random() * 5),
            avgDeliveryTime: Math.floor(Math.random() * 20) + 25
          }
        }));
        
        setRestaurants(restaurantsWithStats);
        setError('');
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [auth.token]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashSidebar />
      
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Restaurant Orders Overview</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">You don't have any restaurants yet</h2>
              <p className="text-gray-600 mb-6">Create a restaurant to start managing orders</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantOrdersCard 
                  key={restaurant._id} 
                  restaurant={restaurant} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantOrdersPage;