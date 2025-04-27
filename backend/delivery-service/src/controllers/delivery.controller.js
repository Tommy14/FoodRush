import {
  assignDeliveryService,
  updateDeliveryStatusService,
  getDeliveriesByPersonService,
  getCompletedDeliveriesByPersonService,
  autoAssignDeliveryService,
  getDeliveryByIdService
} from '../services/delivery.service.js';

// @desc Assign a delivery person automatically to an order
export const autoAssignDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;
    const { address} = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const delivery = await autoAssignDeliveryService(orderId, address);;

    res.status(201).json({ message: 'Delivery assigned', data: delivery });
  } catch (error) {
    console.error('Error assigning delivery:', error.message);
    res.status(500).json({ message: 'Failed to assign delivery', error: error.message });
  }
};


// @desc Assign a delivery person to an order
export const assignDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId, address } = req.body;
    const delivery = await assignDeliveryService({ orderId, deliveryPersonId, address });

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

//get delivery by delivery id
export const getDeliveryById = async (req, res) => {
  try {
    const deliveryId = req.params.id;
    const delivery = await getDeliveryByIdService(deliveryId);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json({ data: delivery });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch delivery', error: error.message });
  }
};