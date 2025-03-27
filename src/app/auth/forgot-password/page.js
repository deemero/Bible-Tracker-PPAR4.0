"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for the password reset link.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-700 leading-snug">
          Bible Project 4.0<br />
          <span className="text-gray-700 font-medium">Revival Generation</span>
        </h1>

        <p className="text-gray-600 text-center mt-2 mb-4">
          Enter your email to reset your password
        </p>

        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md text-black focus:ring-green-500 focus:border-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          <a href="/auth/signin" className="text-blue-500 hover:underline">
            Back to Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
