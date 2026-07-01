import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useApp } from "../ContextProvider/AppContext";
import toast from 'react-hot-toast';

const Login = () => {
  const { setPage, login, loading } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(loginEmail, loginPassword);
      toast.success("Login successful!");
      setPage("DashBoard");
    } catch (err) {
      const message=err?.response?.data?.message || err?.message|| "Login failed";
      setError(message );
      toast.error(message);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-2 py-8">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
      <p className="text-gray-500 mb-8">Sign in to participate in the conversation.</p>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex flex-col gap-5">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700" htmlFor="email">
              Email Address
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 gap-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <input
                id="email"
                type="email"
                required
                placeholder="e.g. alex@example.com"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="flex-1 py-2.5 text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <button type="button" className="text-sm text-blue-700 hover:underline">
                Forgot Password?
              </button>
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 gap-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <Lock size={16} className="text-gray-400 shrink-0" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="flex-1 py-2.5 text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : <>Log In <LogIn size={16} /></>}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.svgrepo.com/show/452235/apple.svg" alt="Apple" className="w-4 h-4" />
              Apple
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm text-gray-500">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setPage("SignUp")}
          className="text-blue-700 font-medium hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;