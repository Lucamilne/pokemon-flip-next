const pokemonList = Object.keys(pokemon.data);
const obj = pokemon.data;

for (const pokemon of pokemonList) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Extract the types from the response
            const types = data.types.map((typeData) => typeData.type.name);

            // Log or use the types as needed
            delete obj[pokemon].type
            obj[pokemon].types = types;
        })
}

// {
//     "overgrow":3, increases random stats by 1 when flipped once per game
//     "blaze":3, increases random stats by 1 when flipped once per game
//     "torrent":3, increases random stats by 1 when flipped once per game
//     "chlorophyll":9, stats have a chance to be increased by 2 when on grass tile
//     "rock-head":9, cannot be combod
//     "sturdy":6, Will always resist an equal attacking card regardless of type.
//     "vital-spirit":2, cannot have stats lowered by more than 1
//     "anger-point":3, increases random stats by 1 everytime it's flipped
//     "swarm":2, increases random stats by 1 when flipped once per game
//     "technician":3, weakest stat is increased by one on card placement
//     "shell-armor":7, Immune to stat attacking card stat increase
//     "skill-link":2, todo combos?
//     "levitate":4, cannot be flipped by ground types
//     "clear-body":2, stats cannot be lowered
//     "liquid-ooze":2, todo draining moves
//     "keen-eye":7, cannot have stats lowered by more than 1
//     "inner-focus":7, cannot be combod
//     "intimidate":6, lower defending card random stat by 1
//     "stench":2, Will always flip an equal defending card regardless of type.
//     "sticky-hold":2, cannot be flipped more than twice per game
//     "limber":3, has a chance to raise a stat instead of lowering it
//     "swift-swim":8,  random stats increase by 2 when on water tile
//     "thick-fat":3, fire and ice types next to this card have their 2 random stats lowered
//     "hydration":2, Increases all stats by 1 on water tiles
//     "neutralizing-gas": all stats are reset to normal on defending cards
//     "run-away":7, small chance to flip twice
//     "adaptability":1, Increases all stats by 1 on corresponding type tiles
//     "magnet-pull":2, steel types todo
//     "early-bird":3, if placed first 2 random stats a raised by 1
//     "flash-fire":7, increases random stats by 1 depending on the amount of adjacent fire types
//     "water-absorb":5, attacking water type abilities have no effect
//     "battle-armor":2,  Immune to stat attacking card stat increase
//     "trace":1, random existing ability when placed. When places first, this ability does nothing.
//     "download":1, redistribues 1 stat per defending card
//     "scrappy":1, Lowers all stats of defending ghost type by 1
//     "illuminate":2, all pokemon you own next to this card has a random stat increased by 1
//     "natural-cure":3, cannot be flipped more than twice per game
//     "own-tempo":3, cannot have stats lowered by more than 1
//     "oblivious":4, ignores all attacking card stat increases
//     "hyper-cutter":3, cannot have stats lowered
//     "pressure":5, todo
//     "sniper":2, increases a stat every time this card flips another
//     "lightning-rod":4, increase a stat for every electric type on the board
//     "leaf-guard":1, cannot be flipped when set on a grass tile
//     "mold-breaker":1, cannot have stats raised or lowered
//     "soundproof":3, cannot be combo'd
//     "static":5, todo
//     "pickup":1, todo
//     "water-veil":2, cannot be flipped, nor flip when set on a water tile
//     "effect-spore":2, contact todo
//     "dry-skin":2, random stats increased by 2 when placed on a water tile, or 1 per adjacent water type
//     "sand-veil":4, cannot be flipped, nor flip when set on a ground tile
//     "arena-trap":2, todo
//     "insomnia":2, todo
//     "forewarn":3, placing reveals one opponent card, if hidden
//     "synchronize":4, when flipped has a chance to attack defending cards adjacent
//     "compound-eyes":2, has a chance to raise or lower up to 2 stats.
//     "tinted-lens":2, when attacking, ignore your type if weak to defending pokemon
//     "damp":5, lower 1 stat per fire pokemon adjacent to this card
//     "cloud-nine":2, removes all elemental tiles todo
//     "guts":5, boosts stats by 1 per flip
//     "no-guard":3, when attacking, stalemates will always flip. When defending stalemates, you flip.
//     "shield-dust":3, if flipped, the attacking pokemon has stats raised reset
//     "cursed-body":1, has a chance not to flip
//     "reckless":1, When attacking, has a chance to raise 2 random stats, and lower another 2.
//     "poison-point":7, Raises all stats by 1 on poison tiles
//     "flame-body":1, Raises all stats by 1 on fire tiles
//     "iron-fist":1, Raises all stats by 1 on fighting tiles
//     "immunity":1, cannot be flipped, nor flip more than one card per game
//     "serene-grace":1, todo
//     "shed-skin":6, has a chance once per turn to regain all stats if lowered
//     "tangled-feet":3,
//     "rivalry":6,
//     "cute-charm":4,
//     "magic-guard":2,
//     "volt-absorb":1,
//     "competitive":2,
//     "filter":1
//  }