import * as menuService from '../services/menu.service.js';
import { generateMenuDescriptionOR } from '../utils/aiHelper.js';


export const addMenuItem = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const { id: restaurantId } = req.params;
    const userId = req.user.userId;

    let finalDescription = description;

    // If description not provided, generate using HF
    if (!finalDescription) {
      finalDescription = await generateMenuDescriptionOR(name);
    }

    const itemData = {
      name,
      price,
      category,
      description: finalDescription
    };

    const item = await menuService.addMenuItem(restaurantId, userId, itemData);

    res.status(201).json(item);
  } catch (err) {
    console.error('Error in addMenuItem:', err.message);
    res.status(403).json({ message: err.message });
  }
};

export const getMenuItems = async (req, res) => {
  const items = await menuService.getMenuItems(req.params.id);
  res.json(items);
};

export const updateMenuItem = async (req, res) => {
  try {
    const item = await menuService.updateMenuItem(
      req.params.id,
      req.params.itemId,
      req.user.userId,
      req.body
    );
    res.json(item);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    await menuService.deleteMenuItem(req.params.id, req.params.itemId, req.user.userId);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};
