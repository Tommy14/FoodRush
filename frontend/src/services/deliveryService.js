// src/services/deliveryService.js
import axios from './axiosInstance'; // use base URL here

export const fetchAssignedOrders = async () => {
  const res = await axios.get('/bff/delivery/my-deliveries');
  return res.data;
};

export const updateDeliveryStatus = async (deliveryId, newStatus) => {
  const res = await axios.put(`/bff/delivery/${deliveryId}/status`, { status : newStatus});
  return res.data;
};

export const fetchCompletedDelivery= async () => {
    const res = await axios.get(`/bff/delivery/my-deliveries/completed `);
    return res.data;
};
