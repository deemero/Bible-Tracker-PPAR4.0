
// src/app/layout.js
import "../globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "Bible Tracker",
  description: "Reading App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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

