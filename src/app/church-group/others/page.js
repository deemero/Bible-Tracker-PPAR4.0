"use client";
import { useState } from "react";

export default function OthersPage() {
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    const formUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSfn1Vjv7Qvgqa8fouRcouxR9eeVrHcXKn8eqrpvN147Xz3tuw/formResponse";
    const formData = new FormData();
    formData.append("entry.2111293688", question);

    await fetch(formUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    setIsSubmitting(false);
    setSubmitted(true);
    setQuestion("");

    setTimeout(() => setSubmitted(false), 4000); // auto hide after 4s
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center text-black mb-6"> Others</h1>

      <section className="bg-white shadow rounded-xl p-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-2">📘 Tentang Bible Project 4.0: Revival Generation</h2>
  <p className="text-sm text-gray-700 leading-relaxed">
    Bible Project 4.0 adalah kesinambungan daripada projek pembacaan Alkitab yang telah dijalankan sebelum ini.
    Dalam versi terbaru ini, semua peserta akan menggunakan sistem digital untuk menanda kemajuan bacaan mereka
    secara harian.
  </p>
  <p className="text-sm text-gray-700 mt-3 leading-relaxed">
    Projek ini merangkumi <strong>Kelas Alkitab</strong> serta <strong>sesi perbincangan</strong> bersama komuniti.
    Bahan bacaan dan panduan akan disediakan oleh pihak <strong>PMMR</strong> bagi membantu peserta memahami isi
    Firman Tuhan dengan lebih mendalam.
  </p>
  <p className="text-sm text-gray-700 mt-3 leading-relaxed">
    Setiap peserta digalakkan untuk meluangkan masa <strong>saat teduh</strong> setiap hari — masa tenang untuk
    berdoa, membaca Alkitab, dan merenung secara peribadi. Ia juga membantu peserta menandakan kemajuan mereka dalam aplikasi ini.
  </p>
</section>


      {/* Aktiviti */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-2">📅 Jadual & Aktiviti Gereja</h2>
        <p className="text-gray-700 text-sm">2 minggu sebulan selepas Kebaktian Ahad Jam 1:00 Pm </p>
      </section>

      {/* Tenaga Pengajar */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-black mb-4">👤 Tenaga Pengajar</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            src="https://vcknnjdutdomnxgmvhos.supabase.co/storage/v1/object/public/others-picture//laji.jpeg"
            alt="Tenaga Pengajar"
            className="w-full sm:w-48 h-48 object-cover rounded-xl shadow"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Ts Raj Mohar Pillai</h3>
            <p className="text-sm text-gray-700 mt-2">
            Seorang yang berdedikasi dalam pelayanan firman Tuhan dan merupakan pengasas Projek Alkitab 1 hingga 3 (2018–2021). Dengan pengalaman lebih 8 tahun dalam pengajaran dan penyelidikan firman, beliau aktif menyampaikan nilai rohani dalam kehidupan seharian. Beliau menjadi teladan dalam mengasihi, mengajar, dan mengamalkan Firman Tuhan, serta terus memberi inspirasi kepada generasi baharu. Kini, beliau turut mengajar dalam Projek Alkitab 4.0: Revival Generation
            </p>
          </div>
        </div>
      </section>

      {/* Soalan Alkitab */}
      <section className="bg-[#b8e8d1] border border-green-100 shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 text-shadow">
          ❓ Ada persoalan tentang Alkitab
          <br /> identiti anda tidak akan diketahui jadi tanya seja apa sahaja, ko mau bagi cadangan aktiviti PMMR pun boleh
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            rows="4"
            className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-white bg-[#a4d9bd] focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm"
            placeholder="Tulis soalan anda di sini..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 px-5 py-2 rounded-lg font-medium transition-all shadow ${
              isSubmitting
                ? "bg-green-300 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Menghantar...
              </span>
            ) : (
              "Hantar Soalan"
            )}
          </button>
          {submitted && (
            <p className="text-white text-sm mt-3 text-shadow">
              ✅ Soalan anda berjaya dihantar!
            </p>
          )}
        </form>
      </section>

     
{/* ✅ QR Code Card */}
<section className="bg-white rounded-xl shadow p-6 text-center">
<h2 className="text-lg font-semibold text-gray-800 mb-4">💝 Support Anda</h2>

{/* No akaun + butang salin */}
<div className="flex items-center justify-center gap-2 mb-2">
  <p className="text-sm text-gray-700 font-medium select-all">100553190219</p>
  <button
    onClick={() => navigator.clipboard.writeText("100553190219")}
    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
  >
    Salin
  </button>
</div>

<p className="text-sm text-gray-600 mb-1">Touch and Go</p>
<p className="text-sm text-gray-600 mb-4">Nama: <span className="font-medium">Avender Jericho</span> (Bendahari PMMR)</p>

<p className="text-sm text-gray-700 italic leading-relaxed">
  Jika anda tergerak untuk menyokong pelayanan <strong>PMMR SIB Keliangau</strong>, sumbangan anda amat dihargai.
  Ia akan digunakan bagi menjayakan lebih banyak aktiviti kerohanian, kelas Alkitab, dan program komuniti.
  Terima kasih atas sokongan anda! 🌱
</p>

  
  {/* ✅ Klik gambar untuk besarkan */}
  <a
    href="https://vcknnjdutdomnxgmvhos.supabase.co/storage/v1/object/public/others-picture//qrcode.jpeg"
    target="_blank"
    rel="noopener noreferrer"
    download
  >
    <img
      src="https://vcknnjdutdomnxgmvhos.supabase.co/storage/v1/object/public/others-picture//qrcode.jpeg"
      alt="QR Code"
      className="w-40 h-40 mx-auto rounded-lg hover:scale-105 transition-transform duration-200 shadow"
    />
    <p className="text-xs mt-2 text-gray-500 underline">Klik untuk besarkan atau muat turun</p>
  </a>
</section>

      
    </div>
  );
}
