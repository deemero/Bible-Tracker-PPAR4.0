"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { bibleBooks } from "@/lib/bibleData";
import { updateStreak } from "@/lib/streakUtils";
import { TrendingUp, CalendarCheck, BarChart2, Flame } from "lucide-react";
import Confetti from "react-confetti";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isOnline, setIsOnline] = useState(false); // ✅ Tambah sini
  const [overallProgress, setOverallProgress] = useState(0);
  const [monthlyProgress, setMonthlyProgress] = useState(0);
  const [ranking, setRanking] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [readingStreak, setReadingStreak] = useState(0);
  const [prevStreak, setPrevStreak] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const allBooks = bibleBooks.flatMap(sec => sec.books);
  const totalChapters = allBooks.reduce((sum, book) => sum + book.chapters, 0);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
      } else {
        const uid = session.user.id;
        setUserId(uid);
        loadAll(uid);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/");
      }
    });

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  const loadAll = async (uid) => {
    getUser(uid);
    getOverallProgress(uid);
    getMonthlyProgress(uid);
    getRanking(uid);
    getRecentReads(uid);
    await updateStreak(uid);
    await getReadingStreak(uid);
  };

  const getUser = async (uid) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url, is_online") // ✅ Ambil is_online
      .eq("id", uid)
      .single();

    if (!error && data) {
      setUserName(data.username);
      setAvatarUrl(data.avatar_url);
      setIsOnline(data.is_online); // ✅ Simpan status online
    }
  };

  const getReadingStreak = async (uid) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("reading_streak")
      .eq("id", uid)
      .single();

    if (!error && data) {
      const newStreak = data.reading_streak || 0;
      if (prevStreak !== null && newStreak > prevStreak && newStreak > 0) {
        setShowConfetti(true);
        toast.success(`🔥 Streak Up! Now ${newStreak} Days`);
        setTimeout(() => setShowConfetti(false), 4000);
      }
      setReadingStreak(newStreak);
      setPrevStreak(newStreak);
    }
  };

  const getOverallProgress = async (uid) => {
    let allData = [], start = 0, hasMore = true, limit = 1000;
    while (hasMore) {
      const { data } = await supabase
        .from("reading_progress")
        .select("is_read")
        .eq("user_id", uid)
        .range(start, start + limit - 1);
      allData = [...allData, ...data];
      start += limit;
      hasMore = data.length === limit;
    }
    const readCount = allData.filter(d => d.is_read).length;
    setOverallProgress(Math.round((readCount / totalChapters) * 100));
  };

  const getMonthlyProgress = async (uid) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    let allData = [], start = 0, hasMore = true, limit = 1000;
    while (hasMore) {
      const { data } = await supabase
        .from("reading_progress")
        .select("is_read, inserted_at")
        .eq("user_id", uid)
        .eq("is_read", true)
        .gte("inserted_at", startOfMonth)
        .range(start, start + limit - 1);
      allData = [...allData, ...data];
      start += limit;
      hasMore = data.length === limit;
    }
    setMonthlyProgress(Math.round((allData.length / totalChapters) * 100));
  };

  const getRanking = async (uid) => {
    const { data: progressData } = await supabase
      .from("reading_progress")
      .select("user_id, is_read")
      .eq("is_read", true);

    const userProgressMap = {};
    progressData.forEach(row => {
      userProgressMap[row.user_id] = (userProgressMap[row.user_id] || 0) + 1;
    });

    const sorted = Object.entries(userProgressMap)
      .map(([user_id, chapters_read]) => ({
        user_id,
        chapters_read,
        progress_percentage: Math.round((chapters_read / totalChapters) * 100),
      }))
      .sort((a, b) => b.progress_percentage - a.progress_percentage);

    const index = sorted.findIndex(u => u.user_id === uid);
    setRanking(index + 1);
    setTotalUsers(sorted.length);
  };

  const getRecentReads = async (uid) => {
    const { data } = await supabase
      .from("reading_progress")
      .select("book_name, chapter_number, inserted_at")
      .eq("user_id", uid)
      .eq("is_read", true)
      .order("inserted_at", { ascending: false })
      .limit(5);
    setRecentActivity(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 bg-transparent">
      {showConfetti && <Confetti numberOfPieces={150} recycle={false} />}
      <Toaster position="top-center" />

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-6 flex flex-col items-center text-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full shadow object-cover mb-4" />
        ) : <div className="w-24 h-24 rounded-full bg-gray-300 mb-4" />}
        <h1 className="text-2xl font-bold text-gray-800">Hello {userName}!</h1>

        {/* ✅ ONLINE STATUS */}
        <p className="text-sm mt-1 font-semibold">
          {isOnline ? (
            <span className="text-green-500">🟢 Online</span>
          ) : (
            <span className="text-gray-400">⚫ Offline</span>
          )}
        </p>

        <p className="text-sm text-gray-500 tracking-wide">
          Welcome back to <span className="font-semibold text-green-600">Bible Project 4.0</span> <br />
          <span className="text-gray-600">Revival Generation</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<TrendingUp size={20} />} label="Overall Progress" value={`${overallProgress}%`} />
        <StatCard icon={<CalendarCheck size={20} />} label="Monthly Ticked" value={`${monthlyProgress}%`} />
        <StatCard icon={<BarChart2 size={20} />} label="Ranking" value={`#${ranking} of ${totalUsers}`} />
        <StatCard icon={<Flame size={20} />} label="Reading Streak" value={`${readingStreak} days`} glow={readingStreak > 0} />
      </div>

      {/* Recent Reads */}
      <div className="p-6 rounded-2xl shadow-md border border-green-100 mb-6 bg-[#b8e8d1]">
        <h2 className="text-lg font-semibold mb-4 text-white text-shadow">Recent Chapters</h2>
        <ul className="text-sm space-y-2">
          {recentActivity.map((item, index) => (
            <li key={index} className="flex justify-between border-b border-green-200 pb-2 text-white text-shadow">
              <span className="font-medium">{item.book_name} {item.chapter_number}</span>
              <span className="text-xs">{new Date(item.inserted_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, glow }) {
  return (
    <div className={`bg-white p-5 rounded-2xl shadow-md text-center border border-gray-200 transition-all duration-300 ${glow ? "ring-2 ring-orange-400 animate-pulse" : ""}`}>
      <div className="flex justify-center items-center mb-2 text-orange-500 text-xl">{icon}</div>
      <p className="text-sm text-gray-600">{label}</p>
      <h3 className="text-2xl font-semibold text-gray-800 mt-1">{value}</h3>
    </div>
  );
}
