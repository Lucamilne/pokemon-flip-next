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

export const allPokemonNames = Object.keys(pokemon.cards);

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

    // Add random variance to tier thresholds (+/- 20)
    const weakThreshold = 395 + Math.floor(Math.random() * 41) - 20; // 375-415
    const midThreshold = 500 + Math.floor(Math.random() * 41) - 20; // 480-520

    // Count player's tier distribution
    const playerTiers = {
        weak: 0,
        mid: 0,
        strong: 0
    };

    playerHand.forEach(card => {
        const statWeight = card.statWeight;
        if (statWeight < weakThreshold) playerTiers.weak++;
        else if (statWeight < midThreshold) playerTiers.mid++;
        else playerTiers.strong++;
    });

    // Generate CPU hand with same distribution
    const selectedCards = [
        ...getRandomItems(weakCards, playerTiers.weak),
        ...getRandomItems(midCards, playerTiers.mid),
        ...getRandomItems(strongCards, playerTiers.strong)
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
    { name: 'rhydon', award: 'Most Armored' },
    { name: 'ivysaur', award: 'Most Awkward Phase' },
    { name: 'charmander', award: 'Best Tail Flame' },
    { name: 'charmeleon', award: 'Most Rebellious' },
    { name: 'wartortle', award: 'Fluffiest Tail' },
    { name: 'caterpie', award: 'Hungriest Caterpillar' },
    { name: 'metapod', award: 'Hardest' },
    { name: 'butterfree', award: 'Most Beautiful' },
    { name: 'weedle', award: 'Pointiest Head' },
    { name: 'kakuna', award: 'Most Stubborn' },
    { name: 'beedrill', award: 'Angriest Bee' },
    { name: 'pidgey', award: 'Most Common' },
    { name: 'pidgeotto', award: 'Best Hair' },
    { name: 'rattata', award: 'Top Percentage' },
    { name: 'raticate', award: 'Biggest Teeth' },
    { name: 'spearow', award: 'Most Aggressive Bird' },
    { name: 'ekans', award: 'Most Backwards' },
    { name: 'sandshrew', award: 'Best Digger' },
    { name: 'nidoran-f', award: 'Most Adorable' },
    { name: 'nidorina', award: 'Best Big Sister' },
    { name: 'nidoran-m', award: 'Smallest Horns' },
    { name: 'nidorino', award: 'Spikiest Ears' },
    { name: 'clefairy', award: 'Cutest' },
    { name: 'vulpix', award: 'Fluffiest Tails' },
    { name: 'zubat', award: 'Most Annoying' },
    { name: 'golbat', award: 'Biggest Mouth' },
    { name: 'oddish', award: 'Sleepiest Walker' },
    { name: 'gloom', award: 'Smelliest Drool' },
    { name: 'paras', award: 'Most Parasitic' },
    { name: 'venonat', award: 'Biggest Eyes' },
    { name: 'diglett', award: 'Most Mysterious' },
    { name: 'meowth', award: 'Most Talkative' },
    { name: 'mankey', award: 'Most Temperamental' },
    { name: 'growlithe', award: 'Best Puppy' },
    { name: 'poliwag', award: 'Most Hypnotic Swirl' },
    { name: 'poliwhirl', award: 'Best Swimmer' },
    { name: 'abra', award: 'Most Likely to Flee' },
    { name: 'kadabra', award: 'Best Spoon Bender' },
    { name: 'machop', award: 'Most Determined' },
    { name: 'machoke', award: 'Most Muscular' },
    { name: 'bellsprout', award: 'Skinniest' },
    { name: 'weepinbell', award: 'Most Droopy' },
    { name: 'tentacool', award: 'Most Stingy' },
    { name: 'graveler', award: 'Most Rocky' },
    { name: 'slowbro', award: 'Most Clueless' },
    { name: 'magnemite', award: 'Most Magnetic' },
    { name: 'magneton', award: 'Most Attracted' },
    { name: 'doduo', award: 'Most Heads (Tie)' },
    { name: 'seel', award: 'Most Seal-like' },
    { name: 'grimer', award: 'Gooiest' },
    { name: 'shellder', award: 'Most Clammy' },
    { name: 'gastly', award: 'Most Gaseous' },
    { name: 'haunter', award: 'Best Prankster' },
    { name: 'drowzee', award: 'Most Creepy' },
    { name: 'krabby', award: 'Most Crabby' },
    { name: 'exeggcute', award: 'Most Cracked' },
    { name: 'koffing', award: 'Most Gassy' },
    { name: 'rhyhorn', award: 'Most Dense' },
    { name: 'horsea', award: 'Tiniest Dragon' },
    { name: 'seadra', award: 'Spikiest Seahorse' },
    { name: 'goldeen', award: 'Most Graceful Swimmer' },
    { name: 'staryu', award: 'Most Mysterious Core' },
    { name: 'vaporeon', award: 'Most Aquatic' },
    { name: 'jolteon', award: 'Spikiest Eeveelution' },
    { name: 'flareon', award: 'Fluffiest Eeveelution' },
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

