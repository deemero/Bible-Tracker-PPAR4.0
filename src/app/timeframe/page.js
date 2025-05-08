'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { bibleBooks } from '@/lib/bibleData';
import useTranslation from '@/hooks/useTranslation';

export default function TimeToReadPage() {
  const [startBook, setStartBook] = useState('Kejadian');
  const [endBook, setEndBook] = useState('Kejadian');
  const [startChapter, setStartChapter] = useState('');
  const [endChapter, setEndChapter] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [language, setLanguage] = useState('ms');

  const { t } = useTranslation();

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

  const bookList = bibleBooks.flatMap(s => s.books);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-center text-green-700 mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        ⏳ {t('timeToRead.title')}
      </motion.h1>
      <p className="text-center text-gray-500 mb-10 text-sm sm:text-base">
        {t('timeToRead.description') ?? "Estimate your Bible reading time by selecting a range."}
      </p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {[{
          label: t('timeToRead.startBook'), value: startBook, set: setStartBook
        }, {
          label: t('timeToRead.endBook'), value: endBook, set: setEndBook
        }].map((item, idx) => (
          <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <label className="text-sm font-medium text-gray-700 block mb-1">{item.label}</label>
            <select
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-inner focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
              value={item.value}
              onChange={(e) => item.set(e.target.value)}
            >
              {bookList.map((book, i) => (
                <option key={i} value={book.name}>{t(`books.${i}`)}</option>
              ))}
            </select>
          </motion.div>
        ))}

        {[{
          label: t('timeToRead.startChapter'), value: startChapter, set: setStartChapter
        }, {
          label: t('timeToRead.endChapter'), value: endChapter, set: setEndChapter
        }].map((item, idx) => (
          <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <label className="text-sm font-medium text-gray-700 block mb-1">{item.label}</label>
            <input
              type="number"
              value={item.value}
              onChange={(e) => item.set(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2 shadow-inner focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex justify-center items-center gap-3 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-sm text-gray-700 font-medium">
          {t('timeToRead.languageLabel')}:
        </span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none"
        >
          <option value="ms">Melayu / Indonesia</option>
          <option value="en">English</option>
        </select>
      </motion.div>

      <motion.div
        className="text-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <button
          onClick={calculateEstimate}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {t('timeToRead.calculateBtn')}
        </button>
      </motion.div>

      {estimate !== null && (
        <motion.div
          className="mt-8 backdrop-blur-md bg-green-100/60 text-green-900 rounded-2xl px-6 py-5 font-semibold text-center text-lg shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {t('timeToRead.resultText', { time: convertToHourMin(estimate) })}
        </motion.div>
      )}
    </motion.div>
  );
}
