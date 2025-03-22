"use client"; 
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/signin"; // Hide sidebar on Signin page

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}
      <main className={`flex-1 p-6 transition-all duration-300 ${hideSidebar ? "" : "ml-20 md:ml-64"}`}>
        {children}
      </main>
    </div>
  );
}
