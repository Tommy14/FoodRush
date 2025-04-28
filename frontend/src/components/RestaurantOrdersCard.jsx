import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function RestaurantOrdersCard({ restaurant, onViewOrders }) {
  const { name, address, cuisineTypes, isOpen, coverImage, rating, reviewCount } = restaurant;

  const formattedAddress = [
    address?.street,
    address?.city,
    address?.state,
    address?.postalCode,
  ].filter(Boolean).join(", ");

  console.log("Restaurant Address:", restaurant);

  // const imageUrl = images?.[0]?.url || "https://via.placeholder.com/400x200.png?text=Restaurant+Image";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow hover:shadow-md transition duration-300 flex flex-col">
      {/* Image Section */}
      <div className="relative">
        <img src={coverImage} alt={name} className="w-full h-40 object-cover" />
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">{cuisineTypes?.join(", ") || "Other"}</p>

        {/* Rating and Reviews */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <div className="flex items-center">
            {/* You can replace these stars with icons */}
            <span className="text-yellow-400">★</span>
            <span className="ml-1 font-bold">{rating?.toFixed(1) || "0.0"}</span>
            <span className="ml-1">/ 5.0</span>
          </div>
          <span className="ml-auto">{reviewCount || 0} reviews</span>
        </div>

        {/* Address and Delivery Time */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FaMapMarkerAlt className="mr-2" />
          <span className="truncate">{formattedAddress || "No address provided"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FaClock className="mr-2" />
          <span>30 min</span> {/* Hardcoded delivery time */}
        </div>

        {/* View Orders Button */}
        <button
          onClick={() => onViewOrders(restaurant._id)}
          className="mt-auto bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
        >
          View Orders
        </button>
      </div>
    </div>
  );
}
