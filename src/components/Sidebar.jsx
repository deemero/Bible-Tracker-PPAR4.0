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
    <aside
      className={`h-screen fixed top-0 left-0 transition-all duration-300 shadow-lg z-40 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col`}
      style={{
        background: "linear-gradient(to bottom, #e0f7ff, #f0ffff, #ffffff)",
        color: "#2e2e2e", // Soft dark text
        fontFamily: "'Segoe UI', 'Inter', sans-serif",
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-gray-700">
          <Menu size={20} />
          {isOpen && (
  <div className="leading-tight">
    <div className="text-sm font-semibold">Bible Project 4.0</div>
    <div className="text-xs text-gray-600">Revival Generation</div>
  </div>
)}

        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
  <SidebarItem icon={<Home size={20} />} text="Home" href="/" isOpen={isOpen} pathname={pathname} />
  <SidebarItem icon={<Book size={20} />} text="Reading Progress" href="/reading-progress" isOpen={isOpen} pathname={pathname} />
  <SidebarItem icon={<BarChart size={20} />} text="Leaderboard" href="/leaderboard" isOpen={isOpen} pathname={pathname} />
  <SidebarItem icon={<Settings size={20} />} text="Settings" href="/settings" isOpen={isOpen} pathname={pathname} />
  <SidebarItem icon={<Book size={20} />} text="Others" href="/others" isOpen={isOpen} pathname={pathname} />
</nav>


      <div className="p-4 border-t border-gray-300">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-500 hover:bg-red-100 hover:text-red-700 rounded-md transition"
        >
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, text, href, isOpen, pathname }) {
  const router = useRouter();
  const isActive = pathname === href;

  return (
    <button
      onClick={() => router.push(href)}
      className={`group flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-md transition-all duration-200
        ${isActive
          ? "bg-blue-100 text-blue-700"
          : "text-gray-700 hover:bg-gray-100"}`}
    >
      <span>{icon}</span>
      {isOpen && <span className="whitespace-nowrap">{text}</span>}
    </button>
  );
}
