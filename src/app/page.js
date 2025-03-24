"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { bibleBooks } from "@/lib/bibleData";
import { UserCircle, TrendingUp, CalendarCheck, BarChart2 } from "lucide-react";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [monthlyProgress, setMonthlyProgress] = useState(0);
  const [ranking, setRanking] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const router = useRouter();

  const totalChapters = bibleBooks.flatMap((sec) => sec.books).reduce((sum, book) => sum + book.chapters, 0);

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
      }
    }
    init();
  }, []);

  const getUser = async (uid) => {
    const { data, error } = await supabase.from("profiles").select("username").eq("id", uid).single();
    if (!error && data?.username) setUserName(data.username);
  };

  const getOverallProgress = async (uid) => {
    const { data, error } = await supabase.from("reading_progress").select("is_read").eq("user_id", uid);
    if (error) return console.error(error);
    const readCount = data.filter((d) => d.is_read).length;
    const percentage = Math.round((readCount / totalChapters) * 100);
    setOverallProgress(percentage);
  };

  const getMonthlyProgress = async (uid) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

    const { data, error } = await supabase
      .from("reading_progress")
      .select("is_read")
      .eq("user_id", uid)
      .eq("is_read", true)
      .gte("inserted_at", startOfMonth);

    if (error) return console.error("Monthly progress error:", error);

    const count = data.length;
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
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Profile Card Modern */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-3">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-xl font-bold text-black">Selamat datang, {userName}!</h1>
        <p className="text-sm text-gray-500">Welcome back to Bible Tracker ✨</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<TrendingUp size={20} />} label="Overall Progress" value={`${overallProgress}%`} />
        <StatCard icon={<CalendarCheck size={20} />} label="Monthly Ticked" value={`${monthlyProgress}%`} />
        <StatCard icon={<BarChart2 size={20} />} label="Ranking" value={`#${ranking} of ${totalUsers}`} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Chapters</h2>
        <ul className="text-sm space-y-2">
          {recentActivity.map((item, index) => (
            <li key={index} className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>{item.book_name} {item.chapter_number}</span>
              <span className="text-xs">{new Date(item.inserted_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow text-center">
      <div className="flex justify-center items-center mb-2 text-blue-500">{icon}</div>
      <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>
      <h3 className="text-xl font-bold text-black dark:text-white">{value}</h3>
    </div>
  );
}
