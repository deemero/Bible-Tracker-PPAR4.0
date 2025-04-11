import "../globals.css";
import ClientLayout from "@/components/ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";
import AutoLogoutProvider from "@/components/AutoLogoutProvider";

export const metadata = {
  title: "Bible Tracker",
  description: "Reading App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Manifest & PWA Settings */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />

        {/* iOS Specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" sizes="180x180" href="/bpr-180.png" />
      </head>
      <body className="bg-background text-foreground h-full">
        <AutoLogoutProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <ClientLayout>{children}</ClientLayout>
        </AutoLogoutProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
