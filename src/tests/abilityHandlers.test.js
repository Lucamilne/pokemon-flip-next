import { describe, it, expect } from 'vitest'
import { selfAbilityHandlers } from '../utils/abilityHandlers'

const {
    agility, gigaImpact, seismicToss, swordsDance, boneClub, petalDance, selfDestruct,
    oblivious,
    shieldDust, shellArmor, defenceCurl, sturdy, thickFat, leafGuard,
    clearBody, magicGuard, hiddenPower,
    prismaticPunch,
    maternal, endure,
    safeguard, softBoiled,
    payDay,
} = selfAbilityHandlers

// Helper to make a minimal card
const makeCard = (overrides = {}) => ({
    id: 1,
    name: 'TestMon',
    types: ['fire'],
    stats: [5, 5, 5, 5],
    originalStats: [5, 5, 5, 5],
    ability: null,
    isPlayerCard: true,
    ...overrides
})

// Helper to make a minimal game state
const makeGameState = (overrides = {}) => ({
    cells: {},
    playerHand: [],
    cpuHand: [],
    isPlayerTurn: true,
    ...overrides
})

describe('agility', () => {
    it('boosts all stats by 1', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const result = agility(card, 'A1', makeGameState())
        expect(result.stats).toEqual([4, 5, 6, 7])
    })

    it('clamps stats at 10', () => {
        const card = makeCard({ stats: [9, 10, 10, 8] })
        const result = agility(card, 'A1', makeGameState())
        expect(result.stats).toEqual([10, 10, 10, 9])
    })

    it('does nothing when other cards are on the grid', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const gameState = makeGameState({
            cells: { A1: { pokemonCard: makeCard({ name: 'Other' }) } }
        })
        const result = agility(card, 'B2', gameState)
        expect(result.stats).toEqual([3, 4, 5, 6])
    })
})

describe('gigaImpact / seismicToss', () => {
    it('reduces all stats by 1', () => {
        const card = makeCard({ stats: [3, 5, 7, 9] })
        const result = gigaImpact(card, 'A1', makeGameState())
        expect(result.stats).toEqual([2, 4, 6, 8])
    })

    it('clamps stats at minimum 1', () => {
        const card = makeCard({ stats: [1, 2, 1, 3] })
        const result = gigaImpact(card, 'A1', makeGameState())
        expect(result.stats).toEqual([1, 1, 1, 2])
    })

    it('seismicToss behaves identically to gigaImpact', () => {
        const card = makeCard({ stats: [4, 6, 8, 10] })
        expect(seismicToss(card, 'A1', makeGameState()).stats)
            .toEqual(gigaImpact(card, 'A1', makeGameState()).stats)
    })
})

describe('swordsDance / boneClub / petalDance', () => {
    it('boosts all stats by 2 at B2', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const result = swordsDance(card, 'B2', makeGameState())
        expect(result.stats).toEqual([5, 6, 7, 8])
    })

    it('clamps stats at 10', () => {
        const card = makeCard({ stats: [9, 10, 8, 10] })
        const result = swordsDance(card, 'B2', makeGameState())
        expect(result.stats).toEqual([10, 10, 10, 10])
    })

    it('does nothing outside of B2', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const result = swordsDance(card, 'A1', makeGameState())
        expect(result.stats).toEqual([3, 4, 5, 6])
    })

    it('boneClub and petalDance behave identically to swordsDance', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const gs = makeGameState()
        expect(boneClub(card, 'B2', gs).stats).toEqual(swordsDance(card, 'B2', gs).stats)
        expect(petalDance(card, 'B2', gs).stats).toEqual(swordsDance(card, 'B2', gs).stats)
    })
})

describe('selfDestruct', () => {
    it('sets all stats to 1', () => {
        const card = makeCard({ stats: [8, 9, 10, 7] })
        const result = selfDestruct(card, 'A1', makeGameState())
        expect(result.stats).toEqual([1, 1, 1, 1])
    })

    it('leaves stats at 1 if already all 1', () => {
        const card = makeCard({ stats: [1, 1, 1, 1] })
        const result = selfDestruct(card, 'A1', makeGameState())
        expect(result.stats).toEqual([1, 1, 1, 1])
    })
})

