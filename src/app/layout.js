// src/app/layout.js
import "../globals.css";
import ClientLayout from "@/components/ClientLayout";

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
      <body className="bg-background text-foreground">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}



// import "./globals.css";
// import Sidebar from "../components/Sidebar";

// export const metadata = {
//   title: "Dashboard",
//   description: "Sidebar Example",
// };


// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="flex">
//         <Sidebar />
//         <main className="ml-64 flex-1 p-4">{children}</main>
//       </body>
//     </html>
//   );
// }



// import "./globals.css";
// import ClientWrapper from "../components/ClientWrapper";

// export const metadata = {
//   title: "Dashboard",
//   description: "Sidebar Example",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="flex">
//         <ClientWrapper>{children}</ClientWrapper>
//       </body>
//     </html>
//   );
// }

// import "./globals.css";
// import Sidebar from "../components/Sidebar";

// export const metadata = {
//   title: "Dashboard",
//   description: "Sidebar Example",
// };


// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="flex">
//         <Sidebar />
//         <main className="ml-64 flex-1 p-4">{children}</main>
//       </body>
//     </html>
//   );
// }



// import "./globals.css";
// import ClientWrapper from "../components/ClientWrapper";

// export const metadata = {
//   title: "Dashboard",
//   description: "Sidebar Example",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="flex">
//         <ClientWrapper>{children}</ClientWrapper>
//       </body>
//     </html>
//   );
// }

