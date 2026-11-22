
import { Suspense } from "react";
import TuitionDetailsClient from "./tuition-details-client";

export const instant = false;

export default function TuitionDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="site-container min-h-[60vh] py-24 text-center">
          <p className="text-lg font-semibold text-[#627181]">
            Loading tuition details...
          </p>
        </main>
      }
    >
      <TuitionDetailsClient />
    </Suspense>
  );
}