describe('oblivious', () => {
    it('boosts all stats by 1 on an elemental tile', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const result = oblivious(card, 'A1', makeGameState({ cells: { A1: { element: 'fire' } } }))
        expect(result.stats).toEqual([4, 5, 6, 7])
    })

    it('clamps stats at 10', () => {
        const card = makeCard({ stats: [9, 10, 10, 8] })
        const result = oblivious(card, 'A1', makeGameState({ cells: { A1: { element: 'fire' } } }))
        expect(result.stats).toEqual([10, 10, 10, 9])
    })

    it('does nothing on a blank tile', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const result = oblivious(card, 'A1', makeGameState({ cells: { A1: { element: null } } }))
        expect(result.stats).toEqual([3, 4, 5, 6])
    })
})

describe('shieldDust (and aliases)', () => {
    it('boosts all stats by 1 when card type matches tile element', () => {
        const card = makeCard({ types: ['fire'], stats: [3, 4, 5, 6] })
        const result = shieldDust(card, 'A1', makeGameState({ cells: { A1: { element: 'fire' } } }))
        expect(result.stats).toEqual([4, 5, 6, 7])
    })

    it('clamps stats at 10', () => {
        const card = makeCard({ types: ['fire'], stats: [9, 10, 10, 8] })
        const result = shieldDust(card, 'A1', makeGameState({ cells: { A1: { element: 'fire' } } }))
        expect(result.stats).toEqual([10, 10, 10, 9])
    })

    it('does nothing when card type does not match tile element', () => {
        const card = makeCard({ types: ['water'], stats: [3, 4, 5, 6] })
        const result = shieldDust(card, 'A1', makeGameState({ cells: { A1: { element: 'fire' } } }))
        expect(result.stats).toEqual([3, 4, 5, 6])
    })

    it('does nothing on a blank tile', () => {
        const card = makeCard({ types: ['fire'], stats: [3, 4, 5, 6] })
        const result = shieldDust(card, 'A1', makeGameState({ cells: { A1: { element: null } } }))
        expect(result.stats).toEqual([3, 4, 5, 6])
    })

    it('aliases all behave identically', () => {
        const card = makeCard({ types: ['fire'], stats: [3, 4, 5, 6] })
        const gs = makeGameState({ cells: { A1: { element: 'fire' } } })
        const expected = shieldDust(card, 'A1', gs).stats
        expect(shellArmor(card, 'A1', gs).stats).toEqual(expected)
        expect(defenceCurl(card, 'A1', gs).stats).toEqual(expected)
        expect(sturdy(card, 'A1', gs).stats).toEqual(expected)
        expect(thickFat(card, 'A1', gs).stats).toEqual(expected)
        expect(leafGuard(card, 'A1', gs).stats).toEqual(expected)
    })
})

describe('clearBody (and aliases)', () => {
    it('boosts all stats by 1 on an elemental tile', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const result = clearBody(card, 'A1', makeGameState({ cells: { A1: { element: 'water' } } }))
        expect(result.stats).toEqual([4, 5, 6, 7])
    })

    it('changes card type to the tile element', () => {
        const card = makeCard({ types: ['fire'] })
        const result = clearBody(card, 'A1', makeGameState({ cells: { A1: { element: 'water' } } }))
        expect(result.types).toEqual(['water'])
    })

    it('clamps stats at 10', () => {
        const card = makeCard({ stats: [9, 10, 10, 8] })
        const result = clearBody(card, 'A1', makeGameState({ cells: { A1: { element: 'water' } } }))
        expect(result.stats).toEqual([10, 10, 10, 9])
    })

    it('does nothing on a blank tile', () => {
        const card = makeCard({ types: ['fire'], stats: [3, 4, 5, 6] })
        const result = clearBody(card, 'A1', makeGameState({ cells: { A1: { element: null } } }))
        expect(result.stats).toEqual([3, 4, 5, 6])
        expect(result.types).toEqual(['fire'])
    })

    it('magicGuard and hiddenPower behave identically', () => {
        const card = makeCard({ types: ['fire'], stats: [3, 4, 5, 6] })
        const gs = makeGameState({ cells: { A1: { element: 'water' } } })
        const ref = clearBody(card, 'A1', gs)
        expect(magicGuard(card, 'A1', gs).stats).toEqual(ref.stats)
        expect(magicGuard(card, 'A1', gs).types).toEqual(ref.types)
        expect(hiddenPower(card, 'A1', gs).stats).toEqual(ref.stats)
        expect(hiddenPower(card, 'A1', gs).types).toEqual(ref.types)
    })
})

