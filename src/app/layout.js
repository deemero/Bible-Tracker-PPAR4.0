// ✅ app/layout.js
import "../globals.css";
import ClientLayout from "@/components/ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";
import AutoLogoutProvider from "@/components/AutoLogoutProvider";
import { icons } from "lucide-react";

export const metadata = {
  title: "Bible Revivalz",
  description: "Reading App",
  icons: {
    icon: '/bpre.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="bprp.png" sizes="180x180" href="/bpr-180.png" />
      </head>
      <body className="bg-white text-gray-900 h-full"> {/* ✅ Back to white/light for Global */}
        <AutoLogoutProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <ClientLayout>{children}</ClientLayout>
        </AutoLogoutProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}


// // src/app/layout.js
// import "../globals.css";
// import { Toaster } from "react-hot-toast";
// import { SpeedInsights } from "@vercel/speed-insights/next";
// import AutoLogoutProvider from "@/components/AutoLogoutProvider";
// import ClientLayout from "@/components/ClientLayout";

// export const metadata = {
//   title: "Bible Tracker",
//   description: "Reading App",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <head>
//         <link rel="manifest" href="/manifest.json" />
//         <meta name="theme-color" content="#0f172a" />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
//         <link rel="apple-touch-icon" sizes="180x180" href="/bpr-180.png" />
//       </head>
//       <body className="bg-white text-gray-900 h-full">
//         <AutoLogoutProvider>
//           <Toaster position="top-center" reverseOrder={false} />
//           <ClientLayout>{children}</ClientLayout>
//         </AutoLogoutProvider>
//         <SpeedInsights />
//       </body>
//     </html>
//   );
// }
