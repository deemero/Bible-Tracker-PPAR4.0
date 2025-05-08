
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import useTranslation from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageProvider";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const [dailyReminder, setDailyReminder] = useState(false);
  const [weeklyReminder, setWeeklyReminder] = useState(false);
  const [manualCount, setManualCount] = useState("");
  const [userId, setUserId] = useState(null);
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

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
    toast((t) => (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">Are you sure you've read this much?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const { error } = await supabase
                .from("profiles")
                .update({ total_completions: parseInt(manualCount) })
                .eq("id", userId);

              if (error) {
                toast.error("❌ Failed. Try Again!", {
                  style: { borderRadius: "12px", background: "#ffe6e6", color: "#b91c1c" },
                });
              } else {
                toast.success("✅ Done! Keep Going ✨", {
                  style: { borderRadius: "12px", background: "#ecfdf5", color: "#065f46" },
                });
              }
            }}
            className="px-3 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Of course
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Sorry No
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  const handleResetProgress = async () => {
    const confirmReset = await new Promise((resolve) => {
      toast((t) => (
        <div className="space-y-2 text-sm">
          <p>⚠️ Are you sure you want to reset your reading progress?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-3 py-1 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ), { duration: 10000 });
    });

    if (!confirmReset || !userId) {
      toast.error("❌ Operation canceled or user not found.");
      return;
    }

    const { error: deleteErr } = await supabase
      .from("reading_progress")
      .delete()
      .eq("user_id", userId);
    if (deleteErr) return toast.error("❌ Failed to delete progress.");

    const { data: chapters, error: chapterErr } = await supabase
      .from("chapters")
      .select("book_name, chapter_number");
    if (chapterErr || !chapters) return toast.error("❌ Failed to fetch chapters.");

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

    for (let i = 0; i < newData.length; i += 300) {
      const chunk = newData.slice(i, i + 300);
      const { error: insertErr } = await supabase
        .from("reading_progress")
        .upsert(chunk, { onConflict: ["user_id", "book_name", "chapter_number"] });
      if (insertErr) return toast.error("❌ Failed to reset some data.");
    }

    toast.success("✅ All progress has been reset. Start fresh!");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete your account permanently?");
    if (confirmDelete) toast("🗑️ Account deletion is under development.");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">⚙️ {t("settings")}</h1>

      <SettingCard title="🌐 Language">
        <div className="flex gap-4">
          <LangButton label="Bahasa Melayu" active={language === "ms"} onClick={() => changeLanguage("ms")} />
          <LangButton label="English" active={language === "en"} onClick={() => changeLanguage("en")} />
        </div>
      </SettingCard>

      <SettingCard title="📲 Notifications">
        <ToggleSwitch label={t("dailyReminder")} enabled={dailyReminder} onToggle={() => setDailyReminder(!dailyReminder)} />
        <ToggleSwitch label={t("weeklyReminder")} enabled={weeklyReminder} onToggle={() => setWeeklyReminder(!weeklyReminder)} />
      </SettingCard>

      <SettingCard title="📘 Manual Completion Entry">
        <p className="text-gray-600 text-sm mb-2">{t("manualEntry")}</p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="0"
            value={manualCount}
            onChange={(e) => setManualCount(e.target.value)}
            className="w-24 px-3 py-2 border rounded-xl"
          />
          <button onClick={handleManualUpdate} className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700">
            {t("save")}
          </button>
        </div>
      </SettingCard>

      <SettingCard title="🧼 Reset Progress">
        <p className="text-gray-600 text-sm mb-2">{t("Delete All your progress / Padam semua Progress")}</p>
        <button onClick={handleResetProgress} className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600">
          {t("resetProgress")}
        </button>
      </SettingCard>

      <SettingCard title="🗑️ Delete Account">
        <p className="text-gray-600 text-sm mb-2">{t("Are you sure?")}</p>
        <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700">
          {t("deleteAccount")}
        </button>
      </SettingCard>

      <SettingCard title="📜 App Info">
        <p className="text-gray-700 text-sm mb-1">Bible Revival V.0.0.1</p>
        <p className="text-gray-400 text-xs">{t("version")}: 1.0.0</p>
      </SettingCard>

      <SettingCard title="📞 Contact Support">
        <ul className="space-y-2 text-blue-600 text-sm">
          <li><a href="https://forms.gle/neroalex93@gmail.com" target="_blank" rel="noopener noreferrer">Google Form</a></li>
          <li><a href="https://wa.me/01129530841" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          <li><a href="mailto:sokongan@bibletracker.com">Email Sokongan</a></li>
        </ul>
      </SettingCard>
    </div>
  );
}

function SettingCard({ title, children }) {
  return (
    <section className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-3">
      <h2 className="text-lg font-semibold text-green-700">{title}</h2>
      {children}
    </section>
  );
}

function LangButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-medium text-sm transition border shadow-sm ${
        active ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

function ToggleSwitch({ label, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-black font-medium">{label}</span>
      <button
        onClick={onToggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          enabled ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
