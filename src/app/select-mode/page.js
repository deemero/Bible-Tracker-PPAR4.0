"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded-xl shadow text-center space-y-6">
      <h1 className="text-2xl font-bold text-green-700">Pilih Mod Anda</h1>
      <p className="text-gray-500 text-sm">Anda ingin menyertai kumpulan gereja atau teruskan dalam mod global?</p>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/join-church")}
          className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          ⛪ Sertai Gereja Saya
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          🌍 Teruskan dalam Mod Global
        </button>
      </div>
    </div>
  );
}
