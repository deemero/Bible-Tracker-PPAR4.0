"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useSession } from "@supabase/auth-helpers-react";

export default function FriendListPage() {
  const session = useSession();
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // ✅ Sync email ke profiles jika kosong
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, username")
        .eq("id", user.id)
        .single();

      if (!profile?.email) {
        const defaultUsername = profile?.username ?? user.user_metadata?.username ?? "Tanpa Nama";

        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          username: defaultUsername,
        });

        if (error) console.error("❌ Gagal sync email:", error.message);
        else console.log("✅ Email synced to profiles");
      }

      // ✅ Ambil semua kawan accepted
      const { data: friendsData } = await supabase
        .from("friends")
        .select("sender_id, receiver_id")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq("status", "accepted");

      const friendIds = friendsData
        .map(f => f.sender_id === user.id ? f.receiver_id : f.sender_id);

      if (friendIds.length === 0) return setFriends([]);

      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, is_online, reading_streak, email")
        .in("id", friendIds);

      const { data: progressData } = await supabase
        .from("reading_progress")
        .select("user_id, is_read")
        .eq("is_read", true);

      const chaptersReadMap = {};
      progressData.forEach(row => {
        chaptersReadMap[row.user_id] = (chaptersReadMap[row.user_id] || 0) + 1;
      });

      const combined = profilesData.map(user => {
        const readCount = chaptersReadMap[user.id] || 0;
        return {
          ...user,
          chapters_read: readCount,
          progress_percentage: Math.round((readCount * 100) / 1189),
        };
      });

      setFriends(combined.sort((a, b) => b.progress_percentage - a.progress_percentage));
    };

    fetchFriends();
  }, []);

  const handleSearch = () => {
    const filtered = friends.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFriends(filtered);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Senarai Kawan 📖</h1>

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

      <div className="space-y-3">
        {friends.map((user, index) => (
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
