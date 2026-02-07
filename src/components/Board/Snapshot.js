import Grid from "../Grid/Grid.js";
import Balance from "../Balance/Balance.js"
import PixelX from '@/assets/svg/PixelX';

import { useEffect } from 'react'
import { loadGameStateFromLocalStorage } from '@/utils/gameStorage';
import { useGameContext } from '@/contexts/GameContext';

export default function Snapshot({ isOpen, onClose }) {
    const {
        cells,
        setCells,
        isMobile,
        setPlayerHand,
        setCpuHand,
        score,
        isPlayerVictory
    } = useGameContext();

    //on mount
    useEffect(() => {
        const savedGameState = loadGameStateFromLocalStorage();

        if (savedGameState) {
            setCells(savedGameState.cells);
            setPlayerHand(savedGameState.playerHand);
            setCpuHand(savedGameState.cpuHand);
            return;
        }
    }, []);

    const mobileLayout = (
        <div className="overflow-hidden relative h-full flex flex-col justify-between" >
            {/* Arena */}
            <div className={`grow flex items-center justify-center overflow-hidden`}>
                <Balance score={score} />
                <Grid cells={cells} ref="grid" isPlayerTurn={isPlayerVictory} hasWonCoinToss={null} snapshot />
            </div>
        </div>
    )

    const desktopLayout = (
        <div className="overflow-hidden relative h-full flex justify-between" >
            <>
                {/* Arena */}
                <div className={`grow flex items-center justify-center overflow-hidden`}>
                    <Balance score={score} />
                    <Grid cells={cells} isPlayerTurn={isPlayerVictory} hasWonCoinToss={null} snapshot />
                </div>
            </>
        </div>
    )

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 md:p-0" onClick={onClose}>
            <div className="p-2 default-tile flex flex-col items-between relative w-full max-w-2xl h-full md:h-auto aspect-square border-4 md:border-8 border-black shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <h2 className='absolute top-6 font-press-start w-full font-bold text-lg md:text-2xl text-center'>{isPlayerVictory === null ? 'Stalemate' : isPlayerVictory ? 'Player Victory!' : 'Player Defeat...'}</h2>
                {isMobile ? mobileLayout : desktopLayout}
                <button onClick={onClose} className='cursor-pointer text-neutral-600 hover:text-neutral-900 leading-none flex justify-center items-center absolute top-3 right-3 md:top-5 md:right-5 font-press-start leading-none'>
                    <PixelX className="size-6 md:size-7 stroke-neutral-600 hover:stroke-neutral-900 fill-neutral-600 hover:fill-neutral-900" />
                </button>
            </div>
        </div>
    )
}
