import { useEffect, useState } from 'react';
import { fetchAssignedOrders, updateDeliveryStatus, fetchAvailability, toggleAvailability} from '../services/deliveryService';
import { apiPrivate } from '../config/api';
import DashSidebar from '../components/DashSidebar';

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetchAssignedOrders();
      setDeliveries(res);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const loadAvailability = async () => {
    try {
      const res = await fetchAvailability();
      setIsAvailable(res.data.isAvailable);
    } catch (error) {
      console.error('Failed to fetch availability', error);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const res = await toggleAvailability();
      setIsAvailable(res.data.isAvailable);
    } catch (error) {
      console.error('Failed to toggle availability', error);
    }
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  useEffect(() => {
    fetchOrders();
    loadAvailability();
  }, []);

  return (
    <div className="flex min-h-screen">
      <DashSidebar />

      <main className="flex-1 bg-gray-100 p-8 overflow-auto mt-16">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
          <h1 className="text-3xl font-extrabold text-gray-700">Delivery Dashboard</h1>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {isAvailable ? 'Available' : 'Not Available'}
            </span>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-md shadow transition ${
                isAvailable ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
              onClick={handleToggleAvailability}
            >
              Toggle
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {Array.isArray(deliveries) && deliveries.length > 0 ? (
            deliveries.map((delivery) => (
              <div
                key={delivery._id}
                className="border border-gray-200 rounded-xl bg-white shadow-sm p-6 transition hover:shadow-md"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded shadow text-sm">
                    <p className="text-gray-500 font-semibold">Order ID</p>
                    <p className="text-gray-700 break-all">{delivery.orderId}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded shadow text-sm">
                    <p className="text-gray-500 font-semibold">Status</p>
                    <p className="text-gray-700 capitalize">{delivery.status}</p>
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

                {delivery.status !== 'delivered' && (
                  <button
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={() =>
                      handleStatusUpdate(
                        delivery._id,
                        delivery.status === 'assigned' ? 'picked_up' : 'delivered'
                      )
                    }
                  >
                    Mark as {delivery.status === 'assigned' ? 'Picked Up' : 'Delivered'}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No assigned deliveries yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
