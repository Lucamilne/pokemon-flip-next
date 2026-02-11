import { useState } from 'react';
import Board from "@/components/Board/Board";

export default function PlayPage() {
  return (
    <section className="relative h-full flex flex-col gap-4 bg-neutral-400" >
      <Board />
    </section>
  );
}
