"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  BarChartBig,
  Settings,
  Menu,
  LogOut,
  Search,
  Info,
  Users,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: <Home size={20} />, text: "Home", href: "/dashboard", color: "blue" },
    { icon: <BookOpen size={20} />, text: "Reading Progress", href: "/reading-progress", color: "green" },
    { icon: <BarChartBig size={20} />, text: "Leaderboard", href: "/leaderboard", color: "green" },
    { icon: <Settings size={20} />, text: "Settings", href: "/settings", color: "green" },
    { icon: <Info size={20} />, text: "Others", href: "/others", color: "green" },
    { icon: <Users size={20} />, text: "All Participant", href: "/playerlist", color: "green" },
  ];

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
    router.push("/");
  }

  if (!user) return null;

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-screen bg-white shadow-md border-r border-gray-200
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        w-64
        sm:translate-x-0 sm:static sm:block
      `}
    >
      <div className="flex justify-between items-center px-4 py-4 border-b">
        <h1 className="text-lg font-bold text-green-600">Bible Project 4.0</h1>
        <button className="sm:hidden text-gray-700" onClick={toggleSidebar}>
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-white text-gray-800 border border-gray-300 shadow-inner"
          />
          <Search size={16} className="absolute top-2.5 right-3 text-gray-400" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-2 overflow-y-auto">
        {navItems
          .filter((item) => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              text={item.text}
              href={item.href}
              pathname={pathname}
              color={item.color}
              toggleSidebar={toggleSidebar} // ✅ pass toggle
            />
          ))}
      </nav>

      {/* Logout Button */}
      <div className="mb-6 mt-4 w-full px-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 transition w-full justify-center"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, text, href, pathname, badge = null, color = "green", toggleSidebar }) {
  const router = useRouter();
  const isActive = pathname === href;

  const colorClass =
    isActive && color === "blue"
      ? "bg-blue-100 text-blue-700"
      : isActive && color === "green"
      ? "bg-green-100 text-green-700"
      : "text-gray-700 hover:bg-gray-100";

  return (
    <div className="relative w-full">
      <button
        onClick={() => {
          router.push(href);
          toggleSidebar(); // ✅ auto close after click
        }}
        className={`flex items-center gap-3 text-sm py-2 px-3 rounded-lg transition-all w-full justify-start ${colorClass}`}
      >
        {icon}
        <span>{text}</span>
        {badge && (
          <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </button>
    </div>
  );
}
