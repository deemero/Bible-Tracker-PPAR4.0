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
        className="w-full max-w-md backdrop-blur-xl bg-white/80 border border-green-200 shadow-2xl rounded-3xl p-8 text-center space-y-8"
      >
  <motion.h1
  initial={{ y: -10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.2 }}
  className="text-4xl sm:text-5xl font-baloo font-extrabold text-center 
             text-[#6FC276] drop-shadow-[0_0_6px_rgba(182,217,194,0.3)]"
>
  Select Mode
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
            className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white text-lg font-bold tracking-wide shadow-md transition-all duration-200"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            ⛪ Join Church
          </motion.button>

          <motion.button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 text-lg font-bold tracking-wide shadow transition-all duration-200"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            🙎‍♂️ Personal Account
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
