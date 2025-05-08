"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function SelectModePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/signin");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center space-y-8"
      >
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-green-700 tracking-tight"
        >
          👋 Select Mode
        </motion.h1>

        <motion.div
          className="flex flex-col gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          <motion.button
            onClick={() => router.push("/join-church")}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-lg shadow-md transition"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            ⛪ Join Church
          </motion.button>

          <motion.button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-lg shadow transition"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            🙎‍♂️ Your Account
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
