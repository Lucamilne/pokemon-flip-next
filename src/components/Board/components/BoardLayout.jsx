import { DndContext } from '@dnd-kit/core';
import HowToPlay from '@/components/HowToPlay/HowToPlay';
import Matchups from '@/components/Matchups/Matchups';
import PokeballSplash from '@/components/PokeballSplash/PokeballSplash.js';
import ResultTransition from '@/components/ResultTransition/ResultTransition.js';
import GameArena from './GameArena.jsx';
import PlayerHand from './PlayerHand.jsx';

export default function BoardLayout({
    cells, cpuHand, playerHand, score, isMobile, isPlayerTurn, hasWonCoinToss, pokeballIsOpen,
    isGameComplete, isHowToPlayOpen, isMatchupsOpen, onDragEnd, onOpenHowToPlay, onCloseHowToPlay,
    onOpenMatchups, onCloseMatchups
}) {
    const arena = <GameArena {...{ cells, score, isPlayerTurn, hasWonCoinToss, isMobile, onOpenHowToPlay, onOpenMatchups }} />;
    const playerHandView = (className) => <PlayerHand cards={playerHand} isPlayerHand isDraggable={isPlayerTurn} isRevealed={pokeballIsOpen} className={className} />;
    const cpuHandView = (className) => <PlayerHand cards={cpuHand} isPlayerHand={false} isDraggable={isMobile && !isPlayerTurn} isRevealed={pokeballIsOpen} className={className} />;

    const overlays = <>
        {isHowToPlayOpen && <HowToPlay isOpen onClose={onCloseHowToPlay} />}
        {isMatchupsOpen && <Matchups isOpen onClose={onCloseMatchups} />}
        <PokeballSplash pokeballIsOpen={pokeballIsOpen} />
        {isGameComplete && <ResultTransition />}
    </>;

    const content = isMobile ? (
        <div className="overflow-hidden relative h-full flex flex-col justify-between">
            {cpuHandView('relative grid grid-cols-[repeat(5,72px)] place-content-center gap-1 hand-top-container p-2 pb-6 pt-4')}
            {arena}
            {playerHandView('grid grid-cols-[repeat(5,72px)] place-content-center gap-1 hand-bottom-container p-2 pt-6 pb-4')}
            {overlays}
        </div>
    ) : (
        <div className={`${isGameComplete ? 'overflow-hidden' : ''} relative h-full flex justify-between`}>
            {playerHandView('relative grid grid-rows-[repeat(5,124px)] place-content-center gap-2 hand-left-container pl-4 pr-8 p-2 h-full')}
            {arena}
            {cpuHandView('relative grid grid-rows-[repeat(5,124px)] place-content-center gap-2 hand-right-container pl-8 pr-4 p-2 h-full')}
            {overlays}
        </div>
    );

    return <DndContext onDragEnd={onDragEnd}>{content}</DndContext>;
}
