"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "@supabase/auth-helpers-react";
import Image from "next/image";
import toast from "react-hot-toast";
import useTranslation from "@/hooks/useTranslation";

export default function FindFriendPage() {
  const session = useSession();
  const [users, setUsers] = useState([]);
  const [friendIds, setFriendIds] = useState([]);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from("friends")
        .select("sender_id, receiver_id")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      const allFriendIds = existing.map((f) =>
        f.sender_id === user.id ? f.receiver_id : f.sender_id
      );
      setFriendIds(allFriendIds);

      const { data: allUsers } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .neq("id", user.id);

      const filtered = allUsers.filter((u) => !allFriendIds.includes(u.id));
      setUsers(filtered);
    };

    load();
  }, []);

  const handleAddFriend = async (targetId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existing } = await supabase
      .from("friends")
      .select("id")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .eq("status", "accepted");

    if (existing.length >= 50) {
      toast.error(t("findFriend.errorLimit"));
      return;
    }

    const { error } = await supabase.from("friends").insert({
      sender_id: user.id,
      receiver_id: targetId,
      status: "pending",
    });

    if (error) {
      toast.error(t("findFriend.errorAdd"));
      console.error(error);
    } else {
      toast.success(t("findFriend.successAdd"));
      setUsers(users.filter((u) => u.id !== targetId));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        {t("findFriend.title")}
      </h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder={t("findFriend.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="space-y-3">
        {users
          .filter((user) =>
            user.username.toLowerCase().includes(search.toLowerCase())
          )
          .map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-white text-black shadow hover:shadow-md transition"
            >
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300" />
              )}

              <div className="flex-1">
                <div className="font-medium">{user.username}</div>
              </div>

              <button
                onClick={() => handleAddFriend(user.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-600"
              >
                {t("findFriend.addFriendBtn")}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
