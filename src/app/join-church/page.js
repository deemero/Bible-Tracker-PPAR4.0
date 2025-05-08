"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // 👁️ Icon toggle (make sure lucide-react is installed)

export default function JoinChurchPage() {
  const [groupCode, setGroupCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle state
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: church, error: churchError } = await supabase
      .from("churches")
      .select("*")
      .eq("group_code", groupCode)
      .eq("password", password)
      .single();

    if (churchError || !church) {
      toast.error("Wrong Code or Password");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ church_id: church.id })
      .eq("id", user.id);

    if (updateError) {
      toast.error("Failed.");
      setLoading(false);
      return;
    }

    toast.success("Success!");
    router.push("/church-group");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 px-4">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center space-y-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-green-700"
        >
          🙏 Welcome to Church Mode
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500"
        >
          Insert your <span className="font-semibold text-gray-700">Church Group Code</span> below.{" "}
          If you don’t have one, please{" "}
          <span className="font-semibold text-green-600">contact our team</span>.
        </motion.p>

        <motion.form
          onSubmit={handleJoin}
          className="space-y-4 text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Group Code</label>
            <input
              type="text"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-green-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition-all ${
              loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Loading..." : "🚀 Join"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
