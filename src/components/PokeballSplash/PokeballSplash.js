import { useState, useEffect } from 'react';

export default function PokeballSplash({ pokeballIsOpen, setPokeballIsOpen }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (pokeballIsOpen) {
      setTimeout(() => {
        setIsVisible(false);
      }, 400);
    }
  }, [pokeballIsOpen])

  if (!isVisible) return null;

  return (
    <section className="absolute top-0 left-0 w-full h-full overflow-y-hidden">
      <div
        className={`pokeball-top bg-theme-red ${pokeballIsOpen ? 'open-up' : ''}`}
      />
      <div
        className={`pokeball-bottom flex flex-col relative ${pokeballIsOpen ? 'open-down' : ''}`}
      >
        <div className="bg-black h-24 w-full" />
        <div className="bg-zinc-200 shadow-top h-full" />
        <div className="bg-white surround-mobile rounded-full flex justify-center items-center">
          <button
            className="pokeball-button bg-white rounded-full cursor-pointer"
            onClick={() => setPokeballIsOpen(true)}
            aria-label="Open pokeball"
          />
        </div>
      </div>
      <p className={`${pokeballIsOpen ? "hidden" : ""} pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:mt-8 text-lg text-sky-400 text-shadow-sm/30 font-press-start blink-1 uppercase`}>Press!</p>
    </section>
  );
}
