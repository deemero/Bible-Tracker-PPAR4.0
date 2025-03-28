"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, BookOpen, BarChartBig, Settings, Menu, LogOut, Search } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: <Home size={20} />, text: "Home", href: "/", color: "blue" },
    { icon: <BookOpen size={20} />, text: "Reading Progress", href: "/reading-progress", color: "green" },
    { icon: <BarChartBig size={20} />, text: "Leaderboard", href: "/leaderboard", color: "green" },
    { icon: <Settings size={20} />, text: "Settings", href: "/settings", color: "green" },
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
    router.push("/auth/signin");
  }

  if (!user) return null;

  return (
    <aside
      className={`h-screen fixed top-0 left-0 transition-all duration-300 z-50 flex flex-col items-center
        ${isOpen ? "w-64" : "w-20"}`}
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        color: "#1e1e1e",
        fontFamily: "'Inter', sans-serif",
        borderRight: "1px solid rgba(0,0,0,0.05)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="w-full flex flex-col items-center py-6 border-b border-gray-200 px-4">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 hover:text-blue-600 self-start">
          <Menu size={22} />
        </button>

        {isOpen ? (
          <div className="flex flex-col gap-1 mt-4 w-full text-center">
            <div className="text-xl font-bold text-green-600 leading-tight">Bible Project 4.0</div>
            <div className="text-sm font-medium text-gray-700 -mt-1">Revival Generation</div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="text-xs font-bold text-green-600 text-center leading-tight">BPR</div>
          </div>
        )}

        {isOpen && (
          <div className="mt-4 w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white text-gray-800 shadow-inner border border-gray-200"
              />
              <Search size={16} className="absolute top-2.5 right-3 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 w-full px-4 mt-6 space-y-4 overflow-y-auto">
        <Section label="" isOpen={isOpen}>
          {navItems
            .filter((item) => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                text={item.text}
                href={item.href}
                isOpen={isOpen}
                pathname={pathname}
                color={item.color}
              />
            ))}
        </Section>
      </nav>

      <div className="mb-6 w-full px-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 transition w-full justify-center"
        >
          <LogOut size={18} />
          <span className={`${!isOpen ? "sr-only" : ""}`}>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, text, href, isOpen, pathname, badge = null, color = "green" }) {
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
        onClick={() => router.push(href)}
        className={`flex items-center gap-3 text-sm py-2 px-3 rounded-lg transition-all w-full
          ${colorClass} ${isOpen ? "justify-start" : "justify-center"}`}
      >
        {icon}
        {isOpen && <span>{text}</span>}
        {badge && isOpen && (
          <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </button>
    </div>
  );
}

function Section({ label, isOpen, children }) {
  return (
    <div>
      {isOpen && label && <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2 ml-1">{label}</h4>}
      <div className="space-y-1">{children}</div>
    </div>
  );
}
