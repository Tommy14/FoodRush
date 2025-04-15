export default function Feature() {
  return (
    <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose FoodRush?</h2>
          <p className="text-gray-600 text-lg">We deliver happiness with every bite. Here's what makes us special.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              <img src="src/assets/delivery-icon.png" alt="Fast Delivery" className="w-15 h-15" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex justify-center">Fast Delivery</h3>
            <p className="text-gray-600">Your food is delivered hot and fresh just the way you like it.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4  rounded-full flex items-center justify-center">
              <img src="src/assets/tasty-icon.png" alt="Tasty Dishes" className="w-15 h-15" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex justify-center">Tasty Dishes</h3>
            <p className="text-gray-600">Enjoy a variety of top rated meals from local restaurants.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-4  rounded-full flex items-center justify-center">
              <img src="src/assets/order-icon.png" alt="Easy to Order" className="w-15 h-15" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex justify-center">Easy to Order</h3>
            <p className="text-gray-600">With just a few taps, your favorite meals are on their way to your doorstep.</p>
          </div>
        </div>
      </section>
  );
}
