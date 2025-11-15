let pokemon = {};

pokemon.types = [
    "bug",
    "dragon",
    "electric",
    "fairy",
    "fighting",
    "fire",
    "flying",
    "ghost",
    "grass",
    "ground",
    "ice",
    "normal",
    "poison",
    "psychic",
    "rock",
    "steel",
    "water"
];

pokemon.data = {
    "bulbasaur": {
        "id": 1,
        "types": [
            "grass",
            "poison"
        ],
        "stats": 318,
        "effort_value": 1
    },
    "charmander": {
        "id": 4,
        "types": [
            "fire"
        ],
        "stats": 309,
        "effort_value": 1
    },
    "squirtle": {
        "id": 7,
        "types": [
            "water"
        ],
        "stats": 314,
        "effort_value": 1
    },
    "caterpie": {
        "id": 10,
        "types": [
            "bug"
        ],
        "stats": 195,
        "effort_value": 1
    },
    "weedle": {
        "id": 13,
        "types": [
            "bug",
            "poison"
        ],
        "stats": 195,
        "effort_value": 1
    },
    "pidgey": {
        "id": 16,
        "types": [
            "flying"
        ],
        "stats": 251,
        "effort_value": 1
    },
    "rattata": {
        "id": 19,
        "types": [
            "normal"
        ],
        "stats": 253,
        "effort_value": 1
    },
    "spearow": {
        "id": 21,
        "types": [
            "flying"
        ],
        "stats": 262,
        "effort_value": 1
    },
    "ekans": {
        "id": 23,
        "types": [
            "poison"
        ],
        "stats": 288,
        "effort_value": 1
    },
    "sandshrew": {
        "id": 27,
        "types": [
            "ground"
        ],
        "stats": 300,
        "effort_value": 1
    },
    "nidoran-f": {
        "id": 29,
        "types": [
            "poison"
        ],
        "stats": 275,
        "effort_value": 1
    },
    "nidoran-m": {
        "id": 32,
        "types": [
            "poison"
        ],
        "stats": 273,
        "effort_value": 1
    },
    "vulpix": {
        "id": 37,
        "types": [
            "fire"
        ],
        "stats": 299,
        "effort_value": 1
    },
    "zubat": {
        "id": 41,
        "types": [
            "poison",
            "flying"
        ],
        "stats": 245,
        "effort_value": 1
    },
    "oddish": {
        "id": 43,
        "types": [
            "grass",
            "poison"
        ],
        "stats": 320,
        "effort_value": 1
    },
    "paras": {
        "id": 46,
        "types": [
            "bug",
            "grass"
        ],
        "stats": 285,
        "effort_value": 1
    },
    "venonat": {
        "id": 48,
        "types": [
            "bug",
            "poison"
        ],
        "stats": 305,
        "effort_value": 1
    },
    "diglett": {
        "id": 50,
        "types": [
            "ground"
        ],
        "stats": 265,
        "effort_value": 1
    },
    "meowth": {
        "id": 52,
        "types": [
            "normal"
        ],
        "stats": 290,
        "effort_value": 1
    },
    "psyduck": {
        "id": 54,
        "types": [
            "water"
        ],
        "stats": 320,
        "effort_value": 1
    },
    "mankey": {
        "id": 56,
        "types": [
            "fighting"
        ],
        "stats": 305,
        "effort_value": 1
    },
    "growlithe": {
        "id": 58,
        "types": [
            "fire"
        ],
        "stats": 350,
        "effort_value": 1
    },
    "poliwag": {
        "id": 60,
        "types": [
            "water"
        ],
        "stats": 300,
        "effort_value": 1
    },
    "abra": {
        "id": 63,
        "types": [
            "psychic"
        ],
        "stats": 310,
        "effort_value": 1
    },
    "machop": {
        "id": 66,
        "types": [
            "fighting"
        ],
        "stats": 305,
        "effort_value": 1
    },
    "bellsprout": {
        "id": 69,
        "types": [
            "grass",
            "poison"
        ],
        "stats": 300,
        "effort_value": 1
    },
    "tentacool": {
        "id": 72,
        "types": [
            "water",
            "poison"
        ],
        "stats": 335,
        "effort_value": 1
    },
    "geodude": {
        "id": 74,
        "types": [
            "rock",
            "ground"
        ],
        "stats": 300,
        "effort_value": 1
    },
    "ponyta": {
        "id": 77,
        "types": [
            "fire"
        ],
        "stats": 410,
        "effort_value": 1
    },
    "slowpoke": {
        "id": 79,
        "types": [
            "water",
            "psychic"
        ],
        "stats": 315,
        "effort_value": 1
    },
    "magnemite": {
        "id": 81,
        "types": [
            "electric",
            "steel"
        ],
        "stats": 325,
        "effort_value": 1
    },
    "farfetchd": {
        "id": 83,
        "types": [
            "flying"
        ],
        "stats": 377,
        "effort_value": 1
    },
    "doduo": {
        "id": 84,
        "types": [
            "flying"
        ],
        "stats": 310,
        "effort_value": 1
    },
    "seel": {
        "id": 86,
        "types": [
            "water"
        ],
        "stats": 325,
        "effort_value": 1
    },
    "grimer": {
        "id": 88,
        "types": [
            "poison"
        ],
        "stats": 325,
        "effort_value": 1
    },
    "shellder": {
        "id": 90,
        "types": [
            "water"
        ],
        "stats": 305,
        "effort_value": 1
    },
    "gastly": {
        "id": 92,
        "types": [
            "ghost",
            "poison"
        ],
        "stats": 310,
        "effort_value": 1
    },
    "onix": {
        "id": 95,
        "types": [
            "rock",
            "ground"
        ],
        "stats": 385,
        "effort_value": 1
    },
    "drowzee": {
        "id": 96,
        "types": [
            "psychic"
        ],
        "stats": 328,
        "effort_value": 1
    },
    "krabby": {
        "id": 98,
        "types": [
            "water"
        ],
        "stats": 325,
        "effort_value": 1
    },
    "voltorb": {
        "id": 100,
        "types": [
            "electric"
        ],
        "stats": 330,
        "effort_value": 1
    },
    "exeggcute": {
        "id": 102,
        "types": [
            "grass",
            "psychic"
        ],
        "stats": 325,
        "effort_value": 1
    },
    "cubone": {
        "id": 104,
        "types": [
            "ground"
        ],
        "stats": 320,
        "effort_value": 1
    },
    "lickitung": {
        "id": 108,
        "types": [
            "normal"
        ],
        "stats": 385,
        "effort_value": 2
    },
    "koffing": {
        "id": 109,
        "types": [
            "poison"
        ],
        "stats": 340,
        "effort_value": 1
    },
    "rhyhorn": {
        "id": 111,
        "types": [
            "ground",
            "rock"
        ],
        "stats": 345,
        "effort_value": 1
    },
    "tangela": {
        "id": 114,
        "types": [
            "grass"
        ],
        "stats": 435,
        "effort_value": 1
    },
    "kangaskhan": {
        "id": 115,
        "types": [
            "normal"
        ],
        "stats": 490,
        "effort_value": 2
    },
    "horsea": {
        "id": 116,
        "types": [
            "water"
        ],
        "stats": 295,
        "effort_value": 1
    },
    "goldeen": {
        "id": 118,
        "types": [
            "water"
        ],
        "stats": 320,
        "effort_value": 1
    },
    "staryu": {
        "id": 120,
        "types": [
            "water"
        ],
        "stats": 340,
        "effort_value": 1
    },
    "scyther": {
        "id": 123,
        "types": [
            "bug",
            "flying"
        ],
        "stats": 500,
        "effort_value": 1
    },
    "pinsir": {
        "id": 127,
        "types": [
            "bug"
        ],
        "stats": 500,
        "effort_value": 2
    },
    "tauros": {
        "id": 128,
        "types": [
            "normal"
        ],
        "stats": 490,
        "effort_value": 2
    },
    "magikarp": {
        "id": 129,
        "types": [
            "water"
        ],
        "stats": 200,
        "effort_value": 1
    },
    "lapras": {
        "id": 131,
        "types": [
            "water",
            "ice"
        ],
        "stats": 535,
        "effort_value": 2
    },
    "ditto": {
        "id": 132,
        "types": [
            "normal"
        ],
        "stats": 288,
        "effort_value": 1
    },
    "eevee": {
        "id": 133,
        "types": [
            "normal"
        ],
        "stats": 325,
        "effort_value": 1
    },
    "porygon": {
        "id": 137,
        "types": [
            "normal"
        ],
        "stats": 395,
        "effort_value": 1
    },
    "omanyte": {
        "id": 138,
        "types": [
            "rock",
            "water"
        ],
        "stats": 355,
        "effort_value": 1
    },
    "kabuto": {
        "id": 140,
        "types": [
            "rock",
            "water"
        ],
        "stats": 355,
        "effort_value": 1
    },
    "aerodactyl": {
        "id": 142,
        "types": [
            "rock",
            "flying"
        ],
        "stats": 515,
        "effort_value": 2
    },
    "articuno": {
        "id": 144,
        "types": [
            "ice",
            "flying"
        ],
        "stats": 580,
        "effort_value": 3
    },
    "zapdos": {
        "id": 145,
        "types": [
            "electric",
            "flying"
        ],
        "stats": 580,
        "effort_value": 3
    },
    "moltres": {
        "id": 146,
        "types": [
            "fire",
            "flying"
        ],
        "stats": 580,
        "effort_value": 3
    },
    "dratini": {
        "id": 147,
        "types": [
            "dragon"
        ],
        "stats": 300,
        "effort_value": 1
    },
    "mewtwo": {
        "id": 150,
        "types": [
            "psychic"
        ],
        "stats": 680,
        "effort_value": 3
    },
    "mew": {
        "id": 151,
        "types": [
            "psychic"
        ],
        "stats": 600,
        "effort_value": 3
    },
    "ivysaur": {
        "id": 2,
        "types": [
            "grass",
            "poison"
        ],
        "stats": 405,
        "effort_value": 2
    },
    "venusaur": {
        "id": 3,
        "types": [
            "grass",
            "poison"
        ],
        "stats": 525,
        "effort_value": 3
    },
    "charmeleon": {
        "id": 5,
        "types": [
            "fire"
        ],
        "stats": 405,
        "effort_value": 2
    },
    "charizard": {
        "id": 6,
        "types": [
            "fire",
            "flying"
        ],
        "stats": 534,
        "effort_value": 3
    },
    "wartortle": {
        "id": 8,
        "types": [
            "water"
        ],
        "stats": 405,
        "effort_value": 2
    },
    "blastoise": {
        "id": 9,
        "types": [
            "water"
        ],
        "stats": 530,
        "effort_value": 3
    },
    "metapod": {
        "id": 11,
        "types": [
            "bug"
        ],
        "stats": 205,
        "effort_value": 2
    },
    "butterfree": {
        "id": 12,
        "types": [
            "bug",
            "flying"
        ],
        "stats": 395,
        "effort_value": 3
    },
    "kakuna": {
        "id": 14,
        "types": [
            "bug",
            "poison"
        ],
        "stats": 205,
        "effort_value": 2
    },
    "beedrill": {
        "id": 15,
        "types": [
            "bug",
            "poison"
        ],
        "stats": 395,
        "effort_value": 3
    },
    "pidgeotto": {
        "id": 17,
        "types": [
            "flying"
        ],
        "stats": 349,
        "effort_value": 2
    },
    "pidgeot": {
        "id": 18,
        "types": [
            "flying"
        ],
        "stats": 479,
        "effort_value": 3
    },
    "raticate": {
        "id": 20,
        "types": [
            "normal"
        ],
        "stats": 413,
        "effort_value": 2
    },
    "fearow": {
        "id": 22,
        "types": [
            "flying"
        ],
        "stats": 442,
        "effort_value": 2
    },
    "arbok": {
        "id": 24,
        "types": [
            "poison"
        ],
        "stats": 448,
        "effort_value": 2
    },
    "pikachu": {
        "id": 25,
        "types": [
            "electric"
        ],
        "stats": 320,
        "effort_value": 2
    },
    "raichu": {
        "id": 26,
        "types": [
            "electric"
        ],
        "stats": 485,
        "effort_value": 3
    },
    "sandslash": {
        "id": 28,
        "types": [
            "ground"
        ],
        "stats": 450,
        "effort_value": 2
    },
    "nidorina": {
        "id": 30,
        "types": [
            "poison"
        ],
        "stats": 365,
        "effort_value": 2
    },
    "nidoqueen": {
        "id": 31,
        "types": [
            "poison",
            "ground"
        ],
        "stats": 505,
        "effort_value": 3
    },
    "nidorino": {
        "id": 33,
        "types": [
            "poison"
        ],
        "stats": 365,
        "effort_value": 2
    },
    "nidoking": {
        "id": 34,
        "types": [
            "poison",
            "ground"
        ],
        "stats": 505,
        "effort_value": 3
    },
    "clefairy": {
        "id": 35,
        "types": [
            "fairy"
        ],
        "stats": 323,
        "effort_value": 2
    },
    "clefable": {
        "id": 36,
        "types": [
            "fairy"
        ],
        "stats": 483,
        "effort_value": 3
    },
    "ninetales": {
        "id": 38,
        "types": [
            "fire"
        ],
        "stats": 505,
        "effort_value": 2
    },
    "jigglypuff": {
        "id": 39,
        "types": [
            "fairy"
        ],
        "stats": 270,
        "effort_value": 2
    },
    "wigglytuff": {
        "id": 40,
        "types": [
            "fairy"
        ],
        "stats": 435,
        "effort_value": 3
    },
    "golbat": {
        "id": 42,
        "types": [
            "poison",
            "flying"
        ],
        "stats": 455,
        "effort_value": 2
    },
    "gloom": {
        "id": 44,
        "types": [
            "grass",
            "poison"
        ],
        "stats": 395,
        "effort_value": 2
    },
    "vileplume": {
        "id": 45,
        "types": [
            "grass",
            "poison"
        ],
        "stats": 490,
        "effort_value": 3
    },
    "parasect": {
        "id": 47,
        "types": [
            "bug",
            "grass"
        ],
        "stats": 405,
        "effort_value": 3
    },
    "venomoth": {
        "id": 49,
        "types": [
            "bug",
            "poison"
        ],
        "stats": 450,
        "effort_value": 2
    },
    "dugtrio": {
        "id": 51,
        "types": [
            "ground"
        ],
        "stats": 425,
        "effort_value": 2
    },
    "persian": {
        "id": 53,
        "types": [
            "normal"
        ],
        "stats": 440,
        "effort_value": 2
    },
    "golduck": {
        "id": 55,
        "types": [
            "water"
        ],
        "stats": 500,
        "effort_value": 2
    },
    "primeape": {
        "id": 57,
        "types": [
            "fighting"
        ],
        "stats": 455,
        "effort_value": 2
    },
    "arcanine": {
        "id": 59,
        "types": [
            "fire"
        ],
        "stats": 555,
        "effort_value": 2
    },
    "poliwhirl": {
        "id": 61,
        "types": [
            "water"
        ],
        "stats": 385,
        "effort_value": 2
    },
    "poliwrath": {
        "id": 62,
        "types": [
            "water",
            "fighting"
        ],
        "stats": 510,
        "effort_value": 3
    },
    "kadabra": {
        "id": 64,
        "types": [
            "psychic"
        ],
        "stats": 400,
        "effort_value": 2
    },
    "alakazam": {
        "id": 65,
        "types": [
            "psychic"
        ],
        "stats": 500,
        "effort_value": 3
    },
    "machoke": {
        "id": 67,
        "types": [
            "fighting"
        ],
        "stats": 405,
        "effort_value": 2
    },
    "machamp": {
        "id": 68,
        "types": [
            "fighting"
        ],
        "stats": 505,
        "effort_value": 3
    },
    "weepinbell": {
        "id": 70,
        "types": [
            "grass",
            "poison"
        ],
        "stats": 390,
        "effort_value": 2
    },
    "victreebel": {
        "id": 71,
        "types": [
            "grass",
            "poison"
        ],
        "stats": 490,
        "effort_value": 3
    },
    "tentacruel": {
        "id": 73,
        "types": [
            "water",
            "poison"
        ],
        "stats": 515,
        "effort_value": 2
    },
    "graveler": {
        "id": 75,
        "types": [
            "rock",
            "ground"
        ],
        "stats": 390,
        "effort_value": 2
    },
    "golem": {
        "id": 76,
        "types": [
            "rock",
            "ground"
        ],
        "stats": 495,
        "effort_value": 3
    },
    "rapidash": {
        "id": 78,
        "types": [
            "fire"
        ],
        "stats": 500,
        "effort_value": 2
    },
    "slowbro": {
        "id": 80,
        "types": [
            "water",
            "psychic"
        ],
        "stats": 490,
        "effort_value": 2
    },
    "magneton": {
        "id": 82,
        "types": [
            "electric",
            "steel"
        ],
        "stats": 465,
        "effort_value": 2
    },
    "dodrio": {
        "id": 85,
        "types": [
            "flying"
        ],
        "stats": 470,
        "effort_value": 2
    },
    "dewgong": {
        "id": 87,
        "types": [
            "water",
            "ice"
        ],
        "stats": 475,
        "effort_value": 2
    },
    "muk": {
        "id": 89,
        "types": [
            "poison"
        ],
        "stats": 500,
        "effort_value": 2
    },
    "cloyster": {
        "id": 91,
        "types": [
            "water",
            "ice"
        ],
        "stats": 525,
        "effort_value": 2
    },
    "haunter": {
        "id": 93,
        "types": [
            "ghost",
            "poison"
        ],
        "stats": 405,
        "effort_value": 2
    },
    "gengar": {
        "id": 94,
        "types": [
            "ghost",
            "poison"
        ],
        "stats": 500,
        "effort_value": 3
    },
    "hypno": {
        "id": 97,
        "types": [
            "psychic"
        ],
        "stats": 483,
        "effort_value": 2
    },
    "kingler": {
        "id": 99,
        "types": [
            "water"
        ],
        "stats": 475,
        "effort_value": 2
    },
    "electrode": {
        "id": 101,
        "types": [
            "electric"
        ],
        "stats": 490,
        "effort_value": 2
    },
    "exeggutor": {
        "id": 103,
        "types": [
            "grass",
            "psychic"
        ],
        "stats": 530,
        "effort_value": 2
    },
    "marowak": {
        "id": 105,
        "types": [
            "ground"
        ],
        "stats": 425,
        "effort_value": 2
    },
    "hitmonlee": {
        "id": 106,
        "types": [
            "fighting"
        ],
        "stats": 455,
        "effort_value": 2
    },
    "hitmonchan": {
        "id": 107,
        "types": [
            "fighting"
        ],
        "stats": 455,
        "effort_value": 2
    },
    "weezing": {
        "id": 110,
        "types": [
            "poison"
        ],
        "stats": 490,
        "effort_value": 2
    },
    "rhydon": {
        "id": 112,
        "types": [
            "ground",
            "rock"
        ],
        "stats": 485,
        "effort_value": 2
    },
    "chansey": {
        "id": 113,
        "types": [
            "normal"
        ],
        "stats": 450,
        "effort_value": 2
    },
    "seadra": {
        "id": 117,
        "types": [
            "water"
        ],
        "stats": 440,
        "effort_value": 2
    },
    "seaking": {
        "id": 119,
        "types": [
            "water"
        ],
        "stats": 450,
        "effort_value": 2
    },
    "starmie": {
        "id": 121,
        "types": [
            "water",
            "psychic"
        ],
        "stats": 520,
        "effort_value": 2
    },
    "mr-mime": {
        "id": 122,
        "types": [
            "psychic",
            "fairy"
        ],
        "stats": 460,
        "effort_value": 2
    },
    "jynx": {
        "id": 124,
        "types": [
            "ice",
            "psychic"
        ],
        "stats": 455,
        "effort_value": 2
    },
    "electabuzz": {
        "id": 125,
        "types": [
            "electric"
        ],
        "stats": 490,
        "effort_value": 2
    },
    "magmar": {
        "id": 126,
        "types": [
            "fire"
        ],
        "stats": 495,
        "effort_value": 2
    },
    "gyarados": {
        "id": 130,
        "types": [
            "water",
            "flying"
        ],
        "stats": 540,
        "effort_value": 2
    },
    "vaporeon": {
        "id": 134,
        "types": [
            "water"
        ],
        "stats": 525,
        "effort_value": 2
    },
    "jolteon": {
        "id": 135,
        "types": [
            "electric"
        ],
        "stats": 525,
        "effort_value": 2
    },
    "flareon": {
        "id": 136,
        "types": [
            "fire"
        ],
        "stats": 525,
        "effort_value": 2
    },
    "omastar": {
        "id": 139,
        "types": [
            "rock",
            "water"
        ],
        "stats": 495,
        "effort_value": 2
    },
    "kabutops": {
        "id": 141,
        "types": [
            "rock",
            "water"
        ],
        "stats": 495,
        "effort_value": 2
    },
    "snorlax": {
        "id": 143,
        "types": [
            "normal"
        ],
        "stats": 540,
        "effort_value": 2
    },
    "dragonair": {
        "id": 148,
        "types": [
            "dragon"
        ],
        "stats": 420,
        "effort_value": 2
    },
    "dragonite": {
        "id": 149,
        "types": [
            "dragon",
            "flying"
        ],
        "stats": 600,
        "effort_value": 3
    }
}

export default pokemon;