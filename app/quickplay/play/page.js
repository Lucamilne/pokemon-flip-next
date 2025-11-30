"use client"

import Board from "@/components/Board/Board";

export default function Home() {
  return (
    <>
      <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-neutral-400 rounded-xl" >
        <Board />
      </section>
    </>
  );
}
