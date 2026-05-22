import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import authClient from "../../api/authClient";

export default function StaffLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authClient.post("/auth/staff/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      login(user, token);

      const dashboardRoutes = {
        ADMIN: "/dashboard/admin",
        SERVICE_ADVISOR: "/dashboard/service-advisor",
        TECHNICIAN: "/dashboard/technician",
        SUPPLY_CHAIN: "/dashboard/supply-chain",
        SALES: "/dashboard/sales",
      };

      navigate(
        dashboardRoutes[user.role] || "/dashboard/admin",
        { replace: true }
      );

    } catch (err) {
      console.error(err);
      setError("Staff login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2f4550] px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md md:max-w-lg bg-[#01263B] rounded-xl shadow-2xl p-6 md:p-10 flex flex-col items-center gap-6"
      >

        {/* Avatar */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center">
          <User size={40} strokeWidth={3} className="text-[#01263B]" />
        </div>

        {/* Title */}
        <h2 className="text-white text-xl md:text-2xl font-semibold">
          Staff Login
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {/* Email */}
        <div className="w-full flex items-center gap-3 px-4 py-3 border border-white/30 rounded-xl">
          <User size={20} className="text-white" />

          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm md:text-base"
          />
        </div>

        {/* Password */}
        <div className="w-full flex items-center gap-3 px-4 py-3 border border-white/30 rounded-xl">
          <Lock size={20} className="text-white" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm md:text-base"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Links */}
        <div className="flex justify-between w-full text-white text-xs md:text-sm">

          <span>
            Customer?{" "}
            <Link
              to="/login/customer"
              className="underline font-medium hover:opacity-80"
            >
              Login here
            </Link>
          </span>

          <Link
            to="/forgot-password"
            className="underline hover:opacity-80"
          >
            Forgot password?
          </Link>

        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 md:h-14 rounded-xl bg-white text-[#01263B] text-base md:text-lg font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>

      </form>

    </div>
  );
}