import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaPlus, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { getMenuItems, deleteMenuItem } from "../../services/menuService";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import DashSidebar from "../../components/DashSidebar";
import { toast } from "react-toastify";
import CartSidebar from "../../components/CartSidebar";

const MenuPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    priceRange: { min: "", max: "" },
  });
  const [isCartOpen, setCartOpen] = useState(false);


  const auth = useSelector((state) => state.auth);
  const isRestaurantAdmin = auth.user && auth.user.role === "restaurant_admin";
  const canManageMenu = isRestaurantAdmin;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const data = await getMenuItems(restaurantId);
        setMenuItems(data);
        setFilteredItems(data);
        setError(null);
      } catch (err) {
        setError("Failed to load menu items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const handleDelete = async (menuItemId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem(restaurantId, menuItemId);
        const updatedItems = menuItems.filter(
          (item) => item._id !== menuItemId
        );
        setMenuItems(updatedItems);
        setFilteredItems(
          filteredItems.filter((item) => item._id !== menuItemId)
        );
        toast.success("Menu item deleted successfully");
      } catch (err) {
        toast.error("Failed to delete menu item");
        console.error(err);
      }
    }
  };

  // Extract unique categories for filter dropdown
  const categories = [
    ...new Set(menuItems.map((item) => item.category).filter(Boolean)),
  ];

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "minPrice" || name === "maxPrice") {
      setFilters({
        ...filters,
        priceRange: {
          ...filters.priceRange,
          [name === "minPrice" ? "min" : "max"]: value,
        },
      });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  // Apply filters
  useEffect(() => {
    let result = [...menuItems];

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          (item.description &&
            item.description.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (filters.category) {
      result = result.filter((item) => item.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange.min) {
      result = result.filter(
        (item) => item.price >= Number(filters.priceRange.min)
      );
    }

    if (filters.priceRange.max) {
      result = result.filter(
        (item) => item.price <= Number(filters.priceRange.max)
      );
    }

    setFilteredItems(result);
  }, [filters, menuItems]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: "",
      search: "",
      priceRange: { min: "", max: "" },
    });
  };

  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    const cartItem = {
      restaurantId: restaurantId,  // Add restaurantId here!
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      quantity: 1, 
      imageUrl: item.image?.url || ''
    };
    console.log('Dispatching addToCart:', cartItem); 
    dispatch(addToCart(cartItem));
    setCartOpen(true); // Open sidebar after adding
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isRestaurantAdmin && <DashSidebar />}

      <div className={`flex-1 p-4 ${isRestaurantAdmin ? "lg:ml-64" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            {isRestaurantAdmin ? (
              <Link
                to="/manage-restaurants"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft className="mr-2" /> Back to Restaurant Management
              </Link>
            ) : (
              <Link
                to={`/restaurants/${restaurantId}`}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft className="mr-2" /> Back to Restaurant
              </Link>
            )}

            <h1 className="text-2xl font-bold text-center">
              {isRestaurantAdmin ? "Admin Menu Management" : "Menu Management"}
            </h1>

            {isRestaurantAdmin && (
              <Link
                to={`/restaurants/${restaurantId}/menu/add`}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                <FaPlus className="mr-2" /> Add Menu Item
              </Link>
            )}
          </div>

          {/* Filters Section */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name or description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    min="0"
                    step="0.01"
                    value={filters.priceRange.min}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    min="0"
                    step="0.01"
                    value={filters.priceRange.max}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Display results count */}
          <div className="mb-4 text-gray-600">
            Showing {filteredItems.length} of {menuItems.length} menu items
          </div>

          {/* Menu List */}
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.length === 0 ? (
                <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    No menu items match your filters.
                  </p>
                  {filters.search ||
                  filters.category ||
                  filters.priceRange.min ||
                  filters.priceRange.max ? (
                    <button
                      onClick={resetFilters}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Clear Filters
                    </button>
                  ) : isRestaurantAdmin ? (
                    <Link
                      to={`/restaurants/${restaurantId}/menu/add`}
                      className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      Add Your First Menu Item
                    </Link>
                  ) : (
                    <p className="mt-2 text-gray-500">
                      This restaurant hasn't added any menu items yet.
                    </p>
                  )}
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                  >
                    <div className="h-48 overflow-hidden">
                      {item.image && item.image.url ? (
                        <img
                          src={item.image.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-green-600 font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {item.description}
                      </p>

                      {item.category && (
                        <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {item.category}
                        </span>
                      )}

                      {isRestaurantAdmin && (
                        <div className="mt-4 flex justify-end space-x-2">
                          <Link
                            to={`/restaurants/${restaurantId}/menu/${item._id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded flex items-center"
                          >
                            <FaEdit className="mr-1" /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded flex items-center"
                          >
                            <FaTrash className="mr-1" /> Delete
                          </button>
                        </div>
                      )}

                      {!isRestaurantAdmin && (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
                        >
                          Add to Cart
                        </button>
                      )}

                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
    
  );
};

export default MenuPage;
