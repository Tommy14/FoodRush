import React, { useEffect, useState } from 'react';
import { getAllRestaurants } from '../services/restaurantService';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Explore Restaurants</h1>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {restaurants.map((rest) => (
          <RestaurantCard key={rest._id || rest.restaurantId} restaurant={rest} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;