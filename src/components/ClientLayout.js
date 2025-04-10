"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const showSidebar = ["/dashboard", "/leaderboard", "/reading-progress", "/settings", "/others", "/playerlist", "/profile"]
    .some(route => pathname.startsWith(route));
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {showSidebar && (
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
      )}

      <main className={`flex-1 transition-all duration-300`}>
        {/* Hamburger button (only on mobile) */}
        {showSidebar && (
          <div className="sm:hidden p-4">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
