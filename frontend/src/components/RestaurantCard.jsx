import React from "react";
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const { name, address, isOpen, coverImage } = restaurant;
  const coverUrl = coverImage?.url || "/placeholder.jpg";

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <img
        src={coverUrl}
        alt={name}
        className="h-48 w-full object-cover rounded-t-xl"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{address}</p>
        <div className="mt-3">
          {isOpen ? (
            <span className="inline-block bg-green-100 text-green-700 text-xs font-medium rounded-full px-3 py-1">
              🟢 Open
            </span>
          ) : (
            <span className="inline-block bg-red-100 text-red-600 text-xs font-medium rounded-full px-3 py-1">
              🔴 Closed
            </span>
          )}
          <div className="mt-4">
            <Link
              to={`/restaurants/${restaurant._id}/menu`}
              className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
            >
              View Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
