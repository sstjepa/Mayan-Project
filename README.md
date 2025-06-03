# 🌴 Mayan Slot Game

A browser-based slot machine game inspired by ancient Mayan treasures. Built
with vanilla JavaScript and HTML, this 5x3 slot features 10 paylines, wild
substitutions, scatter symbols, and an exciting bonus game.

## 🎮 Features

- **Classic 5×3 Layout**: Traditional slot machine grid with 5 reels and 3 rows
- **10 Static Paylines**: Fixed winning patterns across the reels
- **Wild Symbols** (🟨): Substitute for all paying symbols and offer their own
  payouts
- **Scatter Symbols** (🪙): Trigger the bonus game when enough appear
- **Bonus Game**: Collect coins with multipliers for big wins
- **Grand Jackpot**: Fill all 15 positions with coins to win the 2500× jackpot
- **RTP Testing**: Simulate up to 1,000,000 spins to calculate Return-to-Player
  percentage
- **Diagnostic Tools**: Analyze game mechanics and verify fairness
- **No Dependencies**: Built with vanilla JavaScript - no external libraries or
  frameworks
- **Deno Compatible**: Fully compatible with [Deno](https://deno.land/) runtime

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sstjepa/Mayan-Project.git
cd Mayan-Project
```

### 2. Start a Local Server Using Deno

You can serve the project using Deno’s standard file server:

```bash
deno run --allow-read --allow-net server.ts
```

This will serve the current directory on:

```
http://localhost:8000/
```

> ✅ Make sure you have [Deno installed](https://deno.land/#installation)

### 3. Open the Game in Your Browser

Navigate to:

```
http://localhost:8000/index.html
```

You should see the slot game UI and can begin spinning or testing RTP.

## 🎰 Game Mechanics

### Base Game

- **Wild Symbol** (ID 0)\
  Substitutes for all paying symbols and has its own high-value payout.

- **Paying Symbols**\
  Include Mayan-themed icons: totem (🗿), jaguar (🐆), panther (🐅), parrot
  (🦜), snake (🐍), and card symbols (A, K, Q, J, 10).

- **Paylines**\
  10 fixed lines with horizontal, diagonal, and zig-zag patterns.

- **Payouts**\
  Configured per symbol for 3×, 4×, and 5× matches. Wild and Totem symbols offer
  the highest payouts.

### Bonus Game

- **Trigger**: Collect 11 or more Scatter symbols (🪙) on the reels
- **Gameplay**:
  - Start with 3 free spins
  - Each scatter shows a random multiplier value
  - Land new coins to reset spins back to 3
  - Game continues until spins run out or all 15 positions are filled
- **Grand Jackpot**: Fill all 15 positions to win the 2500× jackpot

## 🧪 Testing & Analysis

### RTP Testing

Use the **"Test"** button to simulate up to **1,000,000 spins**. The game will:

- Simulate spins without animation
- Track total bets and total wins
- Show calculated **RTP (%)**
- Log progress and results in real time

### Diagnostic Tools

- **Simulate All**: Test every possible reel combination
- **Run Diagnostic**: Analyze reel strips and verify game mechanics
- **Bonus Game Test**: Simulate multiple bonus game sessions

## 🛠️ Development

The game is built with vanilla JavaScript and follows a modular structure:

- `mayan-slot-game.js`: Main game logic
- `index.html`: Entry point
- `style-mayan.css`: Game styling
- `server.ts`: Deno server for local development

---

Made with ☀️ by sstjepa
