import { apiPrivate } from "../config/api";

/**
 * Fetch all assigned deliveries for the current delivery person.
 * @returns {Promise<Object>} List of assigned delivery orders
 */
export const fetchAssignedOrders = async () => {
  const res = await apiPrivate.get('/delivery/my-deliveries');
  const deliveries = res.data.data;

  const enriched = await Promise.all(
    deliveries.map(async (delivery) => {
      let deliveryAddress = 'N/A';
      let customerName = 'N/A';
      let totalPrice = 0;
      let paymentMethod = 'N/A';
      let items = [];

      try {
        const orderRes = await apiPrivate.get(`/orders/${delivery.orderId}`);
        const order = orderRes.data;

        deliveryAddress = order.order.deliveryAddress;
        totalPrice = order.order.totalAmount;
        paymentMethod = order.order.paymentMethod;
        items = order.order.items;
        const customerId = order.order.customerId;

        const customerRes = await apiPrivate.get(`/auth/by/${customerId}`);
        const customer = customerRes.data;
        customerName = customer.name;
      } catch (err) {
        console.warn('Enrichment failed for delivery:', delivery._id);
      }

      return {
        ...delivery,
        deliveryAddress,
        customerName,
        totalPrice,
        paymentMethod,
        items
      };
    })
  );

  return enriched;
};

/**
 * Update the delivery status of a specific delivery order.
 * @param {string} deliveryId - The ID of the delivery record
 * @param {string} newStatus - New status to update (e.g., 'picked_up', 'delivered')
 * @returns {Promise<Object>} Updated delivery object
 */
export const updateDeliveryStatus = async (deliveryId, newStatus) => {
  try {
    const response = await apiPrivate.put(`/delivery/${deliveryId}/status`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch completed deliveries and enrich with customer name and delivery address.
 * @returns {Promise<Object[]>} Enriched completed delivery orders
 */
export const fetchCompletedDeliveries = async () => {
  try {
    const res = await apiPrivate.get('/delivery/my-deliveries/completed');
    const deliveries = res.data.data;

    const enriched = await Promise.all(
      deliveries.map(async (delivery) => {
        let deliveryAddress = 'N/A';
        let customerName = 'N/A';
        let totalPrice = 0;
        let paymentMethod = 'N/A';

        try {
          const orderRes = await apiPrivate.get(`/orders/${delivery.orderId}`);
          const order = orderRes.data;

          deliveryAddress = order.order.deliveryAddress;
          totalPrice = order.order.totalAmount;
          paymentMethod = order.order.paymentMethod;
          const customerId = order.order.customerId;

          const customerRes = await apiPrivate.get(`/auth/by/${customerId}`);
          const customer = customerRes.data;
          customerName = customer.name;
        } catch (err) {
          console.warn('Enrichment failed for delivery:', delivery._id);
        }

        return {
          ...delivery,
          deliveryAddress,
          customerName,
          totalPrice,
          paymentMethod
        };
      })
    );

    return enriched;
  } catch (error) {
    throw error;
  }
};


/**
 * Fetch the current availability status of the delivery person.
 * @returns {Promise<Object>} isAvailable flag
 */
export const fetchAvailability = async () => {
  try {
    const response = await apiPrivate.get("/auth/availability");
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle the availability status of the delivery person.
 * @returns {Promise<Object>} Updated isAvailable flag
 */
export const toggleAvailability = async () => {
  try {
    const response = await apiPrivate.patch("/auth/toggle-availability");
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch the coordinates of a restaurant using the Location Service endpoint.
 * @param {string} restaurantId - The ID of the restaurant
 * @returns {Promise<[number, number]>} Coordinates in [lng, lat] format
 */
export const getRestaurantCoordinates = async (orderId) => {
  try {
    const orderResponse = await apiPrivate.get(`/orders/${orderId}`);
    const restaurantId = orderResponse.data?.order.restaurantId;
    const response = await apiPrivate.get(`/location/restaurant/${restaurantId}`);
    return response.data?.location?.coordinates || null;
  } catch (error) {
    console.error("Failed to fetch restaurant coordinates:", error);
    throw error;
  }
};

/**
 * Fetch the customer's delivery coordinates from an order.
 * @param {string} orderId - The ID of the order
 * @returns {Promise<[number, number]>} Coordinates in [lng, lat] format
 */
export const getCustomerCoordinates = async (_id) => {
  try {
    const response = await apiPrivate.get(`/delivery/by/${_id}`);

    if (!response.data) {
      throw new Error("No data found for the given delivery ID");
    } 
    return response.data?.data.deliveryCoordinates?.coordinates || null;

  } catch (error) {
    console.error("Failed to fetch customer coordinates:", error);
    throw error;
  }
};