"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LeaderboardPage() {
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
    if (error) console.error("Gagal ambil leaderboard keseluruhan:", error);
    else setOverallLeaders(data);
  };

  const fetchMonthly = async () => {
    const { data, error } = await supabase.rpc("get_monthly_leaders");
    if (error) console.error("Gagal ambil leaderboard bulanan:", error);
    else setMonthlyLeaders(data);
  };

  const fetchAllUsers = async () => {
    const { data, error } = await supabase.rpc("get_all_user_progress");
    if (error) console.error("Gagal ambil semua user:", error);
    else setAllUsers(data);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 text-black">
      <h1 className="text-2xl font-bold text-center mb-6">📊 Leaderboard</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🏅 Top 10 Pembaca Keseluruhan</h2>
        <LeaderboardTable leaders={overallLeaders} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">📆 Top 5 Pembaca Bulan Ini</h2>
        <LeaderboardTable leaders={monthlyLeaders} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">📚 Senarai Semua Peserta & Progress</h2>
        <LeaderboardTable leaders={allUsers} />
      </section>
    </div>
  );
}

function LeaderboardTable({ leaders }) {
  if (!leaders || leaders.length === 0) {
    return <p className="text-gray-600">Tiada data buat masa ini.</p>;
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-[500px] w-full bg-white border rounded shadow text-black">
        <thead className="bg-gray-200 text-black text-sm sm:text-base">
          <tr>
            <th className="py-2 px-4 text-left whitespace-nowrap">#</th>
            <th className="py-2 px-4 text-left whitespace-nowrap">Nama Peserta</th>
            <th className="py-2 px-4 text-center whitespace-nowrap">Bab Dibaca</th>
            <th className="py-2 px-4 text-center whitespace-nowrap">Progress (%)</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, index) => (
            <tr key={index} className="border-b hover:bg-gray-100 text-sm sm:text-base">
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{user.username}</td>
              <td className="py-2 px-4 text-center">{user.chapters_read}</td>
              <td className="py-2 px-4 text-center">{user.progress_percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
