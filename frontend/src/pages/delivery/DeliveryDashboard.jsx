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

  const formatStatus = (status) => {
    if (!status) return '';
    return status
      .split('_')          // split by underscore
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each part
      .join(' ');           // join back with spaces
  };

  const hasActiveOrder = deliveries.some(
    (delivery) => delivery.status === 'assigned' || delivery.status === 'picked_up'
  );

  const actualAvailability = hasActiveOrder ? false : isAvailable;
  
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
  
      <main className="flex-1 overflow-auto mt-16 p-8">
        {/* Outer Big White Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
  
          {/* Green Header inside White Card */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold">Delivery Dashboard</h1>
              <p className="text-sm opacity-90 mt-1">Manage your current deliveries and navigate easily.</p>
            </div>
  
            {/* Toggle inside Green Box */}
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isAvailable ? 'Available' : 'Not Available'}
              </span>
              <button
                onClick={handleToggleAvailability}
                disabled={hasActiveOrder}
                className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ease-in-out 
                  ${hasActiveOrder 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : actualAvailability 
                      ? 'bg-green-700' 
                      : 'bg-red-500'
                  }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                    actualAvailability ? 'translate-x-6' : ''
                  }`}
                ></div>
              </button>
            </div>
          </div>
  
          {/* Delivery Details + Map */}
          {Array.isArray(deliveries) && deliveries.length > 0 && mapCoords && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Delivery Info */}
              <div className="relative space-y-4">
                {/* Status Badge */}
                <div className="absolute top-0 right-0 mt-2 mr-2">
                  <span className={`text-xs font-bold px-4 py-2 rounded-full ${
                    deliveries[0].status === 'delivered' ? 'bg-green-100 text-green-700' :
                    deliveries[0].status === 'picked_up' ? 'bg-blue-800 text-white' :
                    'bg-yellow-200 text-gray-800'
                  }`}>
                    {formatStatus(deliveries[0].status)}
                  </span>
                </div>
  
                {/* Delivery Info Text */}
                <div className="space-y-2 text-sm text-gray-700 mt-6">
                  <p><span className="font-bold">Order ID:</span> {deliveries[0].orderId}</p>
                  <p><span className="font-bold">Customer:</span> {deliveries[0].customerName}</p>
                  <p><span className="font-bold">Address:</span> {deliveries[0].deliveryAddress}</p>
                  <p><span className="font-bold">Item:</span> {deliveries[0].items?.[0]?.name || '—'}</p>
                  <p><span className="font-bold">Total Price:</span> Rs. {deliveries[0].totalPrice?.toLocaleString() || '0.00'}</p>
                  <p><span className="font-bold">Payment Method:</span> {deliveries[0].paymentMethod}</p>
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
                      className="w-full py-2 bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition"
                    >
                      Mark as {deliveries[0].status === 'assigned' ? 'Picked Up' : 'Delivered'}
                    </button>
                  )}
                  {mapCoords?.restaurant?.length === 2 && mapCoords?.customer?.length === 2 && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${mapCoords.restaurant[1]},${mapCoords.restaurant[0]}&destination=${mapCoords.customer[1]},${mapCoords.customer[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-md text-center transition"
                    >
                      📍 Open in Google Maps
                    </a>
                  )}
                </div>
              </div>
  
              {/* Google Map */}
              <div className="h-[400px] rounded-xl overflow-hidden">
                <DeliveryMap origin={mapCoords.restaurant} destination={mapCoords.customer} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
  
  
};

export default DeliveryDashboard;
