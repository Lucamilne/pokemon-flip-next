import { useEffect, useState } from 'react';

export default function useCardFlip({ startsFaceUp, index, isPlayerCard }) {
    const [isFlipped, setIsFlipped] = useState(startsFaceUp);

    useEffect(() => {
        if (startsFaceUp) {
            setIsFlipped(true);
            return undefined;
        }

        const delay = index * 150 + (isPlayerCard ? 0 : 750);
        const timer = setTimeout(() => setIsFlipped(true), delay);
        return () => clearTimeout(timer);
    }, [index, isPlayerCard, startsFaceUp]);

    return isFlipped;
}
