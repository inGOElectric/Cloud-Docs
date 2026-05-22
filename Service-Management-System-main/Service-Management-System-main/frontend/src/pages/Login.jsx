import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
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
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-72"
      >
        <h1 className="text-lg font-semibold mb-4 text-center">
          Login
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <input
          className="border w-full mb-3 p-2 rounded text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        {/* PASSWORD WITH TOGGLE */}
        <div className="relative mb-4">
          <input
            className="border w-full p-2 pr-10 rounded text-sm"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-sm"
            disabled={loading}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
