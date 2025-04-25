// src/pages/CompletedDeliveries.jsx

import { useEffect, useState } from 'react';
import { fetchCompletedDeliveries } from '../../services/deliveryService'; 
import DashSidebar from '../../components/DashSidebar';

const CompletedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);

  const loadCompletedDeliveries = async () => {
    try {
      const res = await fetchCompletedDeliveries(); 
      setDeliveries(res);
    } catch (error) {
      console.error('Failed to fetch completed deliveries:', error);
    }
  };

  useEffect(() => {
    loadCompletedDeliveries();
  }, []);

  return (
    <div className="flex min-h-screen">
      <DashSidebar />

      <main className="flex-1 bg-gray-100 p-8 overflow-auto mt-16">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Completed Deliveries</h1>

        {deliveries.length === 0 ? (
          <p className="text-gray-600">No completed deliveries found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveries.map((delivery) => (
              <div key={delivery._id} className="bg-white rounded-lg shadow p-5 space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-500">Order ID</p>
                  <p className="break-all text-gray-800">{delivery.orderId}</p>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-500">Delivered At</p>
                  <p className="text-gray-800">{new Date(delivery.deliveredAt).toLocaleString()}</p>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-500">Address</p>
                  <p className="text-gray-800">{delivery.deliveryAddress || '—'}</p>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-500">Customer</p>
                  <p className="text-gray-800">{delivery.customerName || '—'}</p>
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
