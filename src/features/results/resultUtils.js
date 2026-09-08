import pokemon from '@/data/game-data.json';
import { specialAwardDefinitions } from '@/utils/cardHelpers';
import DefeatImage from '@/assets/images/defeat.webp';
import TieImage from '@/assets/images/tie.webp';
import VictoryImage from '@/assets/images/victory.webp';

export const resultPresentation = {
    victory: { backgroundClass: 'bg-pokedex-lighter-blue', headingClass: 'bg-theme-blue', heading: 'Rewards', image: VictoryImage },
    defeat: { backgroundClass: 'bg-pokedex-light-red', headingClass: 'bg-theme-red', heading: 'Penalty', image: DefeatImage },
    tie: { backgroundClass: 'bg-white', headingClass: 'bg-neutral-400', heading: 'Rewards', image: TieImage }
};

export function getResultType(isPlayerVictory) {
    return isPlayerVictory ? 'victory' : isPlayerVictory === false ? 'defeat' : 'tie';
}

export const tieMessages = [
    'A tie means no cards change hands. Battle again for victory!',
    'No cards were won or lost in this draw.',
    'The match was a draw. No cards were exchanged.',
    "It's a stalemate! Try again to claim some cards.",
    'No cards won in a tie. Battle again!',
    'So close! A tie means everyone keeps their cards.',
    'An even match! No cards were exchanged.'
];

export const victoryMessages = [
    'Your spoils of victory! These cards now belong to you.',
    "Congratulations! You've earned these new cards.",
    'Victory is yours! Claim your prize cards.',
    'Well fought! These cards are now part of your collection.',
    'A well-deserved win! Add these cards to your deck.',
    "You've proven your skill! These cards are yours.",
    'The spoils of battle! New cards are now in your collection.'
];

export function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}

export function restoreOriginalCardStats(cards) {
    cards.forEach(card => {
        const originalData = pokemon.cards[card.name];
        if (!originalData) return;

        card.stats = [...originalData.originalStats];
        card.types = [...originalData.types];
    });
}

export function calculateRewardCards(cards, collection) {
    const eligibleCards = cards.filter(card => card.isPlayerCard && !collection[card.name] && pokemon.cards[card.name]);
    if (eligibleCards.length <= 5) return eligibleCards;

    return [...eligibleCards].sort(() => Math.random() - 0.5).slice(0, 5);
}

export function calculatePenaltyCard(cards, collection) {
    const eligibleCards = cards.filter(card => !card.isPlayerCard && !card.starter && collection[card.name]);
    if (eligibleCards.length === 0) return null;

    return eligibleCards.reduce((highest, card) => card.statWeight > highest.statWeight ? card : highest);
}

export function calculateMatchAwards(cards) {
    const awards = { playOfTheGame: null, mostEvasive: null, typeMaster: null, comebackKid: null, specialAwards: [] };
    const evasiveCandidates = [];
    let bestCaptures = 0;
    let bestSuperEffective = 0;
    let bestComeback = 0;

    cards.forEach(card => {
        if (card.matchStats?.capturesMade > bestCaptures && card.matchStats.capturesMade > 1) {
            bestCaptures = card.matchStats.capturesMade;
            awards.playOfTheGame = card;
        }
        if (card.matchStats?.immuneDefenses > 0 && card.matchStats?.timesFlipped === 0) evasiveCandidates.push(card);
        if (card.matchStats?.superEffectiveCaptures > bestSuperEffective) {
            bestSuperEffective = card.matchStats.superEffectiveCaptures;
            awards.typeMaster = card;
        }
        if (card.matchStats?.timesFlipped > 1 && card.matchStats?.capturesMade > bestComeback) {
            bestComeback = card.matchStats.capturesMade;
            awards.comebackKid = card;
        }

        const specialAward = specialAwardDefinitions.find(definition => definition.name === card.name.toLowerCase());
        if (specialAward) awards.specialAwards.push({ card, award: specialAward.award });
    });

    if (evasiveCandidates.length > 0) {
        const bestImmuneDefences = Math.max(...evasiveCandidates.map(card => card.matchStats.immuneDefenses));
        const topEvasive = evasiveCandidates.filter(card => card.matchStats.immuneDefenses === bestImmuneDefences);
        awards.mostEvasive = pickRandom(topEvasive);
    }
    if (bestSuperEffective === 0) awards.typeMaster = null;
    if (bestComeback === 0) awards.comebackKid = null;

    return [
        awards.playOfTheGame && { label: 'Play of the Game', card: awards.playOfTheGame },
        awards.mostEvasive && { label: 'Most Evasive', card: awards.mostEvasive },
        awards.typeMaster && { label: 'Type Master', card: awards.typeMaster },
        awards.comebackKid && { label: 'Comeback Kid', card: awards.comebackKid },
        ...awards.specialAwards.map(({ card, award }) => ({ label: award, card }))
    ].filter(Boolean).sort(() => Math.random() - 0.5).slice(0, 3);
}
