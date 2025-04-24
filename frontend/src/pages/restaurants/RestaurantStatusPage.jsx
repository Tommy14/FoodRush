import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaFilter, FaHourglass, FaCheck, FaTimes, FaList } from "react-icons/fa";
import DashSidebar from "../../components/DashSidebar";
import AdminRestaurantCard from "../../components/restaurants/AdminResturantCard";
import {
  getAllRestaurantsForAdmin,
  getPendingRestaurants,
  updateRestaurantStatus,
} from "../../services/restaurantService";

const RestaurantStatusPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error("Failed to load restaurants");
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
    PENDING: restaurants.filter(r => r.status === 'PENDING').length,
    APPROVED: restaurants.filter(r => r.status === 'APPROVED').length,
    REJECTED: restaurants.filter(r => r.status === 'REJECTED').length
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      <DashSidebar />

      <div className="flex-1 p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Restaurant Status Management
            </h1>
            
            <div className="bg-white shadow-sm rounded-lg p-1 flex flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter("ALL")}
                className={`px-4 py-2 rounded-md flex items-center ${
                  filter === "ALL" 
                    ? "bg-blue-500 text-white shadow-md" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaList className="mr-2" /> 
                All
                <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                  {counts.ALL}
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter("PENDING")}
                className={`px-4 py-2 rounded-md flex items-center ${
                  filter === "PENDING" 
                    ? "bg-yellow-500 text-white shadow-md" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaHourglass className="mr-2" /> 
                Pending
                <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                  {counts.PENDING}
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter("APPROVED")}
                className={`px-4 py-2 rounded-md flex items-center ${
                  filter === "APPROVED" 
                    ? "bg-green-500 text-white shadow-md" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaCheck className="mr-2" /> 
                Approved
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                  {counts.APPROVED}
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter("REJECTED")}
                className={`px-4 py-2 rounded-md flex items-center ${
                  filter === "REJECTED" 
                    ? "bg-red-500 text-white shadow-md" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaTimes className="mr-2" /> 
                Rejected
                <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                  {counts.REJECTED}
                </span>
              </motion.button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500">Loading restaurants...</p>
            </div>
          ) : (
            <>
              {filteredRestaurants.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <FaFilter className="text-4xl text-gray-300" />
                  </div>
                  <p className="text-xl text-gray-500">
                    No restaurants found with the selected filter.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Try selecting a different status filter.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant, index) => (
                    <motion.div
                      key={restaurant._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
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
        </motion.div>
      </div>
    </div>
  );
};

export default RestaurantStatusPage;