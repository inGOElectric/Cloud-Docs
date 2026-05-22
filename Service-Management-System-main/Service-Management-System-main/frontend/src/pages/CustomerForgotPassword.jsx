import { useState } from "react";
import client from "../api/client";

export default function CustomerForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await client.post("/auth/customer/forgot-password", { email });

    setMessage("If email exists, reset link sent.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#01263B] text-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-96">
        <h2 className="text-2xl text-center">Customer Reset Password</h2>

        {message && <p className="text-green-400">{message}</p>}

        <input
          type="email"
          placeholder="Enter registered email"
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