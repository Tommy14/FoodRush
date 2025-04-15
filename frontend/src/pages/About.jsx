import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-white py-20 px-6 text-center mt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">About FoodRush</h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          We are passionate about delivering not just food, but joy to your doorstep. At FoodRush, we believe every meal should be a memorable experience.
        </p>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded with a mission to bridge the gap between great food and busy lifestyles, FoodRush started in a small kitchen and grew to serve thousands of happy customers every day.
          </p>
          <p className="text-gray-600">
            Whether you're craving comfort food or discovering new flavors, our platform is built to get your order from your favorite restaurant to your doorstep fast and fresh.
          </p>
        </div>
        <div>
          <img
            src="/src/assets/our-team.jpg"
            alt="Our Team"
            className="w-full rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-green-50 py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg">
            To make quality food accessible and enjoyable for everyone. We work with trusted partners to ensure timely delivery, safety, and the highest level of satisfaction with every bite.
          </p>
        </div>
      </section>

      {/* Team/Call to Action */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Join the FoodRush Movement</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          We’re always looking for passionate people to help us grow our food delivery community. Whether you're a restaurant owner, a delivery partner, or a foodie, you're welcome here.
        </p>
        <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition">
          Work With Us
        </button>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
