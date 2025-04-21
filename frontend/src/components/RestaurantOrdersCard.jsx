import React from 'react';
import { 
  FaUtensils, FaMapMarkerAlt, FaCalendarDay, 
  FaMoneyBillWave, FaCheck, FaClock, FaTimes 
} from 'react-icons/fa';

const RestaurantOrdersCard = ({ restaurant, onViewOrders }) => {
  const formattedAddress = typeof restaurant.address === 'object' 
    ? `${restaurant.address.street || ''}, ${restaurant.address.city || ''}, ${restaurant.address.state || ''} ${restaurant.address.postalCode || ''}`
    : restaurant.address || 'No address available';

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-5">
      <div className="flex flex-col">
        {/* Restaurant Name and Address */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <FaUtensils className="text-amber-500 mr-2" />
            <h2 className="text-xl font-semibold">Restaurant: {restaurant.name}</h2>
          </div>
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <p>Address: {formattedAddress}</p>
          </div>
        </div>
        
        {/* Order Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <FaCalendarDay className="text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Orders Today:</p>
              <p className="font-bold">{restaurant.stats.ordersToday}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FaMoneyBillWave className="text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Revenue Today:</p>
              <p className="font-bold">LKR {restaurant.stats.revenueToday.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FaCheck className="text-green-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Delivered Orders:</p>
              <p className="font-bold">{restaurant.stats.deliveredOrders}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FaClock className="text-amber-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Pending Orders:</p>
              <p className="font-bold">{restaurant.stats.pendingOrders}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FaTimes className="text-red-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Cancelled Orders:</p>
              <p className="font-bold">{restaurant.stats.cancelledOrders}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FaClock className="text-blue-400 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Avg. Delivery Time:</p>
              <p className="font-bold">{restaurant.stats.avgDeliveryTime} min</p>
            </div>
          </div>
        </div>

        {/* View Orders Button */}
        <div className="mt-auto pt-4">
        <button
            onClick={() => onViewOrders(restaurant._id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOrdersCard;