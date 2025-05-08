"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const title = "Bible Revivalz";

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ is_online: true })
          .eq("id", user.id);
      }
      router.push("/select-mode");
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
        {/* Logo cun di atas */}
        <div className="flex justify-center mb-4">
        <img
  src="/bpre.png"
  alt="Bible Revival Logo"
  className="w-36 h-36 object-contain rounded-full"
/>


        </div>

        <h1
  className="text-3xl sm:text-4xl font-extrabold text-center leading-snug 
             bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 
             bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]"
  style={{ fontFamily: "'Baloo 2', cursive" }}
>
  Bible Revivalz
</h1>





        <p className="text-gray-500 text-center text-sm mt-2 mb-4">
          Enter your login credentials to continue
        </p>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
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

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className="text-right text-sm text-green-600 hover:underline">
            <a href="/auth/forgot-password">Forgot password?</a>
          </p>

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
                Loading...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Not registered?{" "}
          <a href="/auth/signup" className="text-green-600 hover:underline font-medium">
            Create account
          </a>
        </p>
      </motion.div>
    </div>
  );
}
