import * as menuService from '../services/menu.service.js';

export const addMenuItem = async (req, res) => {
  try {
    const item = await menuService.addMenuItem(req.params.id, req.user.userId, req.body);
    res.status(201).json(item);
  } catch (err) {
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
