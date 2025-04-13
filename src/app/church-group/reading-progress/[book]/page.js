"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { bibleBooks } from "@/lib/bibleData";

export default function ChurchBookProgressPage() {
  const { book } = useParams();
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [churchId, setChurchId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

  const bookSlug = book;
  const selectedBook = bibleBooks
    .flatMap(sec => sec.books)
    .find(b => b.name.toLowerCase().replace(/\s+/g, "-") === bookSlug);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && selectedBook) {
        setUserId(user.id);

        const { data: profile } = await supabase
          .from("profiles")
          .select("church_id")
          .eq("id", user.id)
          .single();

        setChurchId(profile?.church_id);
        fetchChapters(user.id);
      }
    };
    fetchUser();
  }, [selectedBook]);

  const fetchChapters = async (uid) => {
    const { data, error } = await supabase
      .from("reading_progress")
      .select("chapter_number, is_read")
      .eq("user_id", uid)
      .eq("book_name", selectedBook.name.toLowerCase()); // ✅ use lowercase

    if (error) return console.error(error);

    const chapterMap = new Map(data.map(d => [parseInt(d.chapter_number, 10), d.is_read === true]));

    const updatedChapters = Array.from({ length: selectedBook.chapters }, (_, i) => {
      const chapterNumber = i + 1;
      return {
        chapter: chapterNumber,
        is_read: chapterMap.has(chapterNumber) ? chapterMap.get(chapterNumber) : false
      };
    });

    setChapters(updatedChapters);

    const readCount = updatedChapters.filter(c => c.is_read).length;
    const calculated = readCount === selectedBook.chapters
      ? 100
      : Math.round((readCount / selectedBook.chapters) * 100);
    setProgress(calculated);
    setShowCongrats(calculated === 100);
  };

  const handleCheckboxChange = async (chapter, isChecked) => {
    if (!userId) return;

    const { error } = await supabase
      .from("reading_progress")
      .upsert({
        user_id: userId,
        book_name: selectedBook.name.toLowerCase(), // ✅ force lowercase on insert
        chapter_number: chapter,
        is_read: isChecked,
        church_id: churchId,
      }, {
        onConflict: ['user_id', 'book_name', 'chapter_number']
      });

    if (error) {
      console.error("❌ Gagal simpan progress:", error.message);
      return;
    }

    fetchChapters(userId);
  };

  const getBarColor = (progress) => {
    if (progress < 30) return "bg-gray-400";
    if (progress < 60) return "bg-yellow-500";
    if (progress < 80) return "bg-lime-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 relative">
      {showCongrats && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 px-6 py-4 rounded-xl shadow-lg text-center z-50 animate-bounce">
          🎉 Tahniah! Anda telah selesai membaca {selectedBook?.name}!
        </div>
      )}

      <button
        onClick={() => router.push("/church-group/reading-progress")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 shadow transition"
      >
        ← Kembali ke senarai kitab
      </button>

      <h1 className="text-2xl text-black font-bold mb-2 text-center">
        Pembacaan: {selectedBook?.name}
      </h1>

      <p className="text-center mb-4 text-sm font-semibold text-black">
        Progress: {Math.round(progress)}%
      </p>

      <div className="w-full bg-gray-300 h-3 rounded-full mb-6 overflow-hidden">
        <div
          className={`h-full ${getBarColor(progress)} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 text-black sm:grid-cols-4 md:grid-cols-5 gap-3">
        {chapters.map((item) => (
          <label
            key={item.chapter}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <input
              type="checkbox"
              checked={item.is_read}
              onChange={(e) => handleCheckboxChange(item.chapter, e.target.checked)}
              className="accent-green-500 w-4 h-4"
            />
            Chapter {item.chapter}
          </label>
        ))}
      </div>
    </div>
  );
}
