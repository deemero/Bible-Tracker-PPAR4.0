"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import useTranslation from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageProvider";

export default function SettingsPage() {
  const [dailyReminder, setDailyReminder] = useState(false);
  const [weeklyReminder, setWeeklyReminder] = useState(false);
  const [manualCount, setManualCount] = useState("");
  const [userId, setUserId] = useState(null);
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage(); // ✅ Guna yang global
  

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("profiles")
          .select("total_completions")
          .eq("id", user.id)
          .single();
        if (data) setManualCount(data.total_completions || 0);
      }
    };
    fetchUser();
  }, []);

  const handleManualUpdate = async () => {
    if (!confirm("Simpan jumlah kali anda sudah khatam Alkitab?")) return;

    const { error } = await supabase
      .from("profiles")
      .update({ total_completions: parseInt(manualCount) })
      .eq("id", userId);

    if (error) {
      alert("❌ Gagal simpan.");
      console.error("Manual update error:", JSON.stringify(error, null, 2));
    } else {
      alert("✅ Berjaya disimpan.");
    }
  };

  const handleResetProgress = async () => {
    if (!confirm("Adakah anda pasti ingin hapus semua progress bacaan?")) return;
    if (!userId) {
      alert("❌ User tidak dijumpai.");
      return;
    }

    const { error: deleteErr } = await supabase
      .from("reading_progress")
      .delete()
      .eq("user_id", userId);

    if (deleteErr) {
      alert("❌ Gagal padam progress.");
      console.error(deleteErr);
      return;
    }

    const { data: chapters, error: chapterErr } = await supabase
      .from("chapters")
      .select("book_name, chapter_number");

    if (chapterErr || !chapters) {
      alert("❌ Gagal ambil senarai bab.");
      console.error(chapterErr);
      return;
    }

    const seen = new Set();
    const uniqueChapters = chapters.filter(c => {
      const key = `${c.book_name}-${c.chapter_number}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const newData = uniqueChapters.map(c => ({
      user_id: userId,
      book_name: c.book_name,
      chapter_number: c.chapter_number,
      is_read: false
    }));

    const chunkSize = 300;
    for (let i = 0; i < newData.length; i += chunkSize) {
      const chunk = newData.slice(i, i + chunkSize);

      const { error: insertErr } = await supabase
        .from("reading_progress")
        .upsert(chunk, { onConflict: ["user_id", "book_name", "chapter_number"] });

      if (insertErr) {
        console.error("❌ Insert error:", insertErr);
        alert("❌ Gagal reset sebahagian data:\n" + JSON.stringify(insertErr, null, 2));
        return;
      }
    }

    alert("✅ Semua progress berjaya direset!");
  };

  const handleDeleteAccount = () => {
    if (confirm("Adakah anda pasti ingin padam akaun anda secara kekal?")) {
      alert("Akaun anda telah dipadam.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center text-black mb-6">⚙️ {t("settings")}</h1>

      {/* Bahasa */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">🌐 {t("language")}</h2>
        <div className="flex gap-4">
          <button
            onClick={() => changeLanguage("ms")}
            className={`px-4 py-2 rounded-full font-medium text-sm transition border shadow-sm ${language === "ms" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Bahasa Melayu
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className={`px-4 py-2 rounded-full font-medium text-sm transition border shadow-sm ${language === "en" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            English
          </button>
        </div>
      </section>

      {/* Notifikasi */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">📲 {t("notifications")}</h2>
        <div className="space-y-3">
          <ToggleSwitch label={t("dailyReminder")} enabled={dailyReminder} onToggle={() => setDailyReminder(!dailyReminder)} />
          <ToggleSwitch label={t("weeklyReminder")} enabled={weeklyReminder} onToggle={() => setWeeklyReminder(!weeklyReminder)} />
        </div>
      </section>

      {/* Manual Completion Entry */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">📘 Manual Completion Entry</h2>
        <p className="text-gray-600 mb-4">{t("manualEntry")}</p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="0"
            value={manualCount}
            onChange={(e) => setManualCount(e.target.value)}
            className="w-24 px-3 py-2 border rounded-xl"
          />
          <button
            onClick={handleManualUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {t("save")}
          </button>
        </div>
      </section>

      {/* Reset Progress */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">🧼 {t("resetProgress")}</h2>
        <p className="text-gray-600 mb-4">{t("resetDesc")}</p>
        <button
          onClick={handleResetProgress}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          {t("resetProgress")}
        </button>
      </section>

      {/* Delete Account */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">🗑️ {t("deleteAccount")}</h2>
        <p className="text-gray-600 mb-4">{t("deleteDesc")}</p>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {t("deleteAccount")}
        </button>
      </section>

      {/* Info App */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">📜 {t("appInfo")}</h2>
        <p className="text-gray-600 mb-2">{t("appPurpose")}</p>
        <p className="text-sm text-gray-400">{t("version")}: 1.0.0</p>
      </section>

      {/* Support */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">📞 {t("contactSupport")}</h2>
        <ul className="space-y-2 text-blue-600 text-sm">
          <li><a href="https://forms.gle/neroalex93@gmail.com" target="_blank" rel="noopener noreferrer">Google Form</a></li>
          <li><a href="https://wa.me/01129530841" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          <li><a href="mailto:sokongan@bibletracker.com">Email Sokongan</a></li>
        </ul>
      </section>
    </div>
  );
}

function ToggleSwitch({ label, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-black font-medium">{label}</span>
      <button
        onClick={onToggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${enabled ? "bg-green-500" : "bg-gray-300"}`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${enabled ? "translate-x-6" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}
