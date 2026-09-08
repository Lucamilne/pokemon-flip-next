import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearLocalStorage } from '@/utils/gameStorage';
import { calculateMatchAwards, calculatePenaltyCard, calculateRewardCards, pickRandom, restoreOriginalCardStats, tieMessages, victoryMessages } from '../resultUtils.js';

export default function useMatchResults({ isPlayerVictory, matchCards, userCollection, addCards, removeCard }) {
    const navigate = useNavigate();
    const penaltyCardRef = useRef(null);
    const [matchAwards, setMatchAwards] = useState([]);
    const [rewardCards, setRewardCards] = useState([]);
    const [penaltyCard, setPenaltyCard] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const victoryMessage = useMemo(() => pickRandom(victoryMessages), []);
    const tieMessage = useMemo(() => pickRandom(tieMessages), []);
    const hasPlayerCards = useMemo(() => matchCards?.some(card => card.isPlayerCard) ?? false, [matchCards]);

    useEffect(() => {
        clearLocalStorage();

        if (!matchCards?.length) {
            navigate('/quickplay/select', { replace: true });
            return undefined;
        }

        restoreOriginalCardStats(matchCards);
        setMatchAwards(calculateMatchAwards(matchCards));

        if (isPlayerVictory) {
            const rewards = calculateRewardCards(matchCards, userCollection);
            setRewardCards(rewards);
            addCards(rewards.map(card => card.name)).catch(error => console.error('Failed to add rewards:', error));
        } else if (isPlayerVictory === false) {
            const penalty = calculatePenaltyCard(matchCards, userCollection);
            setPenaltyCard(penalty);
            if (penalty) removeCard(penalty.name).catch(error => console.error('Failed to remove penalty:', error));
        }

        setIsReady(true);
        const penaltyTimer = isPlayerVictory === false ? setTimeout(() => penaltyCardRef.current?.classList.add('rotate-out-center'), 2500) : undefined;
        return () => clearTimeout(penaltyTimer);
        // Result data is intentionally resolved once for the completed match.
    }, []);

    return { isReady, matchAwards, rewardCards, penaltyCard, penaltyCardRef, victoryMessage, tieMessage, hasPlayerCards };
}
