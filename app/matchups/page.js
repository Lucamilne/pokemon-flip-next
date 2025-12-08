"use client"

import Matchups from "@/components/Matchups/Matchups.js";

export default function Home() {
  return (
    <>
      <section className="overflow-hidden relative h-full flex flex-col gap-4 md:rounded-xl" >
        <Matchups />
      </section>
    </>
  );
}
