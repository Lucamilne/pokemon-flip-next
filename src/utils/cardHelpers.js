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

export const allPokemonNames = Object.keys(pokemon.cards)

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
    return allPokemonNames.filter((pokemonName) => pokemon.cards[pokemonName].starter).map((pokemonName) => createCard(pokemonName, isPlayerCard));
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

// Match the player's tier distribution for CPU hand
export const fetchCardsByPlayerTierDistribution = (playerHand) => {
    const { weakCards, midCards, strongCards } = categoriseCardsByTier();

    // Count player's tier distribution
    const playerTiers = {
        weak: 0,
        mid: 0,
        strong: 0
    };

    playerHand.forEach(card => {
        const statWeight = card.statWeight;
        if (statWeight < 395) playerTiers.weak++;
        else if (statWeight < 500) playerTiers.mid++;
        else playerTiers.strong++;
    });

    // Add variance by randomly swapping one card between tiers
    const cpuTiers = { ...playerTiers };
    const roll = Math.random();

    if (roll < 0.25 && cpuTiers.weak > 0) { // Swap weak -> mid
        cpuTiers.weak--;
        cpuTiers.mid++;
    } else if (roll > 0.75 && cpuTiers.strong > 0) { // Swap strong -> mid
        cpuTiers.strong--;
        cpuTiers.mid++;
    }

    const selectedCards = [
        ...getRandomItems(weakCards, cpuTiers.weak),
        ...getRandomItems(midCards, cpuTiers.mid),
        ...getRandomItems(strongCards, cpuTiers.strong)
    ];

    return selectedCards
        .sort(() => Math.random() - 0.5)
        .map((pokemonName) => createCard(pokemonName, false)); // CPU cards are always isPlayerCard = false
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

export const specialAwardDefinitions = [
    { name: 'jigglypuff', award: 'Worst Singer' },
    { name: 'magikarp', award: 'Most Useless' },
    { name: 'psyduck', award: 'Most Headaches' },
    { name: 'snorlax', award: 'Sleepiest' },
    { name: 'mewtwo', award: 'Most Intimidating' },
    { name: 'ditto', award: 'Best Impression' },
    { name: 'slowpoke', award: 'Still Processing the Question' },
    { name: 'pikachu', award: 'Mascot Privilege Award' },
    { name: 'charizard', award: 'Main Character Energy' },
    { name: 'squirtle', award: 'Coolest Shades' },
    { name: 'bulbasaur', award: 'Grower, Not Shower' },
    { name: 'eevee', award: 'Most Career Options Available' },
    { name: 'gengar', award: 'Biggest Tormenter' },
    { name: 'dragonite', award: 'Biggest Golden Retriever Energy' },
    { name: 'alakazam', award: 'Big Brain Bender' },
    { name: 'machamp', award: 'Most Swole' },
    { name: 'mew', award: 'Biggest Tease' },
    { name: 'gyarados', award: 'Biggest Temper' },
    { name: 'lapras', award: 'Best Uber X' },
    { name: 'articuno', award: 'Coolest Bird, Literally' },
    { name: 'zapdos', award: 'Most Tangy' },
    { name: 'moltres', award: 'Most Dramatic Entrance' },
    { name: 'cubone', award: 'Biggest Childhood Trauma' },
    { name: 'electrode', award: 'Most Corroded Terminals' },
    { name: 'chansey', award: 'Luckiest' },
    { name: 'kangaskhan', award: 'Best Parent' },
    { name: 'onix', award: 'Best Rosary Beads' },
    { name: 'hitmonlee', award: 'Long Legs, No Chill' },
    { name: 'hitmonchan', award: 'Fewest Questions Asked' },
    { name: 'lickitung', award: 'Most Regrettable Close-Up' },
    { name: 'tangela', award: 'Worst Hair' },
    { name: 'seaking', award: 'Most Fabulous' },
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
    { name: 'cloyster', award: 'Most Defensive' },
    { name: 'hypno', award: 'Worst Workplace Menace' },
    { name: 'kingler', award: 'Biggest Claw' },
    { name: 'voltorb', award: 'Most Explosive' },
    { name: 'mr-mime', award: 'Best Performer' },
    { name: 'jynx', award: 'Most Likely To Dance Off' },
    { name: 'electabuzz', award: 'Most Energetic' },
    { name: 'magmar', award: 'Hottest Temper' },
    { name: 'kabutops', award: 'Biggest Relic' },
    { name: 'omastar', award: 'Biggest Luddite' },
    { name: 'wigglytuff', award: 'Fluff With Authority' },
    { name: 'clefable', award: 'Most Pretentious Hippy' },
    { name: 'ninetales', award: 'Most Spitefully Elegant' },
    { name: 'arcanine', award: 'Best In Show' },
    { name: 'poliwrath', award: 'Best Lifeguard/Bouncer' },
    { name: 'victreebel', award: 'Most Likely To Eat Trainer' },
    { name: 'tentacruel', award: 'Most Nullified By Pee' },
    { name: 'geodude', award: 'Skipped Leg Day' },
    { name: 'golem', award: 'Most Likely To Roll Away' },
    { name: 'ponyta', award: 'Fastest Runner' },
    { name: 'rapidash', award: 'Most Majestic' },
    { name: 'dugtrio', award: 'Most Likely To Be Scraped Off Shoes' },
    { name: 'persian', award: 'Most Expensive Tastes' },
    { name: 'golduck', award: 'Most In Need of Sectioning' },
    { name: 'primeape', award: 'Anger Management Case Study' },
    { name: 'arbok', award: 'Don\'t Tread On Me' },
    { name: 'raichu', award: 'Former Child Mascot' },
    { name: 'sandslash', award: 'Biggest Land Urchin' },
    { name: 'nidoking', award: 'Most Entitled' },
    { name: 'nidoqueen', award: 'Most Regal' },
    { name: 'vileplume', award: 'Smelliest' },
    { name: 'parasect', award: 'Most Definitely Not There' },
    { name: 'venomoth', award: 'Most Hypnotic' },
    { name: 'blastoise', award: 'Nicest Cannons' },
    { name: 'venusaur', award: 'OK Bloomer' },
    { name: 'pidgeot', award: 'Most Majestic Bird' },
    { name: 'fearow', award: 'Most Intimidating' },
    { name: 'weezing', award: 'Biggest Smoker' },
    { name: 'rhydon', award: 'Poorest At Cornering' },
    { name: 'ivysaur', award: 'Most Awkward Phase' },
    { name: 'charmander', award: 'Cutest Open Flame' },
    { name: 'charmeleon', award: 'Most Rebellious' },
    { name: 'wartortle', award: 'Fluffiest Tail' },
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
    { name: 'clefairy', award: 'Plushiest Toy' },
    { name: 'vulpix', award: 'Most Tails Per Capita' },
    { name: 'zubat', award: 'Most Annoying' },
    { name: 'golbat', award: 'Biggest Gob' },
    { name: 'oddish', award: 'Sleepiest Walker' },
    { name: 'gloom', award: 'Biggest Morning Breath' },
    { name: 'paras', award: 'Most Parasitic' },
    { name: 'venonat', award: 'Most Eyes, Least Depth Perception' },
    { name: 'diglett', award: 'Most Questions, Zero Answers' },
    { name: 'meowth', award: 'Currently Unemployed' },
    { name: 'mankey', award: 'Shortest Fuse' },
    { name: 'growlithe', award: 'Goodest Fire Hazard' },
    { name: 'poliwag', award: 'Most Mesmerising Tummy' },
    { name: 'poliwhirl', award: 'Best Swimmer' },
    { name: 'abra', award: 'Least Committed to Socialising' },
    { name: 'kadabra', award: 'Best Spoon Bender' },
    { name: 'machop', award: 'Curls For The Girls' },
    { name: 'machoke', award: 'Least Likely To Wipe Down Bench' },
    { name: 'bellsprout', award: 'All Stem, No Stability' },
    { name: 'weepinbell', award: 'Most Droopy Poopy' },
    { name: 'tentacool', award: 'Most Stingy' },
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
    { name: 'krabby', award: 'Most Crabby' },
    { name: 'exeggcute', award: 'Most Likely to Crack' },
    { name: 'koffing', award: 'Biggest COVID Enjoyer' },
    { name: 'rhyhorn', award: 'Half Rock, Half IQ' },
    { name: 'horsea', award: 'Tiniest Dragon' },
    { name: 'seadra', award: 'Spikiest Seahorse' },
    { name: 'goldeen', award: 'Most Graceful Swimmer' },
    { name: 'staryu', award: 'Most Mysterious Core' },
    { name: 'vaporeon', award: 'Most Moist (Regrettably)' },
    { name: 'jolteon', award: 'Most Painful Hug' },
    { name: 'flareon', award: 'Warmest Hug' },
    { name: 'omanyte', award: 'Most Praised' },
    { name: 'kabuto', award: 'Hardest Shell' },
    { name: 'dratini', award: 'Most Adorable Dragon' },
    { name: 'dragonair', award: 'Most Serpentine' },
    // Gen 2 Pokemon
    { name: 'chikorita', award: 'Best Neck Leaf' },
    { name: 'bayleef', award: 'Most Fragrant' },
    { name: 'meganium', award: 'Best Flower Crown' },
    { name: 'cyndaquil', award: 'Shyest' },
    { name: 'quilava', award: 'Most Ferocious' },
    { name: 'typhlosion', award: 'Most Explosive' },
    { name: 'totodile', award: 'Most Playful' },
    { name: 'croconaw', award: 'Best Chomper' },
    { name: 'feraligatr', award: 'Most Intimidating Jaw' },
    { name: 'sentret', award: 'Best Lookout' },
    { name: 'furret', award: 'Longest Body' },
    { name: 'hoothoot', award: 'Best One-Legged Stand' },
    { name: 'noctowl', award: 'Wisest' },
    { name: 'ledyba', award: 'Most Bashful' },
    { name: 'ledian', award: 'Best Superhero' },
    { name: 'spinarak', award: 'Best Web Designer' },
    { name: 'ariados', award: 'Creepiest Legs' },
    { name: 'crobat', award: 'Fastest Flier' },
    { name: 'chinchou', award: 'Cutest Anglerfish' },
    { name: 'lanturn', award: 'Best Lighthouse' },
    { name: 'pichu', award: 'Most Shocking Baby' },
    { name: 'cleffa', award: 'Most Starry-Eyed' },
    { name: 'igglybuff', award: 'Bounciest' },
    { name: 'togepi', award: 'Luckiest Egg' },
    { name: 'togetic', award: 'Most Joyful' },
    { name: 'natu', award: 'Most Stoic' },
    { name: 'xatu', award: 'Most Mystical' },
    { name: 'mareep', award: 'Fluffiest Sheep' },
    { name: 'flaaffy', award: 'Most Static' },
    { name: 'ampharos', award: 'Best Beacon' },
    { name: 'bellossom', award: 'Best Dancer' },
    { name: 'marill', award: 'Roundest' },
    { name: 'azumarill', award: 'Best Lifeguard' },
    { name: 'sudowoodo', award: 'Best Impression of a Tree' },
    { name: 'politoed', award: 'Loudest Croaker' },
    { name: 'hoppip', award: 'Lightest' },
    { name: 'skiploom', award: 'Best Glider' },
    { name: 'jumpluff', award: 'Most Airborne' },
    { name: 'aipom', award: 'Most Mischievous' },
    { name: 'sunkern', award: 'Weakest' },
    { name: 'sunflora', award: 'Most Cheerful' },
    { name: 'yanma', award: 'Best Vision' },
    { name: 'wooper', award: 'Most Carefree' },
    { name: 'quagsire', award: 'Most Clueless' },
    { name: 'espeon', award: 'Most Psychic' },
    { name: 'umbreon', award: 'Most Edgy' },
    { name: 'murkrow', award: 'Most Witchy' },
    { name: 'slowking', award: 'Smartest' },
    { name: 'misdreavus', award: 'Most Mischievous Ghost' },
    { name: 'unown', award: 'Most Cryptic' },
    { name: 'wobbuffet', award: 'Most Patient' },
    { name: 'girafarig', award: 'Most Two-Faced' },
    { name: 'pineco', award: 'Most Likely to Explode' },
    { name: 'forretress', award: 'Most Fortified' },
    { name: 'dunsparce', award: 'Most Derpy' },
    { name: 'gligar', award: 'Best Glider' },
    { name: 'steelix', award: 'Hardest' },
    { name: 'snubbull', award: 'Cutest Growl' },
    { name: 'granbull', award: 'Scariest Underbite' },
    { name: 'qwilfish', award: 'Most Inflated' },
    { name: 'scizor', award: 'Most Metal' },
    { name: 'shuckle', award: 'Most Defensive' },
    { name: 'heracross', award: 'Strongest' },
    { name: 'sneasel', award: 'Sneakiest' },
    { name: 'teddiursa', award: 'Most Huggable' },
    { name: 'ursaring', award: 'Most Ferocious' },
    { name: 'slugma', award: 'Slowest Mover' },
    { name: 'magcargo', award: 'Hotter Than The Sun' },
    { name: 'swinub', award: 'Most Oblivious' },
    { name: 'piloswine', award: 'Hairiest' },
    { name: 'corsola', award: 'Most Delicate' },
    { name: 'remoraid', award: 'Best Marksman' },
    { name: 'octillery', award: 'Most Artillery' },
    { name: 'delibird', award: 'Most Generous' },
    { name: 'mantine', award: 'Most Graceful Flier' },
    { name: 'skarmory', award: 'Sharpest Wings' },
    { name: 'houndour', award: 'Most Devilish' },
    { name: 'houndoom', award: 'Most Hellish' },
    { name: 'kingdra', award: 'Most Regal Dragon' },
    { name: 'phanpy', award: 'Most Adorable Trunk' },
    { name: 'donphan', award: 'Best Roller' },
    { name: 'porygon2', award: 'Most Upgraded' },
    { name: 'stantler', award: 'Most Hypnotic Antlers' },
    { name: 'smeargle', award: 'Best Artist' },
    { name: 'tyrogue', award: 'Most Determined Fighter' },
    { name: 'hitmontop', award: 'Best Spinner' },
    { name: 'smoochum', award: 'Most Fashionable' },
    { name: 'elekid', award: 'Most Energetic Baby' },
    { name: 'magby', award: 'Hottest Baby' },
    { name: 'miltank', award: 'Most Terrifying' },
    { name: 'blissey', award: 'Kindest Nurse' },
    { name: 'raikou', award: 'Most Thunderous' },
    { name: 'entei', award: 'Most Volcanic' },
    { name: 'suicune', award: 'Most Graceful Legend' },
    { name: 'larvitar', award: 'Hungriest Mountain Eater' },
    { name: 'pupitar', award: 'Most Explosive Cocoon' },
    { name: 'tyranitar', award: 'Most Destructive' },
    { name: 'lugia', award: 'Best Diver' },
    { name: 'ho-oh', award: 'Most Majestic' },
    { name: 'celebi', award: 'Best Time Traveler' }
];

