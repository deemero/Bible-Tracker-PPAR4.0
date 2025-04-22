'use client';
import { useState } from 'react';
import { BotIcon, ClipboardCopy } from 'lucide-react';

export default function AskAiPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
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

  const handlePreset = (presetText) => {
    setQuestion(presetText);
    setAnswer('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl border border-green-100 rounded-2xl p-6 space-y-6 relative">
        {/* AI Icon */}
        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-4 border-white">
          <BotIcon size={20} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-green-700 mt-6">AI Revival</h1>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => handlePreset("Bagi kesaksian Hidup orang Kristian")}
            className="bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full text-sm text-green-900"
          >
            Kesaksian Hidup
          </button>
          <button
            onClick={() => handlePreset("Tolong beri ayat Alkitab bila saya takut")}
            className="bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full text-sm text-green-900"
          >
            Bila Takut 
          </button>
          <button
            onClick={() => handlePreset("Tuliskan doa ringkas untuk saya hari ini")}
            className="bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full text-sm text-green-900"
          >
            Doa Hari Ini
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border border-green-300 rounded-lg p-3 text-sm focus:outline-green-500"
          rows={4}
          placeholder="Contoh: Apa maksud Roma 12:2?"
        />

        {/* Submit Button */}
        <button
          onClick={handleAsk}
          disabled={loading || !question}
          className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2 rounded-lg text-sm font-semibold shadow-md"
        >
          {loading ? '⏳ Menjawab...' : '🙏 Tanya'}
        </button>

        {/* AI Answer */}
        {answer && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-inner">
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed tracking-normal">
              <strong className="text-green-700">Jawapan AI:</strong><br />
              {answer}
            </div>
            <button
              onClick={handleCopy}
              className="mt-3 flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
            >
              <ClipboardCopy size={14} /> Salin Jawapan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
