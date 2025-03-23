// app/layout.js
import "./globals.css";
import SidebarWrapper from "../components/SidebarWrapper";

export const metadata = {
  title: "Dashboard",
  description: "Sidebar Example",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex">
        <SidebarWrapper />
        {/* Content bergerak ikut lebar sidebar */}
        <main className="min-h-screen flex-1 p-4 ml-16 sm:ml-64 transition-all duration-300">
          {children}
        </main>
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

