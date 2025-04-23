import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { MdAccessTime, MdLocationOn, MdRateReview } from "react-icons/md";
import { useSelector } from "react-redux";
import { getRestaurantReviewSummary } from "../services/restaurantService";

const RestaurantManageCard = ({ restaurant, onToggle, onDelete }) => {
  const [ratingSummary, setRatingSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchRatingSummary = async () => {
      try {
        const data = await getRestaurantReviewSummary(
          restaurant._id,
          auth.token
        );
        setRatingSummary(data);
      } catch (err) {
        console.error("Error fetching rating summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingSummary();
  }, [restaurant._id, auth.token]);

  const getStatusBadge = (status) => {
    const badgeClasses = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      APPROVED: "bg-green-100 text-green-800 border-green-300",
      REJECTED: "bg-red-100 text-red-800 border-red-300",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
          badgeClasses[status] || "bg-gray-100 text-gray-800 border-gray-300"
        }`}
      >
        {status}
      </span>
    );
  };

  // Generate rating stars display
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />); // Use half star icon
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full max-w-md mx-auto">
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 overflow-hidden">
          <img
            src={
              restaurant.coverImage ||
              "https://placehold.co/600x400?text=No+Cover+Image"
            }
            alt={`${restaurant.name} cover`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Logo Overlay */}
        <div className="absolute bottom-0 left-4 transform translate-y-1/2">
          <div className="p-1 bg-white rounded-full shadow-lg">
            <img
              src={restaurant.logo || "https://placehold.co/150x150?text=Logo"}
              alt={`${restaurant.name} logo`}
              className="h-16 w-16 object-cover rounded-full"
            />
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {getStatusBadge(restaurant.status)}
        </div>

        {/* Open/Closed Status */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              restaurant.isOpen
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-gray-100 text-gray-800 border-gray-300"
            } border`}
          >
            {restaurant.isOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>

      <div className="p-4 pt-10">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold line-clamp-1">
            {restaurant.name}
          </h2>
          <button
            onClick={() => onToggle(restaurant._id, restaurant.isOpen)}
            className={`text-xl ${
              restaurant.isOpen ? "text-green-500" : "text-gray-400"
            } hover:opacity-80 transition-opacity`}
            title={
              restaurant.isOpen
                ? "Currently Open - Click to Close"
                : "Currently Closed - Click to Open"
            }
          >
            {restaurant.isOpen ? <FaToggleOn /> : <FaToggleOff />}
          </button>
        </div>

        {/* Rating Summary Section */}
        <div className="mt-3 border border-gray-100 rounded-md p-3 bg-gray-50">
          {loading ? (
            <div className="flex justify-center py-2">
              <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : ratingSummary ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                  {renderRatingStars(ratingSummary.averageRating || 0)}
                  <span className="font-bold text-lg ml-1">
                    {ratingSummary.averageRating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-xs text-gray-500">/ 5.0</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MdRateReview className="mr-1" />
                  <span>{ratingSummary.totalReviews || 0} reviews</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500 py-1">
              No reviews yet
            </div>
          )}
        </div>

        <div className="mt-3 text-sm text-gray-600">
          <div className="flex items-start mb-1">
            <MdLocationOn className="mr-1 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">
              {restaurant.address?.formattedAddress ||
                `${restaurant.address?.street || ""}, ${
                  restaurant.address?.city || ""
                }`}
            </span>
          </div>
          <div className="flex items-center">
            <MdAccessTime className="mr-1 flex-shrink-0" />
            <span>
              {restaurant.estimatedDeliveryTime || "30-45"} min delivery
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t flex justify-between items-center">
          <Link
            to={`/restaurants/${restaurant._id}`}
            className="inline-flex items-center px-3 py-1.5 rounded text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <FaEye className="mr-1" /> View
          </Link>

          <Link
            to={`/edit-restaurant/${restaurant._id}`}
            className="inline-flex items-center px-3 py-1.5 rounded text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
          >
            <FaEdit className="mr-1" /> Edit
          </Link>

          <button
            onClick={() => onDelete(restaurant._id)}
            className="inline-flex items-center px-3 py-1.5 rounded text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <FaTrashAlt className="mr-1" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManageCard;