describe('prismaticPunch', () => {
    it('does nothing on a blank tile', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const result = prismaticPunch(card, 'A1', makeGameState({ cells: { A1: { element: null } } }))
        expect(result.stats).toEqual([3, 4, 5, 6])
    })

    it('boosts all stats by 1 on a fighting tile', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const result = prismaticPunch(card, 'A1', makeGameState({ cells: { A1: { element: 'fighting' } } }))
        expect(result.stats).toEqual([4, 5, 6, 7])
    })

    it('boosts all stats by 2 on fire, electric, and ice tiles', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const gs = (el) => makeGameState({ cells: { A1: { element: el } } })
        expect(prismaticPunch(card, 'A1', gs('fire')).stats).toEqual([5, 6, 7, 8])
        expect(prismaticPunch(card, 'A1', gs('electric')).stats).toEqual([5, 6, 7, 8])
        expect(prismaticPunch(card, 'A1', gs('ice')).stats).toEqual([5, 6, 7, 8])
    })

    it('clamps +2 boost at 10 (including stat 9)', () => {
        const card = makeCard({ stats: [9, 10, 8, 7] })
        const result = prismaticPunch(card, 'A1', makeGameState({ cells: { A1: { element: 'fire' } } }))
        expect(result.stats).toEqual([10, 10, 10, 9])
    })

    it('reduces all stats by 1 on any other elemental tile', () => {
        const card = makeCard({ stats: [3, 4, 5, 6] })
        const result = prismaticPunch(card, 'A1', makeGameState({ cells: { A1: { element: 'water' } } }))
        expect(result.stats).toEqual([2, 3, 4, 5])
    })

    it('clamps fighting boost at 10', () => {
        const card = makeCard({ stats: [9, 10, 10, 8] })
        const result = prismaticPunch(card, 'A1', makeGameState({ cells: { A1: { element: 'fighting' } } }))
        expect(result.stats).toEqual([10, 10, 10, 9])
    })

    it('clamps reduction at minimum 1', () => {
        const card = makeCard({ stats: [1, 2, 1, 3] })
        const result = prismaticPunch(card, 'A1', makeGameState({ cells: { A1: { element: 'water' } } }))
        expect(result.stats).toEqual([1, 1, 1, 2])
    })
})

describe('maternal / endure', () => {
    it('raises all hand stats below 5 to 5', () => {
        const card = makeCard({ name: 'Blissey', stats: [5, 5, 5, 5] })
        const weakCard = makeCard({ name: 'Weak', stats: [2, 3, 4, 1] })
        const gs = makeGameState({ playerHand: [weakCard, card] })
        const result = maternal(card, 'A1', gs)
        expect(result.playerHand[0].stats).toEqual([5, 5, 5, 5])
    })

    it('does not lower stats already at or above 5', () => {
        const card = makeCard({ name: 'Blissey', stats: [5, 5, 5, 5] })
        const strongCard = makeCard({ name: 'Strong', stats: [6, 7, 8, 10] })
        const gs = makeGameState({ playerHand: [strongCard, card] })
        const result = maternal(card, 'A1', gs)
        expect(result.playerHand[0].stats).toEqual([6, 7, 8, 10])
    })

    it('endure behaves identically', () => {
        const card = makeCard({ name: 'TestMon', stats: [5, 5, 5, 5] })
        const weakCard = makeCard({ name: 'Weak', stats: [2, 3, 4, 1] })
        const gs = makeGameState({ playerHand: [weakCard, card] })
        expect(endure(card, 'A1', gs).playerHand[0].stats)
            .toEqual(maternal(card, 'A1', gs).playerHand[0].stats)
    })
})

describe('safeguard / softBoiled', () => {
    it('boosts stats of the cards immediately before and after in hand', () => {
        const prev = makeCard({ name: 'Prev', stats: [3, 4, 5, 6] })
        const card = makeCard({ name: 'Safeguarder', stats: [5, 5, 5, 5] })
        const next = makeCard({ name: 'Next', stats: [7, 8, 9, 10] })
        const gs = makeGameState({ playerHand: [prev, card, next] })
        const result = safeguard(card, 'A1', gs)
        expect(result.playerHand[0].stats).toEqual([4, 5, 6, 7])
        expect(result.playerHand[2].stats).toEqual([8, 9, 10, 10])
    })

    it('does not boost the card itself', () => {
        const prev = makeCard({ name: 'Prev', stats: [3, 4, 5, 6] })
        const card = makeCard({ name: 'Safeguarder', stats: [5, 5, 5, 5] })
        const next = makeCard({ name: 'Next', stats: [7, 8, 9, 10] })
        const gs = makeGameState({ playerHand: [prev, card, next] })
        const result = safeguard(card, 'A1', gs)
        expect(result.playerHand[1].stats).toEqual([5, 5, 5, 5])
    })

    it('does not boost cards further than one position away', () => {
        const far = makeCard({ name: 'Far', stats: [3, 3, 3, 3] })
        const prev = makeCard({ name: 'Prev', stats: [3, 4, 5, 6] })
        const card = makeCard({ name: 'Safeguarder', stats: [5, 5, 5, 5] })
        const gs = makeGameState({ playerHand: [far, prev, card] })
        const result = safeguard(card, 'A1', gs)
        expect(result.playerHand[0].stats).toEqual([3, 3, 3, 3])
        expect(result.playerHand[1].stats).toEqual([4, 5, 6, 7])
    })

    it('softBoiled behaves identically', () => {
        const prev = makeCard({ name: 'Prev', stats: [3, 4, 5, 6] })
        const card = makeCard({ name: 'Safeguarder', stats: [5, 5, 5, 5] })
        const next = makeCard({ name: 'Next', stats: [7, 8, 9, 10] })
        const gs = makeGameState({ playerHand: [prev, card, next] })
        expect(softBoiled(card, 'A1', gs).playerHand[0].stats)
            .toEqual(safeguard(card, 'A1', gs).playerHand[0].stats)
    })
})

describe('payDay', () => {
    it('gives +1 per 10 stat points on the next card', () => {
        const card = makeCard({ name: 'Meowth', stats: [3, 4, 5, 6] })
        const nextCard = makeCard({ name: 'Other', stats: [5, 5, 5, 5] })  // total 20 → bonus 2
        const gs = makeGameState({ playerHand: [card, nextCard] })
        const result = payDay(card, 'A1', gs)
        expect(result.playerHand[0].stats).toEqual([5, 6, 7, 8])
    })

    it('clamps boosted stats at 10', () => {
        const card = makeCard({ name: 'Meowth', stats: [8, 9, 10, 7] })
        const nextCard = makeCard({ name: 'Other', stats: [10, 10, 10, 10] })  // total 40 → bonus 4
        const gs = makeGameState({ playerHand: [card, nextCard] })
        const result = payDay(card, 'A1', gs)
        expect(result.playerHand[0].stats).toEqual([10, 10, 10, 10])
    })

    it('does nothing if next card total is below 10 (bonus 0)', () => {
        const card = makeCard({ name: 'Meowth', stats: [3, 4, 5, 6] })
        const nextCard = makeCard({ name: 'Other', stats: [2, 2, 2, 2] })  // total 8 → bonus 0
        const gs = makeGameState({ playerHand: [card, nextCard] })
        const result = payDay(card, 'A1', gs)
        expect(result.playerHand[0].stats).toEqual([3, 4, 5, 6])
    })

    it('does nothing if there is no next card', () => {
        const card = makeCard({ name: 'Meowth', stats: [3, 4, 5, 6] })
        const gs = makeGameState({ playerHand: [card] })
        const result = payDay(card, 'A1', gs)
        expect(result.playerHand[0].stats).toEqual([3, 4, 5, 6])
    })
})

// ---------------------------------------------------------------------------
// General stat bounds invariant — runs every selfAbilityHandler
// ---------------------------------------------------------------------------
// Extracts all card stats from any return shape:
//   - card returned directly  → { stats: [...] }
//   - hand object returned    → { playerHand, cpuHand }
//   - hand + cells returned   → { playerHand, cpuHand, cells }  (cells ignored; no self-handler modifies cell stats)
const extractStats = (result) => {
    if (!result) return []
    if (Array.isArray(result.stats)) return [result.stats]
    const all = []
    ;[result.playerHand, result.cpuHand].filter(Boolean).forEach(hand =>
        hand.forEach(c => { if (c?.stats) all.push(c.stats) })
    )
    return all
}

// A permissive setup designed to fire most handlers:
//   - fire tile at B2           → triggers tile-element boosts (oblivious, shieldDust, prismaticPunch…)
//   - 4 adjacent enemy cards    → triggers adjacency effects (pressure, guts, leechLife…)
//   - matching fire types       → triggers type-match boosts (chlorophyll, shieldDust…)
//   - populated hands           → triggers hand-based effects (payDay, safeguard, maternal…)
//   - isPlayerTurn matches card → triggers turn-gated effects (rest, harden…)
const makePermissiveSetup = (statValues) => {
    const card = makeCard({ name: 'TestMon', types: ['fire'], stats: [...statValues] })
    const adj  = makeCard({ name: 'Adj',     types: ['fire'], isPlayerCard: false, stats: [...statValues] })
    const next = makeCard({ name: 'Next',    types: ['fire'], stats: [...statValues] })
    const gs = {
        cells: {
            B1: { element: null, pokemonCard: { ...adj }, adjacentCells: [null, null, 'B2', null] },
            A2: { element: null, pokemonCard: { ...adj }, adjacentCells: [null, null, null, 'B2'] },
            B3: { element: null, pokemonCard: { ...adj }, adjacentCells: ['B2', null, null, null] },
            C2: { element: null, pokemonCard: { ...adj }, adjacentCells: [null, 'B2', null, null] },
            B2: { element: 'fire', pokemonCard: null, adjacentCells: ['B1', 'A2', 'B3', 'C2'] },
        },
        playerHand: [card, next],
        cpuHand: [{ ...adj }, { ...adj }, { ...adj }],
        isPlayerTurn: true,
    }
    return { card, gs }
}

describe('stat bounds — all selfAbilityHandlers', () => {
    it.each(Object.entries(selfAbilityHandlers))('%s: no stat exceeds 10', (_, handler) => {
        const { card, gs } = makePermissiveSetup([10, 10, 10, 10])
        const result = handler(card, 'B2', gs)
        extractStats(result).forEach(stats =>
            stats.forEach(stat => expect(stat).toBeLessThanOrEqual(10))
        )
    })

    it.each(Object.entries(selfAbilityHandlers))('%s: no stat goes below 1', (_, handler) => {
        const { card, gs } = makePermissiveSetup([1, 1, 1, 1])
        const result = handler(card, 'B2', gs)
        extractStats(result).forEach(stats =>
            stats.forEach(stat => expect(stat).toBeGreaterThanOrEqual(1))
        )
    })
})