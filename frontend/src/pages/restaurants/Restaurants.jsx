import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaFilter,
  FaStar,
  FaClock,
  FaSort,
  FaSearch,
} from "react-icons/fa";
import { MdDeliveryDining, MdLocationOn } from "react-icons/md";
import LocationSearchBar from "../../components/restaurants/LocationSearchBar";
import FoodCategories from "../../components/restaurants/FoodCategories";
import RestaurantCard from "../../components/restaurants/RestaurantCard";
import { getAllRestaurants } from "../../services/restaurantService";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(false);
  const [filters, setFilters] = useState({
    rating: null,
    maxDeliveryTime: null,
    sort: "nearest",
  });
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        let restaurantsData;

        // If location is available, fetch nearby restaurants
        if (location && location.coordinates) {
          try {
            const endpoint = `/bff/location/nearby?lat=${location.coordinates[1]}&lng=${location.coordinates[0]}&distance=10000`;
            const response = await axios.get(endpoint);

            // Check if we got back valid restaurant data
            if (
              response.data &&
              Array.isArray(response.data) &&
              response.data.length > 0
            ) {
              restaurantsData = response.data;
              console.log("Found nearby restaurants:", restaurantsData.length);
            } else {
              // Fall back to getting all restaurants if nearby search returned no results
              console.log(
                "No nearby restaurants found, fetching all restaurants"
              );
              restaurantsData = await getAllRestaurants();
            }

            
          } catch (err) {
            console.error("Error fetching nearby restaurants:", err);
            // Fall back to getting all restaurants
            restaurantsData = await getAllRestaurants();
          }
        } else {
          // Use the service method for regular restaurant fetching
          restaurantsData = await getAllRestaurants();
          console.log("No location provided, fetching all restaurants");
        }

        setRestaurants(restaurantsData);
        setError("");
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [location]);

  // Rest of your component remains the same...
  // Handle location change
  const handleLocationChange = (newLocation) => {
    if (
      newLocation &&
      Array.isArray(newLocation.coordinates) &&
      newLocation.coordinates.length === 2
    ) {
      setLocation(newLocation);
    } else {
      console.error("Invalid location format:", newLocation);
    }
    localStorage.setItem("userLocation", JSON.stringify(newLocation));
  };

  // Check for saved location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (e) {
        localStorage.removeItem("userLocation");
      }
    }
  }, []);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setCategory(categoryId);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Toggle mobile filters visibility
  const toggleMobileFilters = () => {
    setShowFiltersOnMobile(!showFiltersOnMobile);
  };

  // Filter restaurants based on selected category and search query
  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Skip category filter if "all" is selected
    const matchesCategory =
      category === "all" ||
      (restaurant.cuisineType &&
        (Array.isArray(restaurant.cuisineType)
          ? restaurant.cuisineType.some(
              (cuisine) =>
                cuisine.toLowerCase() === category.toLowerCase() ||
                cuisine.toLowerCase().includes(category.toLowerCase())
            )
          : restaurant.cuisineType.toLowerCase() === category.toLowerCase() ||
            restaurant.cuisineType
              .toLowerCase()
              .includes(category.toLowerCase())));

    // Filter by search query (case insensitive)
    const matchesSearch =
      searchQuery === "" ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.cuisineType &&
        restaurant.cuisineType
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    // Apply rating filter if active
    const matchesRating =
      !filters.rating || restaurant.rating >= filters.rating;

    // Apply delivery time filter if active
    const matchesDeliveryTime =
      !filters.maxDeliveryTime ||
      (restaurant.estimatedDeliveryTime &&
        restaurant.estimatedDeliveryTime <= filters.maxDeliveryTime);

    return (
      matchesCategory && matchesSearch && matchesRating && matchesDeliveryTime
    );
  });

  // Sort filtered restaurants based on selected sort option
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (filters.sort === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    } else if (filters.sort === "delivery") {
      const aTime = a.estimatedDeliveryTime || 30;
      const bTime = b.estimatedDeliveryTime || 30;
      return aTime - bTime;
    } else {
      // Sort by distance (default)
      const aDist = a.distance || 10000;
      const bDist = b.distance || 10000;
      return aDist - bDist;
    }
  });

  console.log(
    "Restaurant cuisine types:",
    restaurants.map((r) => r.cuisineType)
  );
  console.log("Selected category:", category);
  console.log(
    "Matching restaurants:",
    restaurants.filter(
      (r) =>
        r.cuisineType &&
        r.cuisineType.toLowerCase().includes(category.toLowerCase())
    )
  );

  // Toggle filter
  const toggleFilter = (filterType) => {
    setFilters((prev) => {
      // For ratings and delivery time filters, toggle between null and a value
      if (filterType === "rating") {
        return { ...prev, rating: prev.rating ? null : 4.5 };
      }
      if (filterType === "maxDeliveryTime") {
        return { ...prev, maxDeliveryTime: prev.maxDeliveryTime ? null : 30 };
      }
      // For sort, cycle through options
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Side Panel for Location - Hidden on mobile, visible on desktop */}
      <div
        className={`md:w-80 bg-white md:border-r md:h-screen md:sticky md:top-0 p-4 z-40 
                      ${
                        showFiltersOnMobile
                          ? "fixed inset-0 z-50"
                          : "hidden md:block"
                      }`}
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
          <Link
            to="/"
            className="text-green-600 font-bold text-xl flex items-center mb-6"
          >
            <FaShoppingBag className="mr-2" />
            Food Rush
          </Link>

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
            <button
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                filters.rating
                  ? "bg-green-50 text-green-700"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => toggleFilter("rating")}
            >
              <FaStar className="inline mr-2" /> Rating 4.5+
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                filters.maxDeliveryTime
                  ? "bg-green-50 text-green-700"
                  : "hover:bg-gray-50"
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
            {filters.sort === "nearest"
              ? "Distance"
              : filters.sort === "rating"
              ? "Rating"
              : "Delivery Time"}
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

              {/* Delivery Toggle */}
              <div className="hidden md:block">
                <button className="flex items-center text-green-600 font-medium">
                  <MdDeliveryDining className="mr-1 text-xl" />
                  Delivery
                </button>
              </div>
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
                  Please enter your delivery address to see restaurants near
                  you.
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

          {/* No Results */}
          {!loading && !error && location && sortedRestaurants.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium">No restaurants found</h3>
              <p className="text-gray-500 mt-2">
                Try changing your location or filters
              </p>
            </div>
          )}

          {/* Special Offers Section */}
          {!loading && !error && location && sortedRestaurants.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">Special Offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold">
                    40% Off Your First Order
                  </h3>
                  <p className="text-sm mb-2">Use code: FIRSTORDER</p>
                  <Link
                    to="/signup"
                    className="text-green-600 font-medium text-sm"
                  >
                    Order now &rarr;
                  </Link>
                </div>
                <div className="bg-gradient-to-r from-orange-100 to-amber-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold">
                    Free Delivery on orders $15+
                  </h3>
                  <p className="text-sm mb-2">Valid until April 30, 2025</p>
                  <Link
                    to="/restaurants"
                    className="text-amber-600 font-medium text-sm"
                  >
                    Browse restaurants &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Restaurant List Section */}
          {!loading && !error && location && sortedRestaurants.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {searchQuery
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
      </div>
    </div>
  );
};

export default RestaurantList;
