// src/app/auth/layout.js

import "../../globals.css";


export default function AuthLayout({ children }) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      {children}
    </main>
  );
}
