

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // ⬅️ new
  const router = useRouter();

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true); // show loading
    setError(null); // reset error

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false); // reset loading
    } else {
      router.push("/");
    }
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
              className="w-full px-4 py-2 border rounded-md text-black focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md text-black focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-2 rounded-md transition ${
              loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Loading...
              </>
            ) : (
              "Submit"
            )}
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
