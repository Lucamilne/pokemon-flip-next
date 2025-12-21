import { useGameContext } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { clearLocalStorage } from '@/utils/gameStorage';

import VictoryImage from "@/assets/images/victory.webp";
import DefeatImage from "@/assets/images/defeat.webp";
import TieImage from "@/assets/images/tie.webp";
import Card from "@/components/Card/Card.js"
import PokeballSplash from '../PokeballSplash/PokeballSplash';
import styles from './retro.module.css';
import pokemon from '@/data/game-data.json';

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();

    const { isPlayerVictory, matchCards } = useGameContext();
    const { userCollection, addCards, removeCard } = useAuth();

    const [matchAwards, setMatchAwards] = useState(null);
    const [rewardCards, setRewardCards] = useState([]);
    const [penaltyCard, setPenaltyCard] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [isPokeballOpen, setIsPokeballOpen] = useState(true);

    const penaltyCardRef = useRef(null);

    const tieText = [
        "A tie means no cards change hands. Battle again for victory!",
        "No cards were won or lost in this draw.",
        "The match was a draw. No cards were exchanged.",
        "It's a stalemate! Try again to claim some cards.",
        "No cards won in a tie. Battle again!",
        "So close! A tie means everyone keeps their cards.",
        "An even match! No spoils for either side."
    ];

    const handlePlayAgain = () => {
        setIsPokeballOpen(false);
        setTimeout(() => {
            navigate(`/quickplay/select`);
        }, 600);
    }

    const specialAwardDefinitions = [
        { name: 'jigglypuff', award: 'Worst Singer' },
        { name: 'magikarp', award: 'Most Useless' },
        { name: 'psyduck', award: 'Most Confused' },
        { name: 'snorlax', award: 'Sleepiest' },
        { name: 'mewtwo', award: 'Most Intimidating' },
        { name: 'ditto', award: 'Best Impression' },
        { name: 'slowpoke', award: 'Slowest to React' },
        { name: 'pikachu', award: 'Fan Favorite' },
        { name: 'charizard', award: 'Hottest' },
        { name: 'squirtle', award: 'Coolest' },
        { name: 'bulbasaur', award: 'Best Starter' },
        { name: 'eevee', award: 'Most Versatile' },
        { name: 'gengar', award: 'Spookiest' },
        { name: 'dragonite', award: 'Goofiest' },
        { name: 'alakazam', award: 'Biggest Brain' },
        { name: 'machamp', award: 'Most Swole' },
        { name: 'mew', award: 'Most Mysterious' },
        { name: 'gyarados', award: 'Angriest' },
        { name: 'lapras', award: 'Best Transport' },
        { name: 'articuno', award: 'Chillest' },
        { name: 'zapdos', award: 'Most Tangy' },
        { name: 'moltres', award: 'Most Meteoric' },
        { name: 'cubone', award: 'Loneliest' },
        { name: 'electrode', award: 'Most Explosive' },
        { name: 'chansey', award: 'Luckiest' },
        { name: 'kangaskhan', award: 'Best Parent' },
        { name: 'onix', award: 'Longest' },
        { name: 'hitmonlee', award: 'Best Kicks' },
        { name: 'hitmonchan', award: 'Best Punches' },
        { name: 'lickitung', award: 'Longest Tongue' },
        { name: 'tangela', award: 'Worst Hair' },
        { name: 'seaking', award: 'Most Fabulous' },
        { name: 'starmie', award: 'Most Cosmic' },
        { name: 'scyther', award: 'Sharpest Blades' },
        { name: 'pinsir', award: 'Most Pinchy' },
        { name: 'tauros', award: 'Most Aggressive' },
        { name: 'exeggutor', award: 'Tallest' },
        { name: 'marowak', award: 'Bravest' },
        { name: 'porygon', award: 'Most Digital' },
        { name: 'aerodactyl', award: 'Most Prehistoric' },
        { name: 'farfetchd', award: 'Most Prepared' },
        { name: 'dodrio', award: 'Most Heads' },
        { name: 'dewgong', award: 'Most Graceful' },
        { name: 'muk', award: 'Most Toxic' },
        { name: 'cloyster', award: 'Most Defensive' },
        { name: 'hypno', award: 'Sleepiest Hypnotist' },
        { name: 'kingler', award: 'Biggest Claw' },
        { name: 'voltorb', award: 'Most Explosive' },
        { name: 'mr-mime', award: 'Best Performer' },
        { name: 'jynx', award: 'Best Dancer' },
        { name: 'electabuzz', award: 'Most Energetic' },
        { name: 'magmar', award: 'Hottest Temper' },
        { name: 'kabutops', award: 'Best Fossil' },
        { name: 'omastar', award: 'Most Spiraled' },
        { name: 'wigglytuff', award: 'Fluffiest' },
        { name: 'clefable', award: 'Most Mystical' },
        { name: 'ninetales', award: 'Most Elegant' },
        { name: 'arcanine', award: 'Most Loyal' },
        { name: 'poliwrath', award: 'Strongest Swimmer' },
        { name: 'victreebel', award: 'Hungriest' },
        { name: 'tentacruel', award: 'Most Tentacles' },
        { name: 'geodude', award: 'Skipped Leg Day' },
        { name: 'golem', award: 'Most Rock Solid' },
        { name: 'ponyta', award: 'Fastest Runner' },
        { name: 'rapidash', award: 'Most Majestic' },
        { name: 'dugtrio', award: 'Most Underground' },
        { name: 'persian', award: 'Most Pampered' },
        { name: 'golduck', award: 'Most Psychic' },
        { name: 'primeape', award: 'Most Furious' },
        { name: 'arbok', award: 'Most Venomous' },
        { name: 'raichu', award: 'Most Electrifying' },
        { name: 'sandslash', award: 'Spikiest' },
        { name: 'nidoking', award: 'Most Royal' },
        { name: 'nidoqueen', award: 'Most Regal' },
        { name: 'vileplume', award: 'Smelliest' },
        { name: 'parasect', award: 'Most Possessed' },
        { name: 'venomoth', award: 'Most Hypnotic' },
        { name: 'blastoise', award: 'Best Cannons' },
        { name: 'venusaur', award: 'Biggest Bloom' },
        { name: 'pidgeot', award: 'Most Majestic Bird' },
        { name: 'fearow', award: 'Most Intimidating' },
        { name: 'weezing', award: 'Most Polluted' },
        { name: 'rhydon', award: 'Most Armored' }
    ];

    const calculateRewardCards = (cards, collection) => {
        const eligibleCards = cards.filter(card => card.isPlayerCard && !collection[card.name] && pokemon.cards[card.name]);

        if (eligibleCards.length <= 5) {
            return eligibleCards;
        }

        const shuffled = [...eligibleCards].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 5);
    };

    const calculatePenaltyCard = (cards) => {
        // Filter out starter cards, only include player cards that are in collection
        const eligibleCards = cards.filter(card =>
            !card.isPlayerCard &&
            !card.starter &&
            userCollection[card.name]
        );

        if (eligibleCards.length === 0) {
            return null;
        }

        return eligibleCards.reduce((highest, card) => {
            return card.statWeight > highest.statWeight ? card : highest;
        });
    };

    useEffect(() => {
        clearLocalStorage();

        if (!matchCards || matchCards.length === 0) {
            navigate(`/quickplay/select`, { replace: true });
            return;
        }

        const awards = {
            playOfTheGame: null,
            mostEvasive: null,
            typeMaster: null,
            comebackKid: null,
            specialAwards: []
        };

        // Play of the Game: Card with most captures (must be > 1)
        let bestCaptures = 0;
        matchCards.forEach(card => {
            if (card.matchStats?.capturesMade > bestCaptures && card.matchStats.capturesMade > 1) {
                bestCaptures = card.matchStats.capturesMade;
                awards.playOfTheGame = card;
            }
        });

        // Most Evasive: Card with most immuneDefenses (todo: bugged; must have timesFlipped === 0)
        const evasiveCandidates = matchCards.filter(card =>
            card.matchStats?.immuneDefenses > 0 &&
            card.matchStats?.timesFlipped === 0
        );
        if (evasiveCandidates.length > 0) {

            let bestImmune = 0;
            evasiveCandidates.forEach(card => {
                if (card.matchStats.immuneDefenses > bestImmune) {
                    bestImmune = card.matchStats.immuneDefenses;
                }
            });

            const topEvasive = evasiveCandidates.filter(card =>
                card.matchStats.immuneDefenses === bestImmune
            );

            awards.mostEvasive = topEvasive[Math.floor(Math.random() * topEvasive.length)];
        }

        // Type Master: Card with most superEffectiveCaptures (must be > 0)
        let bestSuperEffective = 0;
        matchCards.forEach(card => {
            if (card.matchStats?.superEffectiveCaptures > bestSuperEffective) {
                bestSuperEffective = card.matchStats.superEffectiveCaptures;
                awards.typeMaster = card;
            }
        });

        if (bestSuperEffective === 0) {
            awards.typeMaster = null;
        }

        // Comeback Kid: Card with timesFlipped > 0 AND capturesMade > 0
        let bestComeback = 0;
        matchCards.forEach(card => {
            if (card.matchStats?.timesFlipped > 1 && card.matchStats?.capturesMade > bestComeback) {
                bestComeback = card.matchStats.capturesMade;
                awards.comebackKid = card;
            }
        });

        if (bestComeback === 0) {
            awards.comebackKid = null;
        }

        matchCards.forEach(card => {
            const specialAward = specialAwardDefinitions.find(def => def.name === card.name.toLowerCase());
            if (specialAward) {
                awards.specialAwards.push({
                    card: card,
                    award: specialAward.award,
                });
            }
        });

        const allPossibleAwards = [];

        if (awards.playOfTheGame) {
            allPossibleAwards.push({
                type: 'playOfTheGame',
                label: 'Play of the Game',
                card: awards.playOfTheGame
            });
        }

        if (awards.mostEvasive) {
            allPossibleAwards.push({
                type: 'mostEvasive',
                label: 'Most Evasive',
                card: awards.mostEvasive
            });
        }

        if (awards.typeMaster) {
            allPossibleAwards.push({
                type: 'typeMaster',
                label: 'Type Master',
                card: awards.typeMaster
            });
        }

        if (awards.comebackKid) {
            allPossibleAwards.push({
                type: 'comebackKid',
                label: 'Comeback Kid',
                card: awards.comebackKid
            });
        }

        awards.specialAwards.forEach(special => {
            allPossibleAwards.push({
                type: 'special',
                label: special.award,
                card: special.card
            });
        });

        const shuffled = allPossibleAwards.sort(() => Math.random() - 0.5);
        const selectedAwards = shuffled.slice(0, 3);


        setMatchAwards(selectedAwards);

        if (isPlayerVictory) {
            const rewards = calculateRewardCards(matchCards, userCollection);
            setRewardCards(rewards);
            addCards(rewards.map(pokemonCard => pokemonCard.name))
                .catch(error => console.error('Failed to add rewards:', error));
        } else if (isPlayerVictory === false) {
            const penalty = calculatePenaltyCard(matchCards);
            setPenaltyCard(penalty);

            if (penalty) {
                removeCard(penalty.name)
                    .catch(error => console.error('Failed to remove penalty:', error));
            }

            setTimeout(() => {
                if (penaltyCardRef.current) {
                    penaltyCardRef.current.classList.add('rotate-out-center');
                }
            }, 2500);
        }
        setMounted(true);
    }, []);

    return (
        <div className={`h-full overflow-y-auto ${isPlayerVictory ? 'bg-pokedex-lighter-blue' : isPlayerVictory === false ? 'bg-pokedex-light-red' : 'bg-white'}`}>
            {mounted && (
                <div className="relative flex flex-col gap-4 m-8 justify-center fade-in">
                    <img loading="eager" draggable={false} width={1315} height={777} alt="Pokemon Flip logo" className="w-1/2 mx-auto drop-shadow-md/30" src={isPlayerVictory ? VictoryImage : (isPlayerVictory === false ? DefeatImage : TieImage)} />
                    <div className='bg-white border-4 border-block shadow-lg/30'>
                        <h2 className={`${isPlayerVictory ? 'bg-theme-blue' : isPlayerVictory === false ? 'bg-theme-red' : 'bg-neutral-400'} header-text text-white py-4 text-2xl font-press-start text-center`}>
                            {isPlayerVictory === false ? 'Penalty' : 'Rewards'}
                        </h2>
                        {isPlayerVictory && matchCards?.some(card => card.isPlayerCard) ? (
                            <div className='p-8'>
                                {rewardCards.length > 0 ? (
                                    <>
                                        <div className='font-press-start text-center'>
                                            <p>Your spoils of victory! These cards now belong to you.</p>
                                        </div>
                                        <div className="grid grid-cols-[repeat(auto-fit,124px)] place-content-center gap-4 mt-8">
                                            {rewardCards.map((pokemonCard, index) => {
                                                return (
                                                    <div className="relative aspect-square drop-shadow-md/15" key={index}>
                                                        {pokemonCard && (
                                                            <Card pokemonCard={pokemonCard} isPlayerCard={true} index={index} isDraggable={true} startsFlipped={false} />
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-18 text-center font-press-start">
                                        <p>You already own all the cards you captured!</p>
                                    </div>
                                )}
                            </div>
                        ) : isPlayerVictory === false ? (
                            <div className="p-8">
                                {penaltyCard ? (
                                    <>
                                        <div className='font-press-start text-center'>
                                            <p>Your opponent claimed the <span className='capitalize'>{penaltyCard.name}</span> card from your collection!</p>
                                        </div>
                                        <div className="grid grid-cols-[repeat(auto-fit,124px)] place-content-center gap-4 mt-8">
                                            <div className="relative aspect-square">
                                                <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-black/15" />

                                                {penaltyCard && (
                                                    <div ref={penaltyCardRef} className="drop-shadow-md/15">
                                                        <Card pokemonCard={penaltyCard} index={0} isDraggable={true} startsFlipped={true} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-18 text-center font-press-start">
                                        <p>Your opponent couldn't find a card worth taking...</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-8">
                                <div className="py-18 text-center font-press-start">
                                    <p>{tieText[Math.floor(Math.random() * tieText.length)]}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='bg-white border-4 border-block shadow-lg/30'>
                        {
                            matchAwards && matchAwards.length > 0 && (
                                <div>
                                    <h2 className={`${isPlayerVictory ? 'bg-theme-blue' : isPlayerVictory === false ? 'bg-theme-red' : 'bg-neutral-400'} header-text text-white py-4 text-2xl font-press-start text-center`}>
                                        Match Awards
                                    </h2>
                                    <div className="grid grid-cols-3 gap-4 p-8">
                                        {matchAwards.map((award, index) => (
                                            <div key={index} className="default-tile py-8 border-4 border-black">
                                                {/* Award Title */}
                                                <div className="text-center mb-4">
                                                    <span className="font-press-start text-sm">
                                                        {award.label}
                                                    </span>
                                                </div>

                                                {/* Award Card */}
                                                <div className="flex justify-center">
                                                    <div className="w-[124px] drop-shadow-md/15">
                                                        <Card pokemonCard={award.card} isDraggable={false} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    </div >
                    <div className="relative group text-center font-press-start text-lg">
                        <button className={`${styles['nes-btn']} ${styles['is-success']} cursor-pointer`} onClick={handlePlayAgain}>Play Again</button>
                    </div>
                </div >
            )
            }
            <PokeballSplash pokeballIsOpen={isPokeballOpen} />
        </div >
    )
}
