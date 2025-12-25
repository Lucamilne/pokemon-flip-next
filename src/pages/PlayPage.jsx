import { useState } from 'react';
import Board from "@/components/Board/Board";
import HowToPlay from "@/components/HowToPlay/HowToPlay";

export default function PlayPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-neutral-400 md:rounded-xl" >
        <Board />
      </section>
      <button title="How to play" onClick={() => setIsOpen(true)} className={`absolute hidden md:flex top-14 md:top-18 right-2 md:right-5 transition-transform hover:scale-110 hover:drop-shadow/30 cursor-pointer ring-2 ring-white shrink-0 grow-0 w-9 h-9 transition-colors bg-blue-500 rounded-full flex items-center justify-center overflow-hidden`}>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g> <path d="M2 5h20v14H2V5zm18 12V7H4v10h16zM8 9h2v2h2v2h-2v2H8v-2H6v-2h2V9zm6 0h2v2h-2V9zm4 4h-2v2h2v-2z" fill="#ffffff"></path> </g></svg>
      </button>
      {isOpen && (
        <HowToPlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
