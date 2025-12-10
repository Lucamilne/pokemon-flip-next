import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResultTransition({ reverse = false }) {
    const [tilesLeft, setTilesLeft] = useState(Array.from({ length: 10 }, () => false));
    const [tilesRight, setTilesRight] = useState(Array.from({ length: 10 }, () => false));
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        const halfwayDelay = ((tilesRight.length - 1) / 2) * 50;

        if (reverse) {
            // Reverse animation: tiles slide out in reverse order
            // Right tiles first (reverse order)
            tilesRight.forEach((_, index) => {
                setTimeout(() => {
                    setTilesRight(prev => {
                        const newTiles = [...prev];
                        newTiles[index] = true;
                        return newTiles;
                    });
                }, index * 50);
            });

            // Left tiles second (reverse order), starting halfway through
            tilesLeft.forEach((_, index) => {
                setTimeout(() => {
                    setTilesLeft(prev => {
                        const newTiles = [...prev];
                        newTiles[index] = true;
                        return newTiles;
                    });
                }, halfwayDelay + index * 50);
            });
        } else {
            // Forward animation: tiles slide in
            // First set of tiles from left
            tilesLeft.forEach((_, index) => {
                setTimeout(() => {
                    setTilesLeft(prev => {
                        const newTiles = [...prev];
                        newTiles[index] = true;
                        return newTiles;
                    });
                }, index * 50);
            });

            // Second set of tiles from right, starting halfway through
            tilesRight.forEach((_, index) => {
                setTimeout(() => {
                    setTilesRight(prev => {
                        const newTiles = [...prev];
                        newTiles[index] = true;
                        return newTiles;
                    });
                }, halfwayDelay + index * 50);
            });

            // Calculate when both animations complete and route to results screen
            const totalAnimationTime = halfwayDelay + ((tilesRight.length - 1) * 50) + 300;

            setTimeout(() => {
                navigate(`${pathname}/result`);
            }, totalAnimationTime);
        }
    }, []);

    return (
        <div className="absolute inset-0 z-50 pointer-events-none">
            {/* Left tiles */}
            <div className="absolute inset-0 grid grid-rows-10">
                {tilesLeft.map((isActive, index) => (
                    <div
                        key={`left-${index}`}
                        className="w-full bg-white opacity-75 transition-transform duration-300 ease-out"
                        style={{
                            transform: reverse
                                ? (isActive ? 'translateX(100%)' : 'translateX(0)')
                                : (isActive ? 'translateX(0)' : 'translateX(-100%)'),
                        }}
                    />
                ))}
            </div>
            {/* Right tiles */}
            <div className="absolute inset-0 grid grid-rows-10">
                {tilesRight.map((isActive, index) => (
                    <div
                        key={`right-${index}`}
                        className="w-full bg-white transition-transform duration-300 ease-out"
                        style={{
                            transform: reverse
                                ? (isActive ? 'translateX(-100%)' : 'translateX(0)')
                                : (isActive ? 'translateX(0)' : 'translateX(100%)'),
                        }}
                    />
                ))}
            </div>
        </div>
    );
}