"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ✅ Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-white w-64 h-full sm:hidden">
          <Sidebar isOpen={true} toggleSidebar={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* ✅ Desktop Sidebar */}
      <div className="hidden sm:block fixed w-64 h-screen z-40">
        <Sidebar isOpen={true} />
      </div>

      {/* ✅ Main Content */}
      <main className="flex-1 sm:ml-64 pt-4 px-4 pb-12">
        {/* ☰ Mobile Toggle Button - lembut putih ninah, no shadow */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="sm:hidden mb-4 p-2 rounded-xl bg-[#fdfdfd] text-gray-800"
        >
          <Menu size={25} />
        </button>

        {children}
      </main>
    </div>
  );
}
