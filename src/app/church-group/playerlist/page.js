"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useSession } from "@supabase/auth-helpers-react";
import useTranslation from "@/hooks/useTranslation";

export default function ChurchPlayerListPage() {
  const session = useSession();
  const { t } = useTranslation();
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("church_id, email, username")
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

      if (profile?.church_id) {
        fetchPlayers(profile.church_id);
      }
    };

    load();
  }, []);

  const fetchPlayers = async (churchId) => {
    const { data: profileList } = await supabase
      .from("profiles")
      .select("id, username, avatar_url, is_online, reading_streak, email")
      .eq("church_id", churchId);

    if (!profileList || profileList.length === 0) return;

    const userIds = profileList.map(u => u.id);

    const { data: readCounts } = await supabase
      .from("user_read_progress")
      .select("user_id, total")
      .in("user_id", userIds);

    const userReadCount = {};
    readCounts?.forEach(row => {
      userReadCount[row.user_id] = row.total;
    });

    const playersWithProgress = profileList.map(user => {
      const readCount = userReadCount[user.id] || 0;
      return {
        ...user,
        chapters_read: readCount,
        progress_percentage: Math.round((readCount * 100) / 1189),
      };
    });

    const sorted = playersWithProgress.sort((a, b) => b.progress_percentage - a.progress_percentage);
    setPlayers(sorted);
  };

  const handleSearch = () => {
    const filtered = players.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPlayers(filtered);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {t("playerList.title")}
      </h1>

      <div className="mb-4 flex justify-center gap-4">
        <input
          type="text"
          placeholder={t("playerList.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-300 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          {t("playerList.searchBtn")}
        </button>
      </div>

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
              <div className="text-xs font-semibold mt-0.5">
                {user.is_online ? (
                  <span className="text-green-500">{t("playerList.online")}</span>
                ) : (
                  <span className="text-gray-400">{t("playerList.offline")}</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                {t("playerList.chaptersRead", { count: user.chapters_read })}
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
                    {t("playerList.poke")}
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 italic">{t("playerList.noEmail")}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
