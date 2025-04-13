'use client';
import { useState } from 'react';
import { bibleBooks } from '@/lib/bibleData';

export default function TimeToReadPage() {
  const [startBook, setStartBook] = useState('Kejadian');
  const [endBook, setEndBook] = useState('Kejadian');
  const [startChapter, setStartChapter] = useState('');
  const [endChapter, setEndChapter] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [language, setLanguage] = useState('ms');

  const getChapterCount = (bookName) => {
    for (const section of bibleBooks) {
      for (const book of section.books) {
        if (book.name === bookName) return book.chapters;
      }
    }
    return 0;
  };

  const calculateEstimate = () => {
    const startIdx = bibleBooks.flatMap(s => s.books).findIndex(b => b.name === startBook);
    const endIdx = bibleBooks.flatMap(s => s.books).findIndex(b => b.name === endBook);
    if (startIdx === -1 || endIdx === -1) return;

    const allBooks = bibleBooks.flatMap(s => s.books);
    const rangeBooks = startIdx <= endIdx ? allBooks.slice(startIdx, endIdx + 1) : [];

    let totalChapters = 0;
    rangeBooks.forEach((book, idx) => {
      const start = idx === 0 ? parseInt(startChapter) : 1;
      const end = idx === rangeBooks.length - 1 ? parseInt(endChapter) : book.chapters;
      totalChapters += end - start + 1;
    });

    const minutesPerChapter = language === 'en' ? 4.03 : 3.78;
    const totalMinutes = Math.round(totalChapters * minutesPerChapter);
    setEstimate(totalMinutes);
  };

  const convertToHourMin = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h} jam ${m} minit`;
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">
        Estimasi Masa Baca Alkitab
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Mula dari Buku</label>
          <select
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none"
            value={startBook}
            onChange={(e) => setStartBook(e.target.value)}
          >
            {bibleBooks.flatMap(sec => sec.books).map((book, idx) => (
              <option key={idx} value={book.name}>{book.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Tamat di Buku</label>
          <select
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none"
            value={endBook}
            onChange={(e) => setEndBook(e.target.value)}
          >
            {bibleBooks.flatMap(sec => sec.books).map((book, idx) => (
              <option key={idx} value={book.name}>{book.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Pasal Mula</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none"
            value={startChapter}
            onChange={(e) => setStartChapter(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Pasal Tamat</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none"
            value={endChapter}
            onChange={(e) => setEndChapter(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center items-center gap-3 mb-8">
        <span className="text-sm text-gray-700 font-medium">Bahasa:</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none"
        >
          <option value="ms">Melayu / Indonesia</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="text-center">
        <button
          onClick={calculateEstimate}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200"
        >
        Calculate
        </button>
      </div>

      {estimate !== null && (
        <div className="mt-8 bg-green-100 text-green-900 rounded-xl px-6 py-4 font-semibold text-center text-lg">
          Anggaran masa untuk membaca: <span className="font-bold">{convertToHourMin(estimate)}</span>
        </div>
      )}
    </div>
  );
}