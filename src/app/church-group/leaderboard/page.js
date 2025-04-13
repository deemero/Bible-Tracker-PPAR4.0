// "use client";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import Image from "next/image";

// export default function ChurchLeaderboardPage() {
//   const [tab, setTab] = useState("overall");
//   const [overallLeaders, setOverallLeaders] = useState([]);
//   const [monthlyLeaders, setMonthlyLeaders] = useState([]);
//   const [streakLeaders, setStreakLeaders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [churchId, setChurchId] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("church_id")
//         .eq("id", user.id)
//         .single();

//       if (profile?.church_id) {
//         setChurchId(profile.church_id);
//         fetchAll(profile.church_id);
//       }
//     };
//     load();
//   }, []);

//   const fetchAll = async (cid) => {
//     const { data: overall } = await supabase.rpc("get_church_overall_leaders", { church_uuid: cid });
//     const { data: monthly } = await supabase.rpc("get_church_monthly_leaders", { church_uuid: cid });
//     const { data: streak } = await supabase
//       .from("church_streak_leaders")
//       .select("user_id, username, avatar_url, reading_streak")
//       .eq("church_id", cid)
//       .order("reading_streak", { ascending: false });

//     if (overall) setOverallLeaders(overall);
//     if (monthly) setMonthlyLeaders(monthly);
//     if (streak) setStreakLeaders(streak);
//   };

//   const renderList = (list) => {
//     const topThree = list.slice(0, 3);
//     const others = list.slice(3);

//     return (
//       <>
//         {topThree.length > 0 && (
//           <div className="grid sm:grid-cols-3 gap-4 mb-6">
//             {topThree.map((user, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col items-center bg-white text-black rounded-xl p-4 shadow-md hover:shadow-xl transition duration-300 hover:scale-105 ring-4 ring-[#FBC687] animate-heartbeat-glow"
//               >
//                 {user.avatar_url ? (
//                   <Image
//                     src={user.avatar_url}
//                     alt="Avatar"
//                     width={64}
//                     height={64}
//                     className="rounded-full object-cover w-16 h-16 mb-2"
//                   />
//                 ) : (
//                   <div className="w-16 h-16 rounded-full bg-gray-300 mb-2" />
//                 )}
//                 <div className="text-sm font-semibold text-gray-600 mb-1">#{index + 1}</div>
//                 <div className="font-bold text-lg">{user.username}</div>
//                 <div className="text-xs text-gray-500 mb-1">{user.chapters_read} Bab</div>
//                 <div className="text-sm font-semibold text-blue-500">{user.progress_percentage}%</div>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="space-y-2">
//           {others.map((user, index) => (
//             <div key={index + 3} className="flex items-center gap-4 p-3 rounded-lg bg-white text-black shadow">
//               <div className="text-lg font-bold w-6 text-gray-600">{index + 4}</div>
//               <div className="flex-shrink-0">
//                 {user.avatar_url ? (
//                   <Image
//                     src={user.avatar_url}
//                     alt="Avatar"
//                     width={40}
//                     height={40}
//                     className="rounded-full object-cover w-10 h-10"
//                   />
//                 ) : (
//                   <div className="w-10 h-10 rounded-full bg-gray-300" />
//                 )}
//               </div>
//               <div className="flex-1">
//                 <div className="font-medium">{user.username}</div>
//                 <div className="text-xs text-gray-500 mb-1">{user.chapters_read} Bab dibaca</div>
//                 <div className="w-full bg-gray-200 h-2 rounded-full">
//                   <div
//                     className={`h-full rounded-full transition-all duration-300 ${user.progress_percentage >= 80 ? "bg-green-500" : user.progress_percentage >= 60 ? "bg-lime-400" : user.progress_percentage >= 30 ? "bg-yellow-300" : "bg-red-400"}`}
//                     style={{ width: `${user.progress_percentage}%` }}
//                   />
//                 </div>
//               </div>
//               <div className="text-sm font-bold">{user.progress_percentage}%</div>
//             </div>
//           ))}
//         </div>
//       </>
//     );
//   };

//   const renderStreakList = (filteredList) => (
//     <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
//       {filteredList.map((user, index) => (
//         <div
//           key={index}
//           className="flex flex-col items-center bg-white text-black rounded-xl p-4 shadow-md hover:scale-105 transition duration-300 ring-2 ring-[#A3C39A] animate-heartbeat-glow"
//         >
//           <div className="text-2xl mb-1">{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}</div>
//           {user.avatar_url ? (
//             <Image
//               src={user.avatar_url}
//               alt="Avatar"
//               width={64}
//               height={64}
//               className="rounded-full object-cover w-16 h-16 mb-2"
//             />
//           ) : (
//             <div className="w-16 h-16 rounded-full bg-gray-300 mb-2" />
//           )}
//           <div className="font-semibold">{user.username}</div>
//           <div className="text-sm text-orange-600 font-bold">{user.reading_streak} day streak</div>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-6">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Church Leaderboard</h1>

//       <div className="flex justify-center flex-wrap gap-3 mb-4">
//         {[{ key: "overall", label: "Top 10 Gereja" }, { key: "monthly", label: "Top 5 Bulan Ini" }, { key: "streak", label: "Streak 🔥" }].map(({ key, label }) => (
//           <button
//             key={key}
//             onClick={() => setTab(key)}
//             className={`px-4 py-2 rounded-xl font-semibold text-sm shadow transition duration-200 ${tab === key ? "bg-blue-300 text-white shadow-md" : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"}`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Cari nama..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-300 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
//         />
//       </div>

//       {tab === "overall" && renderList(overallLeaders.filter((user) => (user.username || "").toLowerCase().includes(searchTerm.toLowerCase())))}
//       {tab === "monthly" && renderList(monthlyLeaders.filter((user) => (user.username || "").toLowerCase().includes(searchTerm.toLowerCase())))}
//       {tab === "streak" && renderStreakList(streakLeaders.filter((user) => (user.username || "").toLowerCase().includes(searchTerm.toLowerCase())))}
//     </div>
//   );
// }
