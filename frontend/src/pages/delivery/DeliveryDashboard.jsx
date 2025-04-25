import { useEffect, useState } from 'react';
import { fetchAssignedOrders, updateDeliveryStatus, fetchAvailability, toggleAvailability} from '../../services/deliveryService';
import DashSidebar from '../../components/DashSidebar';
import DeliveryMap from '../../components/DeliveryMap';
import { getRestaurantCoordinates, getCustomerCoordinates } from '../../services/deliveryService';

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [mapCoords, setMapCoords] = useState({});
  const [mapLoaded, setMapLoaded] = useState(false);


  const fetchOrders = async () => {
    try {
      const res = await fetchAssignedOrders();
      setDeliveries(res);
      console.log('Fetched Deliveries:', res);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const fetchCoordinates = async (delivery) => {
    try {
      const restaurantCoords = await getRestaurantCoordinates(delivery.orderId);
      const customerCoords = await getCustomerCoordinates(delivery.orderId);

      setMapCoords({ restaurant: restaurantCoords, customer: customerCoords });
    } catch (err) {
      console.error("Error fetching coordinates:", err);
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
    const loadInitialData = async () => {
      await fetchOrders();
      await loadAvailability();
    };
  
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!mapLoaded && deliveries.length > 0) {
      handleShowMap(deliveries[0]);  // Only load the first delivery's map
      setMapLoaded(true);            // prevent re-running
    }
  }, [deliveries, mapLoaded]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashSidebar />
  
      <main className="flex-1 px-8 py-10 overflow-hidden mt-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Delivery Dashboard</h1>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {isAvailable ? 'Available' : 'Not Available'}
            </span>
            <button
              onClick={handleToggleAvailability}
              className={`px-4 py-2 text-sm font-semibold rounded-md shadow ${
                isAvailable ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              Toggle
            </button>
          </div>
        </div>
  
        {/* Map + Delivery Info Side by Side */}
        {Array.isArray(deliveries) && deliveries.length > 0 && mapCoords && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Info Box */}
            <div className="relative bg-white p-6 rounded-xl shadow  h-[400px]">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Current Delivery</h2>
                <div className="text-sm text-gray-700 space-y-2">
                  <p><strong>Order ID :</strong> {deliveries[0].orderId}</p>
                  <p><strong>Customer :</strong> {deliveries[0].customerName}</p>
                  <p><strong>Address  :</strong> {deliveries[0].deliveryAddress}</p>
                  <p><strong>Item :</strong> {deliveries[0].items?.[0]?.name || '—'}</p>
                  <p><strong>Total Price  :</strong> Rs. {deliveries[0].totalPrice?.toLocaleString() || '0.00'}</p>
                  <p><strong>Payment Method :</strong> {deliveries[0].paymentMethod}</p>
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold 
                    ${deliveries[0].status === 'delivered' ? 'bg-green-100 text-green-700' : 
                      deliveries[0].status === 'picked_up' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {deliveries[0].status?.toUpperCase()}
                  </span>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                {deliveries[0].status !== 'delivered' && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        deliveries[0]._id,
                        deliveries[0].status === 'assigned' ? 'picked_up' : 'delivered'
                      )
                    }
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Mark as {deliveries[0].status === 'assigned' ? 'Picked Up' : 'Delivered'}
                  </button>
                )}
                {mapCoords?.restaurant?.length === 2 && mapCoords?.customer?.length === 2 && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${mapCoords.restaurant[1]},${mapCoords.restaurant[0]}&destination=${mapCoords.customer[1]},${mapCoords.customer[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 mt-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-center"
                  >
                    📍 Open in Google Maps
                  </a>
                )}
              </div>
            </div>
  
            {/* Google Map Box */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
              <DeliveryMap origin={mapCoords.restaurant} destination={mapCoords.customer} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
  
  
};

export default DeliveryDashboard;
