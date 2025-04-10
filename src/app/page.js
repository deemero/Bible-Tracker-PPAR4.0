"use client";

import { useState } from "react";

const slides = [
  {
    title: "Your Bible Reading",
    description: "Track every chapter you read and grow spiritually every day.",
    image: "/bible.png",
  },
  {
    title: "Join the Leaderboard",
    description: "See where you stand among other readers and stay motivated.",
    image: "/lea.png",
  },
  {
    title: "Mark Your Progress",
    description: "Tick off chapters and visualize your spiritual journey clearly.",
    image: "/mark.png",
  },
];

export default function IntroPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="h-screen w-screen bg-emerald-100 flex flex-col justify-between overflow-hidden">
      
      {/* Slides container */}
      <div
        className="flex flex-1 transition-transform duration-500 flex-nowrap"
        style={{
          transform: `translateX(-${activeIndex * 100}vw)`,
          width: `${slides.length * 100}vw`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-screen h-full flex flex-col justify-center items-center text-center px-6 py-10"
          >
            <img src={slide.image} alt={slide.title} className="w-64 h-64 object-contain mb-6" />
            <h2 className="text-3xl font-bold text-green-800 mb-2">{slide.title}</h2>
            <p className="text-gray-700 max-w-sm">{slide.description}</p>
          </div>
        ))}
      </div>

      {/* Page Indicator */}
      <div className="flex justify-center items-center gap-2 py-3">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
              i === activeIndex ? "bg-green-800" : "bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center px-6 pb-6">
        <button
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          className="text-green-800 font-semibold disabled:opacity-40"
          disabled={activeIndex === 0}
        >
          Back
        </button>

        {activeIndex < slides.length - 1 ? (
          <button
            onClick={() => setActiveIndex(Math.min(slides.length - 1, activeIndex + 1))}
            className="text-green-800 font-semibold"
          >
            Next
          </button>
        ) : (
          <div className="flex gap-3 w-full justify-center">
            <a
              href="/auth/signin"
              className="px-6 py-3 bg-white text-green-700 rounded-full font-semibold shadow hover:bg-green-50 transition"
            >
              Log in
            </a>
            <a
              href="/auth/signup"
              className="px-6 py-3 bg-green-700 text-white rounded-full font-semibold shadow hover:bg-green-800 transition"
            >
              Sign up
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
