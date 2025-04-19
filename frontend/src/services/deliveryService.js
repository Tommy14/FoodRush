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

      try {
        const orderRes = await apiPrivate.get(`/orders/${delivery.orderId}`);
        const order = orderRes.data;
        deliveryAddress = order.data.deliveryAddress;
        const customerId = order.data.customerId;
        const customerRes = await apiPrivate.get(`/auth/by/${customerId}`);
        const customer = customerRes.data;
        customerName = customer.name;
      } catch (err) {
        console.warn('Enrichment failed for delivery:', delivery._id);
      }

      return {
        ...delivery,
        deliveryAddress,
        customerName
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

        try {
          const orderRes = await apiPrivate.get(`/orders/${delivery.orderId}`);
          const order = orderRes.data;
          deliveryAddress = order.data.deliveryAddress;
          const customerId = order.data.customerId;

          const customerRes = await apiPrivate.get(`/auth/by/${customerId}`);
          const customer = customerRes.data;
          customerName = customer.name;
        } catch (err) {
          console.warn('Enrichment failed for delivery:', delivery._id);
        }

        return {
          ...delivery,
          deliveryAddress,
          customerName
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