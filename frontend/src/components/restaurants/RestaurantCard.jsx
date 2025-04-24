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
        // Only fetch if restaurant ID exists
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
        // Return default data to avoid error display
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

  // Get cuisine tags
  const renderCuisineTags = () => {
    if (!restaurant.cuisineType) {
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
            Other
          </span>
        </div>
      );
    }

    if (!restaurant || !restaurant._id) {
      return (
        <div className="bg-gray-100 rounded-lg h-full p-4">
          Loading restaurant data...
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
          {restaurant.cuisineType}
        </span>
      </div>
    );
  };

  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="block h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
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

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-500" />
          )}
        </button>

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
        <h2 className="text-xl font-semibold line-clamp-1">
          {restaurant.name}
        </h2>

        {/* Cuisine Tags */}
        {renderCuisineTags()}

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
          {ratingSummary === null && !loading && (
            <div className="text-center text-sm text-red-500 py-1">
              Could not load reviews
            </div>
          )}
        </div>

        <div className="mt-3 text-sm text-gray-600">
          <div className="flex items-start mb-1">
            <MdLocationOn className="mr-1 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1 flex items-center">
              <div className="text-gray-500 text-sm flex items-start mt-1">
                <MdLocationOn className="text-gray-400 mt-0.5 mr-1 flex-shrink-0" />
                <span>
                  {/* Prefer original address when available */}
                  {(() => {
                    // First check for original address
                    if (restaurant.originalAddress) {
                      if (typeof restaurant.originalAddress === "object") {
                        return `${restaurant.originalAddress.street || ""}, ${
                          restaurant.originalAddress.city || ""
                        }`;
                      }
                      return restaurant.originalAddress;
                    }
                    // Fall back to geocoded address
                    if (restaurant.geocodedAddress) {
                      return restaurant.geocodedAddress;
                    }
                    // Handle standard address field
                    if (restaurant.address) {
                      if (typeof restaurant.address === "object") {
                        return `${restaurant.address.street || ""}, ${
                          restaurant.address.city || ""
                        }`;
                      }
                      return restaurant.address;
                    }
                    // Last resort
                    return "Address unavailable";
                  })()}
                </span>
              </div>
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            <div className="flex items-center">
              <MdAccessTime className="mr-1 flex-shrink-0" />
              <span>{restaurant.estimatedDeliveryTime || "30-45"} min</span>
            </div>

            {restaurant.distance && (
              <div className="flex items-center">
                <FaMotorcycle className="mr-1 flex-shrink-0" />
                <span>{(restaurant.distance / 1000).toFixed(1)} km</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors">
            View Menu
          </button>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
