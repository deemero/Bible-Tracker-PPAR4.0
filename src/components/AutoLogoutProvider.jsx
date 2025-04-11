"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

// const TIMEOUT_MS = 18000000; // ✅ Auto logout selepas 5 jam

const TIMEOUT_MS = 43200000; // ✅ Auto logout selepas 12 jam

export default function AutoLogoutProvider({ children }) {
  const router = useRouter();
  const timeoutRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toastShown, setToastShown] = useState(false); // Untuk mengawal bila toast dipaparkan

  // Setup session listener
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Setup timer reset on activity
  useEffect(() => {
    if (!isLoggedIn) return; // Skip jika belum log masuk

    const resetTimer = () => {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && !toastShown) { // Pastikan toast hanya dipaparkan sekali
          await supabase.auth.signOut();
          toast("You've been logged out due to inactivity.", {
            icon: "⏰",
            style: {
              background: "#fef3c7",
              color: "#92400e",
            },
          });
          setToastShown(true); // Tandakan toast telah dipaparkan
          router.push("/"); // Redirect ke intro page
        }
      }, TIMEOUT_MS);
    };

    // Trigger reset pada semua aktiviti
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer(); // Mulakan timer pertama kali

    return () => {
      clearTimeout(timeoutRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [isLoggedIn, toastShown]); // Hanya jalankan timer apabila pengguna log masuk

  return <>{children}</>;
}
