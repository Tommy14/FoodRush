import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaStar, FaUserEdit } from "react-icons/fa";
import { getRestaurantReviews, getRestaurantReviewSummary, addReview } from "../../services/reviewService";

const ReviewsSection = ({ restaurantId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  
  // Get auth state from Redux
  const auth = useSelector((state) => state.auth);
  const isCustomer = auth.isAuthenticated && auth.user?.role === "customer";
  
  const fetchReviews = useCallback(async () => {
    try {
      const data = await getRestaurantReviews(restaurantId);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);
  
  const fetchSummary = useCallback(async () => {
    try {
      const data = await getRestaurantReviewSummary(restaurantId);
      setSummary(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  }, [restaurantId]);
  
  useEffect(() => {
    fetchReviews();
    fetchSummary();
  }, [fetchReviews, fetchSummary]);
  
  // Simple review form component
  const ReviewForm = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (rating === 0) return;
      
      setSubmitting(true);
      try {
        await addReview(restaurantId, { rating, comment });
        setComment("");
        setRating(0);
        setIsModalOpen(false);
        fetchReviews();
        fetchSummary();
      } catch (err) {
        console.error("Error submitting review:", err);
      } finally {
        setSubmitting(false);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Write a Review</h3>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="mb-2">Rating</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl"
                  >
                    <FaStar className={star <= rating ? "text-yellow-400" : "text-gray-300"} />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="mb-2">Comment</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded p-2"
                rows="4"
                placeholder="Share your experience..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={rating === 0 || submitting}
                className="bg-green-600 text-white py-2 px-4 rounded disabled:bg-green-300"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <section className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-800 flex items-center">
          <FaUserEdit className="mr-2" /> Customer Reviews
        </h2>
        
        {isCustomer && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Write a Review
          </button>
        )}
      </div>
      
      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-green-700 mr-2">
            {summary.averageRating?.toFixed(1) || "0.0"}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(summary.averageRating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <span className="text-gray-500">
          {summary.totalReviews || 0} {summary.totalReviews === 1 ? "review" : "reviews"}
        </span>
      </div>
      
      {/* Reviews */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading reviews...</div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-2">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              {review.comment && <p className="text-gray-700">{review.comment}</p>}
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-white rounded-lg">
            <p className="text-gray-500">
              No reviews yet. {isCustomer && "Be the first to leave a review!"}
            </p>
          </div>
        )}
      </div>
      
      {isModalOpen && <ReviewForm />}
    </section>
  );
};

export default ReviewsSection;