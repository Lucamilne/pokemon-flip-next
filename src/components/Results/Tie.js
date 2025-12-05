import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useGameContext } from '@/contexts/GameContext';
import Link from 'next/link'
import TieImage from "@/assets/images/tie.webp";
import Image from 'next/image'
import { GAME_MODES } from '@/constants/gameModes';

export default function Tie({ debugMode = false }) {
    const pathname = usePathname();
    const { selectedGameMode } = useGameContext();

    const isQuickplay = pathname?.includes('quickplay') ?? false;

    const matchDrawText = [
        "YOU TIED, MY GUY!",
        "DO TIES HAPPEN TOO OFTEN?",
    ];

    const randomMatchDrawText = useMemo(() => {
        return matchDrawText[Math.floor(Math.random() * matchDrawText.length)];
    }, []);

    return (
        <div className='fade-in h-full bg-linear-to-b from-transparent from-10% via-normal to-normal-400 flex flex-col'>
            <div className="text-2xl font-bold p-16 flex justify-center">
                <Image loading="eager" draggable={false} width={1315} height={777} alt="Pokemon Flip logo" className='max-w-xl' src={TieImage} />
            </div>
            <div className='default-tile mx-8 mb-8 p-10 border-8 h-full'>
                {selectedGameMode === GAME_MODES.QUICK_PLAY.id || isQuickplay && (
                    <div className='size-full flex justify-center items-center'>
                        <div className="relative group text-center font-press-start text-lg">
                            <h1 className="header-text text-2xl text-hop uppercase mb-12">
                                {randomMatchDrawText.split('').map((char, index) => (<span key={index} style={{
                                    animationDelay: `${(index + 1) * 50}ms`
                                }}>{char}</span>))}

                            </h1>
                            <div className={`arrow absolute -left-4 top-1 -translate-y-1/2 transition-opacity ${selectedGameMode === GAME_MODES.QUICK_PLAY.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`} />
                            <Link className={`cursor-pointer`} href={`${isQuickplay ? "/quickplay" : "/career"}/select`}>Play Again?</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}