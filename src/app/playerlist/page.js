"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useSession } from "@supabase/auth-helpers-react";

export default function PlayerListPage() {
  const session = useSession();
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data, error } = await supabase.rpc("get_all_players_with_email");
  
    // ✅ Tambah ini untuk debug
    console.log("🎯 Data dari Supabase:", data);
    console.log("❌ Error dari Supabase:", error);
  
    if (!error && data) {
      const sortedPlayers = data.sort((a, b) => b.progress_percentage - a.progress_percentage);
      setPlayers(sortedPlayers);
    } else {
      console.error("❌ Error fetching players:", error);
    }
  };
  


  const handleSearch = () => {
    const filteredPlayers = players.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPlayers(filteredPlayers);
  };



  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Revival Project Participant
      </h1>

      {/* Butang Carian */}
      <div className="mb-4 flex justify-center gap-4">
        <input
          type="text"
          placeholder="Cari Nama Pengguna..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-300 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          Cari
        </button>
      </div>

      {/* Senarai Pemain */}
      <div className="space-y-3">
        {players.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-white text-black shadow hover:shadow-md transition"
          >
            <div className="text-lg font-bold w-6 text-gray-600">{index + 1}</div>

            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt="Avatar"
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300" />
            )}

            <div className="flex-1">
              <div className="font-medium">{user.username}</div>

              {/* ✅ Status Online / Offline */}
              <div className="text-xs font-semibold mt-0.5">
                {user.is_online ? (
                  <span className="text-green-500">🟢 Online</span>
                ) : (
                  <span className="text-gray-400">⚫ Offline</span>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-1">
                {user.chapters_read} Bab dibaca
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    user.progress_percentage >= 80
                      ? "bg-green-500"
                      : user.progress_percentage >= 60
                      ? "bg-lime-400"
                      : user.progress_percentage >= 30
                      ? "bg-yellow-300"
                      : "bg-red-400"
                  }`}
                  style={{ width: `${user.progress_percentage}%` }}
                />
              </div>
            </div>

            <div className="text-sm font-bold">{user.progress_percentage}%</div>

            {user.id !== session?.user?.id && (
              <div className="ml-2">
                {user.email ? (
                  <a
                    href={`mailto:${user.email}?subject=Jom Baca Alkitab 📖&body=Hey ${encodeURIComponent(
                      user.username
                    )}, jom baca Firman hari ini! 🔥`}
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 hover:bg-green-200 transition"
                  >
                    Poke
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 italic">Tiada email</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
