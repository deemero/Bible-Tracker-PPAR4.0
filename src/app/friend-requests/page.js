"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "@supabase/auth-helpers-react";
import Image from "next/image";
import toast from "react-hot-toast";
import useTranslation from "@/hooks/useTranslation"; // ✅ Import translation hook

export default function FriendRequestsPage() {
  const session = useSession();
  const { t } = useTranslation(); // ✅ Guna hook untuk multi-bahasa
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: requestsData, error } = await supabase
        .from("friends")
        .select("id, sender_id, receiver_id, status, created_at, sender:sender_id (username, avatar_url)")
        .eq("receiver_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(t("friendRequests.errorFetch"));
        setRequests([]);
      } else {
        setRequests(requestsData);
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleAccept = async (id) => {
    const { error } = await supabase
      .from("friends")
      .update({ status: "accepted" })
      .eq("id", id);

    if (error) {
      toast.error(t("friendRequests.errorAccept"));
    } else {
      toast.success(t("friendRequests.successAccept"));
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleDecline = async (id) => {
    const { error } = await supabase.from("friends").delete().eq("id", id);

    if (error) {
      toast.error(t("friendRequests.errorDecline"));
    } else {
      toast.success(t("friendRequests.successDecline"));
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">{t("friendRequests.title")}</h1>

      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">{t("friendRequests.loading")}</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">{t("friendRequests.noRequests")}</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-white text-black shadow hover:shadow-md transition"
            >
              {req.sender?.avatar_url ? (
                <Image
                  src={req.sender.avatar_url}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300" />
              )}

              <div className="flex-1">
                <div className="font-medium">{req.sender?.username || "Pengguna Tanpa Nama"}</div>
                <div className="text-xs text-gray-500">{t("friendRequests.wantsToBeFriend")}</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(req.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600"
                >
                  {t("friendRequests.accept")}
                </button>
                <button
                  onClick={() => handleDecline(req.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600"
                >
                  {t("friendRequests.decline")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
