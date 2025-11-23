# Monopoly Game Implementation Plan

## Goal Description
Build a web-based Monopoly game ("大富翁") where players can roll dice, move around the board, buy properties, and pay rent. The game will be built using **Svelte** for the UI and state management, and Tailwind CSS for styling.

## User Review Required
- **Framework Change**: Switched from React to Svelte as requested. Svelte's built-in reactivity and stores are excellent for game state management.
- **Game Rules**: Simplified Monopoly rules.
- **Multiplayer**: Hotseat (local multiplayer).
- **Language**: Traditional Chinese.

## Proposed Changes

### Project Setup
#### [NEW] [package.json](file:///Users/sean/.gemini/antigravity/scratch/monopoly-game/package.json)
- Svelte (latest)
- Vite
- Tailwind CSS
- `lucide-svelte` for icons
- `clsx` and `tailwind-merge`

### Core Components

#### [NEW] [src/App.svelte](file:///Users/sean/.gemini/antigravity/scratch/monopoly-game/src/App.svelte)
- Main application entry point.

#### [NEW] [src/components/Board.svelte](file:///Users/sean/.gemini/antigravity/scratch/monopoly-game/src/components/Board.svelte)
- Main game board container.
- Renders the 40 tiles.

#### [NEW] [src/components/Tile.svelte](file:///Users/sean/.gemini/antigravity/scratch/monopoly-game/src/components/Tile.svelte)
- Individual board space.
- Displays property info and players.

#### [NEW] [src/components/PlayerToken.svelte](file:///Users/sean/.gemini/antigravity/scratch/monopoly-game/src/components/PlayerToken.svelte)
- Visual avatar for players.

#### [NEW] [src/components/Controls.svelte](file:///Users/sean/.gemini/antigravity/scratch/monopoly-game/src/components/Controls.svelte)
- Action buttons: "Roll Dice", "End Turn", "Buy Property".

#### [NEW] [src/components/Dashboard.svelte](file:///Users/sean/.gemini/antigravity/scratch/monopoly-game/src/components/Dashboard.svelte)
- Displays current player info, money, and game log.

### State Management
#### [NEW] [src/store/gameStore.ts](file:///Users/sean/.gemini/antigravity/scratch/monopoly-game/src/store/gameStore.ts)
- Using **Svelte Stores** (`writable`, `derived`).
- State includes:
    - `players`: Store<Player[]>
    - `board`: Store<Tile[]>
    - `currentPlayerIndex`: Store<number>
    - `gameState`: Store<string>
    - `gameLog`: Store<string[]>

## Verification Plan

### Automated Tests
- Run `npm run dev` to verify the build works.

### Manual Verification
- **Movement**: Verify players move the correct number of steps.
- **State Updates**: Verify Svelte stores correctly update UI without manual re-renders.
- **Game Flow**: Test the full loop of Roll -> Move -> Action -> End Turn.
