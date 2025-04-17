import { useEffect, useState } from 'react';
import { fetchCustomerOrders } from '../services/orderService';

const statusSteps = [
  'pending',
  'accepted',
  'preparing',
  'ready_for_delivery',
  'assigned',
  'picked_up',
  'delivered'
];

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetchCustomerOrders();
      setOrders(res.data.data);
      console.log('Fetched orders:', res.data.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-10 py-24">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800">📦 My Orders</h1>

      {!Array.isArray(orders) || orders.length === 0 ? (
        <p className="text-gray-500 text-lg">You have no active orders at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => {
            const currentStep = statusSteps.indexOf(order.status);

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
              >
                {/* Step Labels */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] font-medium mb-2">
                    {statusSteps.map((step, index) => (
                      <span
                        key={step}
                        className={`capitalize truncate w-full text-center ${
                          index === currentStep
                            ? 'text-blue-700 font-semibold'
                            : index < currentStep
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Animated Gradient Progress Bar */}
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-pulse rounded-full transition-all duration-700 ease-in-out"
                      style={{ width: `${((currentStep + 1) / statusSteps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Order Info */}
                <div className="space-y-2 text-sm text-gray-800">
                  <div>
                    <p className="text-gray-400 text-xs">Order ID</p>
                    <p className="font-medium break-words">{order._id}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Status</p>
                    <p className={`capitalize font-semibold ${order.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.status.replaceAll('_', ' ')}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Payment</p>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Total</p>
                    <p className="font-medium">Rs. {order.totalAmount}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Ordered At</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Delivery Address</p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
