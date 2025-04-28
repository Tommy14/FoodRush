import React, { useState, useEffect } from 'react';
import { getMenuItems } from '../../services/menuService';
import { FaShoppingCart, FaUtensils, FaSearch } from 'react-icons/fa';
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
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Filter items based on search query and category
  const filteredItems = Object.entries(categorizedMenu)
    .filter(([category]) => activeCategory === 'all' || activeCategory === category)
    .flatMap(([category, items]) => items)
    .filter(item => 
      searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
    <section className="py-16 px-4 bg-gradient-to-b from-green-50 to-white relative" id="menu">
      <div className="absolute top-0 left-0 w-full h-40 overflow-hidden z-0 opacity-10">
        <div className="w-40 h-40 bg-green-600 rounded-full absolute -top-20 -left-20"></div>
        <div className="w-56 h-56 bg-green-400 rounded-full absolute top-10 -right-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14 relative">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-3">Delicious Options</span>
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">Our Menu</h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore our delicious offerings prepared with the finest ingredients
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-lg mx-auto transform hover:scale-102 transition-transform duration-300">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for dishes, ingredients, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 pr-14 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md text-gray-700"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 text-xl">
              <FaSearch />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl font-light">×</span>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2 ml-4">
              Showing results for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-12 overflow-x-auto p-2 max-w-4xl mx-auto">
          <div className="flex flex-nowrap min-w-max justify-center gap-3 pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 shadow-sm
                ${activeCategory === 'all' 
                  ? 'bg-green-600 text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`}
            >
              All Items
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 shadow-sm
                  ${activeCategory === category 
                    ? 'bg-green-600 text-white shadow-md transform scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* No Results Message */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto">
            <div className="text-gray-300 text-6xl mb-4 inline-block">
              <FaUtensils />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-3">No menu items found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any dishes matching your current filters.
            </p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('all');}}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item._id} 
              className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-green-50 transform hover:-translate-y-1
                ${!item.isAvailable ? 'opacity-60 grayscale' : ''}`}
            >
              {/* Menu photo */}
              <div className="h-64 overflow-hidden relative">
                {item.image && item.image.url ? (
                  <img 
                    src={item.image.url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <FaUtensils className="text-gray-300 text-5xl" />
                  </div>
                )}
                
                {/* Price tag */}
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-lg">
                  Rs {item.price.toFixed(2)}
                </div>
                
                {/* Availability badge */}
                {!item.isAvailable && (
                  <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium text-sm shadow-lg">
                    Unavailable
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col flex-grow border-t border-green-100">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-green-800 mb-2">{item.name}</h3>
                  <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full font-medium">
                    {item.category || 'Uncategorized'}
                  </span>
                </div>
                
                {/* Description */}
                <div className="h-24 overflow-y-auto mb-6 pr-1 custom-scrollbar">
                  <p className="text-gray-600 text-sm">
                    {item.description || 'A delicious menu item'}
                  </p>
                </div>
                
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.isAvailable}
                  className={`w-full flex items-center justify-center py-3.5 rounded-xl transition-all duration-300 mt-auto font-medium
                    ${!item.isAvailable 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'}`}
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