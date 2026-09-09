import { Link } from 'react-router-dom';

export default function PokeballSplash({ pokeballIsOpen, href, disabled = false, buttonText = "Start!", textColour = "text-sky-400" }) {
  const isDisabled = disabled || !href;
  const buttonClass = `pokeball-button bg-white rounded-full pointer-events-auto ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`;

  return (
    <section className="absolute top-0 left-0 w-full h-full overflow-y-hidden pointer-events-none">
      <div
        className={`pokeball-top bg-theme-red ${pokeballIsOpen ? 'open-up' : ''}`}
      />
      <div
        className={`relative pokeball-bottom flex flex-col relative ${pokeballIsOpen ? 'open-down' : ''}`}
      >
        <div className="bg-black h-24 w-full" />
        <div className="bg-zinc-200 shadow-top h-full" />
        <div className="bg-white surround-mobile rounded-full flex justify-center items-center">
          {isDisabled ? (
            <button className={buttonClass} type="button" aria-label="Open pokeball" disabled />
          ) : (
            <Link
              className={buttonClass}
              to={href}
              aria-label="Open pokeball"
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
            />
          )}
        </div>
        <p className={`${pokeballIsOpen || !href ? "hidden" : ""} flex gap-0.5 pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 text-lg ${textColour} text-shadow-sm/30 font-press-start uppercase text-hop`}>
          {buttonText.split('').map((char, index) => (<span key={index} style={{
            animationDelay: `${(index + 1) * 50}ms`
          }}> {char}</span>))}
        </p>
      </div>
    </section >
  );
}
