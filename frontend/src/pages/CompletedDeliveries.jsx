// src/pages/CompletedDeliveries.jsx

import { useEffect, useState } from 'react';
import { fetchCompletedDelivery } from '../services/deliveryService';
import DashSidebar from '../components/DashSidebar';

const CompletedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);

  const fetchCompletedDeliveries = async () => {
    try {
        const res = await fetchCompletedDelivery();
      setDeliveries(res.data);
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

      <main className="flex-1 bg-gray-100 p-8 overflow-auto mt-16">
        <h1 className="text-2xl font-bold mb-6">✅ Completed Deliveries</h1>

        {deliveries.length === 0 ? (
          <p className="text-gray-600">No completed deliveries found.</p>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {deliveries.map((delivery) => (
              <div key={delivery._id} className="bg-white rounded-lg shadow-md p-4 mb-6 space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-100 p-3 rounded shadow text-sm">
                    <p className="text-gray-500 font-semibold">Order ID</p>
                    <p className="text-gray-700 break-all">{delivery.orderId}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded shadow text-sm">
                    <p className="text-gray-500 font-semibold">Delivered At:</p>
                    <p className="text-gray-700 capitalize">{new Date(delivery.deliveredAt).toLocaleString()}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded shadow text-sm">
                    <p className="text-gray-500 font-semibold">Address</p>
                    <p className="text-gray-700">{delivery.deliveryAddress || '—'}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded shadow text-sm">
                    <p className="text-gray-500 font-semibold">Customer</p>
                    <p className="text-gray-700">{delivery.customerName || '—'}</p>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CompletedDeliveries;
