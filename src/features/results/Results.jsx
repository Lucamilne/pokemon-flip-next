import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGameContext } from '@/contexts/GameContext';
import PokeballSplash from '@/components/PokeballSplash/PokeballSplash.js';
import Snapshot from '@/components/Board/Snapshot.js';
import MatchAwards from './components/MatchAwards.jsx';
import ResultActions from './components/ResultActions.jsx';
import ResultHero from './components/ResultHero.jsx';
import ResultOutcome from './components/ResultOutcome.jsx';
import useMatchResults from './hooks/useMatchResults.js';
import usePlayAgain from './hooks/usePlayAgain.js';
import { getResultType, resultPresentation } from './resultUtils.js';

export default function Results() {
    const { isPlayerVictory, matchCards } = useGameContext();
    const { userCollection, addCards, removeCard } = useAuth();
    const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
    const { isPokeballOpen, playAgain } = usePlayAgain();
    const result = useMatchResults({ isPlayerVictory, matchCards, userCollection, addCards, removeCard });
    const resultType = getResultType(isPlayerVictory);
    const presentation = resultPresentation[resultType];
    const showBoard = useCallback(() => setIsSnapshotOpen(true), []);
    const closeBoard = useCallback(() => setIsSnapshotOpen(false), []);

    return (
        <div className={`h-full overflow-y-auto ${presentation.backgroundClass}`}>
            {result.isReady && <div className="relative flex flex-col gap-4 m-8 justify-center fade-in">
                <ResultHero resultType={resultType} />
                <ResultOutcome resultType={resultType} hasPlayerCards={result.hasPlayerCards} rewardCards={result.rewardCards} penaltyCard={result.penaltyCard} penaltyCardRef={result.penaltyCardRef} victoryMessage={result.victoryMessage} tieMessage={result.tieMessage} />
                <MatchAwards awards={result.matchAwards} resultType={resultType} />
                <ResultActions onShowBoard={showBoard} onPlayAgain={playAgain} />
            </div>}
            {isSnapshotOpen && <Snapshot isOpen={isSnapshotOpen} onClose={closeBoard} />}
            <PokeballSplash pokeballIsOpen={isPokeballOpen} />
        </div>
    );
}
