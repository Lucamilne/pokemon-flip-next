"use client"

import { fetchCardById } from "@/utils/cardHelpers.js";
import { useDroppable, DndContext } from '@dnd-kit/core';
import { useState } from 'react';
import dynamic from "next/dynamic";
import Help from "@/components/Help/Help.js"

const Card = dynamic(() => import('../../Card/Card.js'), {
    ssr: false,
});

function TutorialDropZone({ droppedCard }) {
    const { isOver, setNodeRef } = useDroppable({
        id: "tutorial-drop-zone",
        data: {
            cellKey: "tutorial-drop-zone"
        }
    });

    let defendingCard = fetchCardById(129, false);

    if (droppedCard) {
        defendingCard.isPlayerCard = true;
    }

    return (
        <div className="grid grid-cols-2 grid-cols-[repeat(2,140px)] gap-1.5 bg-black border-6 border-black">
            <div
                ref={setNodeRef}
                className="relative aspect-square p-2 default-tile"
                data-cell="tutorial-drop-zone"
            >
                {/* Hover overlay */}
                {isOver && (
                    <div className="absolute inset-0 bg-blue-500/30 pointer-events-none z-10" />
                )}

                {droppedCard && (
                    <div className="absolute inset-0 p-2 aspect-square">
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
                className="relative aspect-square p-2 default-tile"
            >
                <div className="absolute inset-0 p-2 aspect-square">
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

export default function B() {
    const pokemonCard = fetchCardById(150);
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
            <div className="relative flex justify-around items-center w-full bg-linear-to-r from-theme-blue via-white to-normal p-4 border-y-6 border-black">
                <div className={`relative aspect-square w-[124px] rounded-md`}>
                    <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-black/15" />
                    {!droppedCard && (
                        <Card index={0} pokemonCard={pokemonCard} isPlayerCard={true} isDraggable={true} startsFlipped={true} />
                    )}
                </div>
                <div className="arrow" />
                <TutorialDropZone droppedCard={droppedCard} />
                {!isBeingDragged && !droppedCard && (
                    <Help customClass="!absolute !-top-12 !-right-4" text="Gulp..." />
                )}
            </div>
        </DndContext>
    )
}