import styles from '@/retro.module.css';

export default function HandActions({ onClear, onConfirm }) {
    return <div className="bg-linear-to-b from-pokedex-blue to-pokedex-dark-blue h-20 w-full absolute -bottom-20 flex gap-4 justify-center items-center font-press-start"><button onClick={onClear} className={`${styles['nes-btn']} ${styles['is-error']} cursor-pointer`}>Clear</button><button onClick={onConfirm} className={`${styles['nes-btn']} ${styles['is-success']} cursor-pointer`}>Confirm</button></div>;
}
