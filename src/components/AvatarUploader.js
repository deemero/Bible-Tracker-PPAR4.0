"use client";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfileImageUploader({ userId, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `${fileName}`; // ✅ NO folder

    // 1. Upload ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("profile-pictures") // ✅ pastikan sama dengan bucket kamu
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("Gagal muat naik gambar!");
      console.error(uploadError);
      setUploading(false);
      return;
    }

    // 2. Dapatkan public URL
    const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    // 3. Simpan URL ke dalam database
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (updateError) {
      alert("Gagal simpan URL gambar dalam database!");
      console.error(updateError);
    } else {
      onUploadSuccess(publicUrl); // Refresh gambar
    }

    setUploading(false);
  };

  return (
    <div className="mt-3">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        disabled={uploading}
      >
        {uploading ? "Memuat naik..." : "📤 Tukar Gambar"}
      </button>
    </div>
  );
}
