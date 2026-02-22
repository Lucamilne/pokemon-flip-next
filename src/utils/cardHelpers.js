import pokemon from "@/data/game-data.json";

export const createCard = (pokemonName, isPlayerCard = false, debugMode = false) => {
    let libraryOfCards = debugMode ? "legends" : "cards";
    let cardData = { ...pokemon[libraryOfCards][pokemonName] };

    return {
        ...cardData,
        name: pokemonName,
        isPlayerCard: isPlayerCard,
        // Match stats (reset each game)
        matchStats: {
            timesFlipped: 0,
            capturesMade: 0,
            superEffectiveCaptures: 0,
            immuneDefenses: 0
        }
    };
};

const allPokemonNamesComplete = Object.keys(pokemon.cards);

let allPokemonNames = allPokemonNamesComplete.filter(
    name => !pokemon.cards[name].generation || pokemon.cards[name].generation === 1
);

export { allPokemonNames };

let _gen2Unlocked = false;

export function setEnabledGenerations({ gen2Unlocked }) {
    _gen2Unlocked = gen2Unlocked;
    allPokemonNames = gen2Unlocked
        ? allPokemonNamesComplete
        : allPokemonNamesComplete.filter(
            name => !pokemon.cards[name].generation || pokemon.cards[name].generation === 1
        );
}

export function getStarterPokemonNames() {
    return allPokemonNamesComplete.filter(name => {
        const card = pokemon.cards[name];
        if (!card.starter) return false;
        if (_gen2Unlocked) return card.generation === 2;
        return !card.generation || card.generation === 1;
    });
}

export const fetchCardById = (id, isPlayerCard = true) => {
    const pokemonName = allPokemonNames.find(
        (name) => pokemon.cards[name].id === id
    );

    if (!pokemonName) {
        return null;
    }

    return createCard(pokemonName, isPlayerCard);
};

export const allocateRandomCards = (isPlayerCard) => {
    const shuffledArray = allPokemonNames.sort(() => Math.random() - 0.5);

    return shuffledArray.slice(0, 5).map((el) => createCard(el, isPlayerCard));
};

export const allocateCpuCardsFromPool = (cardPool) => {
    const shuffledArray = cardPool.sort(() => Math.random() - 0.5);

    return shuffledArray.slice(0, 5);
}

