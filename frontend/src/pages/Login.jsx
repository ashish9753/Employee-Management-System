import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "manager") navigate("/manager");
      else navigate("/employee");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-[#1a2844] p-10 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center font-bold text-lg shadow-lg">
            L
          </div>
          <span className="font-bold text-xl">LeaveMS</span>
        </div>

        <div>
          <h2 className="text-3xl font-extrabold leading-snug mb-3">
            Employee Leave<br />Management System
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Manage leave requests, track balances, and streamline approvals — all in one place.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: "📋", label: "Submit leave applications instantly" },
              { icon: "✅", label: "Manager approval workflow" },
              { icon: "📊", label: "Real-time leave balance tracking" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-white/70 text-sm">
                <span className="text-base">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/25 text-xs">© 2025 LeaveMS. All rights reserved.</p>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center font-bold shadow-lg">
              L
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-white">LeaveMS</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#1a2844] hover:bg-[#243660] text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md text-sm"
            >
              {loading ? "Signing in..." : (
                <>
                  Login <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register Here
            </Link>
          </p>

          {/* Footer */}
          <p className="mt-10 text-center text-xs text-gray-400 dark:text-gray-600">
            Created by{" "}
            <a href="https://ashishdev.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">
              Ashish Sharma
            </a>
            {" "}&middot;{" "}
            <a href="https://ashishdev.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              ashishdev.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
