import CardBack from '../CardBack.js';
import CardFront from '../CardFront.js';

export default function CardFace({ cardRef, isFlipped, frontProps, roundCorners }) {
    return <div ref={cardRef} className="relative" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)', transition: 'transform 0.3s ease-out' }}><CardFront {...frontProps} /><CardBack roundCorners={roundCorners} /></div>;
}
