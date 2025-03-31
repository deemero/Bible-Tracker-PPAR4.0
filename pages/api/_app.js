import { useEffect } from 'react'

import { useUser } from '@supabase/auth-helpers-react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function MyApp({ Component, pageProps }) {
  const user = useUser();

  useEffect(() => {
    if (typeof window !== 'undefined' && window?.OneSignal) {
      window.OneSignal = window.OneSignal || [];
      window.OneSignal.push(function () {
        window.OneSignal.init({
          appId: 'e730a55c-a4a5-4a74-b15b-984a234f0010',
          notifyButton: {
            enable: true,
          },
        });

        // Assign user ID if login
        if (user?.id) {
          window.OneSignal.setExternalUserId(user.id);
        } else {
          window.OneSignal.removeExternalUserId();
        }
      });
    }
  }, [user]);

  return <Component {...pageProps} />
}


