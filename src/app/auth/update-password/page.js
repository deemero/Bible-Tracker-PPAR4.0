"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError("Session expired or invalid. Please request a new link.");
      }
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully. Redirecting...");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
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
          Enter your new password
        </p>

        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-gray-700 font-medium">New Password:</label>
            <input
              type="password"
              placeholder="New password"
              className="w-full px-4 py-2 border rounded-md text-black focus:ring-green-500 focus:border-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Confirm Password:</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-2 border rounded-md text-black focus:ring-green-500 focus:border-green-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            Update Password
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
