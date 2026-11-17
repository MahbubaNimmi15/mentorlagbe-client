
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MentorLagbe | Smart Tuition & Mentorship",
  description:
    "Find tutors and mentorship opportunities that match your learning goals with MentorLagbe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
