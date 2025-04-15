// src/pages/DeliveryDashboard.jsx

import { useEffect, useState } from 'react';
import { fetchAssignedOrders, updateDeliveryStatus } from '../services/deliveryService';
import axios from '../services/axiosInstance'; // use base URL here
import DashSidebar from '../components/DashSidebar';

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/bff/delivery/my-deliveries', {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlYTJkZTY5MzMzMWQwNWExNDQzN2QiLCJyb2xlIjoiZGVsaXZlcnlfcGVyc29uIiwiZW1haWwiOiJkZWxpdmVyeUBnbWFpbC5jb20iLCJpYXQiOjE3NDQ3NDEwODksImV4cCI6MTc0NDc0NDY4OX0.yJFMet14O8fS7T9YuhVYFvzCORQtZtAl0ElWMFPUZz4`
        }
      });
  
      console.log('📦 Orders Response:', res.data); // 👀 See this!
      setDeliveries(res.data.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };  

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      fetchOrders(); // refresh
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const toggleAvailability = async () => {
    try {
      const res = await axios.patch('/bff/auth/toggle-availability', {}, {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlYTJkZTY5MzMzMWQwNWExNDQzN2QiLCJyb2xlIjoiZGVsaXZlcnlfcGVyc29uIiwiZW1haWwiOiJkZWxpdmVyeUBnbWFpbC5jb20iLCJpYXQiOjE3NDQ3NDEwODksImV4cCI6MTc0NDc0NDY4OX0.yJFMet14O8fS7T9YuhVYFvzCORQtZtAl0ElWMFPUZz4`
        }
      });
      setIsAvailable(res.data.isAvailable);
    } catch (error) {
      console.error('Failed to toggle availability', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DashSidebar />

      {/* Main Dashboard */}
      <main className="flex-1 bg-gray-100 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">🚚 Delivery Dashboard</h1>

        <div className="flex items-center gap-3">
            <span>{isAvailable ? '✅ Available' : '❌ Not Available'}</span>
            <button
            className={`px-4 py-1 rounded ${isAvailable ? 'bg-red-500' : 'bg-green-500'} text-white`}
            onClick={toggleAvailability}
            >
            Toggle
            </button>
        </div>

        <div className="space-y-6">
          {Array.isArray(deliveries) && deliveries.length > 0 ? (
            deliveries.map((delivery) => (
              <div key={delivery._id} className="border rounded-lg p-4 shadow-md bg-white">
                <p><strong>Order ID:</strong> {delivery.orderId}</p>
                <p><strong>Status:</strong> {delivery.status}</p>
                <p><strong>Address:</strong> {delivery.deliveryAddress}</p>
                <p><strong>Customer:</strong> {delivery.customerName}</p>
                <div className="mt-3 flex items-center gap-2">
                  {delivery.status !== 'delivered' && (
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                      onClick={() =>
                        handleStatusUpdate(delivery._id, delivery.status === 'assigned' ? 'picked_up' : 'delivered')
                      }
                    >
                      Mark as {delivery.status === 'assigned' ? 'Picked Up' : 'Delivered'}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No assigned deliveries.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
