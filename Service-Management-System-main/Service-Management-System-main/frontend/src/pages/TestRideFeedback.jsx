import { useState } from "react";
import axios from "axios";

export default function TestRideFeedback() {
  const [contact, setContact] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!contact || !feedback || rating === 0) {
      alert("Please enter contact, rating and feedback");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:4000/api/test-rides/feedback",
        {
          contact,
          feedback,
          rating, // ✅ sending rating
        }
      );

      alert("Feedback submitted successfully ✅");

      setContact("");
      setFeedback("");
      setRating(0);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to submit feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">

        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Test Ride Feedback
        </h2>

        {/* Contact Field */}
        <input
          type="text"
          placeholder="Phone or Email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* ⭐ Rating */}
        <div className="flex justify-center mb-4 space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-3xl cursor-pointer transition ${
                (hover || rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Feedback */}
        <textarea
          placeholder="Write your feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-3 h-28 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>

      </div>
    </div>
  );
}