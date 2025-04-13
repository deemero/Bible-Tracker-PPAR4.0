// ✅ app/church-group/layout.js (server layout, no <html>)
import "../../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Church Group | Bible Tracker",
  description: "Church Mode Bible Tracker",
};

export default function ChurchGroupLayout({ children }) {
  return (
    <>
      {children}
      <SpeedInsights />
    </>
  );
}
