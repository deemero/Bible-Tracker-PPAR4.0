"use client";
import { Eye, EyeOff } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";


export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);


  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage("Sign up successful! Please confirm your email before logging in.");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-white to-green-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[90%] max-w-md p-6 sm:p-8 bg-transparent"
      >
        {/* Logo di atas */}
        {/* <div className="flex justify-center mb-4">
        <img
  src="/bpre.png"
  alt="Bible Revival Logo"
  className="w-36 h-36 object-contain rounded-full"
/>
        </div> */}

<h1
  className="text-3xl sm:text-4xl font-extrabold text-center leading-snug
             text-green-600 drop-shadow-md tracking-tight"
>
  Bible Revivalz
</h1>


        <p className="text-gray-500 text-center text-sm mt-2 mb-4">
          Create your account
        </p>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        {message && <p className="text-green-600 text-sm text-center mb-2">{message}</p>}

        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSignUp}>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

       <div className="relative">
  <label className="block text-sm text-gray-700 font-medium mb-1">Password</label>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80"
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute top-[38px] right-3 text-gray-500 hover:text-green-600"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition duration-200 ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Creating...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          already have account?{" "}
          <a href="/auth/signin" className="text-green-600 hover:underline font-medium">
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
}