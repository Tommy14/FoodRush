import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaPhoneAlt, FaGlobe, FaClock, FaUser, FaUtensils } from 'react-icons/fa';
import { MdLocationOn, MdRestaurantMenu, MdDeliveryDining, MdVerified, MdAccessTime } from 'react-icons/md';
import { IoFastFoodOutline } from 'react-icons/io5';
import GoogleMapComponent from './LocationMap';
import ReviewsSection from '../reviews/ReviewsSection';
import { getRestaurantReviewSummary } from '../../services/reviewService';

const RestaurantDetails = ({ restaurant, isOwner = false }) => {
  const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, totalReviews: 0 });

  useEffect(() => {
    const fetchReviewSummary = async () => {
      if (restaurant._id) {
        try {
          const summaryData = await getRestaurantReviewSummary(restaurant._id);
          setReviewSummary(summaryData);
        } catch (err) {
          console.error("Error fetching review summary:", err);
        }
      }
    };

    fetchReviewSummary();
  }, [restaurant._id]);

  const formattedBusinessHours = useMemo(() => {
    if (!restaurant.openingHours) return [];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => {
      const dayData = restaurant.openingHours[day];
      if (!dayData) {
        return { day: day.charAt(0).toUpperCase() + day.slice(1), isClosed: true };
      }
      return {
        day: day.charAt(0).toUpperCase() + day.slice(1),
        openTime: dayData.open || '00:00',
        closeTime: dayData.close || '00:00',
        isClosed: dayData.isClosed || false
      };
    });
  }, [restaurant.openingHours]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sampleBusinessHours = formattedBusinessHours.length === 0
    ? daysOfWeek.map(day => ({ day, isClosed: day === 'Sunday', openTime: '10:00 AM', closeTime: '9:00 PM' }))
    : formattedBusinessHours;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-6xl mx-auto">
        {/* Cover Image */}
        <div className="relative h-72 md:h-96">
          <img
            src={restaurant.coverImage || 'https://placehold.co/1200x800?text=No+Cover+Image'}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          <div className="absolute bottom-6 left-6 flex items-center gap-4">
            <div className="bg-white p-1 rounded-full shadow-md">
              <img
                src={restaurant.logo || 'https://placehold.co/150x150?text=Logo'}
                alt="logo"
                className="h-20 w-20 md:h-24 md:w-24 object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-sm">{restaurant.name}</h1>
              <div className="flex flex-wrap mt-2 gap-2">
                <div className="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                  <FaStar className="text-yellow-400 mr-1" /> {reviewSummary.averageRating?.toFixed(1) || '0.0'}
                </div>
                <div className="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                  <FaUtensils className="mr-1" /> {restaurant.cuisineType || 'Various Cuisine'}
                </div>
                <div className="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                  {restaurant.priceRange || '$'}
                </div>
                {restaurant.status === 'APPROVED' && (
                  <div className="flex items-center bg-blue-600/70 px-3 py-1 rounded-full text-sm text-white">
                    <MdVerified className="mr-1" /> Verified
                  </div>
                )}
              </div>
            </div>
          </div>
          {isOwner && (
            <div className="absolute top-6 right-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium shadow ${restaurant.isOpen ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                {restaurant.isOpen ? '✓ Open Now' : '✕ Closed'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          {isOwner && (
            <div className="flex gap-4 mb-8">
              <Link to={`/edit-restaurant/${restaurant._id}`} className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 text-center">
                Edit Restaurant
              </Link>
              <Link to={`/restaurant/${restaurant._id}/menu`} className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 text-center">
                Manage Menu
              </Link>
            </div>
          )}

          {/* About */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <IoFastFoodOutline className="mr-2" /> About
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {restaurant.description || 'No description available.'}
            </p>
          </section>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Contact & Location */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <MdLocationOn className="mr-2" /> Contact & Location
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MdLocationOn className="text-gray-500 mr-3" />
                  <span>{restaurant.address?.formattedAddress || `${restaurant.address?.street || ''}, ${restaurant.address?.city || ''}, ${restaurant.address?.state || ''}`}</span>
                </div>
                <div className="flex items-center">
                  <FaPhoneAlt className="text-gray-500 mr-3" />
                  <span>{restaurant.phoneNumber || 'Not provided'}</span>
                </div>
                {restaurant.website && (
                  <div className="flex items-center">
                    <FaGlobe className="text-gray-500 mr-3" />
                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {restaurant.website.replace(/^https?:\/\//i, '')}
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <GoogleMapComponent 
                  position={restaurant.location?.coordinates || null}
                  name={restaurant.name}
                  address={restaurant.address?.formattedAddress}
                />
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <MdAccessTime className="mr-2" /> Business Hours
              </h3>
              <div className="divide-y divide-gray-200">
                {sampleBusinessHours.map((hour, index) => (
                  <div key={index} className="flex justify-between py-2">
                    <span>{hour.day}</span>
                    <span className={`${hour.isClosed ? 'text-gray-400 italic' : 'text-gray-700'}`}>
                      {hour.isClosed ? 'Closed' : `${hour.openTime} - ${hour.closeTime}`}
                    </span>
                  </div>
                ))}
              </div>
              {formattedBusinessHours.length === 0 && (
                <p className="text-xs text-gray-400 mt-2 text-center italic">* Sample hours. Actual hours may vary.</p>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <MdDeliveryDining className="mr-2" /> Delivery Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm flex items-center">
                <MdDeliveryDining className="text-2xl text-rose-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Time</p>
                  <p className="font-bold text-gray-800">{restaurant.estimatedDeliveryTime || '30-45'} min</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm flex items-center">
                <FaClock className="text-2xl text-rose-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Preparation Time</p>
                  <p className="font-bold text-gray-800">{restaurant.preparationTime || '20-30'} min</p>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="mb-10 border-t pt-8">
            <ReviewsSection restaurantId={restaurant._id} />
          </section>

          {/* Owner Info */}
          {isOwner && (
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2" /> Restaurant Status
              </h2>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span>Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    restaurant.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    restaurant.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {restaurant.status}
                  </span>
                </div>
                {restaurant.status === 'PENDING' && (
                  <p className="text-sm text-yellow-700">Your restaurant is under review.</p>
                )}
                {restaurant.status === 'REJECTED' && restaurant.rejectionReason && (
                  <p className="text-sm text-red-700">Reason: {restaurant.rejectionReason}</p>
                )}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
