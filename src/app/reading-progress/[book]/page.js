"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { bibleBooks } from "@/lib/bibleData";

export default function BookProgressPage() {
  const { book } = useParams();
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState(0);

  const bookSlug = book?.replace(/-/g, " ");
  const selectedBook = bibleBooks.flatMap(sec => sec.books).find(b => b.name.toLowerCase() === bookSlug);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && selectedBook) {
        setUserId(user.id);
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
      .eq("book_name", selectedBook.name);

    if (error) return console.error(error);

    const chapterMap = new Map(data.map(d => [d.chapter_number, d.is_read]));
    const updatedChapters = Array.from({ length: selectedBook.chapters }, (_, i) => {
      const chapterNumber = i + 1;
      return {
        chapter: chapterNumber,
        is_read: chapterMap.get(chapterNumber) || false
      };
    });

    setChapters(updatedChapters);
    const readCount = updatedChapters.filter(c => c.is_read).length;
    setProgress((readCount / selectedBook.chapters) * 100);
  };

  const handleCheckboxChange = async (chapter, isChecked) => {
    if (!userId) return;

    await supabase
      .from("reading_progress")
      .upsert({
        user_id: userId,
        book_name: selectedBook.name,
        chapter_number: chapter,
        is_read: isChecked,
      }, { onConflict: ['user_id', 'book_name', 'chapter_number'] });

    fetchChapters(userId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* Butang Kembali */}
      <button
        onClick={() => router.push("/reading-progress")}
        className="mb-4 px-4 py-2 bg-black text-black font-semibold rounded hover:bg-gray-200 shadow transition"
      >
        ← Kembali ke senarai kitab
      </button>

      <h1 className="text-2xl font-bold mb-2 text-center">
        Pembacaan: {selectedBook?.name}
      </h1>

      {/* Progress */}
      <p className="text-center mb-4 text-sm font-semibold text-black">
        Progress: {Math.round(progress)}%
      </p>
      <div className="w-full bg-gray-300 h-3 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Chapter list */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {chapters.map((item) => (
          <label key={item.chapter} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={item.is_read}
              onChange={(e) => handleCheckboxChange(item.chapter, e.target.checked)}
            />
            Chapter {item.chapter}
          </label>
        ))}
      </div>
    </div>
  );
}
