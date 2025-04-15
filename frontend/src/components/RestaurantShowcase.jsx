const restaurants = [
    {
      name: "Loretta Cafe",
      image: "/src/assets/rest1.jpg"
    },
    {
      name: "P.F. Chang's",
      image: "/src/assets/rest2.jpg"
    },
    {
      name: "Mc Donald's",
      image: "/src/assets/rest3.jpg"
    },
    {
      name: "Little Caesars",
      image: "/src/assets/rest4.jpg"
    }
  ];
  
  export default function RestaurantShowcase() {
    return (
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Featured Restaurants</h2>
          <p className="text-gray-600 mt-2">Discover gourmet flavors from our most loved partners.</p>
        </div>
  
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {restaurants.map((restaurant, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10" />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold text-gray-800">{restaurant.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Partnered since 2021</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  