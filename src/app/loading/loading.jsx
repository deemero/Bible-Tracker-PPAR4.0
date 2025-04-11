'use client';
import Image from 'next/image';

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Image
        src="/bpr.png" // Pastikan gambar ada dalam public folder
        alt="Bible Project Logo"
        width={150}
        height={150}
        className="rounded-full shadow-lg animate-pulse"
      />
      <p className="mt-4 text-green-700 font-semibold animate-bounce">
        Loading Bible Project...
      </p>
    </div>
  );
}
