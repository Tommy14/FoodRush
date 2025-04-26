import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaFilter, FaHourglass, FaCheck, FaTimes, FaList, FaExclamationTriangle } from "react-icons/fa";
import DashSidebar from "../../components/DashSidebar";
import Footer from "../../components/Footer";
import AdminRestaurantCard from "../../components/restaurants/AdminResturantCard";
import { getAllRestaurantsForAdmin, getPendingRestaurants, updateRestaurantStatus } from "../../services/restaurantService";

const RestaurantStatusPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const { token } = useSelector((state) => state.auth);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      let data;

      // Only fetch pending restaurants if that's what we're filtering for
      if (filter === "PENDING") {
        data = await getPendingRestaurants(token);
      } else {
        data = await getAllRestaurantsForAdmin(token);
      }

      setRestaurants(data);
      setError("");
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError("Failed to load restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [token, filter]); // Include filter in the dependencies

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateRestaurantStatus(id, status, token);

      // Update local state
      setRestaurants(
        restaurants.map((restaurant) =>
          restaurant._id === id ? { ...restaurant, status } : restaurant
        )
      );

      toast.success(`Restaurant status updated to ${status}`);
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      toast.error("Failed to update restaurant status");
    }
  };

  const filteredRestaurants =
    filter === "ALL"
      ? restaurants
      : restaurants.filter((restaurant) => restaurant.status === filter);

  // Get count of restaurants by status
  const counts = {
    ALL: restaurants.length,
    PENDING: restaurants.filter((r) => r.status === "PENDING").length,
    APPROVED: restaurants.filter((r) => r.status === "APPROVED").length,
    REJECTED: restaurants.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-grow">
        <DashSidebar />
        <div className="flex-1 mt-16 p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-green-500 to-emerald-600">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  Restaurant Status Management
                </h1>
                <p className="text-green-100 mt-1">
                  Approve, reject or manage restaurant applications
                </p>
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
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition-colors ${
                        filter === "ALL"
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : "bg-gray-100 text-gray-500 border-gray-300"
                      }`}
                    >
                      <FaList className="inline mr-1" /> All
                      <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 text-gray-800">
                        {counts.ALL}
                      </span>
                    </button>

                    <button
                      onClick={() => setFilter("PENDING")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition-colors ${
                        filter === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                          : "bg-gray-100 text-gray-500 border-gray-300"
                      }`}
                    >
                      <FaHourglass className="inline mr-1" /> Pending
                      <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-yellow-200 text-yellow-800">
                        {counts.PENDING}
                      </span>
                    </button>

                    <button
                      onClick={() => setFilter("APPROVED")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition-colors ${
                        filter === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-gray-100 text-gray-500 border-gray-300"
                      }`}
                    >
                      <FaCheck className="inline mr-1" /> Approved
                      <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-emerald-200 text-emerald-800">
                        {counts.APPROVED}
                      </span>
                    </button>

                    <button
                      onClick={() => setFilter("REJECTED")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition-colors ${
                        filter === "REJECTED"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : "bg-gray-100 text-gray-500 border-gray-300"
                      }`}
                    >
                      <FaTimes className="inline mr-1" /> Rejected
                      <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-rose-200 text-rose-800">
                        {counts.REJECTED}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Error message */}
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

              {/* Content */}
              <div className="p-4">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                  </div>
                ) : (
                  <>
                    {filteredRestaurants.length === 0 ? (
                      <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-sm">
                        <div className="flex justify-center mb-4">
                          <FaFilter className="text-4xl text-gray-300" />
                        </div>
                        <p className="text-xl text-gray-500">
                          No restaurants found with the selected filter.
                        </p>
                        <p className="text-gray-400 mt-2">
                          Try selecting a different status filter.
                        </p>
                        <button
                          onClick={() => setFilter("ALL")}
                          className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          Show all restaurants
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRestaurants.map((restaurant, index) => (
                          <motion.div
                            key={restaurant._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <AdminRestaurantCard
                              restaurant={restaurant}
                              onUpdateStatus={handleStatusUpdate}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
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

export default RestaurantStatusPage;
