import Favorite from '../models/Favorite.js';
import Restaurant from '../models/Restaurant.js';

export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const favorites = await Favorite.find({ userId })
      .populate('restaurantId');
    
    const restaurantsList = favorites.map(item => item.restaurantId);
    
    res.status(200).json(restaurantsList);
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user.userId;
    
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Check if already favorited
    const existing = await Favorite.findOne({ userId, restaurantId });
    
    if (existing) {
      // Remove favorite
      await Favorite.findByIdAndDelete(existing._id);
      res.status(200).json({ favorited: false });
    } else {
      // Add favorite
      await Favorite.create({ userId, restaurantId });
      res.status(200).json({ favorited: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ message: 'Failed to update favorite status' });
  }
};

export const checkFavoriteStatus = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user.userId;
    
    const favorite = await Favorite.findOne({ userId, restaurantId });
    
    res.status(200).json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ message: 'Failed to check favorite status' });
  }
};