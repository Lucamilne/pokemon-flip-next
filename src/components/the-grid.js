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

    const style = {
        backgroundColor: isOver ? 'rgba(0, 255, 0, 0.2)' : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative dropzone aspect-square border-2 border-black p-2 ${cellData.class} ${cellData.element ? typeBackgrounds[cellData.element] : 'bg-white/30'}`}
            data-cell={cellKey}
        >
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

            {cellData.pokemonCardRef && (
                <div className="absolute inset-0 p-2">
                    <Card
                        pokemonCard={cellData.pokemonCardRef}
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
        <div className="grid shadow grid-cols-3 mx-12" id="grid">
            {Object.entries(cells).map(([key, value]) => (
                <DroppableCell key={key} cellKey={key} cellData={value} />
            ))}
        </div>
    );
}