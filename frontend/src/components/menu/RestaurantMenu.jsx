import React, { useState, useEffect } from 'react';
import { getMenuItems } from '../../services/menuService';
import { FaShoppingCart, FaUtensils } from 'react-icons/fa';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import CartSidebar from "../../components/CartSidebar";

const RestaurantMenu = ({ restaurantId, restaurantName }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCartOpen, setCartOpen] = useState(false);
  
  const dispatch = useDispatch();

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await getMenuItems(restaurantId);
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Could not load the menu. Please try again later.");
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenu();
    }
  }, [restaurantId]);

  // Group menu items by category
  const categorizedMenu = menuItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Get unique categories
  const categories = Object.keys(categorizedMenu);

  const handleAddToCart = (item) => {
    const cartItem = {
      restaurantId,
      restaurantName,
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.image?.url || ''
    };
    
    console.log('Dispatching addToCart:', cartItem);
    dispatch(addToCart(cartItem));
    setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        <p className="mt-4 text-gray-600">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center">
        <div className="text-red-500 text-5xl mb-4">
          <HiOutlineEmojiSad />
        </div>
        <p className="text-lg text-gray-700">{error}</p>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center">
        <div className="text-gray-400 text-5xl mb-4">
          <FaUtensils />
        </div>
        <p className="text-lg text-gray-700">This restaurant hasn't added any menu items yet.</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-green-50 to-white" id="menu">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Our Menu</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our delicious offerings prepared with the finest ingredients
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex flex-nowrap min-w-max justify-center gap-2 pb-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${activeCategory === 'all' 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`}
            >
              All Items
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${activeCategory === category 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(categorizedMenu)
            .filter(([category]) => activeCategory === 'all' || activeCategory === category)
            .flatMap(([category, items]) => items)
            .map((item) => (
              <div 
                key={item._id} 
                className={`rounded-xl overflow-hidden shadow-md transition duration-300 hover:shadow-lg h-full flex flex-col
                  ${!item.isAvailable ? 'opacity-60 grayscale' : ''}`}
              >
                {/* Image */}
                <div className="h-64 overflow-hidden relative">
                  {item.image && item.image.url ? (
                    <img 
                      src={item.image.url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FaUtensils className="text-gray-400 text-5xl" />
                    </div>
                  )}
                  
                  {/* Price tag */}
                  <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-lg font-bold">
                    Rs {item.price.toFixed(2)}
                  </div>
                  
                  {/* Availability badge */}
                  {!item.isAvailable && (
                    <div className="absolute top-0 left-0 bg-gray-800 text-white px-3 py-1 rounded-br-lg font-medium text-sm">
                      Unavailable
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-green-800 mb-2">{item.name}</h3>
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      {item.category || 'Uncategorized'}
                    </span>
                  </div>
                  
                  {/* Description with flex-grow to push button to bottom */}
                  <p className="text-gray-600 text-sm mb-5 line-clamp-2 flex-grow">
                    {item.description || 'A delicious menu item'}
                  </p>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.isAvailable}
                    className={`w-full flex items-center justify-center py-3 rounded-lg transition mt-auto
                      ${!item.isAvailable 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white'}`}
                  >
                    <FaShoppingCart className="mr-2" />
                    {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </section>
  );
};

export default RestaurantMenu;