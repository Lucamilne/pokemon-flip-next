import { memo } from 'react';
import Card from '../Card/Card.js';
import Help from '../Help/Help.js';
import styles from '@/retro.module.css';

const PlayerHand = memo(function PlayerHand({ playerHand, showConfirm, showHelp, onCardClick, onClear, onConfirm }) {
    return (
        <div className={`${showConfirm ? '-translate-y-20' : 'translate-y-0'} transition-transform relative grid grid-cols-[repeat(5,72px)] md:grid-cols-[repeat(5,124px)] items-center gap-1 md:gap-4 hand-bottom-container pt-7 p-3 md:pt-8 md:p-4 w-full justify-center`}>
            {playerHand.map((pokemonCard, index) => (
                <button
                    className={`relative aspect-square ${pokemonCard ? "cursor-pointer" : ""}`}
                    key={index}
                    onClick={() => onCardClick(pokemonCard)}
                >
                    <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-pokedex-inner-blue flex justify-center items-center">
                        <span className='header-text text-xl md:text-2xl'>{index + 1}</span>
                    </div>
                    {pokemonCard && (
                        <div className='slide-in-blurred-top'>
                            <Card pokemonCard={pokemonCard} index={index} isDraggable={false} />
                        </div>
                    )}
                </button>
            ))}
            {playerHand.every(card => card === null) && showHelp && (
                <Help customClass="fade-in-b !hidden md:!block !absolute !-top-16 !left-1/2" text="Add cards to your hand!" />
            )}
            <div className='bg-linear-to-b from-pokedex-blue to-pokedex-dark-blue h-20 w-full absolute -bottom-20 flex gap-4 justify-center items-center font-press-start'>
                <button onClick={onClear} className={`${styles['nes-btn']} ${styles['is-error']} cursor-pointer`}>Clear</button>
                <button onClick={onConfirm} className={`${styles['nes-btn']} ${styles['is-success']} cursor-pointer`}>Confirm</button>
            </div>
        </div>
    );
});

export default PlayerHand;
