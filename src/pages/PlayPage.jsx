import { useState } from 'react';
import Board from "@/components/Board/Board";

export default function PlayPage() {
  return (
    <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-neutral-400 md:rounded-xl" >
      <Board />
    </section>
  );
}
