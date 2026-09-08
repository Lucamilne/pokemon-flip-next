import { memo } from 'react';
import LoadingCardSkeleton from './LoadingCardSkeleton.jsx';
import SelectableCard from './SelectableCard.jsx';

const CardLibrary = memo(function CardLibrary({ isLoadingCollection, filteredCards, selectedCardIds, onCardSelect, cardGridRef }) {
    return (
        <div ref={cardGridRef} tabIndex={0} className={`h-full relative hide-scrollbar p-2 pb-[52px] md:p-4 md:pb-4 ${isLoadingCollection ? 'overflow-y-hidden' : 'overflow-y-auto'} focus:outline-none`}>
            <div className="grid grid-cols-[repeat(4,82px)] place-content-center md:grid-cols-[repeat(4,124px)] auto-rows-min gap-1 md:gap-4">
                {isLoadingCollection ? <><>{Array.from({ length: 24 }).map((_, index) => <LoadingCardSkeleton key={index} index={index} />)}</><p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl header-text text-hop flex">{'...'.split('').map((char, index) => <span key={index} style={{ animationDelay: `${(index + 1) * 50}ms` }}> {char}</span>)}</p></> : filteredCards.map((pokemonCard, index) => <SelectableCard key={pokemonCard.id} pokemonCard={pokemonCard} index={index} isSelected={selectedCardIds.has(pokemonCard.id)} onSelect={onCardSelect} />)}
            </div>
        </div>
    );
});

export default CardLibrary;
