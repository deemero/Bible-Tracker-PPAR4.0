

"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [dailyReminder, setDailyReminder] = useState(false);
  const [weeklyReminder, setWeeklyReminder] = useState(false);
  const [language, setLanguage] = useState("ms"); // 'ms' for Malay, 'en' for English

  const handleResetProgress = () => {
    if (confirm("Adakah anda pasti ingin hapus semua progress bacaan?")) {
      alert("Progress berjaya direset.");
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("Adakah anda pasti ingin padam akaun anda secara kekal?")) {
      alert("Akaun anda telah dipadam.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center text-black mb-6">⚙️ Settings</h1>

      {/* Language Toggle */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">🌐 Bahasa</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setLanguage("ms")}
            className={`px-4 py-2 rounded-full font-medium text-sm transition border shadow-sm ${
              language === "ms" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Bahasa Melayu
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-4 py-2 rounded-full font-medium text-sm transition border shadow-sm ${
              language === "en" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            English
          </button>
        </div>
      </section>

      {/* Notifikasi */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">📲 Notifikasi</h2>
        <div className="space-y-3">
          <ToggleSwitch
            label="Hantar notifikasi harian untuk baca Alkitab"
            enabled={dailyReminder}
            onToggle={() => setDailyReminder(!dailyReminder)}
          />
          <ToggleSwitch
            label="Hantar email peringatan mingguan"
            enabled={weeklyReminder}
            onToggle={() => setWeeklyReminder(!weeklyReminder)}
          />
        </div>
      </section>

      {/* Reset Progress */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">🧼 Reset Progress</h2>
        <p className="text-gray-600 mb-4">Hapus semua progress bacaan anda. Tindakan ini tidak boleh diundur.</p>
        <button
          onClick={handleResetProgress}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Reset Progress
        </button>
      </section>

      {/* Delete Account */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">🗑️ Padam Akaun</h2>
        <p className="text-gray-600 mb-4">Padam akaun anda secara kekal dari sistem.</p>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </section>

      {/* Info & Versi */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">📜 Info Aplikasi</h2>
        <p className="text-gray-600 mb-2">
          Bible Tracker dibina untuk membantu komuniti membaca Alkitab secara konsisten dan berkongsi kemajuan bersama.
        </p>
        <p className="text-sm text-gray-400">Versi Aplikasi: 1.0.0</p>
      </section>

      {/* Support */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">📞 Hubungi Sokongan</h2>
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
 