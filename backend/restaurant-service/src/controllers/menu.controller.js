import * as menuService from '../services/menu.service.js';
import * as imageService from '../services/image.service.js';
import { generateMenuDescriptionOR } from '../utils/aiHelper.js';

export const addMenuItem = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const { id: restaurantId } = req.params;
    const userId = req.user.userId;

    let finalDescription = description;
    let imageData = {};

    // If description not provided, generate using HF
    if (!finalDescription) {
      finalDescription = await generateMenuDescriptionOR(name);
    }

    // Handle image upload
    if (req.files && req.files.image) {
      imageData.image = await imageService.uploadImage(req.files.image[0], 'menus/items');
    }

    const itemData = {
      name,
      price,
      category,
      description: finalDescription,
      ...imageData
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
    let imageData = {};

    // Handle image upload
    if (req.files && req.files.image) {
      // Get current menu item to check if we need to delete existing image
      const currentItem = await menuService.getMenuItemById(req.params.itemId);
      if (currentItem && currentItem.image && currentItem.image.publicId) {
        await imageService.deleteImage(currentItem.image.publicId);
      }
      imageData.image = await imageService.uploadImage(req.files.image[0], 'menus/items');
    }

    const updatedData = { ...req.body, ...imageData };

    const item = await menuService.updateMenuItem(
      req.params.id,
      req.params.itemId,
      req.user.userId,
      updatedData
    );
    res.json(item);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    // Get menu item to delete its image
    const menuItem = await menuService.getMenuItemById(req.params.itemId);
    
    if (menuItem && menuItem.image && menuItem.image.publicId) {
      await imageService.deleteImage(menuItem.image.publicId);
    }
    
    await menuService.deleteMenuItem(req.params.id, req.params.itemId, req.user.userId);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const item = await menuService.getMenuItemById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

