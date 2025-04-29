import { useEffect, useState } from 'react';
import { fetchCompletedDeliveries, getRestaurantCoordinates, getCustomerCoordinates } from '../../services/deliveryService';
import DashSidebar from '../../components/DashSidebar';
import DeliveryMap from '../../components/DeliveryMap';

const CompletedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [mapCoords, setMapCoords] = useState({});
  const [mapLoaded, setMapLoaded] = useState(false);

  const loadCompletedDeliveries = async () => {
    try {
      const res = await fetchCompletedDeliveries();
      setDeliveries(res);
    } catch (error) {
      console.error('Failed to fetch completed deliveries:', error);
    }
  };

  const fetchCoordinates = async (delivery) => {
    try {
      const restaurantCoords = await getRestaurantCoordinates(delivery.orderId);
      const customerCoords = await getCustomerCoordinates(delivery._id);
      return { restaurant: restaurantCoords, customer: customerCoords };
    } catch (err) {
      console.error("Error fetching coordinates:", err);
      return null;
    }
  };

  const handleShowMap = async (delivery) => {
    const coords = await fetchCoordinates(delivery);
    if (coords) {
      setMapCoords((prev) => ({
        ...prev,
        [delivery._id]: coords
      }));
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadCompletedDeliveries();
    };
    init();
  }, []);

  useEffect(() => {
    if (!mapLoaded && deliveries.length > 0) {
      handleShowMap(deliveries[0]); // preload first map
      setMapLoaded(true);
    }
  }, [deliveries, mapLoaded]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashSidebar />

      <main className="flex-1 p-8 md:p-10 mt-16 overflow-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10">📦 Completed Deliveries</h1>

        {deliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center space-y-3">
            <p className="text-2xl text-gray-500 font-semibold">No Deliveries Found</p>
            <p className="text-gray-400">Completed deliveries will appear here once available.</p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 xl:grid-cols-1">
            {deliveries.map((delivery) => {
              const coords = mapCoords[delivery._id];

              return (
                <div
                  key={delivery._id}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 border hover:shadow-2xl transition-all duration-300"
                >
                  {/* Delivery Info */}
                  <div className="flex-1 space-y-4 flex flex-col justify-between">

                    <div className="space-y-3">
                      <Attribute label="Order ID" value={delivery.orderId.slice(-6).toUpperCase()} />
                      <Attribute label="Customer" value={delivery.customerName || '—'} />
                      <Attribute label="Address" value={delivery.deliveryAddress || '—'} />
                      <Attribute label="Total Price" value={`Rs. ${delivery.totalPrice?.toLocaleString() || '—'}`} />
                      <Attribute label="Payment" value={delivery.paymentMethod || '—'} />
                      <Attribute label="Delivered At" value={new Date(delivery.deliveredAt).toLocaleString()} />
                    </div>

                    <div>
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-4 py-2 rounded-full mt-2">
                        Delivered
                      </span>
                    </div>
                  </div>

                  {/* Google Map */}
                  <div className="flex-1 h-50 rounded-lg overflow-hidden">
                    {coords ? (
                      <DeliveryMap origin={coords.restaurant} destination={coords.customer} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                        Loading map...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

const Attribute = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-gray-700 break-words">{value}</p>
  </div>
);

export default CompletedDeliveries;
