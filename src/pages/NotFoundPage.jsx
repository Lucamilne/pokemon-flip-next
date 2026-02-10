import { useNavigate } from 'react-router-dom';
import styles from '@/retro.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-pokedex-lighter-blue md:rounded-xl">
      <div className="text-white flex-1 flex flex-col items-center justify-center font-press-start text-center p-8 gap-8 ">

        <h1 className="text-4xl md:text-6xl header-text">404</h1>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png"
          alt="Psyduck"
          className="size-32 drop-shadow-md"
          draggable={false}
        />
        <p className="text-xs md:text-base">This route was not very effective...</p>
        <button
          className={`${styles['nes-btn']} ${styles['is-primary']} cursor-pointer`}
          onClick={() => navigate('/')}
        >
          Go Home
        </button>
      </div>
    </section>
  );
}
