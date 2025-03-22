"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSignIn(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setError(error.message);
    router.push("/");
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-green-700">Bible Tracker</h1>
        <p className="text-gray-600 text-center mb-4">Enter your login credentials</p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
          <div>
            <label className="block text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Not registered?{" "}
          <a href="/auth/signup" className="text-blue-500 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
