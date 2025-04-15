// src/pages/CompletedDeliveries.jsx

import { useEffect, useState } from 'react';
import axios from '../services/axiosInstance';
import DashSidebar from '../components/DashSidebar';

const CompletedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);

  const fetchCompletedDeliveries = async () => {
    try {
      const res = await axios.get('/bff/delivery/my-deliveries/completed', {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlYTJkZTY5MzMzMWQwNWExNDQzN2QiLCJyb2xlIjoiZGVsaXZlcnlfcGVyc29uIiwiZW1haWwiOiJkZWxpdmVyeUBnbWFpbC5jb20iLCJpYXQiOjE3NDQ3NDEwODksImV4cCI6MTc0NDc0NDY4OX0.yJFMet14O8fS7T9YuhVYFvzCORQtZtAl0ElWMFPUZz4`
        }
      });
      setDeliveries(res.data.data);
    } catch (error) {
      console.error('❌ Failed to fetch completed deliveries:', error);
    }
  };

  useEffect(() => {
    fetchCompletedDeliveries();
  }, []);

  return (
    <div className="flex min-h-screen">
      <DashSidebar />

      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">✅ Completed Deliveries</h1>

        {deliveries.length === 0 ? (
          <p className="text-gray-600">No completed deliveries found.</p>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery._id} className="bg-white p-4 shadow rounded-md">
                <p><strong>Order ID:</strong> {delivery.orderId}</p>
                <p><strong>Delivered At:</strong> {new Date(delivery.deliveredAt).toLocaleString()}</p>
                <p><strong>Address:</strong> {delivery.deliveryAddress}</p>
                <p><strong>Customer:</strong> {delivery.customerName}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CompletedDeliveries;
