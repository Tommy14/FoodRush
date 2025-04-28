import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFilter,
  FaStar,
  FaClock,
  FaSort,
  FaSearch,
  FaHeart
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import LocationSearchBar from "../../components/restaurants/LocationSearchBar";
import FoodCategories from "../../components/restaurants/FoodCategories";
import RestaurantCard from "../../components/restaurants/RestaurantCard";
import { getAllRestaurants } from "../../services/restaurantService";
import LocationService from "../../services/locationService";
import { getUserFavorites } from "../../services/favoriteService";
import Footer from "../../components/Footer";

const MAX_LOCATION_AGE = 4 * 60 * 60 * 1000; // 4 hours

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(false);
  const [filters, setFilters] = useState({
    rating: null,
    maxDeliveryTime: null,
    favorites: false,
    sort: "nearest",
  });

  // Fetch favorite restaurants
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const favorites = await getUserFavorites();
        setFavoriteRestaurants(favorites);
      } catch (error) {
        // Don't set error state as this is not critical
      }
    }
    
    if (filters.favorites) {
      fetchFavorites();
    }
  }, [filters.favorites]);

  // Fetch restaurants based on location
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        let restaurantsData;

        if (location && location.coordinates) {
          try {
            restaurantsData = await LocationService.findNearbyRestaurants(
              location.coordinates,
              10000
            );
            
            if (!(Array.isArray(restaurantsData) && restaurantsData.length > 0)) {
              restaurantsData = await getAllRestaurants();
            }
          } catch (err) {
            restaurantsData = await getAllRestaurants();
          }
        } else {
          restaurantsData = await getAllRestaurants();
        }

        // Validate and format restaurant data
        restaurantsData = restaurantsData
          .filter(restaurant => restaurant && typeof restaurant === "object" && restaurant._id)
          .map((restaurant) => {
            const originalAddress = restaurant.address;
            const formattedAddress = typeof originalAddress === "object"
              ? `${originalAddress.street || ""}, ${originalAddress.city || ""}`
              : originalAddress;

            return {
              ...restaurant,
              distance: restaurant.distance || null,
              estimatedDeliveryTime: restaurant.estimatedDeliveryTime || 30,
              geocodedAddress: restaurant.geocodedAddress || formattedAddress || "Location unavailable",
              originalAddress: originalAddress,
            };
          });

        setRestaurants(restaurantsData);
        setError("");
      } catch (err) {
        setError("Failed to load restaurants. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [location]);

  // Handle location change
  const handleLocationChange = (newLocation) => {
    if (
      newLocation &&
      Array.isArray(newLocation.coordinates) &&
      newLocation.coordinates.length === 2
    ) {
      const updatedLocation = {
        ...newLocation,
        address: newLocation.address || newLocation.formattedAddress || "Location selected",
      };

      setLocation(updatedLocation);
      localStorage.setItem(
        "userLocation",
        JSON.stringify({
          ...updatedLocation,
          timestamp: Date.now(),
        })
      );
    }
  };

  // Load saved location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        
        if (!parsedLocation.address && parsedLocation.formattedAddress) {
          parsedLocation.address = parsedLocation.formattedAddress;
        }

        if (
          !parsedLocation.timestamp ||
          Date.now() - parsedLocation.timestamp <= MAX_LOCATION_AGE
        ) {
          setLocation(parsedLocation);
        }
      } catch (e) {
        localStorage.removeItem("userLocation");
      }
    }
  }, []);

  const handleCategorySelect = (categoryId) => {
    setCategory(categoryId);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleMobileFilters = () => {
    setShowFiltersOnMobile(!showFiltersOnMobile);
  };

  // Filter restaurants based on criteria
  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Category filter
    const matchesCategory =
      category === "all" ||
      (restaurant.cuisineTypes &&
        (Array.isArray(restaurant.cuisineTypes)
          ? restaurant.cuisineTypes.some(
              cuisine => cuisine.toLowerCase() === category.toLowerCase() ||
                        cuisine.toLowerCase().includes(category.toLowerCase())
            )
          : restaurant.cuisineTypes.toLowerCase() === category.toLowerCase() ||
            restaurant.cuisineTypes.toLowerCase().includes(category.toLowerCase())));

    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.cuisineTypes && restaurant.cuisineTypes.toLowerCase().includes(searchQuery.toLowerCase()));

    // Rating filter
    const matchesRating = !filters.rating || restaurant.rating >= filters.rating;

    // Delivery time filter
    const matchesDeliveryTime = !filters.maxDeliveryTime ||
      (restaurant.estimatedDeliveryTime && restaurant.estimatedDeliveryTime <= filters.maxDeliveryTime);
        
    // Favorites filter
    const matchesFavorites = !filters.favorites || 
      favoriteRestaurants.some(fav => fav._id === restaurant._id);

    return matchesCategory && matchesSearch && matchesRating && matchesDeliveryTime && matchesFavorites;
  });

  // Sort filtered restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (filters.sort === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    } else if (filters.sort === "delivery") {
      return (a.estimatedDeliveryTime || 30) - (b.estimatedDeliveryTime || 30);
    } else {
      // Sort by distance (default)
      return (a.distance || 10000) - (b.distance || 10000);
    }
  });

  // Toggle filters
  const toggleFilter = (filterType) => {
    setFilters((prev) => {
      if (filterType === "rating") {
        return { ...prev, rating: prev.rating ? null : 4.5 };
      }
      if (filterType === "maxDeliveryTime") {
        return { ...prev, maxDeliveryTime: prev.maxDeliveryTime ? null : 30 };
      }
      if (filterType === "favorites") {
        return { ...prev, favorites: !prev.favorites };
      }
      if (filterType === "sort") {
        const options = ["nearest", "rating", "delivery"];
        const currentIndex = options.indexOf(prev.sort);
        const nextIndex = (currentIndex + 1) % options.length;
        return { ...prev, sort: options[nextIndex] };
      }
      return prev;
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 pt-16">
      {/* Side Panel for Location - Hidden on mobile, visible on desktop */}
      <div
        className={`md:w-[35%] bg-white md:border-r md:h-screen md:sticky md:top-16 p-4 z-40 
                    ${showFiltersOnMobile ? "fixed inset-0 z-50" : "hidden md:block"}`}
      >
        {/* Close button for mobile view */}
        {showFiltersOnMobile && (
          <button
            onClick={toggleMobileFilters}
            className="absolute top-4 right-4 text-gray-500 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Delivery Location</h3>
          <div className="mb-4">
            <LocationSearchBar onLocationChange={handleLocationChange} />
          </div>

          {location && (
            <div className="text-sm text-gray-600 mt-2">
              <p className="font-medium">Current Location:</p>
              <div className="flex items-start mt-1">
                <MdLocationOn className="text-green-600 mt-0.5 mr-1 flex-shrink-0" />
                <span>{location.address}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Quick Filters</h3>
          <div className="space-y-2">
            {/* Favorites Filter Button */}
            <button
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                filters.favorites ? "bg-red-50 text-red-600" : "hover:bg-gray-50"
              }`}
              onClick={() => toggleFilter("favorites")}
            >
              <FaHeart className={`inline mr-2 ${filters.favorites ? "text-red-600" : "text-gray-400"}`} /> 
              Favorites Only
            </button>
            
            {/* Rating Filter Button */}
            <button
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                filters.rating ? "bg-green-50 text-green-700" : "hover:bg-gray-50"
              }`}
              onClick={() => toggleFilter("rating")}
            >
              <FaStar className="inline mr-2" /> Rating 4.5+
            </button>
            
            {/* Delivery Time Filter Button */}
            <button
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                filters.maxDeliveryTime ? "bg-green-50 text-green-700" : "hover:bg-gray-50"
              }`}
              onClick={() => toggleFilter("maxDeliveryTime")}
            >
              <FaClock className="inline mr-2" /> Under 30 min
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Sort By</h3>
          <button
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50"
            onClick={() => toggleFilter("sort")}
          >
            <FaSort className="inline mr-2" />
            {filters.sort === "nearest" ? "Distance" : 
             filters.sort === "rating" ? "Rating" : "Delivery Time"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        {/* Main Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              {/* Mobile filter button */}
              <button
                className="md:hidden flex items-center text-gray-600"
                onClick={toggleMobileFilters}
              >
                <FaFilter className="mr-1" />
                <span className="text-sm">Filters</span>
              </button>

              {/* Search Bar */}
              <div className="relative flex-grow max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for restaurant or cuisine"
                    className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Mobile Location Display and Selector */}
            <div className="md:hidden mt-3">
              {location ? (
                <div 
                  className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer"
                  onClick={toggleMobileFilters}
                >
                  <MdLocationOn className="text-green-600 mr-2 flex-shrink-0" />
                  <div className="text-sm truncate">
                    <span className="text-gray-500">Delivering to: </span>
                    <span className="font-medium">{location.address}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              ) : (
                <div 
                  className="flex items-center justify-center p-2 bg-green-50 rounded-lg cursor-pointer text-green-700"
                  onClick={toggleMobileFilters}
                >
                  <MdLocationOn className="mr-2" />
                  <span className="font-medium">Set delivery location</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4">
          {/* Categories Scrollbar */}
          <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4">
            <FoodCategories onCategorySelect={handleCategorySelect} />
          </div>

          {/* Applied Filters Pills - Mobile only */}
          <div className="md:hidden mb-4 flex flex-wrap gap-2">
            {filters.favorites && (
              <div className="flex items-center bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm">
                <FaHeart className="mr-1 text-xs" /> Favorites
                <button className="ml-1" onClick={() => toggleFilter("favorites")}>
                  ×
                </button>
              </div>
            )}
            {filters.rating && (
              <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="mr-1 text-xs" /> 4.5+
                <button className="ml-1" onClick={() => toggleFilter("rating")}>
                  ×
                </button>
              </div>
            )}
            {filters.maxDeliveryTime && (
              <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaClock className="mr-1 text-xs" /> &lt;30 min
                <button
                  className="ml-1"
                  onClick={() => toggleFilter("maxDeliveryTime")}
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              <FaSort className="mr-1 text-xs" />
              {filters.sort === "nearest"
                ? "Distance"
                : filters.sort === "rating"
                ? "Rating"
                : "Delivery Time"}
              <button className="ml-1" onClick={() => toggleFilter("sort")}>
                ↻
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
              {!location && (
                <p className="mt-2">
                  Please enter your delivery address to see restaurants near you.
                </p>
              )}
            </div>
          )}

          {/* No Location Selected */}
          {!loading && !error && !location && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium">
                Select a delivery location
              </h3>
              <p className="text-gray-500 mt-2 mb-6">
                We need your location to find restaurants near you
              </p>
              <div className="max-w-md mx-auto">
                <LocationSearchBar onLocationChange={handleLocationChange} />
              </div>
            </div>
          )}

          {/* No Results with Favorites Filter Notification */}
          {!loading && !error && location && sortedRestaurants.length === 0 && filters.favorites && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col items-center">
                <FaHeart className="text-red-200 text-5xl mb-4" />
                <h3 className="text-xl font-medium">No favorite restaurants found</h3>
                <p className="text-gray-500 mt-2 mb-4">
                  You haven't added any restaurants to your favorites yet
                </p>
                <button 
                  onClick={() => toggleFilter("favorites")}
                  className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                >
                  Show all restaurants
                </button>
              </div>
            </div>
          )}

          {/* No Results (not due to favorites filter) */}
          {!loading && !error && location && sortedRestaurants.length === 0 && !filters.favorites && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium">No restaurants found</h3>
              <p className="text-gray-500 mt-2">
                Try changing your location or filters
              </p>
            </div>
          )}

          {/* Restaurant List Section */}
          {!loading && !error && location && sortedRestaurants.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {filters.favorites
                    ? "Your Favorite Restaurants"
                    : searchQuery
                    ? `Results for "${searchQuery}"`
                    : "Restaurants near you"}
                </h2>
                <span className="text-sm text-gray-500">
                  {sortedRestaurants.length} restaurants
                </span>
              </div>

              {/* Restaurant Grid - Responsive layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedRestaurants.map((restaurant) =>
                  restaurant._id ? (
                    <RestaurantCard
                      key={restaurant._id}
                      restaurant={restaurant}
                    />
                  ) : null
                )}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default RestaurantList;