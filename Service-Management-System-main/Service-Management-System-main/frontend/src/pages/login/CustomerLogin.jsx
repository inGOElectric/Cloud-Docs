import { useState } from "react";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import client from "../../api/client";

export default function CustomerLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await client.post("/auth/customer/login", {
        mobileNumber,
        password,
      });

      const { token, customer } = res.data;
      localStorage.setItem("token", token);

      login(customer, token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError("Invalid mobile number or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#01263B] px-4">

      <div className="bg-white w-full max-w-md md:max-w-lg rounded-3xl shadow-2xl p-6 md:p-10">

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#01263B] text-center">
          Welcome Back!
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6 md:mb-8 text-sm md:text-base">
          Please login to your account.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">

          {/* Mobile Field */}
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
            <Phone className="text-[#01263B] mr-3" size={18} />

            <input
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
            <Lock className="text-[#01263B] mr-3" size={18} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#01263B]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/customer-forgot-password"
              className="text-[#01263B] text-xs md:text-sm hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#01263B] text-white py-3 md:py-3.5 rounded-xl text-base md:text-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}