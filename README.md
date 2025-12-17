# Pokemon Flip

A strategic card battle game inspired by Triple Triad, featuring Pokemon cards with elemental types and stat-based combat.

## Game Overview

Pokemon Flip is a turn-based strategy game where you battle against the CPU on a 3x3 grid. Each card has four directional stats (top, left, bottom, right) and elemental types that affect gameplay through type advantages and elemental tile bonuses.

## How to Play

### Setup
1. Select 5 Pokemon cards from your collection to form your hand
2. The CPU will randomly select 5 cards as well
3. Elemental tiles will be randomly placed on the grid based on the types in both players' hands

### Basic Rules

#### Card Placement
- Players take turns placing one card at a time on the 3x3 grid
- You can place cards on any empty cell
- Once placed, cards cannot be moved

#### Capturing Cards
When you place a card, it will attempt to capture adjacent enemy cards based on these rules:

1. **Standard Capture**: Your card's stat facing an adjacent enemy card must be **higher** than the opponent's facing stat
2. **Type Advantage Capture**: If your card has a **type advantage** (super effective) against an adjacent enemy card AND the stats are **equal**, you capture the card
3. **Immunity**: If the defending card is **immune** to your card's type, it **cannot be captured** regardless of stats

#### Type Effectiveness
- **Super Effective**: Your attacking type is strong against the defender's type (e.g., Electric vs Water)
  - Shows "SUPER EFFECTIVE!" when capturing with type advantage
  - Allows captures even when stats are equal
- **Immune**: The defender is completely immune to your type (e.g., Ground is immune to Electric)
  - Shows "NO EFFECT!" when immunity blocks your attack
  - Prevents ALL captures, even if your stats are higher

#### Elemental Tiles
Some grid cells have elemental types:
- **Matching Type**: If your card's type matches the tile element, ALL stats are increased by +1 (max 10)
- **Non-Matching Type**: If your card's type doesn't match the tile element, ALL stats are decreased by -1 (min 1)
- **Normal Type**: Normal-type Pokemon are not affected by elemental tiles

### Winning the Game
- The game ends when all 9 cells are filled
- The player who controls the most cards on the board wins
- Captured cards change color to show who owns them (blue for player, red for CPU)
- **Win a round**: All cards you captured from the CPU are added to your permanent collection
- **Lose a round**: You must forfeit one of the cards the CPU captured during that round from your collection

### Strategy Tips
- Look for opportunities to use type advantages when stats are equal
- Be aware of immunity matchups that can prevent captures
- Use elemental tiles to boost your card stats
- Position cards with strong stats facing potential threats
- Try to capture multiple cards with a single placement

## Development

This is a React application built with [Vite](https://vitejs.dev).

### Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the game.

### Tech Stack
- **Vite** - Build tool and dev server
- **React** - UI library
- **Tailwind CSS** - Styling
- **dnd-kit** - Drag and drop functionality
- **PokeAPI** - Pokemon data and sprites
- **Firebase** - Authentication and cloud storage
- **Nes.css** & **Snes.css** - Retro pixel-art styling
