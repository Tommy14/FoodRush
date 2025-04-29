import React, { useState, useEffect } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { addReview, updateReview } from "../../services/reviewService";

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  restaurantId, 
  onSuccess, 
  reviewToEdit = null, 
  isEditing = false 
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load review data if editing
  useEffect(() => {
    if (reviewToEdit && isEditing) {
      setRating(reviewToEdit.rating || 0);
      setComment(reviewToEdit.comment || "");
    } else {
      setRating(0);
      setComment("");
    }
  }, [reviewToEdit, isEditing, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isEditing && reviewToEdit) {
        await updateReview(
          restaurantId, 
          reviewToEdit._id, 
          { rating, comment }
        );
      } else {
        await addReview(restaurantId, { rating, comment });
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      let errorMessage = "Failed to submit review";
      
      // Handle specific error cases
      if (err.response?.status === 403) {
        errorMessage = "You've already reviewed this restaurant. Please edit your existing review.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-800">
            {isEditing ? "Edit Your Review" : "Write a Review"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                  <button
                    type="button"
                    key={ratingValue}
                    className="text-2xl focus:outline-none"
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <FaStar
                      className={`${
                        ratingValue <= (hover || rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Comment</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
            >
              {loading ? "Submitting..." : isEditing ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;