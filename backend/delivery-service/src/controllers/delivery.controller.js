import Delivery from '../models/Delivery.js';

// @desc Assign a delivery person to an order
export const assignDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId } = req.body;

    const delivery = new Delivery({
      orderId,
      deliveryPersonId,
      status: 'assigned',
      assignedAt: new Date()
    });

    await delivery.save();
    res.status(201).json({ message: 'Delivery assigned', data: delivery });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign delivery', error });
  }
};

// @desc Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    delivery.status = status;

    if (status === 'picked_up') {
      delivery.pickedUpAt = new Date();
    } else if (status === 'delivered') {
      delivery.deliveredAt = new Date();
    }

    await delivery.save();
    res.status(200).json({ message: 'Delivery status updated', data: delivery });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error });
  }
};

// @desc Get deliveries assigned to a delivery person
export const getDeliveriesByPerson = async (req, res) => {
  try {
    const deliveryPersonId = req.user.userId;

    const deliveries = await Delivery.find({ deliveryPersonId }).sort({ createdAt: -1 });

    res.status(200).json({ data: deliveries });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch deliveries', error });
  }
};

