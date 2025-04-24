import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import Footer from "../components/Footer";

const ContactUs = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-green-50 pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We'd love to hear from you! Whether it's a question, feedback, or
            just a hello—reach out and let's talk.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-green-600 mb-6">
              Get in Touch
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaEnvelope className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Email</h3>
                  <p className="text-gray-700">info@foodrush.com</p>
                  <p className="text-gray-700">support@foodrush.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaPhone className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Phone</h3>
                  <p className="text-gray-700">+94 77 123 4567</p>
                  <p className="text-gray-700">+94 11 444 4444</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaMapMarkerAlt className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Address</h3>
                  <p className="text-gray-700">
                  123, 3, Galle Road, Colombo 03,
                  </p>
                  <p className="text-gray-700"> Western Province, Sri Lanka</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-black mb-4">
                Connect With Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white p-3 rounded-full hover:bg-black transition duration-300"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white p-3 rounded-full hover:bg-black transition duration-300"
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white p-3 rounded-full hover:bg-black transition duration-300"
                >
                  <FaInstagram className="text-xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-full">
            <h2 className="text-3xl font-bold text-green-600 mb-6">
              Our Location
            </h2>
            <div className="rounded-lg overflow-hidden shadow-lg h-[400px] border-2 border-green-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8240883299736!2d79.8493967!3d6.911626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25942551d9487%3A0x8f9dd27fc9ac0df9!2s123%2C%203%20Galle%20Rd%2C%20Colombo%2000300!5e0!3m2!1sen!2slk!4v1745534157396!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="FoodRush Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-green-600 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-2 border-green-100 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300"
              >
                <h3 className="text-xl font-semibold text-black mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// FAQ data
const faqs = [
  {
    question: "How quickly can I get food delivered?",
    answer:
      "Delivery times vary based on your location, the restaurant's preparation time, and our driver availability. Typically, deliveries arrive within 30-45 minutes of placing your order.",
  },
  {
    question: "What is your delivery area?",
    answer:
      "We currently deliver within a 10km radius of our partner restaurants. You can check if delivery is available to your location by entering your address in our app or website.",
  },
  {
    question: "How do I become a delivery driver?",
    answer:
      "To join our delivery team, visit the 'Careers' section of our website and apply for a delivery position. Requirements include a valid driver's license, insurance, and a reliable vehicle.",
  },
  {
    question: "How can I list my restaurant on FoodRush?",
    answer:
      "Restaurant owners can apply to join our platform through the 'Partner with Us' section. We'll review your application and contact you to discuss partnership terms and onboarding.",
  },
];

export default ContactUs;
