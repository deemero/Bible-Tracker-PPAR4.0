"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';
import { bibleBooks } from '@/lib/bibleData';

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);

  const router = useRouter();
  const totalChapters = bibleBooks.flatMap(sec => sec.books).reduce((sum, book) => sum + book.chapters, 0); // 1189

  useEffect(() => {
    async function init() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/signin");
      } else {
        setUserId(user.id);
        getUser(user.id);
        getOverallProgress(user.id);
      }
    }
    init();
  }, []);

  const getUser = async (uid) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", uid)
      .single();

    if (!error && data?.username) {
      setUserName(data.username);
    }
  };

  const getOverallProgress = async (uid) => {
    const { data, error } = await supabase
      .from("reading_progress")
      .select("is_read")
      .eq("user_id", uid);

    if (error) return console.error(error);

    const readCount = data.filter(d => d.is_read).length;
    const percentage = Math.round((readCount / totalChapters) * 100);
    setOverallProgress(percentage);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-2">Selamat datang, {userName || "Guest"}!</h1>

      <p className="text-sm text-gray-600 mb-2">Overall Bible Reading Progress:</p>
      <p className="text-xl font-bold mb-4 text-black">{overallProgress}%</p>

      <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
}
