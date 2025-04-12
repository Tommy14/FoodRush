import MenuItem from '../models/MenuItem.js';

export const addMenuItemService = async ({ restaurantId, name, description, price, isAvailable }) => {
  const newItem = new MenuItem({
    restaurantId,
    name,
    description,
    price,
    isAvailable
  });

  await newItem.save();
  return newItem;
};

export const getMenuItemsService = async (restaurantId) => {
  const items = await MenuItem.find({ restaurantId });
  return items;
};

export const updateMenuItemService = async (itemId, updateData) => {
  const updated = await MenuItem.findByIdAndUpdate(itemId, updateData, { new: true });
  return updated;
};

export const deleteMenuItemService = async (itemId) => {
  const deleted = await MenuItem.findByIdAndDelete(itemId);
  return deleted;
};
