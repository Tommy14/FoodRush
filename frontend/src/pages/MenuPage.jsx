import { useEffect, useState } from 'react';
import { getMenuItems } from '../services/menuService';
import MenuItemCard from '../components/MenuItemCard';
import MenuCategoryFilter from '../components/MenuCategoryFilter';
import { useParams } from 'react-router-dom';

export default function MenuPage() {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    async function fetchMenu() {
      const data = await getMenuItems(restaurantId);
      setMenuItems(data);
      setFilteredItems(data);
    }
    fetchMenu();
  }, [restaurantId]);

  const handleFilter = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === cat));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 pb-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-green-700">Our Menu</h1>
      <div className="border-b-2 border-green-600 w-20 mx-auto mb-6"></div>

      <MenuCategoryFilter selected={category} onSelect={handleFilter} />

      <div className="grid gap-6 md:grid-cols-2">
        {filteredItems.map(item => (
          <MenuItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}