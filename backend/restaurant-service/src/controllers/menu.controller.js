import MenuItem from '../models/MenuItem.js';

// @desc Create a new menu item
export const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, isAvailable } = req.body;
    const restaurantId = req.params.id;

    const newItem = new MenuItem({
      restaurantId,
      name,
      description,
      price,
      isAvailable
    });

    await newItem.save();
    res.status(201).json({ message: 'Menu item added', data: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item', error });
  }
};

// @desc Get all menu items for a restaurant
export const getMenuItems = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const items = await MenuItem.find({ restaurantId });

    res.status(200).json({ data: items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error });
  }
};

// @desc Update a specific menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const updated = await MenuItem.findByIdAndUpdate(itemId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Menu item not found' });

    res.status(200).json({ message: 'Menu item updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error });
  }
};

// @desc Delete a specific menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const deleted = await MenuItem.findByIdAndDelete(itemId);
    if (!deleted) return res.status(404).json({ message: 'Menu item not found' });

    res.status(200).json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error });
  }
};
