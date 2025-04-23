import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DashSidebar from '../components/DashSidebar';
import RestaurantManageCard from '../components/RestaurantManageCard';
import { FaPlusCircle, FaFilter, FaLayerGroup } from 'react-icons/fa';

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('/bff/restaurants/owner', {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setRestaurants(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load your restaurants. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [auth.token]);

  const toggleRestaurant = async (id, isCurrentlyOpen) => {
    try {
      await axios.patch(`/bff/restaurants/${id}/toggle`, {}, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      
      // Update the restaurants list with the updated restaurant
      setRestaurants(prev => 
        prev.map(restaurant => 
          restaurant._id === id ? { ...restaurant, isOpen: !isCurrentlyOpen } : restaurant
        )
      );
    } catch (err) {
      console.error('Error toggling restaurant status:', err);
      alert('Failed to update restaurant status');
    }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`/bff/restaurants/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      
      // Remove the deleted restaurant from the list
      setRestaurants(prev => prev.filter(restaurant => restaurant._id !== id));
    } catch (err) {
      console.error('Error deleting restaurant:', err);
      alert('Failed to delete restaurant');
    }
  };

  // Filter restaurants based on selected filter
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (filter === 'ALL') return true;
    if (filter === 'OPEN') return restaurant.isOpen;
    if (filter === 'CLOSED') return !restaurant.isOpen;
    return restaurant.status === filter;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashSidebar />
      
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">My Restaurants</h1>
            
            <Link 
              to="/create-restaurant"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FaPlusCircle className="mr-2" /> Create New Restaurant
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'ALL' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <FaLayerGroup className="inline mr-1" /> All
            </button>
            <button
              onClick={() => setFilter('OPEN')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setFilter('CLOSED')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'CLOSED' ? 'bg-gray-100 text-gray-800 font-medium' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Closed
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">You don't have any restaurants yet</h2>
              <p className="text-gray-600 mb-6">Create your first restaurant to start managing your business</p>
              <Link 
                to="/create-restaurant"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaPlusCircle className="mr-2" /> Create Restaurant
              </Link>
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100">
              <h2 className="text-lg font-medium text-gray-700">No restaurants match the selected filter</h2>
              <button 
                onClick={() => setFilter('ALL')}
                className="mt-4 inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
              >
                <FaFilter className="mr-2" /> Show all restaurants
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantManageCard 
                  key={restaurant._id} 
                  restaurant={restaurant}
                  onToggle={toggleRestaurant}
                  onDelete={deleteRestaurant}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageRestaurants;