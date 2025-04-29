import { useEffect, useState } from 'react';
import { fetchCustomerOrders } from '../services/orderService';
import DashSidebar from '../components/DashSidebar';
import { Package, CookingPot, Truck, CheckCircle, Clock, Boxes } from 'lucide-react'; // Added Boxes for heading icon

const statusSteps = [
  'placed',
  'preparing',
  'ready_for_delivery',
  'picked_up',
  'delivered'
];

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  

  const fetchOrders = async () => {
    try {
      const enrichedOrders = await fetchCustomerOrders();
      setOrders(enrichedOrders);
      console.log('Fetched orders:', enrichedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
  
    return () => clearInterval(interval);
  }, []);
  

  const filteredOrders = orders
    .filter(order => {
      if (!selectedStatus) return true;
      const effectiveStatus = order.deliveryStatus || order.status;
      return effectiveStatus === selectedStatus;
    })
    .sort((a, b) => {
      const isDeliveredA = (a.deliveryStatus || a.status) === 'delivered';
      const isDeliveredB = (b.deliveryStatus || b.status) === 'delivered';
      if (isDeliveredA && !isDeliveredB) return 1;
      if (!isDeliveredA && isDeliveredB) return -1;
      return 0;
    });

  const statusFilters = [
    { key: 'placed', label: 'Placed', icon: Package },
    { key: 'preparing', label: 'Preparing', icon: CookingPot },
    { key: 'ready_for_delivery', label: 'Ready', icon: Truck },
    { key: 'picked_up', label: 'Picked Up', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  return (
    <div className="flex min-h-screen">
      <DashSidebar />

      <div className="min-h-screen flex-1 bg-gray-100 px-10 py-24">
        {/*Heading */}
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 flex items-center gap-3">
          <Boxes className="w-8 h-8 text-green-600" />
          My Orders
        </h1>

        {/*Filter Bar */}
        <div className="flex items-center gap-4 mb-8">
          {statusFilters.map((filter) => {
            const Icon = filter.icon;
            const isSelected = selectedStatus === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setSelectedStatus(filter.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  isSelected ? 'bg-green-100 border-green-500' : 'border-gray-300'
                } hover:bg-green-50 transition`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-green-700' : 'text-gray-500'}`} />
                <span className={`text-sm font-semibold ${
                  isSelected ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {filter.label}
                </span>
              </button>
            );
          })}
          {selectedStatus && (
            <button
              onClick={() => setSelectedStatus(null)}
              className="ml-auto text-sm font-medium text-gray-500 underline hover:text-gray-700"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/*No Orders Message */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <CheckCircle className="w-10 h-10 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No orders found for this status.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Existing Order Cards (unchanged) */}
            {filteredOrders.map((order) => {
              const effectiveStatus = order.deliveryStatus || order.status;
              const currentStep = statusSteps.indexOf(effectiveStatus);

              return (
                <div
                  key={order._id}
                  className="w-full min-w-[340px] md:min-w-[460px] bg-white rounded-2xl border border-green-300 shadow-lg p-6 hover:shadow-xl hover:scale-[1.01] transition transform"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl border border-black">
                    <div className="text-xs text-gray-400 font-medium">Order ID</div>
                    <div className="text-[13px] font-semibold text-gray-700 break-all text-right">#FR-{order._id.slice(-6).toUpperCase()}</div>
                  </div>

                  {/* Status Steps */}
                  <div className="px-6 py-3 border-l border-r border-black">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-1">
                      {statusSteps.map((step, index) => (
                        <span
                          key={step}
                          className={`capitalize ${
                            effectiveStatus === 'delivered' && index === currentStep
                              ? 'text-green-600 font-semibold'
                              : index === currentStep
                              ? 'text-blue-600'
                              : index < currentStep
                              ? 'text-green-500'
                              : 'text-gray-300'
                          }`}
                        >
                          {step.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          effectiveStatus === 'delivered'
                            ? 'bg-green-500'
                            : 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-pulse'
                        }`}
                        style={{
                          width: `${((currentStep + 1) / statusSteps.length) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="px-6 py-4 space-y-2 text-sm text-gray-700 border-l border-r border-black">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                          effectiveStatus === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {effectiveStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment</span>
                      <span className="font-medium text-gray-800">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total</span>
                      <span className="font-bold text-green-700">Rs. {order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="px-6 py-4 bg-gray-50 rounded-b-xl text-[13px] text-gray-600 border-t border-gray-100 space-y-1 border border-black">
                    <div className="flex justify-between">
                      <span>Ordered At</span>
                      <span className="text-gray-700 font-medium">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 mb-0.5">Delivery Address</span>
                      <p className="font-medium text-gray-800 leading-snug">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  {/* 🧾 Ordered Items */}
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Ordered Items</h3>
                    <div className="max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    <ul className="divide-y divide-gray-200">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-10 h-10 rounded border object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-800">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} × Rs. {item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-gray-700">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;