export const fetchStarterCards = (isPlayerCard = true) => {
    return getStarterPokemonNames().map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchAllCards = (isPlayerCard = true) => {
    return allPokemonNames.map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchEarlyGameCards = (isPlayerCard = true) => {
    return allPokemonNames.filter((pokemonName) => pokemon.cards[pokemonName].statWeight < 395).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchMidGameCards = (isPlayerCard = true) => {
    return allPokemonNames.filter((pokemonName) => pokemon.cards[pokemonName].statWeight >= 395 && pokemon.cards[pokemonName].statWeight < 500).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchStrongCards = (isPlayerCard = true) => {
    return allPokemonNames.filter((pokemonName) => pokemon.cards[pokemonName].statWeight >= 500).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchSingleTypeCards = (type, isPlayerCard = true) => {
    return allPokemonNames.filter((pokemonName) => pokemon.cards[pokemonName].types.includes(type)).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchMonoTypeCards = (isPlayerCard = true) => {
    return allPokemonNames.filter((pokemonName) => pokemon.cards[pokemonName].types.length === 1).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchNidoFamilyCards = (isPlayerCard = true) => {
    return allPokemonNames.filter((pokemonName) => pokemonName.startsWith('nido')).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchSecretCards = (isPlayerCard = true) => {
    return Object.keys(pokemon.legends).map((pokemonName) => createCard(pokemonName, isPlayerCard, true));
}

// Helper function to get random items from an array
const getRandomItems = (arr, count) => {
    const result = [];
    const copy = [...arr];
    for (let i = 0; i < count && copy.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(randomIndex, 1)[0]);
    }
    return result;
};

// Helper function to categorize cards by tier
const categoriseCardsByTier = () => {
    const weakCards = [];
    const midCards = [];
    const strongCards = [];

    allPokemonNames.forEach((pokemonName) => {
        const statWeight = pokemon.cards[pokemonName].statWeight;
        if (statWeight < 395) weakCards.push(pokemonName);
        else if (statWeight < 500) midCards.push(pokemonName);
        else strongCards.push(pokemonName);
    });

    return { weakCards, midCards, strongCards };
};

export const fetchRandomCardsFromUserCollection = (userCollection = {}) => {
    return getRandomItems( Object.keys(userCollection), 5)
        .map((pokemonName) => createCard(pokemonName, true));
}

export const fetchBalancedTierCards = (isPlayerCard = true) => {
    const { weakCards, midCards, strongCards } = categoriseCardsByTier();

    const selectedCards = [
        ...getRandomItems(weakCards, 1),
        ...getRandomItems(midCards, 3),
        ...getRandomItems(strongCards, 1)
    ];

    return selectedCards
        .sort(() => Math.random() - 0.5)
        .map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

// Select CPU cards based on player's average statWeight
export const fetchCpuCardsByPlayerStrength = (playerHand, userCollection = {}) => {
    // Calculate average statWeight of player's hand
    const totalStatWeight = playerHand.reduce((sum, card) => sum + card.statWeight, 0);
    const avgStatWeight = totalStatWeight / playerHand.length;

    // Define search range with bounds [195, 680]
    const minStatWeight = Math.max(195, avgStatWeight - 150);
    const maxStatWeight = Math.min(680, avgStatWeight + 50);

    // Get all pokemon within the bounded range
    const eligibleCards = allPokemonNames.filter(pokemonName => {
        const statWeight = pokemon.cards[pokemonName].statWeight;
        return statWeight >= minStatWeight && statWeight <= maxStatWeight;
    });

    // If not enough cards OR high-level player, expand to -150/+200
    let cardsToSelect = eligibleCards;

    if (cardsToSelect.length < 5 || avgStatWeight >= 500) {
        // Expanded range: reuse minStatWeight, only recalculate max
        const expandedMaxStatWeight = Math.min(680, avgStatWeight + 200);

        cardsToSelect = allPokemonNames.filter(pokemonName => {
            const statWeight = pokemon.cards[pokemonName].statWeight;
            return statWeight >= minStatWeight && statWeight <= expandedMaxStatWeight;
        });
    }

    // Fallback to all cards if still not enough
    if (cardsToSelect.length < 5) {
        cardsToSelect = allPokemonNames;
    }

    // Check if player has completed collection
    const ownedCount = Object.keys(userCollection).length;
    const numOfPokemon = allPokemonNames.length;

    if (ownedCount >= numOfPokemon) {
        // Player owns everything, no guarantee possible
        return getRandomItems(cardsToSelect, 5)
            .map((pokemonName) => createCard(pokemonName, false));
    }

    // Separate cards by ownership status in a single pass
    const unownedInRange = [];
    const ownedInRange = [];
    for (const pokemonName of cardsToSelect) {
        if (userCollection[pokemonName]) {
            ownedInRange.push(pokemonName);
        } else {
            unownedInRange.push(pokemonName);
        }
    }

    // Guarantee at least 1 unowned card
    let guaranteedUnownedCard;
    if (unownedInRange.length > 0) {
        // Best case: unowned cards exist in the difficulty-appropriate range
        guaranteedUnownedCard = getRandomItems(unownedInRange, 1)[0];
    } else {
        // Edge case: no unowned in range, pick from ALL unowned cards
        const allUnowned = allPokemonNames.filter(pokemonName => !userCollection[pokemonName]);
        guaranteedUnownedCard = getRandomItems(allUnowned, 1)[0];
    }

    // Fill remaining 4 slots
    // Remove guaranteed card from available pools to prevent duplicates
    const remainingUnownedInRange = unownedInRange.filter(
        name => name !== guaranteedUnownedCard
    );

    // Build pool for remaining cards
    let poolForRemaining;
    if (remainingUnownedInRange.length >= 4) {
        // Ideal: enough unowned to fill all 4 remaining slots
        poolForRemaining = remainingUnownedInRange;
    } else if (unownedInRange.length > 0) {
        // Mix scenario: use remaining unowned + owned cards from range
        poolForRemaining = [...remainingUnownedInRange, ...ownedInRange];
    } else {
        // Guaranteed card came from outside range; use all eligible cards
        poolForRemaining = cardsToSelect;
    }

    const remaining4Cards = getRandomItems(poolForRemaining, 4);

    // Combine and create cards
    const finalSelection = [guaranteedUnownedCard, ...remaining4Cards];
    return finalSelection.map((pokemonName) => createCard(pokemonName, false));
}

export const fetchGlassCannonCards = (isPlayerCard = true) => {
    return allPokemonNames
        .filter((pokemonName) => {
            const card = pokemon.cards[pokemonName];
            const stats = card.stats;
            const maxStat = Math.max(...stats);
            const minStat = Math.min(...stats);
            // Has at least one very high stat and one low stat (variance)
            return maxStat >= 8 && minStat <= 1;
        })
        .map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchDualTypeCards = (isPlayerCard = true) => {
    return allPokemonNames
        .filter((pokemonName) => pokemon.cards[pokemonName].types.length === 2)
        .map((pokemonName) => createCard(pokemonName, isPlayerCard));
}


export const fetchAllStarterLineCards = (isPlayerCard = true) => {
    const starters = ['bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard',
        'squirtle', 'wartortle', 'blastoise', 'pikachu', 'raichu'];
    return allPokemonNames
        .filter((pokemonName) => starters.includes(pokemonName))
        .map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchFossilCards = (isPlayerCard = true) => {
    const fossils = ['omanyte', 'omastar', 'kabuto', 'kabutops', 'aerodactyl'];
    return allPokemonNames
        .filter((pokemonName) => fossils.includes(pokemonName))
        .map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const sumUpNumbersInArray = (array) => {
    return array.reduce((acc, val) => acc + val, 0);
};

export const specialAwardDefinitions = [
    { name: 'jigglypuff', award: 'Worst Karaoke' },
    { name: 'magikarp', award: 'Most Useless...?' },
    { name: 'psyduck', award: 'Biggest Migraine' },
    { name: 'snorlax', award: 'Spent the Day in Bed' },
    { name: 'mewtwo', award: 'Lab Accident of the Year' },
    { name: 'ditto', award: 'Best at Impressions' },
    { name: 'slowpoke', award: 'Still Processing the Question' },
    { name: 'pikachu', award: 'Biggest Plot Armor' },
    { name: 'charizard', award: 'Main Character Energy' },
    { name: 'squirtle', award: 'Coolest Shades' },
    { name: 'bulbasaur', award: 'Grower, Not a Shower' },
    { name: 'eevee', award: 'Most Career Options Available' },
    { name: 'gengar', award: 'Biggest Bully' },
    { name: 'dragonite', award: 'Golden Retriever Energy' },
    { name: 'alakazam', award: 'Big Brain Bender' },
    { name: 'machamp', award: 'Most Swole' },
    { name: 'mew', award: 'Biggest Tease' },
    { name: 'gyarados', award: 'Most Stroppy' },
    { name: 'lapras', award: 'Best Piggyback Ride' },
    { name: 'articuno', award: 'Seafoam Island PTSD' },
    { name: 'zapdos', award: 'Most in Need of Conditioner' },
    { name: 'moltres', award: 'Almost at The Elite Four' },
    { name: 'cubone', award: 'Biggest Childhood Trauma' },
    { name: 'electrode', award: 'Most Corroded Terminals' },
    { name: 'chansey', award: 'Most Likely to Win Lottery' },
    { name: 'kangaskhan', award: 'Mum of the Year' },
    { name: 'onix', award: 'Best Rosary Beads' },
    { name: 'hitmonlee', award: 'Long Legs, No Chill' },
    { name: 'hitmonchan', award: 'Fewest Questions Asked' },
    { name: 'lickitung', award: 'Most Regrettable Close-Up' },
    { name: 'tangela', award: 'Biggest Grunger' },
    { name: 'seaking', award: 'Biggest Fish Lips' },
    { name: 'starmie', award: 'Biggest Alien Spy' },
    { name: 'scyther', award: 'Sharpest Blades' },
    { name: 'pinsir', award: 'Most Handsy' },
    { name: 'tauros', award: 'Least Interested in Pleasantries' },
    { name: 'exeggutor', award: 'Loudest Group Chat' },
    { name: 'marowak', award: 'Trauma-Driven Character Arc' },
    { name: 'porygon', award: 'Most Likely to Exit Code 1' },
    { name: 'aerodactyl', award: 'Most Prehistoric' },
    { name: 'farfetchd', award: 'Biggest Prepper' },
    { name: 'dodrio', award: 'Most Opinions Per Body' },
    { name: 'dewgong', award: 'Most Graceful' },
    { name: 'muk', award: 'Former Thames Water Employee' },
    { name: 'cloyster', award: 'Biggest Commitment Issues' },
    { name: 'hypno', award: 'Background Check Failure' },
    { name: 'kingler', award: 'Best at Arm Wrestling' },
    { name: 'voltorb', award: 'Most Explosive to the Touch' },
    { name: 'mr-mime', award: 'Most Unsettling...' },
    { name: 'jynx', award: 'Most Likely To Dance Off' },
    { name: 'electabuzz', award: 'Best Taser Replacement' },
    { name: 'magmar', award: 'Best Resting Pitch Face' },
    { name: 'kabutops', award: 'Edward Scissorhands' },
    { name: 'omastar', award: 'Biggest Luddite' },
    { name: 'wigglytuff', award: 'Fluff With Authority' },
    { name: 'clefable', award: 'Most Pretentious Hippy' },
    { name: 'ninetales', award: 'Most Spitefully Elegant' },
    { name: 'arcanine', award: '11/10 Would Pet' },
    { name: 'poliwrath', award: 'Least Likely To Skip Arm Day' },
    { name: 'victreebel', award: 'Most Likely To Eat Trainer' },
    { name: 'tentacruel', award: 'Most Nullified By Pee' },
    { name: 'geodude', award: 'Skipped Leg Day' },
    { name: 'golem', award: 'Most Likely To Roll Away' },
    { name: 'ponyta', award: 'My Hot Horse Summer' },
    { name: 'rapidash', award: 'Unicorn At Home' },
    { name: 'dugtrio', award: 'Most Likely To Be Scraped Off Shoes' },
    { name: 'persian', award: 'Most Expensive Tastes' },
    { name: 'golduck', award: 'Most In Need of Sectioning' },
    { name: 'primeape', award: 'Anger Management Case Study' },
    { name: 'arbok', award: 'Don\'t Tread On Me' },
    { name: 'raichu', award: 'Former Child Mascot' },
    { name: 'sandslash', award: 'Biggest Land Urchin' },
    { name: 'nidoking', award: 'Most Toxic Masculinity' },
    { name: 'nidoqueen', award: 'Wears The Pants' },
    { name: 'vileplume', award: 'Most Allergens' },
    { name: 'parasect', award: 'Most Definitely Not There' },
    { name: 'venomoth', award: 'Bröther, May I Have Lämp' },
    { name: 'blastoise', award: 'Tickets To The Gun Show' },
    { name: 'venusaur', award: 'OK Bloomer' },
    { name: 'pidgeot', award: 'Mach 2 Mullet' },
    { name: 'fearow', award: 'Pidgeot at Home' },
    { name: 'weezing', award: 'Biggest Smoker' },
    { name: 'rhydon', award: 'Poorest At Cornering' },
    { name: 'ivysaur', award: 'Most Awkward Phase' },
    { name: 'charmander', award: 'Most Likely To Rain Check' },
    { name: 'charmeleon', award: 'Biggest Middle Child Energy' },
    { name: 'wartortle', award: 'Most Aspirational Tail' },
    { name: 'caterpie', award: 'Hungriest Caterpillar' },
    { name: 'metapod', award: 'Stiffest Competition' },
    { name: 'butterfree', award: 'Glow-Up of the Year' },
    { name: 'weedle', award: 'Best Knock-Off Unicorn' },
    { name: 'kakuna', award: 'Most Likely To Stick Around' },
    { name: 'beedrill', award: 'Least Interested in Peace' },
    { name: 'pidgey', award: 'Most Unavoidable' },
    { name: 'pidgeotto', award: 'Best Hair Day' },
    { name: 'rattata', award: 'Never More Than 2 Metres Away' },
    { name: 'raticate', award: 'Best Dental Work' },
    { name: 'spearow', award: 'Angriest Bird Per Gram' },
    { name: 'ekans', award: 'He Who Slithers On His Belly' },
    { name: 'sandshrew', award: 'Biggest Underground Hit' },
    { name: 'nidoran-f', award: 'Voice Note Queen' },
    { name: 'nidorina', award: 'Most Likely To Curb Wheel' },
    { name: 'nidoran-m', award: 'Fantasy Football Commissioner' },
    { name: 'nidorino', award: 'Most Likely To Argue in Comments' },
    { name: 'clefairy', award: 'Moon Conspiracy Theorist' },
    { name: 'vulpix', award: 'Most Tails Per Capita' },
    { name: 'zubat', award: 'Every Cave, Every Time' },
    { name: 'golbat', award: 'All Mouth, No Thoughts' },
    { name: 'oddish', award: 'Sleepiest Walker' },
    { name: 'gloom', award: 'Biggest Morning Breath' },
    { name: 'paras', award: 'Send Help' },
    { name: 'venonat', award: 'Most Eyes, Least Depth Perception' },
    { name: 'diglett', award: 'Most Questions, Zero Answers' },
    { name: 'meowth', award: 'Currently Unemployed' },
    { name: 'mankey', award: 'Shortest Fuse' },
    { name: 'growlithe', award: 'Goodest Fire Hazard' },
    { name: 'poliwag', award: 'Most Visible Intestines' },
    { name: 'poliwhirl', award: 'All Hail Hypnotoad' },
    { name: 'abra', award: 'Least Committed to Socialising' },
    { name: 'kadabra', award: 'Best Spoon Bender' },
    { name: 'machop', award: 'Curls For The Girls' },
    { name: 'machoke', award: 'Least Likely To Wipe Down Bench' },
    { name: 'bellsprout', award: 'All Stem, No Stability' },
    { name: 'weepinbell', award: 'Most Droopy Poopy' },
    { name: 'tentacool', award: 'Ocean\'s Least Wanted' },
    { name: 'graveler', award: 'Biggest Brexiteer' },
    { name: 'slowbro', award: 'Least Brain Cells' },
    { name: 'magnemite', award: 'Biggest Screw Loose' },
    { name: 'magneton', award: 'Most Overcommitted to the Bit' },
    { name: 'doduo', award: 'Most Arguments With Itself' },
    { name: 'seel', award: 'Kissed From A Rose' },
    { name: 'grimer', award: 'Most in Need of Wash' },
    { name: 'shellder', award: 'Most Clammy' },
    { name: 'gastly', award: 'Will Vanish Mid-Sentence' },
    { name: 'haunter', award: 'Best Prankster' },
    { name: 'drowzee', award: 'HR-Approved Nightmare Fuel' },
    { name: 'krabby', award: 'Snappiest Attitude' },
    { name: 'exeggcute', award: 'Group Project Energy' },
    { name: 'koffing', award: 'Biggest COVID Enjoyer' },
    { name: 'rhyhorn', award: 'Half Rock, Half IQ' },
    { name: 'horsea', award: 'Pre-Glow Up Era' },
    { name: 'seadra', award: 'Most Defensive About Everything' },
    { name: 'goldeen', award: 'Most Graceful Swimmer' },
    { name: 'staryu', award: 'Most Mysterious Core' },
    { name: 'vaporeon', award: 'Most Moist (Regrettably)' },
    { name: 'jolteon', award: 'Static Cling Champion' },
    { name: 'flareon', award: 'Space Heater Energy' },
    { name: 'omanyte', award: 'Most Appraised' },
    { name: 'kabuto', award: 'Prehistoric Roomba Award' },
    { name: 'dratini', award: 'Baby\'s First Dragon' },
    { name: 'dragonair', award: 'Pre-Glow Down' },
];

