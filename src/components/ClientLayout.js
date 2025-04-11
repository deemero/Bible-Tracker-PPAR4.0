"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ Hanya pages yang perlu login akan check session
  const protectedRoutes = [
    "/dashboard",
    "/leaderboard",
    "/reading-progress",
    "/settings",
    "/others",
    "/playerlist",
    "/profile",
  ];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const [checkingSession, setCheckingSession] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (!isProtected) {
        setCheckingSession(false); // ✅ Skip check for public pages
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setIsLoggedIn(false);
        router.push("/");
      } else {
        setIsLoggedIn(true);
      }

      setCheckingSession(false);
    };

    checkSession();
  }, [pathname]);

  if (checkingSession) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {isProtected && (
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
      )}

      <main className="flex-1 transition-all duration-300">
        {/* Hamburger for mobile */}
        {isProtected && (
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
