import { fetchCardById } from "@/utils/cardHelpers.js";
import { useDroppable, DndContext } from '@dnd-kit/core';
import { useState } from 'react';
import Help from "@/components/Help/Help.js"
import Card from '../../Card/Card.js';

function TutorialDropZone({ droppedCard }) {
    const { isOver, setNodeRef } = useDroppable({
        id: "tutorial-drop-zone",
        data: {
            cellKey: "tutorial-drop-zone"
        }
    });

    let defendingCard = fetchCardById(16, false);

    if (droppedCard) {
        droppedCard.wasNoEffect = true
    }

    return (
        <div className="grid grid-cols-2 grid-cols-[repeat(2,80px)] md:grid-cols-[repeat(2,140px)] gap-1 bg-black border-4 border-black">
            <div
                ref={setNodeRef}
                className="relative aspect-square p-1 md:p-2 default-tile"
                data-cell="tutorial-drop-zone"
            >
                {/* Hover overlay */}
                {isOver && (
                    <div className="absolute inset-0 bg-blue-500/30 pointer-events-none z-10" />
                )}

                {droppedCard && (
                    <div className="absolute inset-0 p-1 md:p-2 aspect-square">
                        <Card
                            pokemonCard={droppedCard}
                            index={0}
                            isDraggable={false}
                            isPlacedInGrid={true}
                            roundCorners={false}
                        />
                    </div>
                )}
            </div>
            <div
                className="relative aspect-square p-1 md:p-2 default-tile"
            >
                <div className="absolute inset-0 p-1 md:p-2 aspect-square">
                    <Card
                        pokemonCard={defendingCard}
                        index={1}
                        isDraggable={false}
                        isPlacedInGrid={true}
                        roundCorners={false}
                    />
                </div>
            </div>
        </div>
    );
}

export default function E({ nextSlide }) {
    const pokemonCard = fetchCardById(28);
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
            <div className="relative flex justify-around items-center w-full bg-linear-to-r from-theme-blue via-white to-theme-red p-2 md:p-4 border-y-6 border-black">
                <div className={`relative aspect-square w-[72px] md:w-[124px] rounded-md`}>
                    <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-black/15" />
                    {!droppedCard && (
                        <Card index={0} pokemonCard={pokemonCard} isPlayerCard={true} isDraggable={true} startsFaceUp={true} />
                    )}
                </div>
                <div className="arrow-relative" />
                <div className="relative">
                    <TutorialDropZone droppedCard={droppedCard} />
                    {!isBeingDragged && !droppedCard && (
                        <Help direction="from-right" customClass="!whitespace-nowrap scale-80 md:scale-100 !absolute !-top-16 !right-0" text="No threat!" />
                    )}
                </div>
            </div>
        </DndContext>
    )
}