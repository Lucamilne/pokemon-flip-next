import { useEffect, useState } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { useRouter, usePathname } from 'next/navigation';
import { clearGameState } from '@/utils/gameStorage';

export default function Result() {
    const { matchCards } = useGameContext();
    const router = useRouter();
    const pathname = usePathname();
    const [isPlayerVictory, setIsPlayerVictory] = useState(null); // null = tie, true = player wins, false = cpu wins
    const [resultText, setResultText] = useState('');

    useEffect(() => {
        clearGameState();

        if (matchCards.length === 0) {
            const gameMode = pathname.split('/').filter(Boolean)[0];
            router.push(`/${gameMode}/select`);
            return;
        }

        // Calculate victory by counting cards with isPlayerCard property
        const playerCardCount = matchCards.filter(card => card.isPlayerCard === true).length;
        const cpuCardCount = matchCards.filter(card => card.isPlayerCard === false).length;

        if (playerCardCount > cpuCardCount) {
            setIsPlayerVictory(true);
            setResultText('Victory!');
        } else if (cpuCardCount > playerCardCount) {
            setIsPlayerVictory(false);
            setResultText('Defeat!');
        } else {
            setIsPlayerVictory(null);
            setResultText('Tie.');
        }
    }, []);

    return (
        <div>
            <div className="text-2xl font-bold mb-4 h-64 bg-theme-blue">
                <h1 className="header-text text-2xl text-hop">
                    {resultText.split('').map((char, index) => (<span key={index} style={{
                        animationDelay: `${(index + 1) * 50}ms`
                    }}>{char}</span>))}
                </h1>
            </div>
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