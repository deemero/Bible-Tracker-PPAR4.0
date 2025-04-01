"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react"; // ✅ Penting!
import ClientLayout from "./ClientLayout";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  // ✅ Register service worker
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
