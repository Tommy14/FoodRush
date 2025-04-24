import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import RestaurantDetails from '../../components/restaurants/RestaurantDetails';
import DashSidebar from '../../components/DashSidebar';
import { getRestaurantById } from '../../services/restaurantService';

const RestaurantDetailsPage = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        
        // Get token from auth state if available
        const token = auth?.token || null;
        
        // Use the service method instead of direct axios call
        const restaurantData = await getRestaurantById(restaurantId, token);
        setRestaurant(restaurantData);
        
        // Check if the current user is the owner of this restaurant
        if (auth.user && auth.user.id) {
          setIsOwner(restaurantData.ownerId === auth.user.id);
        }
        
        setError('');
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        if (err.message.includes('403')) {
          setError('You do not have permission to view this restaurant.');
        } else {
          setError('Failed to load restaurant details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId, auth]);

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
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">Restaurant not found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
    
  return (
    <div className="flex min-h-screen bg-gray-50">
      {isOwner && <DashSidebar />}
      
      <div className={`flex-1 p-4 ${isOwner ? 'lg:ml-64' : ''}`}>
        <div className="max-w-5xl mx-auto">
          <RestaurantDetails restaurant={restaurant} isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsPage;