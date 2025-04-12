import Delivery from '../models/Delivery.js';

export const assignDeliveryService = async ({ orderId, deliveryPersonId }) => {
  const delivery = new Delivery({
    orderId,
    deliveryPersonId,
    status: 'assigned',
    assignedAt: new Date()
  });
  await delivery.save();
  return delivery;
};

export const updateDeliveryStatusService = async (id, status) => {
  const delivery = await Delivery.findById(id);
  if (!delivery) {
    throw new Error('Delivery not found');
  }

  delivery.status = status;

  if (status === 'picked_up') {
    delivery.pickedUpAt = new Date();
  } else if (status === 'delivered') {
    delivery.deliveredAt = new Date();
  }

  await delivery.save();
  return delivery;
};

export const getDeliveriesByPersonService = async (deliveryPersonId) => {
  const deliveries = await Delivery.find({ deliveryPersonId }).sort({ createdAt: -1 });
  return deliveries;
};
