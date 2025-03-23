"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { bibleBooks } from "@/lib/bibleData";

export default function ReadingProgressHome() {
  const [userId, setUserId] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);

  const totalChapters = bibleBooks.flatMap(sec => sec.books).reduce((sum, book) => sum + book.chapters, 0); // = 1189

  useEffect(() => {
    const fetchUserAndProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await calculateProgress(user.id);
      }
    };
    fetchUserAndProgress();
  }, []);

  const calculateProgress = async (uid) => {
    const { data, error } = await supabase
      .from("reading_progress")
      .select("book_name, chapter_number, is_read")
      .eq("user_id", uid);

    if (error) return console.error(error);

    const grouped = {};
    let totalRead = 0;

    for (const row of data) {
      if (!grouped[row.book_name]) grouped[row.book_name] = [];
      if (row.is_read) {
        grouped[row.book_name].push(row.chapter_number);
        totalRead += 1;
      }
    }

    const newProgress = {};
    bibleBooks.flatMap(sec => sec.books).forEach(book => {
      const readCount = grouped[book.name]?.length || 0;
      newProgress[book.name] = Math.round((readCount / book.chapters) * 100);
    });

    setProgressMap(newProgress);
    setOverallProgress(Math.round((totalRead / totalChapters) * 100));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
<h1 className="text-2xl font-bold text-center mb-2 text-black">
  Progress Pembacaan Alkitab
</h1>

      {/* ✅ Overall Progress */}
      <p className="text-center text-sm text-black mb-1">
        Progress Seluruh Alkitab: {overallProgress}%
      </p>
      <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden mb-6">
        <div
          className="bg-black h-full transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {bibleBooks.map(section => (
        <div key={section.section} className="mb-8">
          <h2 className="text-xl text-black font-semibold mb-2">{section.section}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {section.books.map(book => {
              const slug = book.name.toLowerCase().replace(/\s+/g, "-");
              const progress = progressMap[book.name] || 0;

              return (
                <Link
                  key={book.name}
                  href={`/reading-progress/${slug}`}
                  className="p-4 rounded-lg border hover:bg-blue-600 hover:text-white transition text-sm bg-white text-black shadow-sm"
                >
                  <div className="font-semibold">{book.name}</div>
                  <div className="text-xs text-black/60">
                    Progress: {progress}%
                  </div>
                  <div className="w-full bg-black/20 h-2 rounded mt-1">
                    <div
                      className="h-full bg-black rounded"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
