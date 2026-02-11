import { useNavigate, Link } from 'react-router-dom';
import styles from '@/retro.module.css';
import { fetchCardById } from "@/utils/cardHelpers.js";
import { useDroppable, DndContext } from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import Help from "@/components/Help/Help.js"
import { typeTiles } from '@/utils/typeIcons'
import Card from '@/components/Card/Card.js';

function DropZone({ droppedCard }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "drop-zone",
    data: {
      cellKey: "drop-zone"
    }
  });

  const modifiedCard = droppedCard ? {
    ...droppedCard,
    stats: droppedCard.stats.map(stat => stat + 1),
    types: ['water']
  } : null;

  return (
    <div
      ref={setNodeRef}
      className="relative aspect-square w-[88px] md:w-[148px] border-4 border-black p-1 md:p-2 water-tile"
      data-cell="drop-zone"
    >
      {/* Hover overlay */}
      {isOver && (
        <div className="absolute inset-0 bg-blue-500/30 pointer-events-none z-10" />
      )}

      <img
        draggable={false}
        className="absolute w-1/3 h-1/3 inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
        src={typeTiles.water}
        width={100}
        height={100}
        alt={`Water type tile`}
      />

      {modifiedCard && (
        <div className="absolute inset-0 p-1 md:p-2 aspect-square">
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

const pokemonCard = fetchCardById(54);
pokemonCard.types = ['psychic'];

export default function NotFoundPage() {
  const navigate = useNavigate();

  const [droppedCard, setDroppedCard] = useState(null);
  const [isBeingDragged, setIsBeingDragged] = useState(false)

  const handleDragStart = (event) => {
    setIsBeingDragged(true);
  }

  const handleDragEnd = (event) => {
    setIsBeingDragged(false);
    const { active, over } = event;

    if (over && over.id === "drop-zone") {
      const draggedCard = active.data.current.pokemonCard;
      setDroppedCard(draggedCard);
      setTimeout(() => navigate('/'), 1500);
    }
  };

  return (
    <section className="relative h-full flex flex-col gap-4 bg-(--color-psychic-300) flex items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4 md:gap-8">
        <div className='fade-in flex items-center font-press-start mb-4'>
          <span className='text-5xl header-text -m-8'>4</span>
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png"
            alt="Psyduck"
            className="size-32 drop-shadow-md"
            draggable={false}
          />
          <span className='text-5xl header-text -m-6'>4</span>
        </div>
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <div className="fade-in relative flex justify-around items-center w-full" style={{ animationDelay: '150ms' }}>
            <div className={`relative aspect-square w-[72px] md:w-[124px] rounded-md`}>
              <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-black/15" />
              {!droppedCard && (
                <Card index={0} pokemonCard={pokemonCard} isPlayerCard={true} isDraggable={true} startsFaceUp={true} showTooltip={false} />
              )}
            </div>
            <div className="arrow-relative" />
            <div className="relative">
              <DropZone droppedCard={droppedCard} />
              {!isBeingDragged && !droppedCard && (
                <Help direction="from-right" customClass="!whitespace-nowrap scale-80 md:scale-100 !absolute !-top-16 !right-0 md:!right-12" text="Drag here!" />
              )}
            </div>
          </div>
        </DndContext>
        <div className='fade-in text-black text-xs md:text-base font-press-start flex flex-col items-center gap-4 mb-20' style={{ animationDelay: '300ms' }}>
          <p>Looks like Psyduck is confused.</p>
          <p>Help Psyduck find its way <Link to="/" className="cursor-pointer text-blue-500">home</Link>!</p>
        </div>
      </div>
    </section>
  );
}
