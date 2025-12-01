import { useMemo } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import Link from 'next/link'
import DefeatImage from "@/assets/images/defeat.webp";
import Image from 'next/image'
import { GAME_MODES } from '@/constants/gameModes';

export default function Defeat({ debugMode = false }) {
    const { selectedGameMode } = useGameContext();

    const gameOverTextArray = [
        "DISHONOR ON YOUR ANCESTORS.",
        "PATHETIC MORTAL.",
        "EVEN THE NPC IS LAUGHING.",
        "UNWORTHY OF THE DECK.",
        "A STAIN ON HISTORY.",
        "YOUR LEGACY ENDS HERE.",
        "LOOK AWAY IN SHAME.",
        "SHAME BE UPON YOUR MOTHER.",
        "BANISHED FOR YOUR INCOMPETENCE.",
        "THE CARDS WEEP FOR YOU.",
        "YOUR FAMILY NAME IS TARNISHED.",
        "RETURN TO THE TUTORIAL. (Yet to be written)",
        "A DISGRACE TO THE DOJO."
    ];

    const randomGameOverText = useMemo(() => {
        return gameOverTextArray[Math.floor(Math.random() * gameOverTextArray.length)];
    }, []);

    return (
        <div className='h-full bg-linear-to-b bg-red from-10% via-theme-red to-theme-red-200 flex flex-col'>
            <div className="text-2xl font-bold p-16 flex justify-center">
                <Image loading="eager" draggable={false} width={1315} height={777} alt="Pokemon Flip logo" className='max-w-xl' src={DefeatImage} />
            </div>
            <div className='default-tile mx-8 mb-8 p-10 border-8 h-full'>
                {selectedGameMode === GAME_MODES.QUICK_PLAY.id && (
                    <div className='size-full flex justify-center items-center'>
                        <div className="relative group text-center font-press-start text-lg">
                            <h1 className="header-text text-2xl text-hop uppercase mb-12">
                                {randomGameOverText.split('').map((char, index) => (<span key={index} style={{
                                    animationDelay: `${(index + 1) * 50}ms`
                                }}>{char}</span>))}

                            </h1>
                            <div className={`arrow absolute -left-4 top-1 -translate-y-1/2 transition-opacity ${selectedGameMode === GAME_MODES.QUICK_PLAY.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`} />
                            <Link className={`cursor-pointer`} href={`/${selectedGameMode}/select`}>Play Again?</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}