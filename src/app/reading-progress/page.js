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

export default function ReadingProgressHome() {
  const [userId, setUserId] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [waitingForSoundConfirm, setWaitingForSoundConfirm] = useState(false);
  const [modalType, setModalType] = useState(null); // "wahyu", "maleakhi", "yohanes"

  const allBooks = bibleBooks.flatMap(sec => sec.books);
  const totalChapters = allBooks.reduce((sum, book) => sum + book.chapters, 0);

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
    let allData = [];
    let start = 0;
    const limit = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("book_name, chapter_number, is_read", { count: "exact" })
        .eq("user_id", uid)
        .range(start, start + limit - 1);

      if (error) {
        console.error("❌ Supabase Error:", error);
        break;
      }

      if (data.length > 0) {
        allData = [...allData, ...data];
        start += limit;
        hasMore = data.length === limit;
      } else {
        hasMore = false;
      }
    }

    const grouped = {};
    let totalRead = 0;

    for (const row of allData) {
      if (row.is_read) {
        if (!grouped[row.book_name]) grouped[row.book_name] = [];
        grouped[row.book_name].push(row.chapter_number);
        totalRead += 1;
      }
    }

    const newProgress = {};
    allBooks.forEach(book => {
      const readCount = grouped[book.name]?.length || 0;
      newProgress[book.name] = Math.round((readCount / book.chapters) * 100);
    });

    setProgressMap(newProgress);
    setOverallProgress(Math.round((totalRead / totalChapters) * 100));
  };

  useEffect(() => {
    const currentWahyuProgress = progressMap["Wahyu"];
    const currentMaleakhiProgress = progressMap["Maleakhi"];
    const currentYohanesProgress = progressMap["Yohanes"];

    if (currentWahyuProgress === 100 && !localStorage.getItem("rev_achievement_done")) {
      setModalType("wahyu");
      setWaitingForSoundConfirm(true);
    }

    if (
      currentMaleakhiProgress === 100 &&
      currentWahyuProgress < 100 &&
      !localStorage.getItem("maleakhi_half_done")
    ) {
      setModalType("maleakhi");
      setWaitingForSoundConfirm(true);
    }

    if (currentYohanesProgress === 100 && !localStorage.getItem("yohanes_love_done")) {
      setModalType("yohanes");
      setWaitingForSoundConfirm(true);
    }

    if (currentWahyuProgress < 100 && localStorage.getItem("rev_achievement_done")) {
      localStorage.removeItem("rev_achievement_done");
    }

    if (currentMaleakhiProgress < 100 && localStorage.getItem("maleakhi_half_done")) {
      localStorage.removeItem("maleakhi_half_done");
    }

    if (currentYohanesProgress < 100 && localStorage.getItem("yohanes_love_done")) {
      localStorage.removeItem("yohanes_love_done");
    }
  }, [progressMap["Wahyu"], progressMap["Maleakhi"], progressMap["Yohanes"]]);

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