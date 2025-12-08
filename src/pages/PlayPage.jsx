import Board from "@/components/Board/Board";
import { useState } from 'react';
import HowToPlay from "@/components/HowToPlay/HowToPlay";

export default function PlayPage() {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-neutral-400 rounded-xl" >
        <Board />
      </section>
      <button onClick={() => setIsOpen(true)} className="cursor-pointer p-1 leading-none flex justify-center items-center absolute top-2 right-2 text-white/80 font-press-start text-2xl hover:text-white">
        <span>?</span>
      </button>
      {isOpen && (
        <HowToPlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
