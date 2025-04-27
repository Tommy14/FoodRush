import { useRef, useState, useEffect } from 'react';
import { FaPizzaSlice, FaHamburger, FaCoffee, FaIceCream, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GiNoodles, GiSushis, GiChickenLeg } from 'react-icons/gi';
import { MdFastfood, MdBreakfastDining, MdLocalGroceryStore } from 'react-icons/md';
import breakfast from "../../assets/icons/breakfast.png";
import grocery from "../../assets/icons/grocery.png";
import drinks from "../../assets/icons/drinks.png";
import chinese from "../../assets/icons/chinese.png";
import pizza from "../../assets/icons/pizza.png";
import srilankan from "../../assets/icons/srilankan.png";
import vegan from "../../assets/icons/vegan.png";
import desserts from "../../assets/icons/desserts.png";
import burger from "../../assets/icons/burger.png";
import all from "../../assets/icons/all.png";
import barbecue from "../../assets/icons/barbecue.png";
import fish from "../../assets/icons/fish.png";
import bakery from "../../assets/icons/bakery.png";
import healthy from "../../assets/icons/healthy.png";

const categories = [
  { id: "all", name: "All", image: all },
  { id: "grocery", name: "Grocery", image: grocery },
  { id: "breakfast", name: "Breakfast", image: breakfast },
  { id: "drinks", name: "Drinks", image: drinks },
  { id: "chinese", name: "Chinese", image: chinese },
  { id: "pizza", name: "Pizza", image: pizza },
  { id: "burger", name: "Burger", image: burger },
  { id: "srilankan", name: "Sri Lankan", image: srilankan },
  { id: "dessert", name: "Dessert", image: desserts },
  { id: "vegan", name: "Vegan", image: vegan },
  { id: "fish", name: "fish", image: fish },
  { id: "bbq", name: "bbq", image: barbecue },
  { id: "healthy", name: "healthy", image: healthy },
  { id: "bakery", name: "bakery", image: bakery },
  
  
];

export default function FoodCategories({ onCategorySelect }) {
  const [active, setActive] = useState('all');
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check if scrolling is needed and update arrow visibility
  const checkScrollability = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  // Set up scroll event listener and responsive behavior
  useEffect(() => {
    const scrollEl = scrollRef.current;
    
    if (scrollEl) {
      // Initial check
      checkScrollability();
      
      // Check on scroll
      scrollEl.addEventListener('scroll', checkScrollability);
      
      // Check on window resize
      window.addEventListener('resize', checkScrollability);
    }

    return () => {
      if (scrollEl) scrollEl.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, []);

  const handleSelect = (categoryId) => {
    setActive(categoryId);
    onCategorySelect(categoryId);
  };

  const scroll = (direction) => {
    const scrollAmount = 150; // Adjust based on your design
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full py-4 px-0 sm:px-2 md:px-4 max-w-[75vw] overflow-hidden">
      {/* Left Arrow - Responsive positioning and styling */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1.5 sm:p-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-gray-600 text-sm sm:text-base" />
        </button>
      )}

      {/* Centered, Scrollable Category List */}
      <div
        ref={scrollRef}
        className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-8 md:px-10 max-w-full"
        style={{ 
          msOverflowStyle: 'none', // IE and Edge
          scrollbarWidth: 'none', // Firefox
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
          '::-webkit-scrollbar': { display: 'none' } // Hide scrollbar in Webkit browsers
        }}
      >
        {categories.map((category) => {
          const isActive = active === category.id;
          return (
            <div
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`flex flex-col items-center flex-shrink-0 cursor-pointer transition-all min-w-[60px] sm:min-w-[70px] ${
                isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <div
                className={`p-2 sm:p-3 rounded-full mb-1 sm:mb-2 transition-all duration-300 ${
                  isActive 
                    ? 'bg-green-100 shadow-md transform scale-110' 
                    : 'bg-gray-100 hover:bg-green-50'
                }`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className={`w-8 h-8 sm:w-10 sm:h-10 object-contain transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-80'
                  }`}
                />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-center line-clamp-1 w-full">{category.name}</span>
            </div>
          );
        })}
      </div>

      {/* Right Arrow - Responsive positioning and styling */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1.5 sm:p-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-gray-600 text-sm sm:text-base" />
        </button>
      )}
    </div>
  );
}