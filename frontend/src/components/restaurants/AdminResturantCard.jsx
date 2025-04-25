import React from 'react';
import { FaCheck, FaTimes, FaHourglass, FaUtensils, FaPhone, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const AdminRestaurantCard = ({ restaurant, onUpdateStatus }) => {
  const { _id, name, description, logo, coverImage, status, cuisineTypes, contactPhone, address } = restaurant;
  
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    APPROVED: 'bg-green-100 text-green-800 border-green-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusIcons = {
    PENDING: <FaHourglass className="mr-1" />,
    APPROVED: <FaCheck className="mr-1" />,
    REJECTED: <FaTimes className="mr-1" />
  };

  const buttonStatusColors = {
    PENDING: {
      active: 'bg-yellow-500 text-white shadow-md shadow-yellow-200',
      inactive: 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200'
    },
    APPROVED: {
      active: 'bg-green-500 text-white shadow-md shadow-green-200',
      inactive: 'bg-green-50 text-green-800 hover:bg-green-100 border border-green-200'
    },
    REJECTED: {
      active: 'bg-red-500 text-white shadow-md shadow-red-200',
      inactive: 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
      <div className="relative h-48 overflow-hidden group">
        <img 
          src={coverImage || 'https://via.placeholder.com/800x400?text=No+Cover+Image'} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
        
        {/* Status badge positioned in top right */}
        <div className={`absolute top-4 right-4 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[status]} shadow-sm border`}>
          {statusIcons[status]}
          {status}
        </div>
      </div>
      
      {/* Logo repositioned outside the cover image */}
      <div className="relative px-6">
        <div className="absolute -top-10 left-0 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
          <img 
            src={logo || 'https://via.placeholder.com/200x200?text=No+Logo'} 
            alt={`${name} logo`} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="p-6 pt-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
        <p className="text-gray-600 mb-5 line-clamp-2 min-h-[1rem]">{description}</p>
        
        {/* Restaurant details in a more compact layout */}
        <div className="mb-5 text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">
          {cuisineTypes && cuisineTypes.length > 0 && (
            <div className="flex items-center mb-2 text-gray-700">
              <FaUtensils className="text-orange-500 mr-2 flex-shrink-0" />
              <span className="truncate">{cuisineTypes.join(', ')}</span>
            </div>
          )}
          
          {contactPhone && (
            <div className="flex items-center mb-2 text-gray-700">
              <FaPhone className="text-blue-500 mr-2 flex-shrink-0" />
              <span>{contactPhone}</span>
            </div>
          )}
          
          {address && (
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="text-red-500 mr-2 flex-shrink-0" />
              <span className="truncate">
                {address.street && `${address.street}, `}
                {address.city}
                {address.state && `, ${address.state}`}
              </span>
            </div>
          )}
        </div>
        
        {/* Status management buttons with improved responsive styling */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onUpdateStatus(_id, 'PENDING')} 
              className={`flex-1 flex justify-center items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                status === 'PENDING' 
                  ? buttonStatusColors.PENDING.active
                  : buttonStatusColors.PENDING.inactive
              }`}
            >
              <FaHourglass className="mr-1.5" /> 
              <span>Pending</span>
            </button>
            
            <button
              onClick={() => onUpdateStatus(_id, 'APPROVED')} 
              className={`flex-1 flex justify-center items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                status === 'APPROVED' 
                  ? buttonStatusColors.APPROVED.active
                  : buttonStatusColors.APPROVED.inactive
              }`}
            >
              <FaCheck className="mr-1.5" /> 
              <span>Approve</span>
            </button>
            
            <button
              onClick={() => onUpdateStatus(_id, 'REJECTED')} 
              className={`flex-1 flex justify-center items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                status === 'REJECTED' 
                  ? buttonStatusColors.REJECTED.active
                  : buttonStatusColors.REJECTED.inactive
              }`}
            >
              <FaTimes className="mr-1.5" /> 
              <span>Reject</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRestaurantCard;