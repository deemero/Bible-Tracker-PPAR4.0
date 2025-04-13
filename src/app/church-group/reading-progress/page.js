"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { bibleBooks } from "@/lib/bibleData";
import { WahyuAchievementModal, SoundReminderModal } from "@/components/WahyuAchievementModal";

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

export default function ChurchReadingProgress() {
  const [progressMap, setProgressMap] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [waitingForSoundConfirm, setWaitingForSoundConfirm] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const allBooks = bibleBooks.flatMap((sec) => sec.books);
  const totalChapters = allBooks.reduce((sum, book) => sum + book.chapters, 0);

  useEffect(() => {
    const fetchChurchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("church_id")
        .eq("id", user.id)
        .single();

      if (!profile?.church_id) return;

      const { data: readingData, error } = await supabase
        .from("reading_progress")
        .select("book_name, chapter_number, is_read, user_id")
        .eq("church_id", profile.church_id);

      if (error) {
        console.error("❌ Supabase Error:", error);
        return;
      }

      const grouped = {};
      let totalRead = 0;
      const userSet = new Set();

      for (const row of readingData) {
        userSet.add(row.user_id);
        if (row.is_read) {
          const bookName = row.book_name.toLowerCase(); // ✅ normalize for comparison
          if (!grouped[bookName]) grouped[bookName] = new Set();
          grouped[bookName].add(`${row.user_id}-${row.chapter_number}`);
          totalRead += 1;
        }
      }

      const totalUsers = Math.max(userSet.size, 1);
      const newProgress = {};

      allBooks.forEach(book => {
        const bookKey = book.name.toLowerCase();
        const readCount = grouped[bookKey]?.size || 0;
        const maxProgress = book.chapters * totalUsers;
        const percentage = maxProgress === 0 ? 0 : (readCount / maxProgress) * 100;
        newProgress[book.name] = Math.min(100, Math.round(percentage));
      });

      const totalMaxChapters = totalChapters * totalUsers;
      const totalPercentage = totalMaxChapters === 0 ? 0 : (totalRead / totalMaxChapters) * 100;
      setProgressMap(newProgress);
      setOverallProgress(Math.min(100, Math.round(totalPercentage)));
    };

    fetchChurchProgress();
  }, []);

  useEffect(() => {
    const currentWahyu = progressMap["Wahyu"];
    const currentMaleakhi = progressMap["Maleakhi"];
    const currentYohanes = progressMap["Yohanes"];

    if (currentWahyu === 100 && !localStorage.getItem("rev_achievement_done")) {
      setModalType("wahyu");
      setWaitingForSoundConfirm(true);
    }

    if (currentMaleakhi === 100 && currentWahyu < 100 && !localStorage.getItem("maleakhi_half_done")) {
      setModalType("maleakhi");
      setWaitingForSoundConfirm(true);
    }

    if (currentYohanes === 100 && !localStorage.getItem("yohanes_love_done")) {
      setModalType("yohanes");
      setWaitingForSoundConfirm(true);
    }
  }, [progressMap]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
        Church Bible Reading Progress
      </h1>

      <p className="text-center text-sm text-gray-700 mb-1">
        Progress Whole Church: {overallProgress}%
      </p>
      <div className="mb-6">
        <FancyProgressBar value={overallProgress} />
      </div>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Cari nama buku..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white text-black placeholder-gray-500"
        />
      </div>

      {bibleBooks.map(section => (
        <div key={section.section} className="mb-8">
          <h2 className="text-xl text-gray-800 font-semibold mb-2">{section.section}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {section.books
              .filter(book => book.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(book => {
                const slug = book.name.toLowerCase().replace(/\s+/g, "-");
                const progress = progressMap[book.name] || 0;

                return (
                  <Link
                    key={book.name}
                    href={`/church-group/reading-progress/${slug}`}
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

      <SoundReminderModal
        show={waitingForSoundConfirm}
        onConfirm={() => {
          let audio;
          if (modalType === "wahyu") {
            audio = new Audio("/sounds/finalc.mp3");
            localStorage.setItem("rev_achievement_done", "true");
          } else if (modalType === "maleakhi") {
            audio = new Audio("/sounds/jesus.mp3");
            localStorage.setItem("maleakhi_half_done", "true");
          } else if (modalType === "yohanes") {
            audio = new Audio("/sounds/luv.mp3");
            localStorage.setItem("yohanes_love_done", "true");
          }

          setTimeout(() => {
            audio?.play().catch(() => {});
          }, 300);

          setWaitingForSoundConfirm(false);
          setShowModal(true);
        }}
      />

      <WahyuAchievementModal
        show={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
      />
    </div>
  );
}
