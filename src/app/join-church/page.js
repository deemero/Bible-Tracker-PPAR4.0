"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function JoinChurchPage() {
  const [groupCode, setGroupCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Step 1: Check kod & password dari table churches
    const { data: church, error: churchError } = await supabase
      .from("churches")
      .select("*")
      .eq("group_code", groupCode)
      .eq("password", password)
      .single();

    if (churchError || !church) {
      toast.error("Kod atau kata laluan salah");
      setLoading(false);
      return;
    }

    // ✅ Step 2: Update profiles.church_id
    const { data: { user } } = await supabase.auth.getUser();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ church_id: church.id })
      .eq("id", user.id);

    if (updateError) {
      toast.error("Gagal menyertai gereja.");
      setLoading(false);
      return;
    }

    toast.success("Berjaya sertai gereja!");
    router.push("/church-group");
  };

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded-xl shadow text-center space-y-6">
      <Toaster />
      <h1 className="text-2xl font-bold text-green-700">Sertai Gereja Anda</h1>
      <p className="text-gray-500 text-sm">Masukkan kod kumpulan & kata laluan untuk menyertai gereja anda.</p>

      <form onSubmit={handleJoin} className="space-y-4 text-left">
        <div>
          <label className="block text-sm font-medium text-gray-700">Group Code</label>
          <input
            type="text"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 font-semibold text-white rounded-md ${
            loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Memproses..." : "Sertai Gereja"}
        </button>
      </form>
    </div>
  );
}
