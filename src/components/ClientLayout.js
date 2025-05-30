"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "./Sidebar";
import { LanguageProvider } from "@/context/LanguageProvider"; // ✅ Tambah ini

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isChurchMode = pathname.startsWith("/church-group");

  const protectedRoutes = [
    "/dashboard",
    "/leaderboard",
    "/reading-progress",
    "/settings",
    "/others",
    "/playerlist",
    "/profile",
    "/church-group/dashboard",
    "/church-group/leaderboard",
    "/church-group/reading-progress",
    "/church-group/settings",
    "/church-group/others",
    "/church-group/playerlist",
  ];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const [checkingSession, setCheckingSession] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (!isProtected) {
        setCheckingSession(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      // ✅ Auto insert user to profiles if not exists
      const { user } = session;
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingProfile) {
        const username = user.email.split("@")[0];
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          username: username,
          is_online: true,
          avatar_url: `https://api.dicebear.com/6.x/thumbs/svg?seed=${username}`,
        });
      }

      setCheckingSession(false);
    };

    checkSession();
  }, [pathname]);

  if (checkingSession) return null;

  return (
    <LanguageProvider> {/* ✅ Wrap di sini */}
      <div className="flex min-h-screen bg-white text-gray-900 relative">
        {isProtected && (
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          />
        )}

        <main className="flex-1 transition-all duration-300">
          {/* ✅ Hamburger hanya muncul bila sidebar ditutup */}
          {isProtected && !isSidebarOpen && (
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
    </LanguageProvider>
  );
}
