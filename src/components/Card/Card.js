import { useEffect, useRef, useState } from 'react';
import { useTooltip } from '@/hooks/useTooltip';
import { useCardAnimations } from '@/hooks/useCardAnimations';
import CardTooltip from './CardTooltip.js';
import CardFace from './components/CardFace.jsx';
import CardShell from './components/CardShell.jsx';
import useCardFlip from './hooks/useCardFlip.js';
import useCardPresentation from './hooks/useCardPresentation.js';

function CardContent({ pokemonCard, index = 0, cellKey, isDraggable = true, isPlacedInGrid = false, roundCorners = true, startsFaceUp = true, isUnselected = false, snapshot = false, showTooltip = true }) {
    const { isVisible, handlers } = useTooltip();
    const [tooltipPosition, setTooltipPosition] = useState('top');
    const cardRef = useRef(null);

    const isFlipped = useCardFlip({ startsFaceUp, index, isPlayerCard: pokemonCard.isPlayerCard });
    const presentation = useCardPresentation(pokemonCard, isUnselected);
    const { statDelta, showOverlay, handleStatChange } = useCardAnimations(cardRef, pokemonCard, isPlacedInGrid, snapshot);

    useEffect(() => {
        if (!isVisible || !cardRef.current) return;
        const { top, height } = cardRef.current.getBoundingClientRect();
        setTooltipPosition(top + height / 2 < window.innerHeight / 3 ? 'bottom' : 'top');
    }, [isVisible]);

    const frontProps = { pokemonCard, isPlacedInGrid, roundCorners, showOverlay, statDelta, snapshot, handleStatChange, isUnselected, ...presentation };

    return (
        <CardShell pokemonCard={pokemonCard} index={index} cellKey={cellKey} isDraggable={isDraggable} tooltipHandlers={handlers}>
            {(isDragging) => (
                <>
                    <CardFace cardRef={cardRef} isFlipped={isFlipped} frontProps={frontProps} roundCorners={roundCorners} />
                    <CardTooltip pokemonCard={pokemonCard} isVisible={isVisible} isDragging={isDragging} tooltipPosition={tooltipPosition} abilityBgStyle={presentation.abilityBgStyle} showTooltip={showTooltip} />
                </>
            )}
        </CardShell>
    );
}

export default function Card(props) {
    return props.pokemonCard ? <CardContent {...props} /> : null;
}
