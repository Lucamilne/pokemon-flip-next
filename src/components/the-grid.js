import Image from 'next/image'
import { typeTiles } from '@/utils/typeIcons'
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
            className={`relative aspect-square p-2 ${cellData.element ? `${cellData.element}-tile` : 'default-tile'}`}
            data-cell={cellKey}
            title={cellData.element ? `${cellData.element.toUpperCase()}` : ""}
        >
            {/* Hover overlay */}
            {isOver && (
                <div className="absolute inset-0 bg-blue-500/30 pointer-events-none z-10" />
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
                <div className="absolute inset-0 p-2 aspect-square">
                    <Card
                        pokemonCard={cellData.pokemonCard}
                        index={0}
                        isDraggable={false}
                        isPlacedInGrid={true}
                    />
                </div>
            )}
        </div>
    );
}

export default function TheGrid({ cells }) {
    return (
        <div className="relative grid grid-cols-[repeat(3,140px)] sm:grid-cols-[repeat(3,174px)] bg-black gap-1.5 border-6 border-black mx-auto overflow-hidden aspect-square" id="grid">
            {Object.entries(cells).map(([key, value]) => (
                <DroppableCell key={key} cellKey={key} cellData={value} />
            ))}
            {/* <div className="absolute -top-32 -left-8 grid grid-cols-[30px_120px] gap-4 rotate-35" aria-hidden="true">
                <div className='w-full h-128 bg-white/30' />
                <div className='w-full h-128 bg-white/30' />
            </div> */}
        </div>
    );
}