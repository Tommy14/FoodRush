import {
  assignDeliveryService,
  updateDeliveryStatusService,
  getDeliveriesByPersonService,
  getCompletedDeliveriesByPersonService
} from '../services/delivery.service.js';

// @desc Assign a delivery person to an order
export const assignDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId } = req.body;
    const delivery = await assignDeliveryService({ orderId, deliveryPersonId });

    res.status(201).json({ message: 'Delivery assigned', data: delivery });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign delivery', error: error.message });
  }
};

// @desc Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await updateDeliveryStatusService(req.params.id, status);

    res.status(200).json({ message: 'Delivery status updated', data: delivery });
  } catch (error) {
    const statusCode = error.message === 'Delivery not found' ? 404 : 500;
    res.status(statusCode).json({ message: 'Failed to update status', error: error.message });
  }
};

// @desc Get deliveries assigned to a delivery person
export const getDeliveriesByPerson = async (req, res) => {
  try {
    const deliveryPersonId = req.user.userId;
    const deliveries = await getDeliveriesByPersonService(deliveryPersonId);

    res.status(200).json({ data: deliveries });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch deliveries', error: error.message });
  }
};

export const getCompletedDeliveriesByPerson = async (req, res) => {
  try {
    const deliveryPersonId = req.user.userId;
    const deliveries = await getCompletedDeliveriesByPersonService(deliveryPersonId);

    res.status(200).json({ data: deliveries });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch deliveries', error: error.message });
  }
};