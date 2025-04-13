// ✅ church-group/page.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChurchGroupIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/church-group/dashboard");
  }, []);

  return null;
}


// // 📁 church-group/dashboard/page.js
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";
// import { bibleBooks } from "@/lib/bibleData";
// import { updateStreak } from "@/lib/streakUtils";
// import { TrendingUp, CalendarCheck, BarChart2, Flame } from "lucide-react";
// import Confetti from "react-confetti";
// import toast, { Toaster } from "react-hot-toast";

// export default function ChurchDashboard() {
//   const router = useRouter();
//   const [userName, setUserName] = useState("");
//   const [avatarUrl, setAvatarUrl] = useState(null);
//   const [churchName, setChurchName] = useState("");
//   const [overallProgress, setOverallProgress] = useState(0);
//   const [ranking, setRanking] = useState(null);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [showConfetti, setShowConfetti] = useState(false);

//   const allBooks = bibleBooks.flatMap((sec) => sec.books);
//   const totalChapters = allBooks.reduce((sum, book) => sum + book.chapters, 0);

//   useEffect(() => {
//     const load = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) return router.push("/");
//       const userId = session.user.id;
//       getUser(userId);
//       getChurch(userId);
//       getProgress(userId);
//     };
//     load();
//   }, []);

//   const getUser = async (uid) => {
//     const { data } = await supabase.from("profiles").select("username, avatar_url").eq("id", uid).single();
//     if (data) {
//       setUserName(data.username);
//       setAvatarUrl(data.avatar_url);
//     }
//   };

//   const getChurch = async (uid) => {
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("church_id")
//       .eq("id", uid)
//       .single();
    
//     if (profile?.church_id) {
//       const { data: church } = await supabase
//         .from("churches")
//         .select("name")
//         .eq("id", profile.church_id)
//         .single();
//       if (church) setChurchName(church.name);
//     }
//   };

//   const getProgress = async (uid) => {
//     const { data: all } = await supabase
//       .from("reading_progress")
//       .select("user_id, is_read")
//       .eq("is_read", true);

//     const userProgress = {};
//     all.forEach((row) => {
//       userProgress[row.user_id] = (userProgress[row.user_id] || 0) + 1;
//     });

//     const sorted = Object.entries(userProgress)
//       .map(([id, chapters]) => ({ id, progress: Math.round((chapters / totalChapters) * 100) }))
//       .sort((a, b) => b.progress - a.progress);

//     const index = sorted.findIndex((u) => u.id === uid);
//     setRanking(index + 1);
//     setTotalUsers(sorted.length);
//     setOverallProgress(sorted[index]?.progress || 0);
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <Toaster />
//       <div className="bg-white p-6 rounded-2xl shadow text-center">
//         {avatarUrl ? (
//           <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
//         ) : (
//           <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4" />
//         )}
//         <h1 className="text-xl font-bold text-gray-800">Hello {userName}</h1>
//         <p className="text-sm text-gray-500">Anda berada dalam gereja: <span className="font-semibold text-green-600">{churchName}</span></p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
//         <StatCard icon={<TrendingUp size={20} />} label="Overall Progress" value={`${overallProgress}%`} />
//         <StatCard icon={<BarChart2 size={20} />} label="Ranking" value={`#${ranking} of ${totalUsers}`} />
//       </div>
//     </div>
//   );
// }

// function StatCard({ icon, label, value }) {
//   return (
//     <div className="bg-white p-5 rounded-2xl shadow-md text-center border border-gray-200">
//       <div className="flex justify-center items-center mb-2 text-orange-500 text-xl">{icon}</div>
//       <p className="text-sm text-gray-600">{label}</p>
//       <h3 className="text-2xl font-semibold text-gray-800 mt-1">{value}</h3>
//     </div>
//   );
// }
