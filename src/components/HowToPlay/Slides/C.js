import { fetchCardById } from "@/utils/cardHelpers.js";
import { useDroppable, DndContext } from '@dnd-kit/core';
import { useState, useMemo } from 'react';
import Help from "@/components/Help/Help.js"
import { typeTiles } from '@/utils/typeIcons'
import Card from '../../Card/Card.js';

function TutorialDropZone({ droppedCard }) {
    const { isOver, setNodeRef } = useDroppable({
        id: "tutorial-drop-zone",
        data: {
            cellKey: "tutorial-drop-zone"
        }
    });

    const modifiedCard = useMemo(() => {
        if (!droppedCard) return null;
        return {
            ...droppedCard,
            stats: droppedCard.stats.map(stat => stat + 1)
        };
    }, [droppedCard]);

    return (
        <div
            ref={setNodeRef}
            className="relative aspect-square w-[148px] border-4 border-black p-2 fire-tile"
            data-cell="tutorial-drop-zone"
        >
            {/* Hover overlay */}
            {isOver && (
                <div className="absolute inset-0 bg-blue-500/30 pointer-events-none z-10" />
            )}

            <img
                draggable={false}
                className="absolute w-1/3 h-1/3 inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
                src={typeTiles.fire}
                width={100}
                height={100}
                alt={`Fire type tile`}
            />

            {modifiedCard && (
                <div className="absolute inset-0 p-2 aspect-square">
                    <Card
                        pokemonCard={modifiedCard}
                        index={0}
                        isDraggable={false}
                        isPlacedInGrid={true}
                        roundCorners={false}
                    />
                </div>
            )}
        </div>
    );
}

export default function C({ nextSlide }) {
    const pokemonCard = fetchCardById(37);
    const [droppedCard, setDroppedCard] = useState(null);
    const [isBeingDragged, setIsBeingDragged] = useState(false)

    const handleDragStart = (event) => {
        setIsBeingDragged(true);
    }

    const handleDragEnd = (event) => {
        setIsBeingDragged(false);
        const { active, over } = event;

        if (over && over.id === "tutorial-drop-zone") {
            const draggedCard = active.data.current.pokemonCard;
            setDroppedCard(draggedCard);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div className="relative flex justify-around items-center w-full bg-linear-to-r from-theme-blue via-white to-fire p-4 border-y-6 border-black">
                <div className={`relative aspect-square w-[124px] rounded-md`}>
                    <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-black/15" />
                    {!droppedCard && (
                        <Card index={0} pokemonCard={pokemonCard} isPlayerCard={true} isDraggable={true} startsFlipped={true} />
                    )}
                </div>
                <div className="arrow" />
                <TutorialDropZone droppedCard={droppedCard} />
                {!isBeingDragged && !droppedCard && (
                    <Help customClass="!absolute !-top-12 !right-0" text="Toasty!" />
                )}
            </div>
        </DndContext>
    )
}