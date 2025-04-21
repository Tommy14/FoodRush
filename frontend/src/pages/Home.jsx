import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import Footer from '../components/Footer';
import Feature from "../components/FeatureHighlights";
import DownloadApp from "../components/DownloadApp";
import StatsSection from "../components/StatsSection";
import RestaurantShowcase from "../components/RestaurantShowcase";
import { useSelector } from "react-redux";



export default function Home() {
  const slides = [hero1, hero2, hero3];
  const [current, setCurrent] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();

  console.log("Redux Auth State:", authState);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);

    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [slides.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleOrderNow = () => {
    navigate('/restaurants');
  };


  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-gray-800">
      {/* Hero Slider Section */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        {slides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Hero Dish"
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Order Your Favourite Food Here</h1>
          <p className="max-w-xl mb-6 text-lg">
            Choose from a diverse menu crafted with the finest ingredients. Elevate your dining experience with FoodRush.
          </p>
          <button 
            onClick={handleOrderNow}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full text-lg font-medium"
            >
            Order now
          </button>
        </div>
      </section>

      {/* Feature Highlights */}
      <Feature />

      {/* Stats Sections */}
      <StatsSection />

      {/* Restaurant Showcase */}
      <RestaurantShowcase />

      {/* CTA */}
      <DownloadApp />



      {/* Footer */}
      <Footer />

      {/* Optional: Add a back-to-top button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full h-15 w-12 text-2xl shadow-lg hover:bg-green-700 transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}


    </div>
  );
}
