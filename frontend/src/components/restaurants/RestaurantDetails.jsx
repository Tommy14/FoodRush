import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaPhoneAlt, FaGlobe, FaClock, FaUser } from 'react-icons/fa';
import { MdLocationOn, MdRestaurantMenu, MdDeliveryDining, MdVerified } from 'react-icons/md';
import LocationMap from './LocationMap';

const RestaurantDetails = ({ restaurant, isOwner = false }) => {
  // Handle days display
  const formatBusinessHours = (hours) => {
    if (!hours || hours.length === 0) return 'Not specified';

    return hours.map((hour, index) => (
      <div key={index} className="grid grid-cols-2 gap-2">
        <span className="font-medium">{hour.day}</span>
        <span>
          {hour.isClosed
            ? 'Closed'
            : `${hour.openTime} - ${hour.closeTime}`}
        </span>
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={restaurant.coverImage || 'https://placehold.co/1200x800?text=No+Cover+Image'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* Logo */}
        <div className="absolute bottom-4 left-4 flex items-center">
          <div className="bg-white p-1 rounded-full shadow-lg mr-4">
            <img
              src={restaurant.logo || 'https://placehold.co/150x150?text=Logo'}
              alt={`${restaurant.name} logo`}
              className="h-20 w-20 object-cover rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{restaurant.name}</h1>
            <div className="flex items-center text-white mt-1">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="mr-2">{restaurant.rating || '0.0'}</span>
              <span className="mr-2">•</span>
              <span>{restaurant.cuisineType}</span>
              <span className="mx-2">•</span>
              <span>{restaurant.priceRange}</span>
              {restaurant.status === 'APPROVED' && (
                <>
                  <span className="mx-2">•</span>
                  <MdVerified className="text-blue-400" />
                  <span className="ml-1 text-sm">Verified</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Status Badge for Owners */}
        {isOwner && (
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              restaurant.isOpen 
                ? 'bg-green-100 text-green-800 border-green-300' 
                : 'bg-gray-100 text-gray-800 border-gray-300'
              } border`}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        )}
      </div>

      {/* Restaurant Info */}
      <div className="p-4 md:p-6">
        {/* Owner Actions */}
        {isOwner && (
          <div className="flex gap-3 mb-6">
            <Link 
              to={`/edit-restaurant/${restaurant._id}`}
              className="flex-1 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Restaurant
            </Link>
            <Link 
              to={`/restaurant/${restaurant._id}/menu`}
              className="flex-1 py-2 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transition-colors"
            >
              Manage Menu
            </Link>
          </div>
        )}

        {/* About Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">About</h2>
          <p className="text-gray-700">{restaurant.description || 'No description available.'}</p>
        </div>

        {/* Contact & Location Info with Map */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Contact & Location</h2>
            <div className="space-y-3 mb-4">
              <div className="flex items-start">
                <MdLocationOn className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">
                  {restaurant.address?.formattedAddress || 
                    `${restaurant.address?.street || ''}, ${restaurant.address?.city || ''}, ${restaurant.address?.state || ''} ${restaurant.address?.zipCode || ''}`}
                </span>
              </div>
              
              <div className="flex items-center">
                <FaPhoneAlt className="text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{restaurant.phoneNumber || 'Not provided'}</span>
              </div>
              
              {restaurant.website && (
                <div className="flex items-center">
                  <FaGlobe className="text-gray-500 mr-2 flex-shrink-0" />
                  <a href={restaurant.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">
                    {restaurant.website.replace(/^https?:\/\//i, '')}
                  </a>
                </div>
              )}
            </div>
            
            {/* Location Map */}
            <div className="mt-4">
              <LocationMap 
                position={restaurant.location?.coordinates || null}
                name={restaurant.name}
                address={restaurant.address?.formattedAddress}
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Business Hours</h2>
            <div className="space-y-1 text-sm text-gray-700">
              {restaurant.businessHours && restaurant.businessHours.length > 0 
                ? formatBusinessHours(restaurant.businessHours)
                : 'Business hours not specified'}
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Delivery Information</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
              <MdDeliveryDining className="text-xl text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Delivery Time</p>
                <p className="font-medium">{restaurant.estimatedDeliveryTime || '30-45'} min</p>
              </div>
            </div>
            
            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
              <FaClock className="text-xl text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Preparation Time</p>
                <p className="font-medium">{restaurant.preparationTime || '20-30'} min</p>
              </div>
            </div>
            
            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
              <MdRestaurantMenu className="text-xl text-amber-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Minimum Order</p>
                <p className="font-medium">${restaurant.minimumOrder || '0'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Info - Only shown to the owner */}
        {isOwner && (
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-3">Restaurant Status</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  restaurant.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                  restaurant.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {restaurant.status}
                </span>
              </div>
              
              {restaurant.status === 'PENDING' && (
                <p className="text-sm text-gray-600 mt-1">
                  Your restaurant is under review. We'll notify you once it's approved.
                </p>
              )}
              {restaurant.status === 'REJECTED' && restaurant.rejectionReason && (
                <div className="mt-1">
                  <p className="text-sm font-medium text-red-700">Rejection Reason:</p>
                  <p className="text-sm text-gray-600">{restaurant.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;