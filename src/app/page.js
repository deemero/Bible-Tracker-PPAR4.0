"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { bibleBooks } from "@/lib/bibleData";
import { TrendingUp, CalendarCheck, BarChart2 } from "lucide-react";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [monthlyProgress, setMonthlyProgress] = useState(0);
  const [ranking, setRanking] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const router = useRouter();

  const allBooks = bibleBooks.flatMap(sec => sec.books);
  const totalChapters = allBooks.reduce((sum, book) => sum + book.chapters, 0);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/signin");
      } else {
        setUserId(user.id);
        getUser(user.id);
        getOverallProgress(user.id);
        getMonthlyProgress(user.id);
        getRanking(user.id);
        getRecentReads(user.id);

        // OneSignal external ID (link to Supabase user)
        if (window?.OneSignal) {
          window.OneSignal.push(() => {
            window.OneSignal.setExternalUserId(user.id);
          });
        }
      }
    }
    init();
  }, []);

  const getUser = async (uid) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", uid)
      .single();
    if (!error) {
      setUserName(data.username);
      setAvatarUrl(data.avatar_url);
    }
  };

  const getOverallProgress = async (uid) => {
    let allData = [];
    let start = 0;
    const limit = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("is_read", { count: "exact" })
        .eq("user_id", uid)
        .range(start, start + limit - 1);

      if (error) return console.error(error);

      allData = [...allData, ...data];
      start += limit;
      hasMore = data.length === limit;
    }

    const readCount = allData.filter(d => d.is_read).length;
    const percentage = Math.round((readCount / totalChapters) * 100);
    setOverallProgress(percentage);
  };

  const getMonthlyProgress = async (uid) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

    let allData = [];
    let start = 0;
    const limit = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("is_read, inserted_at", { count: "exact" })
        .eq("user_id", uid)
        .eq("is_read", true)
        .gte("inserted_at", startOfMonth)
        .range(start, start + limit - 1);

      if (error) return console.error("Monthly progress error:", error);

      allData = [...allData, ...data];
      start += limit;
      hasMore = data.length === limit;
    }

    const count = allData.length;
    const monthlyPercentage = Math.round((count / totalChapters) * 100);
    setMonthlyProgress(monthlyPercentage);
  };

  const getRanking = async (uid) => {
    const { data: progressData, error } = await supabase
      .from("reading_progress")
      .select("user_id, is_read")
      .eq("is_read", true);
    if (error) return console.error("Error fetching progress data:", error);

    const userProgressMap = {};
    for (const row of progressData) {
      if (!userProgressMap[row.user_id]) userProgressMap[row.user_id] = 0;
      userProgressMap[row.user_id]++;
    }

    const sorted = Object.entries(userProgressMap)
      .map(([user_id, chapters_read]) => ({
        user_id,
        chapters_read,
        progress_percentage: Math.round((chapters_read / totalChapters) * 100),
      }))
      .sort((a, b) => b.progress_percentage - a.progress_percentage);

    const index = sorted.findIndex((user) => user.user_id === uid);
    if (index !== -1) {
      setRanking(index + 1);
      setTotalUsers(sorted.length);
    } else {
      setRanking(sorted.length + 1);
      setTotalUsers(sorted.length + 1);
    }
  };

  const getRecentReads = async (uid) => {
    const { data, error } = await supabase
      .from("reading_progress")
      .select("book_name, chapter_number, inserted_at")
      .eq("user_id", uid)
      .eq("is_read", true)
      .order("inserted_at", { ascending: false })
      .limit(5);
    if (!error) setRecentActivity(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 bg-transparent">
      <div className="bg-white rounded-2xl p-6 shadow-md mb-6 flex flex-col items-center text-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full shadow object-cover mb-4" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-4" />
        )}
        <h1 className="text-2xl font-bold text-gray-800">Hello {userName}!</h1>
        <p className="text-sm text-gray-500 tracking-wide">
          Welcome back to <span className="font-semibold text-green-600">Bible Project 4.0</span> <br />
          <span className="text-gray-600">Revival Generation</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<TrendingUp size={20} />} label="Overall Progress" value={`${overallProgress}%`} />
        <StatCard icon={<CalendarCheck size={20} />} label="Monthly Ticked" value={`${monthlyProgress}%`} />
        <StatCard icon={<BarChart2 size={20} />} label="Ranking" value={`#${ranking} of ${totalUsers}`} />
      </div>

      <div className="p-6 rounded-2xl shadow-md border border-green-100 mb-6 bg-[#b8e8d1]">
        <h2 className="text-lg font-semibold mb-4 text-white text-shadow">Recent Chapters</h2>
        <ul className="text-sm space-y-2">
          {recentActivity.map((item, index) => (
            <li key={index} className="flex justify-between border-b border-green-200 pb-2 text-white text-shadow">
              <span className="font-medium">{item.book_name} {item.chapter_number}</span>
              <span className="text-xs text-white text-shadow">{new Date(item.inserted_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ OneSignal Noti Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => {
            if (window?.OneSignal) {
              window.OneSignal.showSlidedownPrompt();
            }
          }}
          className="p-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          Aktifkan Notifikasi 📣
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md text-center border border-gray-200">
      <div className="flex justify-center items-center mb-2 text-blue-500 text-xl">{icon}</div>
      <p className="text-sm text-gray-600">{label}</p>
      <h3 className="text-2xl font-semibold text-gray-800 mt-1">{value}</h3>
    </div>
  );
}
