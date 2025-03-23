// src/app/auth/layout.js

import "../../globals.css";


export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="flex items-center justify-center min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
