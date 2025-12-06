"use client"

import Results from "@/components/Results/Results";

export default function Home() {
  return (
    <>
      <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-white rounded-xl" >
        <Results />
      </section>
    </>
  );
}
