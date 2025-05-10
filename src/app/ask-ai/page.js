
'use client';
import { supabase } from '@/lib/supabaseClient'; 
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BotIcon, ClipboardCopy } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function AskAiPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { t } = useTranslation();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
  const fetchUserName = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) return;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", session.user.id)
      .single();

    if (profile && !profileError) {
      setUserId(session.user.id);
      setUserName(profile.username); // update state
    }
  };

  fetchUserName();
}, []);

  useEffect(() => {
    const dismissed = localStorage.getItem('ai_welcome_dismissed');
    if (!dismissed) {
      setShowWelcome(true);
    }
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const res = await fetch('/api/ask-gpt', {
      method: 'POST',
      body: JSON.stringify({ question }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  const dismissBanner = () => {
    setShowWelcome(false);
    localStorage.setItem('ai_welcome_dismissed', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white px-4 py-12 flex flex-col items-center justify-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent"
      >
        Hello, <span className="font-extrabold"> {userName}</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 w-full max-w-2xl bg-white border border-green-100 shadow-xl rounded-2xl p-6 space-y-6"
      >
        {/* Welcome Banner */}
        {showWelcome && (
          <div className="relative p-4 rounded-xl border border-green-200 bg-green-50 text-sm text-green-800 shadow-inner">
            <button
              onClick={dismissBanner}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
            >
              ❌
            </button>
            <p className="font-semibold mb-1">👋 Welcome to Bible Revival AI Assistant</p>
            <p className="text-xs leading-relaxed text-gray-600">
              This assistant helps you get Biblical insights. Answers are AI-generated — always confirm with Scripture and your leaders.
            </p>
          </div>
        )}

        {/* Chat Bubble UI */}
        {question && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-right"
          >
            <div className="inline-block bg-green-100 text-green-900 rounded-xl px-4 py-2 text-sm max-w-xs">
              {question}
            </div>
          </motion.div>
        )}

        {answer && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left"
          >
            <div className="inline-block bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-gray-800 max-w-md">
              <div className="flex items-center gap-1 mb-2 text-green-700 font-semibold">
                <BotIcon size={16} /> <span>{t("askAi.answerLabel")}</span>
              </div>
              <div className="whitespace-pre-wrap">{answer}</div>
              <button
                onClick={() => navigator.clipboard.writeText(answer)}
                className="mt-3 flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
              >
                <ClipboardCopy size={14} /> {t("askAi.copy")}
              </button>
            </div>
          </motion.div>
        )}

        {/* Input + Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 border border-green-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            placeholder={t("askAi.placeholder")}
          />
          <button
            onClick={handleAsk}
            disabled={loading || !question}
            className="sm:w-40 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition-all duration-300"
          >
            {loading ? t("askAi.loading") : t("askAi.askBtn")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
