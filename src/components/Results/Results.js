import { useGameContext } from '@/contexts/GameContext';
import Link from 'next/link'
import Image from 'next/image'
import VictoryImage from "@/assets/images/victory.webp";
import DefeatImage from "@/assets/images/defeat.webp";
import TieImage from "@/assets/images/tie.webp";
import { GAME_MODES } from '@/constants/gameModes';
import Card from "@/components/Card/Card.js"
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearLocalStorage } from '@/utils/gameStorage';
import Loader from "@/components/Loader/Loader.js";

export default function Results() {
    const pathname = usePathname();
    const { selectedGameMode } = useGameContext();
    const isQuickplay = pathname?.includes('quickplay') ?? false;
    const router = useRouter();
    const { matchCards } = useGameContext();
    const [matchAwards, setMatchAwards] = useState(null);
    const [isPlayerVictory, setIsPlayerVictory] = useState(null); // null = tie, true = victory, false = defeat
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        clearLocalStorage();

        if (!matchCards || matchCards.length === 0) {
            const gameMode = pathname.split('/').filter(Boolean)[0];
            router.replace(`/${gameMode}/select`);
            return;
        }

        // Calculate victory by counting cards with isPlayerCard property
        const playerCardCount = matchCards.filter(card => card.isPlayerCard === true).length;
        const cpuCardCount = matchCards.filter(card => card.isPlayerCard === false).length;

        if (playerCardCount > cpuCardCount) {
            setIsPlayerVictory(true);
        } else if (cpuCardCount > playerCardCount) {
            setIsPlayerVictory(false);
        }

        // Calculate match awards from card stats
        const awards = {
            playOfTheGame: null,
            mostEvasive: null,
            typeMaster: null,
            comebackKid: null,
            specialAwards: [] // For personality-based awards
        };

        // Play of the Game: Card with most captures (must be > 1)
        let bestCaptures = 0;
        matchCards.forEach(card => {
            if (card.matchStats?.capturesMade > bestCaptures && card.matchStats.capturesMade > 1) {
                bestCaptures = card.matchStats.capturesMade;
                awards.playOfTheGame = card;
            }
        });

        // Most Evasive: Card with most immuneDefenses (must have timesFlipped === 0)
        const evasiveCandidates = matchCards.filter(card =>
            card.matchStats?.immuneDefenses > 0 &&
            card.matchStats?.timesFlipped === 0
        );
        if (evasiveCandidates.length > 0) {
            // Find the highest immuneDefenses value
            let bestImmune = 0;
            evasiveCandidates.forEach(card => {
                if (card.matchStats.immuneDefenses > bestImmune) {
                    bestImmune = card.matchStats.immuneDefenses;
                }
            });
            // Get all cards with the highest value (in case of tie)
            const topEvasive = evasiveCandidates.filter(card =>
                card.matchStats.immuneDefenses === bestImmune
            );
            // Pick one at random if there's a tie
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
        // Only award if they actually got super effective captures
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

        // Only award if they actually made a comeback
        if (bestComeback === 0) {
            awards.comebackKid = null;
        }

        // Special personality-based awards
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
            { name: 'dragonite', award: 'Goofiest Dragon' },
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

        matchCards.forEach(card => {
            const specialAward = specialAwardDefinitions.find(def => def.name === card.name.toLowerCase());
            if (specialAward) {
                awards.specialAwards.push({
                    card: card,
                    award: specialAward.award,
                });
            }
        });

        // Collect all valid awards into a flat array
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

        // Add each special award as a separate possible award
        awards.specialAwards.forEach(special => {
            allPossibleAwards.push({
                type: 'special',
                label: special.award,
                card: special.card
            });
        });

        // Randomly select 3 awards
        const shuffled = allPossibleAwards.sort(() => Math.random() - 0.5);
        const selectedAwards = shuffled.slice(0, 3);

        setMatchAwards(selectedAwards);
        setMounted(true);
    }, []);

    if (!matchCards || matchCards.length === 0 || !mounted) {
        return <Loader />;
    }


    return (
        <div className={`fade-in h-full bg-linear-to-b from-transparent from-10% ${isPlayerVictory ? 'via-ground-200 to-ground-400' : (isPlayerVictory === false ? "via-theme-red to-theme-red-200" : "via-normal to-normal-400")} flex flex-col`}>
            <div className="font-bold px-16 py-6 flex justify-center">
                <Image loading="eager" draggable={false} width={1315} height={777} alt="Pokemon Flip logo" className="max-w-lg" src={isPlayerVictory ? VictoryImage : (isPlayerVictory === false ? DefeatImage : TieImage)} />
            </div>
            <div className='p-10 h-full'>
                {mounted && (selectedGameMode === GAME_MODES.QUICK_PLAY.id || isQuickplay) && (
                    <div className='size-full'>
                        {matchAwards && matchAwards.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-press-start text-center mb-6">
                                    Match Awards
                                </h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {matchAwards.map((award, index) => (
                                        <div key={index} className="default-tile p-4 py-8 border-4 border-black">
                                            {/* Award Title */}
                                            <div className="text-center mb-3">
                                                <span className="font-press-start text-sm">
                                                    {award.label}
                                                </span>
                                            </div>

                                            {/* Award Card */}
                                            <div className="flex justify-center">
                                                <div className="w-[124px]">
                                                    <Card pokemonCard={award.card} isDraggable={false} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="relative group text-center font-press-start text-lg">
                            <div className={`arrow absolute -left-4 top-1 -translate-y-1/2 transition-opacity ${selectedGameMode === GAME_MODES.QUICK_PLAY.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`} />
                            <Link className={`cursor-pointer`} href={`${isQuickplay ? "/quickplay" : "/career"}/select`}>Play Again?</Link>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}
