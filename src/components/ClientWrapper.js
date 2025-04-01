"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import ClientLayout from "./ClientLayout";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").then(() => {
        console.log("✅ Service Worker Registered");
      });
    }
  }, []);

  return isAuthPage ? (
    <div className="w-full">{children}</div>
  ) : (
    <ClientLayout>{children}</ClientLayout>
  );
}
