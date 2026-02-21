import { memo } from 'react';
import Card from '../Card/Card.js';

const CardGrid = memo(function CardGrid({ isLoadingCollection, filteredCards, selectedCardIds, onCardSelect, cardGridRef }) {
    return (
        <div ref={cardGridRef} tabIndex={0} className={`h-full relative hide-scrollbar p-2 pb-[52px] md:p-4 md:pb-4 ${isLoadingCollection ? 'overflow-y-hidden' : 'overflow-y-auto'} focus:outline-none`}>
            <div className="grid grid-cols-[repeat(4,82px)] place-content-center md:grid-cols-[repeat(4,124px)] auto-rows-min gap-1 md:gap-4">
                {isLoadingCollection ? (
                    <>
                        {Array.from({ length: 24 }).map((_, index) => (
                            <div
                                key={index}
                                className="fade-in-out aspect-square bg-pokedex-inner-blue/15 rounded-md"
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    opacity: 0
                                }}
                            />
                        ))}
                        <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl header-text text-hop flex'>
                            {"...".split('').map((char, index) => (
                                <span key={index} style={{ animationDelay: `${(index + 1) * 50}ms` }}> {char}</span>
                            ))}
                        </p>
                    </>
                ) : (
                    filteredCards.map((pokemonCard, index) => {
                        const isInHand = selectedCardIds.has(pokemonCard.id);
                        return (
                            <button
                                className={`cursor-pointer relative rounded-md aspect-square transition-transform shadow-md/15 ${isInHand ? 'ring-3 md:ring-5 ring-lime-300' : ''}`}
                                key={pokemonCard.id}
                                onClick={() => onCardSelect(pokemonCard)}
                            >
                                <Card isUnselected={!isInHand} pokemonCard={pokemonCard} index={index} isDraggable={false} />
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
});

export default CardGrid;
