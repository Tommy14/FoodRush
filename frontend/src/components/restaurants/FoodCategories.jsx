import { useRef, useState, useEffect } from 'react';
import { FaPizzaSlice, FaHamburger, FaCoffee, FaIceCream, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GiNoodles, GiSushis, GiChickenLeg } from 'react-icons/gi';
import { MdFastfood, MdBreakfastDining, MdLocalGroceryStore } from 'react-icons/md';

const categories = [
  { id: 'all', name: 'All', icon: MdFastfood },
  { id: 'grocery', name: 'Grocery', icon: MdLocalGroceryStore },
  { id: 'breakfast', name: 'Breakfast', icon: MdBreakfastDining },
  { id: 'coffee', name: 'Coffee', icon: FaCoffee },
  { id: 'pizza', name: 'Pizza', icon: FaPizzaSlice },
  { id: 'burger', name: 'Burgers', icon: FaHamburger },
  { id: 'dessert', name: 'Desserts', icon: FaIceCream },
  { id: 'chinese', name: 'Chinese', icon: GiNoodles },
  { id: 'sushi', name: 'Sushi', icon: GiSushis },
  { id: 'bbq', name: 'BBQ', icon: GiChickenLeg },
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
          const Icon = category.icon;
          const isActive = active === category.id;
          return (
            <div
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`flex flex-col items-center flex-shrink-0 cursor-pointer transition-all min-w-[50px] sm:min-w-[60px] ${
                isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <div
                className={`p-2 sm:p-3 rounded-full mb-1 sm:mb-2 ${
                  isActive ? 'bg-green-100' : 'bg-gray-100 hover:bg-green-50'
                }`}
              >
                <Icon className="text-lg sm:text-xl" />
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