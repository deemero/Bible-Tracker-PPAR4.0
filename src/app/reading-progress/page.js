"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { bibleBooks } from "@/lib/bibleData";

function FancyProgressBar({ value }) {
  const getColor = (val) => {
    if (val < 30) return "bg-gray-300";
    if (val < 60) return "bg-yellow-300";
    if (val < 80) return "bg-green-300";
    return "bg-green-400";
  };

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${getColor(value)}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function ReadingProgressHome() {
  const [userId, setUserId] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);

  const totalChapters = bibleBooks.flatMap(sec => sec.books).reduce((sum, book) => sum + book.chapters, 0);

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
      .eq("user_id", uid)
      .limit(5000);
  
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
      <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
      Bible Reading Progress
      </h1>

      <p className="text-center text-sm text-gray-700 mb-1">
      Progress Whole Bible: {overallProgress}%
      </p>
      <div className="mb-6">
        <FancyProgressBar value={overallProgress} />
      </div>

      {bibleBooks.map(section => (
        <div key={section.section} className="mb-8">
          <h2 className="text-xl text-gray-800 font-semibold mb-2">{section.section}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {section.books.map(book => {
              const slug = book.name.toLowerCase().replace(/\s+/g, "-");
              const progress = progressMap[book.name] || 0;

              return (
                <Link
                  key={book.name}
                  href={`/reading-progress/${slug}`}
                  className="p-4 rounded-2xl border border-gray-200 bg-white hover:bg-green-200 hover:text-gray-900 transition text-sm text-gray-800 shadow-sm"
                >
                  <div className="font-semibold mb-1">{book.name}</div>
                  <div className="text-xs text-gray-500 mb-1">
                    Progress: {progress}%
                  </div>
                  <FancyProgressBar value={progress} />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}