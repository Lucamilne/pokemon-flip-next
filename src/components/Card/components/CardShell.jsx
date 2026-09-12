import { useDraggable } from '@dnd-kit/core';

export default function CardShell({ pokemonCard, index, cellKey, isDraggable, tooltipHandlers, children }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `${pokemonCard.id}-${cellKey}-${pokemonCard.isPlayerCard ? 'player' : 'cpu'}`,
        disabled: !isDraggable,
        data: { pokemonCard, index }
    });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

    return (
        <div className={`relative select-none ${isDraggable ? 'cursor-pointer touch-none' : 'cursor-not-auto'} ${transform ? 'z-20 shadow-lg/30 scale-105' : ''}`} ref={setNodeRef} style={style} {...(isDraggable ? listeners : {})} {...(isDraggable ? attributes : {})} {...tooltipHandlers}>
            {children(isDragging)}
        </div>
    );
}
