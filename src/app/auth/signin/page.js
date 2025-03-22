"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null); // Simpan username selepas login
  const router = useRouter();

  async function handleSignIn(e) {
    e.preventDefault();
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return setError(error.message);

    // Dapatkan username selepas login
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUsername(user.user_metadata.username || "Guest");

    router.push("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl">Sign In</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
      </form>
      {username && <p>Welcome, {username}!</p>} {/* Tunjuk username selepas login */}
      <p>Don't have an account? <a href="/auth/signup" className="text-blue-500">Sign Up</a></p>
    </div>
  );
}


// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";

// export default function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   async function handleSignIn(e) {
//     e.preventDefault();
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) return setError(error.message);
//     router.push("/");
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-2xl">Sign In</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
//         <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Sign In</button>
//       </form>
//       <p>Don't have an account? <a href="/auth/signup" className="text-blue-500">Sign Up</a></p>
//     </div>
//   );
// }
