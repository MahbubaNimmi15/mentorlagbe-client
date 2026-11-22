
import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ToastProvider } from "@/components/ui/toast-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MentorLagbe | Find Your Perfect Mentor",
    template: "%s | MentorLagbe",
  },
  description:
    "MentorLagbe connects students with tutors and helps learners find the right tuition opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fff9f0] text-[#14243a] antialiased">
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#fff9f0]">
              <p className="text-sm font-semibold text-[#627181]">
                Loading MentorLagbe...
              </p>
            </div>
          }
        >
          <ToastProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </ToastProvider>
        </Suspense>
      </body>
    </html>
  );
}
