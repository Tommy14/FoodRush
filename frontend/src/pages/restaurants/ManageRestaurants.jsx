import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import DashSidebar from "../../components/DashSidebar";
import Footer from "../../components/Footer";
import RestaurantManageCard from "../../components/restaurants/RestaurantManageCard";
import { FaPlusCircle, FaFilter, FaLayerGroup, FaExclamationTriangle } from "react-icons/fa";

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("/bff/restaurants/owner", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setRestaurants(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load your restaurants. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [auth.token]);

  const toggleRestaurant = async (id, isCurrentlyOpen) => {
    try {
      await axios.patch(
        `/bff/restaurants/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // Update the restaurants list with the updated restaurant
      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant._id === id
            ? { ...restaurant, isOpen: !isCurrentlyOpen }
            : restaurant
        )
      );
    } catch (err) {
      console.error("Error toggling restaurant status:", err);
      setError("Failed to update restaurant status");
    }
  };

  const deleteRestaurant = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this restaurant? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/bff/restaurants/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      // Remove the deleted restaurant from the list
      setRestaurants((prev) =>
        prev.filter((restaurant) => restaurant._id !== id)
      );
    } catch (err) {
      console.error("Error deleting restaurant:", err);
      setError("Failed to delete restaurant");
    }
  };

  // Filter restaurants based on selected filter
  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (filter === "ALL") return true;
    if (filter === "OPEN") return restaurant.isOpen;
    if (filter === "CLOSED") return !restaurant.isOpen;
    return restaurant.status === filter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-grow">
        <DashSidebar />
        <div className="flex-1 mt-16 p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-green-500 to-emerald-600">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">
                      My Restaurants
                    </h1>
                    <p className="text-green-100 mt-1">
                      Manage your restaurant portfolio
                    </p>
                  </div>
                  <Link
                    to="/create-restaurant"
                    className="flex items-center px-4 py-2 mt-4 sm:mt-0 bg-white text-green-700 rounded-md hover:bg-green-50 transition-colors shadow-sm"
                  >
                    <FaPlusCircle className="mr-2" /> Create New Restaurant
                  </Link>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FaFilter className="mr-2 text-green-500" />
                    <span className="font-medium">Filter by status:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter("ALL")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition duration-200 ${
                        filter === "ALL"
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      <FaLayerGroup className="inline mr-1" /> All
                    </button>
                    <button
                      onClick={() => setFilter("OPEN")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition duration-200 ${
                        filter === "OPEN"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => setFilter("CLOSED")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition duration-200 ${
                        filter === "CLOSED"
                          ? "bg-gray-200 text-gray-800 border-gray-300"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      Closed
                    </button>
                    <button
                      onClick={() => setFilter("PENDING")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition duration-200 ${
                        filter === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setFilter("APPROVED")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition duration-200 ${
                        filter === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      Approved
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mx-4 my-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    <p>{error}</p>
                  </div>
                  <button
                    onClick={() => setError("")}
                    className="mt-2 text-sm text-red-700 hover:text-red-900"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className="p-4">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                  </div>
                ) : restaurants.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      You don't have any restaurants yet
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Create your first restaurant to start managing your business
                    </p>
                    <Link
                      to="/create-restaurant"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <FaPlusCircle className="mr-2" /> Create Restaurant
                    </Link>
                  </div>
                ) : filteredRestaurants.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
                    <h2 className="text-lg font-medium text-gray-700">
                      No restaurants match the selected filter
                    </h2>
                    <button
                      onClick={() => setFilter("ALL")}
                      className="mt-4 inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                    >
                      <FaFilter className="mr-2" /> Show all restaurants
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRestaurants.map((restaurant) => (
                      <RestaurantManageCard
                        key={restaurant._id}
                        restaurant={restaurant}
                        onToggle={toggleRestaurant}
                        onDelete={deleteRestaurant}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageRestaurants;