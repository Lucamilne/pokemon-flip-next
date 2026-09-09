import HandSlot from './HandSlot.jsx';

export default function PlayerHand({ cards, isPlayerHand, isDraggable, isRevealed, className }) {
    return (
        <div className={className}>
            {cards.map((pokemonCard, index) => (
                <HandSlot
                    key={index}
                    pokemonCard={pokemonCard}
                    index={index}
                    isPlayerHand={isPlayerHand}
                    isDraggable={isDraggable}
                    isRevealed={isRevealed}
                />
            ))}
        </div>
    );
}
