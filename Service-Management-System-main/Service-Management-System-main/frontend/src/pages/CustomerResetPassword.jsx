import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import client from "../api/client";
import { Eye, EyeOff } from "lucide-react";

export default function CustomerResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await client.post("/auth/customer/reset-password", {
        token,
        password,
      });

      setMessage("Password updated successfully.");
      setTimeout(() => navigate("/login/customer"), 2000);
    } catch (err) {
      setError("Invalid or expired token.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#01263B] text-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-96">
        <h2 className="text-2xl text-center">Set New Password</h2>

        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-400">{error}</p>}

      
  <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter new password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>
        <button
          type="submit"
          className="bg-white text-[#01263B] py-3 rounded-lg"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}