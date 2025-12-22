import { typeTiles } from '@/utils/typeIcons'
import { useDroppable } from '@dnd-kit/core';
import Card from '../Card/Card.js';

function DroppableCell({ cellKey, cellData }) {
    const { isOver, setNodeRef } = useDroppable({
        id: cellKey,
        disabled: !!cellData.pokemonCard, // Disable dropping on occupied cells
        data: {
            cellKey
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`relative aspect-square p-2 ${cellData.element ? `${cellData.element}-tile` : 'default-tile'}`}
            data-cell={cellKey}
            title={cellData.element ? `${cellData.element.charAt(0).toUpperCase() + cellData.element.slice(1)} tile` : ""}
        >
            {/* Hover overlay */}
            {isOver && (
                <div className="absolute inset-0 bg-blue-500/30 pointer-events-none z-10" />
            )}

            {cellData.element && (
                <img
                    draggable={false}
                    className="absolute w-10 md:w-1/3 h-10 md:h-1/3 inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    src={typeTiles[cellData.element]}
                    width={100}
                    height={100}
                    alt={`${cellData.element} type tile`}
                />
            )}

            {cellData.pokemonCard && (
                <div className="absolute inset-0 p-2 aspect-square">
                    <Card
                        pokemonCard={cellData.pokemonCard}
                        cellKey={cellKey}
                        isDraggable={false}
                        isPlacedInGrid={true}
                        roundCorners={false}
                        element={cellData.element}
                    />
                </div>
            )}
        </div>
    );
}

export default function Grid({ cells, isPlayerTurn, hasWonCoinToss }) {
    return (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 ${hasWonCoinToss !== null ? "bg-neutral-400" : isPlayerTurn ? "bg-theme-blue" : "bg-theme-red"}`}>
            <div className="grid grid-cols-3 w-full w-auto grid-cols-[repeat(3,88px)] md:grid-cols-[repeat(3,140px)] bg-black gap-1 border-4 border-black mx-auto aspect-square shadow-xl/30" id="grid">
                {Object.entries(cells).map(([key, value]) => (
                    <DroppableCell key={key} cellKey={key} cellData={value} />
                ))}
            </div>
        </div>
    );
}