import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import authClient from "../api/authClient";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ moved inside
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  console.log("TOKEN FROM URL:", token);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authClient.post("/auth/reset-password", {
        token,
        password,
      });

      setMessage("Password updated successfully.");
      setTimeout(() => navigate("/login/staff"), 2000);
    } catch (err) {
      setError("Invalid or expired token.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#01263B] text-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-96">

        <h2 className="text-2xl font-semibold text-center">
          Set New Password
        </h2>

        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-400">{error}</p>}

        {/* Password Field With Toggle */}
        <div className="flex items-center border-2 border-white rounded-lg px-4 py-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white ml-2"
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
