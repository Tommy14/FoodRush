const categories = ['All', 'Breakfast', 'Lunch', 'Shakes', 'Drinks', 'Appetizer'];

export default function MenuCategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full font-medium transition duration-200 ${
            selected === cat
              ? 'bg-green-600 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-green-100'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}