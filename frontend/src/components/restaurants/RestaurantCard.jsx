import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaMotorcycle,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { MdAccessTime, MdLocationOn, MdRateReview } from "react-icons/md";
import { useSelector } from "react-redux";
import { getRestaurantReviewSummary } from "../../services/restaurantService";

const RestaurantCard = ({ restaurant }) => {
  const [ratingSummary, setRatingSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchRatingSummary = async () => {
      try {
        if (restaurant && restaurant._id) {
          setLoading(true);
          const data = await getRestaurantReviewSummary(
            restaurant._id,
            auth?.token || null
          );
          setRatingSummary(data);
        } else {
          setRatingSummary(null);
        }
      } catch (err) {
        console.error("Error fetching rating summary:", err);
        setRatingSummary({ averageRating: 0, totalReviews: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchRatingSummary();
  }, [restaurant, restaurant?._id, auth?.token]);

  // Generate rating stars display
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  // Toggle favorite (could be connected to a real service in the future)
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Format address from various possible formats
  const formatAddress = () => {
    if (restaurant.originalAddress) {
      if (typeof restaurant.originalAddress === "object") {
        return `${restaurant.originalAddress.street || ""}, ${
          restaurant.originalAddress.city || ""
        }`;
      }
      return restaurant.originalAddress;
    }
    if (restaurant.geocodedAddress) {
      return restaurant.geocodedAddress;
    }
    if (restaurant.address) {
      if (typeof restaurant.address === "object") {
        return `${restaurant.address.street || ""}, ${
          restaurant.address.city || ""
        }`;
      }
      return restaurant.address;
    }
    return "Address unavailable";
  };

  // Render cuisine tags
  const renderCuisineTags = () => {
    if (!restaurant || !restaurant._id) {
      return null;
    }

    const cuisines = restaurant.cuisineType
      ? Array.isArray(restaurant.cuisineType)
        ? restaurant.cuisineType
        : [restaurant.cuisineType]
      : ["Other"];

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {cuisines.map((cuisine, index) => (
          <span
            key={index}
            className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
          >
            {cuisine}
          </span>
        ))}
      </div>
    );
  };

  if (!restaurant || !restaurant._id) {
    return (
      <div className="bg-gray-100 rounded-lg h-80 p-4 animate-pulse border border-gray-200 shadow-sm">
        <div className="h-1/2 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="block h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100"
    >
      <div className="relative">
        {/* Cover Image with enhanced zoom effect */}
        <div className="h-52 sm:h-56 md:h-64 overflow-hidden relative group">
          <img
            src={
              restaurant.coverImage ||
              "https://placehold.co/600x400?text=No+Cover+Image"
            }
            alt={`${restaurant.name} cover`}
            className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-125 group-hover:brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 group-hover:opacity-80"></div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors z-10"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-500 text-lg hover:text-red-400" />
          )}
        </button>

        {/* Logo Overlay with enhanced zoom effect */}
        <div className="absolute -bottom-6 left-4 z-10">
          <div className="p-1 bg-white rounded-full shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-hidden rounded-full group/logo">
              <img
                src={
                  restaurant.logo || "https://placehold.co/150x150?text=Logo"
                }
                alt={`${restaurant.name} logo`}
                className="h-14 w-14 sm:h-16 sm:w-16 object-cover transition-all duration-500 ease-out group-hover/logo:scale-125"
              />
            </div>
          </div>
        </div>

        {/* Open/Closed Status */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              restaurant.isOpen
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-gray-100 text-gray-800 border-gray-300"
            } border shadow-sm`}
          >
            {restaurant.isOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>

      <div className="p-4 pt-8">
        <h2 className="text-lg sm:text-xl font-semibold line-clamp-1 mt-2">
          {restaurant.name}
        </h2>

        {/* Cuisine Tags */}
        {renderCuisineTags()}

        {/* Rating Summary Section */}
        <div className="mt-3 rounded-md p-2.5 bg-gray-50 border border-gray-100 shadow-sm">
          {loading ? (
            <div className="flex justify-center py-2">
              <div className="w-5 h-5 border-t-2 border-green-500 rounded-full animate-spin"></div>
            </div>
          ) : ratingSummary ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                {renderRatingStars(ratingSummary.averageRating || 0)}
                <span className="font-bold text-lg ml-1">
                  {ratingSummary.averageRating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MdRateReview className="mr-1" />
                <span>{ratingSummary.totalReviews || 0}</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500 py-1">
              No reviews yet
            </div>
          )}
        </div>

        {/* Restaurant details */}
        <div className="mt-3 text-sm text-gray-600 space-y-2.5">
          <div className="flex items-start">
            <MdLocationOn className="mr-1.5 mt-0.5 flex-shrink-0 text-black-600 text-lg" />
            <span className="line-clamp-1">{formatAddress()}</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <MdAccessTime className="mr-1.5 flex-shrink-0 text-balck-600 text-lg" />
              <span>{restaurant.estimatedDeliveryTime || "30-45"} min</span>
            </div>

            {restaurant.distance && (
              <div className="flex items-center">
                <FaMotorcycle className="mr-1.5 flex-shrink-0 text-black-600 text-lg" />
                <span>{(restaurant.distance / 1000).toFixed(1)} km</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
