"use client";

import { usePathname } from "next/navigation";
import SidebarWrapper from "./SidebarWrapper";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <div className="min-h-screen flex bg-gray-100">
      {!isAuthPage && <SidebarWrapper />}
      <main className={`flex-1 p-4 transition-all duration-300 ${!isAuthPage ? 'ml-16 sm:ml-64' : 'flex items-center justify-center'}`}>
        {children}
      </main>
    </div>
  );
}
