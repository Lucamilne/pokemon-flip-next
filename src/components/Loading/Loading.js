import { useState, useEffect } from 'react';

export default function Loading({ pokeballIsOpen, setPokeballIsOpen }) {
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
    </section>
  );
}
