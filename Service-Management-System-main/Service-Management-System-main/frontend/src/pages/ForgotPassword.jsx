import { useState } from "react";
import authClient from "../api/authClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await authClient.post("/auth/forgot-password", { email });
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setError("Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#01263B] text-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-96">
        <h2 className="text-2xl font-semibold text-center">
          Reset Password
        </h2>

        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-400">{error}</p>}

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-lg text-white"
          required
        />

        <button
          type="submit"
          className="bg-white text-[#01263B] py-3 rounded-lg"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}