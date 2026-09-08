import { memo } from 'react';
import Help from '@/components/Help/Help.js';
import HandSlot from './HandSlot.jsx';
import HandActions from './HandActions.jsx';

const HandBuilder = memo(function HandBuilder({ playerHand, isHandEmpty, showConfirm, showHelp, onCardClick, onClear, onConfirm }) {
    return <div className={`${showConfirm ? '-translate-y-20' : 'translate-y-0'} transition-transform relative grid grid-cols-[repeat(5,72px)] md:grid-cols-[repeat(5,124px)] items-center gap-1 md:gap-4 hand-bottom-container pt-7 p-3 md:pt-8 md:p-4 w-full justify-center`}>{playerHand.map((pokemonCard, index) => <HandSlot key={index} pokemonCard={pokemonCard} index={index} onCardClick={onCardClick} />)}{isHandEmpty && showHelp && <Help customClass="fade-in-b !hidden md:!block !absolute !-top-16 !left-1/2" text="Add cards to your hand!" />}<HandActions onClear={onClear} onConfirm={onConfirm} /></div>;
});

export default HandBuilder;
