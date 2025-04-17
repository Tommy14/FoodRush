export default function MenuItemCard({ item }) {
    return (
      <div className="flex gap-4 p-4 bg-white shadow rounded-lg">
        <img
          src={item.image?.url}
          alt={item.name}
          className="w-32 h-32 object-cover rounded border-2 border-green-500"
        />
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{item.description}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-green-600 font-semibold">${item.price}</span>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm transition duration-200">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }