import Image from 'next/image'
import { typeTiles } from '@/utils/typeIcons'
import { typeBackgrounds } from '@/utils/typeBackgrounds'
import { useDroppable } from '@dnd-kit/core';
import Card from './card.js';

function DroppableCell({ cellKey, cellData }) {
    const { isOver, setNodeRef } = useDroppable({
        id: cellKey,
        data: {
            cellKey
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`relative dropzone aspect-square border-2 border-black p-2 ${cellData.class} ${cellData.element ? typeBackgrounds[cellData.element] : 'bg-white/30'}`}
            data-cell={cellKey}
        >
            {/* Hover overlay */}
            {isOver && (
                <div className="absolute inset-0 bg-green-500/20 pointer-events-none z-10" />
            )}

            {cellData.element && (
                <Image
                    draggable={false}
                    className="absolute w-1/3 h-1/3 inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    src={typeTiles[cellData.element]}
                    width={100}
                    height={100}
                    alt={`${cellData.element} type tile`}
                />
            )}

            {cellData.pokemonCard && (
                <div className="absolute inset-0 p-2">
                    <Card
                        pokemonCard={cellData.pokemonCard}
                        isPlayerCard={true}
                        index={0}
                        isDraggable={false}
                        initIsFlipped={true}
                    />
                </div>
            )}
        </div>
    );
}

export default function TheGrid({ cells }) {
    return (
        <div className="grid shadow grid-cols-3 w-3/5 mx-auto" id="grid">
            {Object.entries(cells).map(([key, value]) => (
                <DroppableCell key={key} cellKey={key} cellData={value} />
            ))}
        </div>
    );
}