"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { bibleBooks } from "@/lib/bibleData";
import { TrendingUp, BarChart2, Flame, CalendarDays, CircleDot, BookOpen } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ChurchDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [churchName, setChurchName] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [readingStreak, setReadingStreak] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [monthlyProgress, setMonthlyProgress] = useState(0);
  const [recentChapters, setRecentChapters] = useState([]);
  const [ranking, setRanking] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [completionCount, setCompletionCount] = useState(0);

  const totalChapters = bibleBooks.flatMap((sec) => sec.books).reduce((sum, book) => sum + book.chapters, 0);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/");
      const userId = session.user.id;

      await getUser(userId);
      await getChurch(userId);
      await getProgress(userId);
      await getMonthly(userId);
      await getRecent(userId);
      await getCompletion(userId);
    };
    load();
  }, []);

  const getUser = async (uid) => {
    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url, is_online, reading_streak")
      .eq("id", uid)
      .single();

    if (data) {
      setUserName(data.username);
      setAvatarUrl(data.avatar_url);
      setIsOnline(data.is_online);
      setReadingStreak(data.reading_streak || 0);
    }
  };

  const getChurch = async (uid) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("church_id")
      .eq("id", uid)
      .single();

    if (profile?.church_id) {
      const { data: church } = await supabase
        .from("churches")
        .select("name")
        .eq("id", profile.church_id)
        .single();
      if (church) setChurchName(church.name);
    }
  };

  const getProgress = async (uid) => {
    const { data: readCounts } = await supabase
      .from("user_read_progress")
      .select("user_id, total")
      .limit(2000);

    const userMap = {};
    readCounts?.forEach((row) => {
      userMap[row.user_id] = row.total;
    });

    const sorted = Object.entries(userMap)
      .map(([id, total]) => ({
        id,
        progress: Math.round((total / totalChapters) * 100),
      }))
      .sort((a, b) => b.progress - a.progress);

    const index = sorted.findIndex((u) => u.id === uid);
    setRanking(index + 1);
    setTotalUsers(sorted.length);
    setOverallProgress(sorted[index]?.progress || 0);
  };

  const getMonthly = async (uid) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    let allData = [], start = 0, limit = 1000, hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("book_name, chapter_number", { count: "exact" })
        .eq("user_id", uid)
        .eq("is_read", true)
        .gte("inserted_at", startOfMonth)
        .range(start, start + limit - 1);

      if (error) break;
      if (data?.length > 0) {
        allData = [...allData, ...data];
        start += limit;
        hasMore = data.length === limit;
      } else hasMore = false;
    }

    const unique = new Set(allData.map(d => `${d.book_name}-${d.chapter_number}`));
    setMonthlyProgress(Math.round((unique.size / totalChapters) * 100));
  };

  const getRecent = async (uid) => {
    const { data } = await supabase
      .from("reading_progress")
      .select("book_name, chapter_number, inserted_at")
      .eq("user_id", uid)
      .eq("is_read", true)
      .order("inserted_at", { ascending: false })
      .limit(5);

    setRecentChapters(data || []);
  };

  const getCompletion = async (uid) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("total_completions")
      .eq("id", uid)
      .single();
    if (data) setCompletionCount(data.total_completions || 0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Toaster />
      <div className="bg-white p-6 rounded-2xl shadow text-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
        ) : <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4" />}

        <h1 className="text-xl font-bold text-gray-800">Hello {userName}</h1>
        <p className="text-sm text-gray-500">
          <span className="flex items-center justify-center gap-2 mt-1">
            {isOnline && <CircleDot className="text-green-500 w-3 h-3" />} Online
          </span>
          Church Mode : <span className="font-semibold text-green-600">{churchName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-6">
        <StatCard icon={<TrendingUp size={20} />} label="Overall Progress" value={`${overallProgress}%`} />
        <StatCard icon={<CalendarDays size={20} />} label="Monthly Ticked" value={`${monthlyProgress}%`} />
        <StatCard icon={<BarChart2 size={20} />} label="Ranking" value={`#${ranking} of ${totalUsers}`} />
        <div className="p-5 border-2 border-orange-400 rounded-2xl shadow-sm text-center animate-pulse bg-white">
          <div className="flex justify-center text-orange-500 text-3xl mb-2 animate-bounce">
            <Flame />
          </div>
          <p className="text-sm text-gray-600 font-medium">Reading Streak</p>
          <h3 className="text-3xl font-bold text-gray-800">{readingStreak} days</h3>
        </div>
        <StatCard icon={<BookOpen size={20} />} label="Total Completions" value={`${completionCount}x`} />
      </div>

      <div className="bg-green-100 rounded-2xl p-6 mt-6 shadow-inner">
        <h2 className="text-lg font-semibold text-white drop-shadow-lg mb-4">Recent Chapters</h2>
        <ul className="text-white text-sm space-y-2 drop-shadow-lg">
          {recentChapters.map((item, idx) => (
            <li key={idx} className="flex justify-between">
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
    <div className="bg-white p-5 rounded-2xl shadow-md text-center border border-gray-200">
      <div className="flex justify-center items-center mb-2 text-orange-500 text-xl">
        {icon}
      </div>
      <p className="text-sm text-gray-600">{label}</p>
      <h3 className="text-2xl font-semibold text-gray-800 mt-1">{value}</h3>
    </div>
  );
}
