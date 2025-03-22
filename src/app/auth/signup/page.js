"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Tambah username
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSignUp(e) {
    e.preventDefault();

    // Signup user dengan username
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // Simpan username dalam metadata pengguna
      },
    });

    if (error) return setError(error.message);
    router.push("/auth/signin"); // Redirect ke Sign In
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl">Sign Up</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/auth/signin" className="text-blue-500">Sign In</a></p>
    </div>
  );
}


// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";

// export default function SignUp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   async function handleSignUp(e) {
//     e.preventDefault();
//     const { error } = await supabase.auth.signUp({ email, password });
//     if (error) return setError(error.message);
//     router.push("/auth/signin");
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-2xl">Sign Up</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
//         <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Sign Up</button>
//       </form>
//       <p>Already have an account? <a href="/auth/signin" className="text-blue-500">Sign In</a></p>
//     </div>
//   );
// }
