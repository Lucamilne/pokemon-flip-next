import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function PageTransition() {
    const [tilesLeft, setTilesLeft] = useState(Array.from({ length: 12 }, () => false));
    const [tilesRight, setTilesRight] = useState(Array.from({ length: 12 }, () => false));
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
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
        const halfwayDelay = ((tilesRight.length - 1) / 2) * 50;
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
            router.push(`${pathname}/result`);
        }, totalAnimationTime);
    }, []);

    return (
        <div className="absolute inset-0 z-50 pointer-events-none">
            {/* Left tiles */}
            {tilesLeft.map((isActive, index) => (
                <div
                    key={`left-${index}`}
                    className="absolute w-full bg-white opacity-75 transition-transform duration-300 ease-out"
                    style={{
                        height: `${100 / 12}%`,
                        top: `${(100 / 12) * index}%`,
                        transform: isActive ? 'translateX(0)' : 'translateX(-100%)',
                    }}
                />
            ))}
            {/* Right tiles */}
            {tilesRight.map((isActive, index) => (
                <div
                    key={`right-${index}`}
                    className="absolute w-full bg-white transition-transform duration-300 ease-out"
                    style={{
                        height: `${100 / 12}%`,
                        top: `${(100 / 12) * index}%`,
                        transform: isActive ? 'translateX(0)' : 'translateX(100%)',
                    }}
                />
            ))}
        </div>
    );
}