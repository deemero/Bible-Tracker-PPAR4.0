"use client";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function SidebarWrapper() {
  const pathname = usePathname();
  const isSignUpPage = pathname === "/auth/signup"; // Jika di halaman sign-up, sembunyikan sidebar

  if (isSignUpPage) return null; // Sidebar tidak dirender

  return <Sidebar />;
}
