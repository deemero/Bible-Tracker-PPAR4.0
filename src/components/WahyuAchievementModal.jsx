import { motion, AnimatePresence } from "framer-motion";

export function WahyuAchievementModal({ show, onClose, type }) {
  const isFullBible = type === "wahyu";
  const isOldTestament = type === "maleakhi";
  const isYohanes = type === "yohanes";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white text-center px-8 py-6 rounded-3xl shadow-xl max-w-sm w-full border-2 border-green-100"
          >
            <div className="text-4xl mb-2">
              {isFullBible ? "🕊️" : isOldTestament ? "💪🔥" : "❤️📖"}
            </div>
            <h2 className="text-xl font-bold text-green-700 mb-2">
              {isFullBible
                ? "You Have Finished the Entire Bible!"
                : isOldTestament
                ? "You Have Finished the Old Testament!"
                : "You Have Finished the Book of John!"}
            </h2>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {isFullBible
                ? "Thank you for faithfully reading God's Word to the end. This journey was not easy, but you persevered. Let this not be the end, but the beginning of a deeper walk with Him."
                : isOldTestament
                ? "You're halfway through the Bible! Stay strong and keep the fire of your faith burning. You're about to enter the New Testament — where the main character finally appears after 2000 years of waiting. Keep going! 💪🔥✝️"
                : "The heart of Jesus — His love, His grace, His truth. May your heart burn brighter with love as you continue walking with Him."}
            </p>
            <p className="text-sm text-gray-700 italic mb-3">
              {isFullBible ? (
                <>
                  “Your word is a lamp to my feet and a light for my path.”<br />
                  — Psalm 119:105 ✨
                </>
              ) : isOldTestament ? (
                <>
                  “Let us not grow weary in doing good, for in due season we will reap, if we do not give up.”<br />
                  — Galatians 6:9 💥
                </>
              ) : (
                <>
                  “We love because He first loved us.”<br />
                  — 1 John 4:19 💖
                </>
              )}
            </p>
            {isFullBible && (
              <p className="text-xs text-gray-500 mb-4">
                Take a screenshot of this achievement to claim your reward. 
                We pray that you will not stop here, but continue to grow in faith. 🙏
              </p>
            )}
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              {isFullBible ? "Amen 🙏" : isOldTestament ? "Keep Going! 🚀" : "Stay in His Love ❤️"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SoundReminderModal({ show, onConfirm }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white text-center px-6 py-5 rounded-2xl shadow-xl max-w-sm w-full border border-green-100"
          >
            <div className="text-3xl mb-2">🔊</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Turn On Your Sound
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Please make sure your sound is on so you don’t miss your reward experience!
            </p>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
