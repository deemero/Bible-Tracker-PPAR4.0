// src/app/layout.js
import "../globals.css";
import ClientLayout from "@/components/ClientLayout";
import { Metadata } from "next";
import Head from "next/head";

export const metadata = {
  title: "Bible Tracker",
  description: "Reading App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-background text-foreground">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").then(() => {
      console.log("✅ Service Worker Registered");
    });
  }
}, []);



