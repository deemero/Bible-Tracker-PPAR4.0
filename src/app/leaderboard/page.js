"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function LeaderboardPage() {
  const [tab, setTab] = useState("overall");
  const [overallLeaders, setOverallLeaders] = useState([]);
  const [monthlyLeaders, setMonthlyLeaders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchOverall();
    fetchMonthly();
    fetchAllUsers();
  }, []);

  const fetchOverall = async () => {
    const { data, error } = await supabase.rpc("get_overall_leaders");
    if (!error) setOverallLeaders(data);
  };

  const fetchMonthly = async () => {
    const { data, error } = await supabase.rpc("get_monthly_leaders");
    if (!error) setMonthlyLeaders(data);
  };

  const fetchAllUsers = async () => {
    const { data, error } = await supabase.rpc("get_all_user_progress");
    if (!error) setAllUsers(data);
  };

  const renderList = (list) => {
    const topThree = list.slice(0, 3);
    const others = list.slice(3);

    return (
      <>
        {topThree.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {topThree.map((user, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-white rounded-xl p-4 shadow-md border"

              >
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="rounded-full object-cover w-16 h-16 mb-2"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 mb-2" />
                )}
                <div className="text-sm font-semibold text-gray-600 mb-1">#{index + 1}</div>
                <div className="font-bold text-lg text-gray-800">{user.username}</div>
                <div className="text-xs text-gray-500 mb-1">{user.chapters_read} Bab</div>
                <div className="text-sm font-semibold text-blue-500">{user.progress_percentage}%</div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {others.map((user, index) => (
          <div key={index + 3} className="flex items-center gap-4 p-3 rounded-lg bg-white shadow"> 
              <div className="text-lg font-bold w-6 text-gray-600">{index + 4}</div>
              <div className="flex-shrink-0">
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
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{user.username}</div>
                <div className="text-xs text-gray-500 mb-1">{user.chapters_read} Bab dibaca</div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      user.progress_percentage >= 80
                        ? "bg-green-500"
                        : user.progress_percentage >= 60
                        ? "bg-lime-400"
                        : user.progress_percentage >= 30
                        ? "bg-yellow-300"
                        : "bg-red-300"
                    }`}
                    style={{ width: `${user.progress_percentage}%` }}
                  />
                </div>
              </div>
              <div className="text-sm font-bold text-gray-600">{user.progress_percentage}%</div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
     <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Leaderboard</h1>


      <div className="flex justify-center flex-wrap gap-3 mb-6">
        {[
          { key: "overall", label: "Top 10 Keseluruhan" },
          { key: "monthly", label: "Top 5 Bulan Ini" },
          { key: "all", label: "Semua Peserta" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm shadow transition duration-200 ${
              tab === key
                ? "bg-blue-300 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overall" && renderList(overallLeaders)}
      {tab === "monthly" && renderList(monthlyLeaders)}
      {tab === "all" && renderList(allUsers)}
    </div>
  );
}