# 🌴 Mayan Slot Game

A browser-based slot machine game inspired by ancient Mayan treasures. Built
with vanilla JavaScript and HTML, this 5x3 slot features 10 paylines, wild
substitutions, and a test mode with RTP calculation.

## 🎮 Features

- 5 Reels × 3 Rows layout
- 10 Static Paylines
- Wild symbols (🟨) with substitution and their own payouts
- Scatter symbols (🪙) for bonus triggering (bonus logic in progress)
- RTP test mode with up to 1,000,000 simulated spins
- Visual symbol highlights and payout display
- No external libraries or frameworks
- Fully compatible with [Deno](https://deno.land/)

---

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

---

## 🧪 Test Spins & RTP Analysis

Use the **"Test"** button to simulate up to **1,000,000 spins**. The game will:

- Simulate spins without animation
- Track total bets and total wins
- Show calculated **RTP (%)**
- Log progress and results in real time

---

## 🔧 Game Mechanics

- **Wild Symbol (ID 0)**\
  Substitutes for all paying symbols and also has its own payout.

- **Scatter Symbol (🪙 ID 11)**\
  Appears randomly. Bonus trigger logic is planned but not yet active.

- **Symbols**\
  Include Mayan-themed icons: totem, jaguar, parrot, snake, and card symbols (A,
  K, Q, J, 10).

- **Paylines**\
  10 fixed lines: horizontal, diagonal, and zig-zag patterns.

- **Payouts**\
  Configured per symbol for 3x, 4x, and 5x matches. See `paytable` in the source
  for details.

---

Made with ☀️ by sstjepa
