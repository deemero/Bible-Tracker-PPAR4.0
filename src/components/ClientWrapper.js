"use client";
import { usePathname } from "next/navigation";
import ClientLayout from "./ClientLayout";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth"); // Periksa jika di halaman auth

  return isAuthPage ? <div className="w-full">{children}</div> : <ClientLayout>{children}</ClientLayout>;
}
