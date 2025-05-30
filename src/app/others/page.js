
"use client";
import { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import { motion } from "framer-motion";

export default function OthersPage() {
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    const formUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSfn1Vjv7Qvgqa8fouRcouxR9eeVrHcXKn8eqrpvN147Xz3tuw/formResponse";
    const formData = new FormData();
    formData.append("entry.2111293688", question);

    await fetch(formUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    setIsSubmitting(false);
    setSubmitted(true);
    setQuestion("");

    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-8 space-y-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-3xl font-bold text-center text-green-700 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("others.title")}
      </motion.h1>

      {/* About Section */}
      <motion.section
        className="bg-white shadow rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{t("others.aboutTitle")}</h2>
        <p className="text-sm text-gray-700 leading-relaxed">{t("others.aboutDesc1")}</p>
        <p className="text-sm text-gray-700 mt-3 leading-relaxed">{t("others.aboutDesc2")}</p>
        <p className="text-sm text-gray-700 mt-3 leading-relaxed">{t("others.aboutDesc3")}</p>
      </motion.section>

      {/* Schedule Section */}
      <motion.section
        className="bg-white shadow rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-black mb-2">{t("others.scheduleTitle")}</h2>
        <p className="text-gray-700 text-sm">{t("others.scheduleInfo")}</p>
      </motion.section>

      {/* Teacher Section */}
      <motion.section
        className="bg-white shadow rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-black mb-4">{t("others.teacherTitle")}</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            src="https://vcknnjdutdomnxgmvhos.supabase.co/storage/v1/object/public/others-picture//laji.jpeg"
            alt="Tenaga Pengajar"
            className="w-full sm:w-48 h-48 object-cover rounded-xl shadow"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t("others.teacherName")}</h3>
            <p className="text-sm text-gray-700 mt-2">{t("others.teacherDesc")}</p>
          </div>
        </div>
      </motion.section>

      {/* Question Section */}
      <motion.section
        className="bg-[#b8e8d1] border border-green-100 shadow-md rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4 drop-shadow">{t("others.questionTitle")}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            rows="4"
            className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-white bg-[#a4d9bd] focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm"
            placeholder={t("others.questionPlaceholder")}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 px-5 py-2 rounded-lg font-medium transition-all shadow ${
              isSubmitting
                ? "bg-green-300 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                {t("others.submitting")}
              </span>
            ) : (
              t("others.submitBtn")
            )}
          </button>
          {submitted && (
            <p className="text-white text-sm mt-3 drop-shadow">{t("others.submittedMsg")}</p>
          )}
        </form>
      </motion.section>

      {/* Support Section */}
      <motion.section
        className="bg-white rounded-2xl shadow p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("others.supportTitle")}</h2>
        <p className="text-sm text-gray-700 italic leading-relaxed mb-4">
          {t("others.supportDesc")}
        </p>
        <a
          href="https://altar-give.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition"
        >
          Click Here to support
        </a>
      </motion.section>
    </motion.div>
  );
}
