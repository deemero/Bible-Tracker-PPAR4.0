"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Book, BarChart, Settings, Menu, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      router.refresh();
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/signin");
  }

  if (!user) return null;

  return (
    <aside className={`h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white fixed top-0 left-0 transition-all duration-300 shadow-xl z-40 ${isOpen ? "w-64" : "w-16"} flex flex-col`}>
      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-3 flex items-center gap-3 hover:bg-gray-700 w-full transition">
        <Menu size={16} />
        <span className={`text-sm font-semibold tracking-wide transition-all duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>
          SIB Keliangau
        </span>
      </button>

      {/* Navigation */}
      <nav className="mt-6 flex flex-col space-y-3">
        <SidebarItem icon={<Home size={24} />} text="Home" href="/" isOpen={isOpen} pathname={pathname} />
        <SidebarItem icon={<Book size={24} />} text="Reading Progress" href="/reading-progress" isOpen={isOpen} pathname={pathname} />
        <SidebarItem icon={<BarChart size={24} />} text="Leaderboard" href="/leaderboard" isOpen={isOpen} pathname={pathname} />
        <SidebarItem icon={<Settings size={24} />} text="Settings" href="/settings" isOpen={isOpen} pathname={pathname} />
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} className="mt-auto p-3 flex items-center gap-3 hover:bg-red-700 w-full transition text-red-400 hover:text-white">
        <LogOut size={24} />
        <span className={`text-lg font-medium transition-all ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>Logout</span>
      </button>
    </aside>
  );
}

function SidebarItem({ icon, text, href, isOpen, pathname }) {
  const router = useRouter();
  const isActive = pathname === href;

  return (
    <button 
      onClick={() => router.push(href)} 
      className={`flex items-center gap-4 p-3 transition rounded-lg transform hover:scale-105 ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-700"} `}
    >
      <span className={`${isActive ? "text-white" : "text-gray-400"}`}>
        {icon}
      </span>
      <span className={`text-lg font-medium transition-all ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>
        {text}
      </span>
    </button>
  );
}
