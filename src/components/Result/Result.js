import { useEffect } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { useRouter, usePathname } from 'next/navigation';
import { clearGameState } from '@/utils/gameStorage';

export default function Result() {
    const { matchCards } = useGameContext();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        clearGameState();
        
        if (matchCards.length === 0) {
            const gameMode = pathname.split('/').filter(Boolean)[0];
            router.push(`/${gameMode}/select`);
            return;
        }
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Match Results</h1>
            <ul className="space-y-2">
                {matchCards.map((card, index) => (
                    <li
                        key={index}
                        className={`capitalize ${card.isPlayerCard ? 'text-blue-500' : 'text-red-500'}`}
                    >
                        {card.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}