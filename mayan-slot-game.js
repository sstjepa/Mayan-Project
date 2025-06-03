// deno-lint-ignore-file prefer-const require-await
class MayanSlotGame {
     constructor() {
          // Symbol definitions
          this.symbols = {
               0: "Wild",
               1: "🗿",
               2: "🐆",
               3: "🐅",
               4: "🦜",
               5: "🐍",
               6: "A",
               7: "K",
               8: "Q",
               9: "J",
               10: "10",
               11: "🪙"
          };

          // Symbol payouts (multipliers) for x3, x4, x5 matches
          this.paytable = {
               0: [2, 10, 125],    // Wild
               1: [2, 10, 125],    // Totem
               2: [1, 5, 25],      // Panter
               3: [1, 5, 25],      // Jaguar
               4: [1, 5, 20],      // Parrot
               5: [1, 5, 20],      // Snake
               6: [0.5, 2, 10],    // A
               7: [0.5, 2, 10],    // K
               8: [0.5, 1, 5],     // Q
               9: [0.5, 1, 5],     // J
               10: [0.5, 1, 5],    // 10
               11: [0, 0, 0]       // Scatter
          };

          // Reels' symbol sequences
          this.reels = [
               // R1
               [7, 7, 10, 10, 10, 7, 10, 11, 11, 11, 2, 2, 2, 9, 9, 9, 1, 9, 9, 6, 6, 5, 6, 5, 3, 3, 8, 4, 8, 4, 8, 8, 8, 0, 0, 0, 0],
               // R2
               [0, 0, 0, 2, 5, 2, 5, 5, 11, 11, 11, 6, 6, 6, 10, 10, 4, 3, 3, 8, 8, 7, 7, 7, 4, 7, 1, 1, 1, 9, 9, 9],
               // R3
               [4, 7, 7, 7, 4, 4, 2, 2, 9, 9, 9, 11, 11, 11, 5, 5, 5, 3, 5, 10, 10, 3, 0, 0, 0, 1, 1, 1, 8, 6, 8, 8, 8, 6],
               // R4
               [5, 5, 7, 7, 7, 11, 11, 11, 3, 8, 8, 3, 8, 8, 8, 2, 9, 2, 9, 9, 9, 1, 0, 0, 0, 0, 10, 4, 10, 10, 10, 4, 6, 6, 6],
               // R5
               [6, 6, 6, 4, 4, 6, 11, 11, 11, 8, 8, 2, 8, 2, 5, 7, 7, 5, 10, 10, 10, 3, 10, 3, 3, 0, 0, 0, 0, 9, 9, 9, 1, 1, 1, 11, 11, 11]
          ];

          // Paylines
          this.paylines = [
               [1, 1, 1, 1, 1],  // 1. Middle row
               [0, 0, 0, 0, 0],  // 2. Top row
               [2, 2, 2, 2, 2],  // 3. Bottom row
               [0, 1, 2, 1, 0],  // 4. V shape
               [2, 1, 0, 1, 2],  // 5. Inverted V
               [0, 0, 1, 2, 2],  // 6. Diagonal top-left to bottom-right
               [2, 2, 1, 0, 0],  // 7. Diagonal bottom-left to top-right
               [1, 2, 2, 2, 1],  // 8. U shape
               [1, 0, 0, 0, 1],  // 9. Inverted U
               [0, 1, 1, 1, 0]   // 10. Roof shape
          ];

          // Default displayed symbols (J, K, A, 10, Q)
          this.defaultSymbols = [
               [9, 9, 9],    // R1: J
               [7, 7, 7],    // R2: K
               [6, 6, 6],    // R3: A
               [10, 10, 10], // R4: 10
               [8, 8, 8]     // R5: Q
          ];

          // Next scatter probability
          this.scatterProbability = {
               12: 0.0700, // 7%
               13: 0.0700, // 7%
               14: 0.0400, // 4%
               15: 0.0029  // 0.29%
          };

          // Scatter multipliers
          this.scatterMultiplier = [1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 75, 500];

          this.scatterMultiplierChance = {
               1: 0.5,
               2: 0.25,
               3: 0.13,
               4: 0.05,
               5: 0.03,
               10: 0.015,
               15: 0.007,
               20: 0.005,
               25: 0.005,
               50: 0.004,
               75: 0.003,
               500: 0.001
          };

          this.GrandJackpot = 2500;

          // Initialize display
          this.display = Array(3).fill().map(() => Array(5).fill(0));
          this.currentPositions = [];

          // Game state
          this.isSpinning = false;
          this.inBonusGame = false;
          this.bonusFreeSpins = 0;
          this.bonusCoins = [];
          this.balance = 1000;
          this.betAmount = 2.0;
          this.totalWon = 0;
          this.RTP = 0.0;
          this.RTPBet = 0;
          this.RTPWin = 0;

          this.setupUI();

          this.setDefaultDisplay();

          this.loadCSS();
     }

     loadCSS() {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'style-mayan.css';
          document.head.appendChild(link);
     }

     setupUI() {
          // Main container
          this.container = document.createElement('div');
          this.container.className = 'slot-machine';
          document.body.appendChild(this.container);

          // Game title
          const title = document.createElement('h1');
          title.textContent = '🌴 MAYAN TREASURES 🌴';
          title.className = 'game-title';
          this.container.appendChild(title);

          // Reels container
          this.reelsContainer = document.createElement('div');
          this.reelsContainer.className = 'reels-container';
          this.container.appendChild(this.reelsContainer);

          // Create reels and symbols
          for (let reel = 0; reel < 5; reel++) {
               const reelElement = document.createElement('div');
               reelElement.className = 'reel';

               for (let pos = 0; pos < 3; pos++) {
                    const symbol = document.createElement('div');
                    symbol.className = 'symbol';
                    symbol.id = `symbol-${pos}-${reel}`;
                    symbol.textContent = '?';
                    reelElement.appendChild(symbol);
               }

               this.reelsContainer.appendChild(reelElement);
          }

          // Paylines display
          this.paylineDisplay = document.createElement('div');
          this.paylineDisplay.className = 'payline-display';
          this.paylineDisplay.textContent = 'Spin to see winning lines';
          this.container.appendChild(this.paylineDisplay);

          // Info panel
          const infoPanel = document.createElement('div');
          infoPanel.className = 'info-panel';
          this.container.appendChild(infoPanel);

          // Balance display
          this.balanceDisplay = document.createElement('div');
          this.balanceDisplay.className = 'balance-display';
          this.balanceDisplay.textContent = `Balance: ${this.balance.toFixed(2)}`;
          infoPanel.appendChild(this.balanceDisplay);

          // Win display
          this.winDisplay = document.createElement('div');
          this.winDisplay.className = 'win-display';
          this.winDisplay.textContent = 'Win: 0.00';
          infoPanel.appendChild(this.winDisplay);

          // Controls container
          const controls = document.createElement('div');
          controls.className = 'controls';
          this.container.appendChild(controls);

          // Bet control
          const betControl = document.createElement('div');
          betControl.className = 'bet-control';
          controls.appendChild(betControl);

          const betLabel = document.createElement('label');
          betLabel.textContent = 'Bet: ';
          betControl.appendChild(betLabel);

          this.betInput = document.createElement('input');
          this.betInput.type = 'number';
          this.betInput.min = '0.6';
          this.betInput.step = '0.1';
          this.betInput.value = this.betAmount.toFixed(2);
          betControl.appendChild(this.betInput);

          // Spin button
          this.spinButton = document.createElement('button');
          this.spinButton.className = 'spin-button';
          this.spinButton.textContent = '🎰 SPIN';
          this.spinButton.addEventListener('click', () => this.handleSpin());
          controls.appendChild(this.spinButton);

          // Add bonus game simulation button
          this.bonusGameButton = document.createElement('button');
          this.bonusGameButton.className = 'bonus-game-button';
          this.bonusGameButton.textContent = '🪙 BONUS GAME';
          this.bonusGameButton.addEventListener('click', () => this.simulateBonusGame());
          controls.appendChild(this.bonusGameButton);

          // DiagControls container
          const diagControls = document.createElement('div');
          diagControls.className = 'diagControls';
          this.container.appendChild(diagControls);

          // Test spin control
          const testSpinControl = document.createElement('div');
          testSpinControl.className = 'testspin-control';
          diagControls.appendChild(testSpinControl);

          const testSpinLabel = document.createElement('label');
          testSpinLabel.textContent = 'Test spins: ';
          testSpinControl.appendChild(testSpinLabel);

          this.testSpinInput = document.createElement('input');
          this.testSpinInput.type = 'number';
          this.testSpinInput.min = '0';
          this.testSpinInput.value = '100000';
          this.testSpinInput.step = '100000';
          testSpinControl.appendChild(this.testSpinInput);

          this.testSpinButton = document.createElement('button');
          this.testSpinButton.className = 'testspin-button';
          this.testSpinButton.textContent = 'TEST';
          this.testSpinButton.addEventListener('click', () => this.handleTestSpin());
          testSpinControl.appendChild(this.testSpinButton);

          // Simulate button
          const testControl = document.createElement('div');
          testControl.className = 'test-control';
          diagControls.appendChild(testControl);

          this.simulateButton = document.createElement('button');
          this.simulateButton.className = 'simulate-button';
          this.simulateButton.textContent = 'Simulate';
          this.simulateButton.addEventListener('click', () => this.runSimulateTest());
          testControl.appendChild(this.simulateButton);

          this.runDiagButton = document.createElement('button');
          this.runDiagButton.className = 'run-diagnostic-button';
          this.runDiagButton.textContent = 'Run Diagnostics';
          this.runDiagButton.addEventListener('click', () => this.runDiagnosticTest());
          testControl.appendChild(this.runDiagButton);

          // Results log
          this.log = document.createElement('div');
          this.log.className = 'results-log';
          this.container.appendChild(this.log);
     }

     // Get short symbol name for display
     getShortSymbolName(symbolId) {
          return this.symbols[symbolId] || '?';
     }

     // Add method to get stored coin multiplier
     getCoinMultiplier(pos, reel) {
          return this.coinMultipliers[`${pos}-${reel}`] || 1;
     }

     // Add method to set coin multiplier
     setCoinMultiplier(pos, reel, multiplier) {
          this.coinMultipliers[`${pos}-${reel}`] = multiplier;
     }

     setDefaultDisplay() {
          // Initialize coin multipliers storage
          this.coinMultipliers = {};

          // Set the default display with J, K, A, 10, Q symbols
          for (let reel = 0; reel < 5; reel++) {
               for (let pos = 0; pos < 3; pos++) {
                    const symbolId = this.defaultSymbols[reel][pos];
                    this.display[pos][reel] = symbolId;

                    const symbolElement = document.getElementById(`symbol-${pos}-${reel}`);
                    symbolElement.textContent = this.getShortSymbolName(symbolId);
                    symbolElement.classList.remove('winning', 'wild', 'scatter', 'bonus-coin', 'spinning', 'bonus-mode');

                    // Add appropriate classes
                    if (symbolId === 0) symbolElement.classList.add('wild');
               }
          }
          this.paylineDisplay.textContent = 'Spin to see winning lines';
     }

     // Handle Spin button click
     async handleSpin() {
          if (this.isSpinning) return;

          // Update bet amount from input
          this.betAmount = parseFloat(this.betInput.value) || 2.0;

          // Check if player has enough balance
          if (this.balance < this.betAmount) {
               this.logMessage("Not enough balance to place this bet!", true);
               return;
          }

          // Deduct bet from balance
          this.balance -= this.betAmount;
          this.updateBalanceDisplay();

          // Disable controls during spin
          this.isSpinning = true;
          this.spinButton.disabled = true;
          this.testSpinButton.disabled = true;
          this.simulateButton.disabled = true;
          this.runDiagButton.disabled = true;
          this.bonusGameButton.disabled = true;
          this.betInput.disabled = true;

          // Clear previous win displays
          this.winDisplay.textContent = 'Spinning...';
          this.paylineDisplay.textContent = 'Spinning reels...';

          // Clear any previous winning highlights
          document.querySelectorAll('.winning').forEach(el => {
               el.classList.remove('winning');
          });

          // Perform the spin animation
          await this.animateSpin();

          // Check if bonus game was triggered
          let scatterCount = 0;
          for (let row = 0; row < 3; row++) {
               for (let reel = 0; reel < 5; reel++) {
                    if (this.display[row][reel] === 11) {
                         scatterCount++;
                    }
               }
          }

          // If bonus game is triggered, wait for it to complete
          if (scatterCount >= 11) {
               this.logMessage(`${scatterCount} Scatter symbols! Bonus game triggered!`, true);

               // Start bonus game and wait for it to complete
               await new Promise(resolve => setTimeout(resolve, 150));
               await this.handleBonusGame();
          }
          else {
               // Check for wins
               const winAmount = this.checkWins(this.betAmount);

               // Update balance and displays
               this.balance += winAmount;
               this.totalWon += winAmount;
               this.updateBalanceDisplay();
               this.winDisplay.textContent = `Win: ${winAmount.toFixed(2)}`;

          }

          // Only re-enable controls after everything is complete
          this.isSpinning = false;
          this.spinButton.disabled = false;
          this.testSpinButton.disabled = false;
          this.simulateButton.disabled = false;
          this.runDiagButton.disabled = false;
          this.bonusGameButton.disabled = false;
          this.betInput.disabled = false;

          return scatterCount >= 11 ? 0 : winAmount;
     }

     // Animate the spin of the reels
     async animateSpin() {
          return new Promise(resolve => {
               // Reset symbol classes
               document.querySelectorAll('.symbol').forEach(symbol => {
                    symbol.className = 'symbol';
                    symbol.textContent = '?';
               });

               // Initialize coin multipliers for this spin
               this.coinMultipliers = {};

               // Random delay for each reel to create a cascading stop effect
               const reelDelays = [100, 200, 300, 400, 500];

               // Spin each reel
               for (let reel = 0; reel < 5; reel++) {
                    setTimeout(() => {
                         // Select a random starting position on this reel
                         const startPos = Math.floor(Math.random() * (this.reels[reel].length));
                         this.currentPositions[reel] = startPos;

                         // Update the 3 visible positions
                         for (let pos = 0; pos < 3; pos++) {
                              const reelPos = (startPos + pos) % this.reels[reel].length;
                              const symbolId = this.reels[reel][reelPos];
                              this.display[pos][reel] = symbolId;

                              // Update the UI
                              const symbolElement = document.getElementById(`symbol-${pos}-${reel}`);

                              // For scatter symbols, generate and store multiplier
                              if (symbolId === 11) {
                                   const multiplier = this.getRandomMultiplier();
                                   const value = this.betAmount * multiplier;

                                   // Store the multiplier for this specific position
                                   this.setCoinMultiplier(pos, reel, multiplier);

                                   symbolElement.textContent = `${this.symbols[11]} x${value.toFixed(2)}`;
                                   symbolElement.classList.add('scatter');
                              } else {
                                   symbolElement.textContent = this.getShortSymbolName(symbolId);
                              }

                              // Add special styling for Wild
                              if (symbolId === 0) symbolElement.classList.add('wild');
                         }

                         // If this is the last reel, resolve the promise
                         if (reel === 4) {
                              setTimeout(resolve, 7);
                         }
                    }, reelDelays[reel]);
               }
          });
     }

     // Handle Random spin simulations
     async handleTestSpin() {
          if (this.isSpinning) return;

          const spins = parseInt(this.testSpinInput.value) || 10;
          if (spins < 1) return;

          this.balance = 1000000; // Reset balance for test spins
          this.logMessage(`Starting ${spins} Test spins with bet ${this.betAmount.toFixed(2)}`);

          // Disable controls during test
          this.isSpinning = true;
          this.spinButton.disabled = true;
          this.testSpinButton.disabled = true;
          this.simulateButton.disabled = true;
          this.runDiagButton.disabled = true;
          this.bonusGameButton.disabled = true;
          this.betInput.disabled = true;

          // Reset RTP tracking for this test session
          this.RTPBet = 0;
          this.RTPWin = 0;

          // Fast test mode without animations
          const startTime = performance.now();
          let totalWon = 0;
          let bonusTriggered = 0;

          // Run test spins in batches to avoid UI freezing
          const batchSize = 10000;
          let remainingSpins = spins;

          const runBatch = () => {
               const batchCount = Math.min(batchSize, remainingSpins);

               for (let i = 0; i < batchCount; i++) {
                    // Update bet tracking
                    this.betAmount = parseFloat(this.betInput.value) || 2.0;
                    this.RTPBet += this.betAmount;

                    // Fast spin without animation
                    this.fastSpin();

                    // Check for bonus game trigger
                    let scatterCounter = 0;
                    for (let row = 0; row < 3; row++) {
                         for (let reel = 0; reel < 5; reel++) {
                              if (this.display[row][reel] === 11) {
                                   scatterCounter++;
                              }
                         }
                    }

                    let winAmount = 0;
                    if (scatterCounter >= 11) {
                         // Bonus game triggered
                         bonusTriggered++;
                         winAmount = this.simulateBonusNoUI(this.betAmount);
                    } else {
                         // Get win amount
                         winAmount = this.checkWinsNoUI(this.betAmount);
                    }

                    totalWon += winAmount;
                    this.RTPWin += winAmount;
               }

               remainingSpins -= batchCount;

               // Update progress display (less frequently)
               if (remainingSpins % 100000 === 0 || remainingSpins === 0) {
                    const progress = spins - remainingSpins;
                    this.winDisplay.textContent = `Progress: ${progress}/${spins} (${Math.round(progress / spins * 100)}%)`;
               }

               if (remainingSpins > 0) {
                    // Use setTimeout to allow UI to update and prevent browser hanging
                    setTimeout(runBatch, 0);
               } else {
                    // Test complete
                    const endTime = performance.now();
                    const duration = ((endTime - startTime) / 1000).toFixed(2);

                    this.RTP = (this.RTPWin / this.RTPBet) * 100;

                    this.logMessage(`Test completed in ${duration} seconds.`, false);
                    this.logMessage(`RTP: ${this.RTP.toFixed(2)}%`, false);
                    this.logMessage(`Total Won: ${this.RTPWin.toFixed(2)}`, false);
                    this.logMessage(`Total Bet: ${this.RTPBet.toFixed(2)}`, false);
                    this.logMessage(`Bonus Game Triggered: ${bonusTriggered} times`, false);

                    // Re-enable controls
                    this.isSpinning = false;
                    this.spinButton.disabled = false;
                    this.testSpinButton.disabled = false;
                    this.simulateButton.disabled = false;
                    this.runDiagButton.disabled = false;
                    this.bonusGameButton.disabled = false;
                    this.betInput.disabled = false;

                    // Reset UI to default view
                    this.setDefaultDisplay();
               }
          };

          // Start the batch process
          runBatch();
     }


     // Fast spin method that skips animations
     fastSpin() {
          // Initialize coin multipliers for this spin
          this.coinMultipliers = {};

          // Generate new random results
          for (let reel = 0; reel < 5; reel++) {
               // Select a random starting position on this reel
               const startPos = Math.floor(Math.random() * this.reels[reel].length);

               // Update the 3 visible positions
               for (let pos = 0; pos < 3; pos++) {
                    const reelPos = (startPos + pos) % this.reels[reel].length;
                    const symbolId = this.reels[reel][reelPos];
                    this.display[pos][reel] = symbolId;

                    // Generate and store multiplier for coins
                    if (symbolId === 11) {
                         const multiplier = this.getRandomMultiplier();
                         this.setCoinMultiplier(pos, reel, multiplier);
                    }
               }
          }
     }

     checkWins(betAmount = 2.0) {
          let totalWin = 0;
          let winningLines = [];

          // Count scatter symbols
          let scatterCount = 0;
          let scatterPositions = [];

          for (let row = 0; row < 3; row++) {
               for (let reel = 0; reel < 5; reel++) {
                    if (this.display[row][reel] === 11) {
                         scatterCount++;
                         scatterPositions.push([row, reel]);
                    }
               }
          }

          // Check each payline
          for (let lineNum = 0; lineNum < this.paylines.length; lineNum++) {
               const payline = this.paylines[lineNum];
               let symbolsInLine = [];
               let positions = [];

               // Get the symbols on this payline
               for (let reel = 0; reel < 5; reel++) {
                    const pos = payline[reel];
                    const symbol = this.display[pos][reel];
                    symbolsInLine.push(symbol);
                    positions.push([pos, reel]);
               }

               // Check for wild substitutions and winning combinations
               const winAmount = this.calculateLineWin(symbolsInLine, betAmount);

               if (winAmount > 0) {
                    winningLines.push({
                         lineNum: lineNum + 1,
                         amount: winAmount,
                         positions: positions
                    });
                    totalWin += winAmount;
               }
          }

          // Display results and highlight winning symbols
          if (winningLines.length > 0) {
               let paylineText = 'Winning Lines:<br>';

               for (const { lineNum, amount, positions } of winningLines) {
                    paylineText += `Line ${lineNum}: ${amount.toFixed(2)}<br>`;

                    // Highlight the winning symbols on this line
                    for (const [row, col] of positions) {
                         document.getElementById(`symbol-${row}-${col}`).classList.add('winning');
                    }
               }

               this.paylineDisplay.innerHTML = paylineText;
               this.logMessage(`Total Win: ${totalWin.toFixed(2)}`, true);
          } else {
               this.paylineDisplay.textContent = 'No winning lines';
               this.logMessage(`No win`, false);
          }

          return totalWin;
     }

     // Check wins without updating UI
     checkWinsNoUI(betAmount = 1.0) {
          let totalWin = 0;

          // Reuse these arrays
          const symbolsInLine = new Array(5);

          // Check each payline
          for (let lineNum = 0; lineNum < this.paylines.length; lineNum++) {
               const payline = this.paylines[lineNum];

               // Get the symbols on this payline
               for (let reel = 0; reel < 5; reel++) {
                    const pos = payline[reel];
                    symbolsInLine[reel] = this.display[pos][reel];
               }

               // Calculate win without UI updates
               const winAmount = this.calculateLineWin(symbolsInLine, betAmount);
               totalWin += winAmount;
          }

          return totalWin;
     }

     calculateLineWin(symbols, betAmount = 1.0) {
          if (symbols.includes(0)) {
               // Try each possible symbol as a substitution for wilds
               let bestWin = 0;

               // For each non-scatter symbol
               for (let potentialSymbol = 0; potentialSymbol <= 10; potentialSymbol++) {
                    // Skip wild as substitution for itself
                    if (potentialSymbol === 0) continue;

                    // Create a new array replacing wilds with this symbol
                    const substituted = symbols.map(s => s === 0 ? potentialSymbol : s);

                    // Check for consecutive matches from left
                    const firstSymbol = substituted[0];
                    if (firstSymbol === 11) continue;

                    let count = 1;
                    for (let i = 1; i < substituted.length; i++) {
                         if (substituted[i] === firstSymbol) {
                              count++;
                         } else {
                              break;
                         }
                    }

                    // Calculate win with this substitution
                    if (count >= 3) {
                         const multiplierIndex = count - 3;
                         if (multiplierIndex < this.paytable[firstSymbol].length) {
                              const win = betAmount * this.paytable[firstSymbol][multiplierIndex];
                              bestWin = Math.max(bestWin, win);
                         }
                    }
               }

               return bestWin;
          } else {
               // No wild symbols - check for consecutive matches from left
               const firstSymbol = symbols[0];
               if (firstSymbol === 11) return 0;  // Scatter doesn't pay on lines

               let count = 1;
               for (let i = 1; i < symbols.length; i++) {
                    if (symbols[i] === firstSymbol) {
                         count++;
                    } else {
                         break;
                    }
               }

               // Check if count qualifies for a win
               if (count >= 3) {
                    const multiplierIndex = count - 3;
                    if (multiplierIndex < this.paytable[firstSymbol].length) {
                         return betAmount * this.paytable[firstSymbol][multiplierIndex];
                    }
               }
          }

          return 0;
     }

     // Run diagnostic tests to validate game mechanics
     runDiagnosticTest() {
          this.logMessage("Running diagnostic tests...");

          if (this.isSpinning) return;

          // Disable controls during test
          this.isSpinning = true;
          this.spinButton.disabled = true;
          this.testSpinButton.disabled = true;
          this.simulateButton.disabled = true;
          this.runDiagButton.disabled = true;
          this.bonusGameButton.disabled = true;
          this.betInput.disabled = true;

          // Analyze reel strips
          this.analyzeReelStrips();

          // Validate random number generation
          this.validateRandomGeneration();

          // Test payline processing
          this.verifyPaylines();

          // Run a controlled test with detailed logging
          this.logMessage("Running 1,000,000 test spins with detailed analysis...");

          let totalBet = 0;
          let totalWin = 0;
          let bonusTriggered = 0;
          const winsBySymbol = Array(12).fill(0);

          for (let i = 0; i < 1000000; i++) {
               this.betAmount = parseFloat(this.betInput.value);
               const bet = this.betAmount;
               totalBet += bet;

               // Generate spin result
               this.fastSpin();

               // Check for bonus game trigger
               let scatterCount = 0;
               for (let row = 0; row < 3; row++) {
                    for (let reel = 0; reel < 5; reel++) {
                         if (this.display[row][reel] === 11) {
                              scatterCount++;
                         }
                    }
               }

               let winAmount = 0;
               if (scatterCount >= 11) {
                    // Bonus game triggered
                    bonusTriggered++;
                    winAmount = this.simulateBonusNoUI(this.betAmount);
               } else {
                    // Get win amount
                    winAmount = this.checkWinsNoUI(this.betAmount);

                    if (winAmount > 0) {
                         // Track wins by symbol
                         for (let sym = 0; sym < 12; sym++) {
                              if (this.display[0][0] === sym || this.display[1][0] === sym || this.display[2][0] === sym) {
                                   winsBySymbol[sym]++;
                              }
                         }
                    }
               }

               totalWin += winAmount;
          }

          // Output detailed results
          this.logMessage(`Diagnostic test completed.`);
          this.logMessage(`Total bet: ${totalBet.toFixed(2)}`);
          this.logMessage(`Total win: ${totalWin.toFixed(2)}`);
          this.logMessage(`RTP: ${(totalWin / totalBet * 100).toFixed(2)}%`);
          this.logMessage(`Bonus Game Triggered: ${bonusTriggered} times`);

          // Output wins by symbol
          console.log("Wins by symbol:");
          for (let sym = 0; sym < 11; sym++) {
               if (winsBySymbol[sym] > 0) {
                    console.log(`${this.symbols[sym]}: ${winsBySymbol[sym]} wins`);
               }
          }

          // Re-enable controls
          this.isSpinning = false;
          this.spinButton.disabled = false;
          this.testSpinButton.disabled = false;
          this.simulateButton.disabled = false;
          this.runDiagButton.disabled = false;
          this.bonusGameButton.disabled = false;
          this.betInput.disabled = false;

          this.winDisplay.textContent = 'Diagnostic test done.';
          this.paylineDisplay.textContent = `Diagnostic test has completed.`;
     }
     validateRandomGeneration() {
          // Count occurrences of each symbol on each reel
          const counts = Array(5).fill().map(() => Array(12).fill(0));
          const sampleSize = 100000;

          for (let spin = 0; spin < sampleSize; spin++) {
               for (let reel = 0; reel < 5; reel++) {
                    // Select a random starting position on this reel
                    const startPos = Math.floor(Math.random() * this.reels[reel].length);
                    const symbolId = this.reels[reel][startPos];
                    counts[reel][symbolId]++;
               }
          }

          // Output distribution stats
          console.log("Symbol distribution on each reel (% chance):");
          for (let reel = 0; reel < 5; reel++) {
               console.log(`Reel ${reel + 1}:`);
               for (let sym = 0; sym < 12; sym++) {
                    const percentage = (counts[reel][sym] / sampleSize * 100).toFixed(2);
                    console.log(`  ${this.symbols[sym]}: ${percentage}%`);
               }
          }
     }

     verifyPaylines() {
          // Test with a grid full of the same symbol
          const testSymbol = 1; // Totem

          // Fill display with test symbol
          for (let row = 0; row < 3; row++) {
               for (let col = 0; col < 5; col++) {
                    this.display[row][col] = testSymbol;
               }
          }

          // Check each payline
          console.log("Payline verification:");
          for (let lineNum = 0; lineNum < this.paylines.length; lineNum++) {
               const payline = this.paylines[lineNum];
               const symbols = [];

               // Get symbols on this payline
               for (let reel = 0; reel < 5; reel++) {
                    const row = payline[reel];
                    symbols.push(this.display[row][reel]);
               }

               const win = this.calculateLineWin(symbols, 1.0);
               console.log(`Payline ${lineNum + 1}: ${symbols.join(',')} => Win: ${win}`);
          }
     }

     analyzeReelStrips() {
          // Count each symbol on each reel
          const symbolCounts = Array(5).fill().map(() => Array(12).fill(0));
          const reelLengths = [];

          for (let reel = 0; reel < 5; reel++) {
               reelLengths.push(this.reels[reel].length);

               for (let pos = 0; pos < this.reels[reel].length; pos++) {
                    const symbol = this.reels[reel][pos];
                    symbolCounts[reel][symbol]++;
               }
          }

          console.log("Reel strip analysis:");
          console.log("Reel lengths:", reelLengths);

          for (let sym = 0; sym < 12; sym++) {
               const counts = symbolCounts.map(reel => reel[sym]);
               const percentages = counts.map((count, idx) =>
                    (count / reelLengths[idx] * 100).toFixed(2) + '%');

               console.log(`${this.symbols[sym]}: ${counts.join(', ')} (${percentages.join(', ')})`);
          }
     }


     // Run simulation test for all combinations
     runSimulateTest() {
          this.logMessage("Running simulation test for all combinations...");
          this.paylineDisplay.textContent = 'Simulation every possible combination in progress...';
          if (this.isSpinning) return;

          this.balance = 1000000;

          // Disable controls during test
          this.isSpinning = true;
          this.spinButton.disabled = true;
          this.testSpinButton.disabled = true;
          this.simulateButton.disabled = true;
          this.runDiagButton.disabled = true;
          this.bonusGameButton.disabled = true;
          this.betInput.disabled = true;

          // Reset RTP tracking for this test session
          this.RTPBet = 0;
          this.RTPWin = 0;

          // Starting positions for each reel
          const positions = [0, 0, 0, 0, 0];
          const reelLengths = this.reels.map(reel => reel.length);
          let combinationsCount = 0;
          let winningCombinations = 0;
          let bonusTriggered = 0;

          // Process combinations in batches to prevent UI freezing
          const processBatch = () => {
               const batchSize = 1000;
               let batchCount = 0;

               while (batchCount < batchSize) {
                    // Set the display based on current positions
                    for (let reel = 0; reel < 5; reel++) {
                         for (let pos = 0; pos < 3; pos++) {
                              const reelPos = (positions[reel] + pos) % reelLengths[reel];
                              const symbolId = this.reels[reel][reelPos];
                              this.display[pos][reel] = this.reels[reel][reelPos];

                              if (symbolId === 11) {
                                   const multiplier = this.getRandomMultiplier();
                                   this.setCoinMultiplier(pos, reel, multiplier);
                              }
                         }
                    }

                    // Check for bonus game trigger
                    let scatterCount = 0;
                    for (let row = 0; row < 3; row++) {
                         for (let reel = 0; reel < 5; reel++) {
                              if (this.display[row][reel] === 11) {
                                   scatterCount++;
                              }
                         }
                    }

                    // Check for wins
                    const betAmount = parseFloat(this.betInput.value) || 2.0;
                    this.RTPBet += betAmount;

                    let winAmount = 0;
                    if (scatterCount >= 11) {
                         // Bonus game triggered
                         bonusTriggered++;
                         winAmount = this.simulateBonusNoUI(betAmount);
                    } else {
                         // Get win amount
                         winAmount = this.checkWinsNoUI(betAmount);
                    }

                    this.RTPWin += winAmount;

                    if (winAmount > 0) {
                         winningCombinations++;
                    }

                    combinationsCount++;

                    // Move to next combination - start with rightmost reel
                    positions[4]++;
                    // If we've gone through all positions on a reel, reset it and increment the next reel
                    for (let r = 4; r > 0; r--) {
                         if (positions[r] >= reelLengths[r]) {
                              positions[r] = 0;
                              positions[r - 1]++;
                         }
                    }

                    // If we've gone through all positions on the first reel, we're done
                    if (positions[0] >= reelLengths[0]) {
                         break;
                    }

                    batchCount++;
               }

               // Update progress display
               this.winDisplay.textContent = `Combinations tested: ${combinationsCount}`;


               // If we're not done, schedule the next batch
               if (positions[0] < reelLengths[0]) {
                    setTimeout(processBatch, 0);
               } else {
                    // Test complete
                    const RTP = (this.RTPWin / this.RTPBet) * 100;

                    this.logMessage(`Simulation completed.`, false);
                    this.logMessage(`Total combinations tested: ${combinationsCount}`, false);
                    this.logMessage(`Winning combinations: ${winningCombinations} (${(winningCombinations / combinationsCount * 100).toFixed(2)}%)`, false);
                    this.logMessage(`Bonus Game Triggered: ${bonusTriggered} times`, false);
                    this.logMessage(`RTP: ${RTP.toFixed(2)}%`, false);
                    this.logMessage(`Total Won: ${this.RTPWin.toFixed(2)}`, false);
                    this.logMessage(`Total Bet: ${this.RTPBet.toFixed(2)}`, false);

                    // Re-enable controls
                    this.isSpinning = false;
                    this.spinButton.disabled = false;
                    this.testSpinButton.disabled = false;
                    this.simulateButton.disabled = false;
                    this.runDiagButton.disabled = false;
                    this.bonusGameButton.disabled = false;
                    this.betInput.disabled = false;

                    // Reset UI to default view
                    this.setDefaultDisplay();
               }
          };

          // Start the batch process
          processBatch();
     }

     updateBalanceDisplay() {
          this.balanceDisplay.textContent = `Balance: ${this.balance.toFixed(2)}`;
     }

     logMessage(message, isWin = false) {
          const entry = document.createElement('div');
          entry.className = 'log-entry' + (isWin ? ' win-log' : '');
          entry.textContent = message;

          // Add to log and scroll to bottom
          this.log.appendChild(entry);
          this.log.scrollTop = this.log.scrollHeight;

          // Limit log entries
          while (this.log.children.length > 50) {
               this.log.removeChild(this.log.firstChild);
          }
     }

     async handleBonusGame() {
          // Enter bonus game
          this.inBonusGame = true;
          this.bonusFreeSpins = 3;
          this.betAmount = parseFloat(this.betInput.value) || 2.0;

          // Change UI to purple
          document.body.classList.add('bonus-mode');
          this.container.classList.add('bonus-mode');

          // Show coins instead of numbers
          const getCoinEmojis = (spins) => {
               return '🪙'.repeat(spins);
          }

          // Display bonus game message
          this.winDisplay.textContent = `BONUS GAME! ${getCoinEmojis(this.bonusFreeSpins)}`;
          this.paylineDisplay.textContent = 'BONUS GAME IN PROGRESS...';
          this.logMessage("🎉 BONUS GAME ACTIVATED! 🎉", true);

          // Track coins already on the table
          this.bonusCoins = [];
          for (let row = 0; row < 3; row++) {
               for (let reel = 0; reel < 5; reel++) {
                    if (this.display[row][reel] === 11) {
                         // Use the already stored multiplier instead of generating a new one
                         const existingMultiplier = this.getCoinMultiplier(row, reel);
                         this.bonusCoins.push({
                              row,
                              reel,
                              multiplier: existingMultiplier
                         });
                    }
               }
          }

          // Update UI to show existing coins with correct multipliers
          this.updateDisplayUI();

          // Bonus game loop
          while (this.bonusFreeSpins > 0 && this.bonusCoins.length < 15) {
               await this.bonusSpin();
               this.bonusFreeSpins--;

               // Update display
               this.winDisplay.textContent = `BONUS GAME! ${getCoinEmojis(this.bonusFreeSpins)}`;

               // Small delay between spins
               await new Promise(resolve => setTimeout(resolve, 1000));
          }

          // Calculate total win
          let totalBonusWin = 0;
          for (const coin of this.bonusCoins) {
               totalBonusWin += this.betAmount * coin.multiplier;
          }

          // Add Grand Jackpot if all positions filled
          if (this.bonusCoins.length === 15) {
               totalBonusWin += this.betAmount * this.GrandJackpot;
               this.logMessage(`🏆 GRAND JACKPOT! +${(this.betAmount * this.GrandJackpot).toFixed(2)}`, true);
          }

          // Update balance and display
          this.balance += totalBonusWin;
          this.totalWon += totalBonusWin;
          this.updateBalanceDisplay();
          this.winDisplay.textContent = `Bonus Win: ${totalBonusWin.toFixed(2)}`;
          this.paylineDisplay.textContent = `Bonus game completed! Win: ${totalBonusWin.toFixed(2)}`;
          this.logMessage(`Bonus Game Ended! Total Win: ${totalBonusWin.toFixed(2)}`, true);

          // Reset bonus game state
          this.inBonusGame = false;
          document.body.classList.remove('bonus-mode');
          this.container.classList.remove('bonus-mode');

          return totalBonusWin;
     }

     async bonusSpin() {

          // Update bet amount from input
          this.betAmount = parseFloat(this.betInput.value) || 2.0;

          // Find empty positions
          const emptyPositions = [];
          for (let row = 0; row < 3; row++) {
               for (let reel = 0; reel < 5; reel++) {
                    // Check if position doesn't have a coin
                    if (!this.bonusCoins.some(coin => coin.row === row && coin.reel === reel)) {
                         emptyPositions.push({ row, reel });
                    }
               }
          }

          // Reset all empty positions to show spinning animation
          for (const pos of emptyPositions) {
               const symbolElement = document.getElementById(`symbol-${pos.row}-${pos.reel}`);
               if (symbolElement) {
                    symbolElement.textContent = '?';
                    symbolElement.className = 'symbol spinning';
               }
          }

          // Short delay to show spinning animation
          await new Promise(resolve => setTimeout(resolve, 1200));

          // Randomly select positions that will get coins based on probability
          const newCoins = [];
          for (const pos of emptyPositions) {
               // Get probability based on current coin count
               const probability = this.scatterProbability[this.bonusCoins.length + newCoins.length + 1] || 0.01;

               if (Math.random() < probability) {
                    const multiplier = this.getRandomMultiplier();

                    // Store the multiplier for this position
                    this.setCoinMultiplier(pos.row, pos.reel, multiplier);

                    newCoins.push({
                         row: pos.row,
                         reel: pos.reel,
                         multiplier: multiplier
                    });

                    // If we got a new coin, reset free spins
                    this.bonusFreeSpins = 4;
                    this.logMessage(`New coin found! Free spins reset to 3`, false);
               }
          }

          // Add new coins to the bonus coins array
          this.bonusCoins.push(...newCoins);

          // Update display to show coins
          for (const coin of this.bonusCoins) {
               const symbolElement = document.getElementById(`symbol-${coin.row}-${coin.reel}`);
               const value = coin.multiplier * this.betAmount;
               symbolElement.textContent = `${this.symbols[11]} x${value.toFixed(2)}`;
               symbolElement.classList.add('scatter', 'bonus-coin');
          }

          // Clear empty positions that didn't get coins
          for (const pos of emptyPositions) {
               if (!newCoins.some(coin => coin.row === pos.row && coin.reel === pos.reel)) {
                    const symbolElement = document.getElementById(`symbol-${pos.row}-${pos.reel}`);
                    if (symbolElement) {
                         symbolElement.textContent = '❌';
                         symbolElement.className = 'symbol';
                    }
               }
          }

          return newCoins.length > 0;
     }

     getRandomMultiplier() {
          const rand = Math.random();
          let cumulativeProbability = 0;

          for (const [multiplier, probability] of Object.entries(this.scatterMultiplierChance)) {
               cumulativeProbability += probability;
               if (rand < cumulativeProbability) {
                    return parseFloat(multiplier);
               }
          }

          // Default to lowest multiplier if something goes wrong
          return 1;
     }

     // Simulate bonus game with UI updates
     async simulateBonusGame() {
          if (this.isSpinning) return;

          // Get number of bonus games to simulate test spin input
          const bonusGames = parseInt(this.testSpinInput.value) || 10;
          if (bonusGames < 1) return;

          this.logMessage(`Starting ${bonusGames} Bonus Games Simulations`);

          // Disable controls during bonus game
          this.isSpinning = true;
          this.spinButton.disabled = true;
          this.testSpinButton.disabled = true;
          this.simulateButton.disabled = true;
          this.runDiagButton.disabled = true;
          this.bonusGameButton.disabled = true;
          this.betInput.disabled = true;

          // Clear previous win displays
          this.winDisplay.textContent = 'Starting Bonus Game...';
          this.paylineDisplay.textContent = 'Simulating Bonus Game...';

          // Clear any previous winning highlights
          document.querySelectorAll('.winning').forEach(el => {
               el.classList.remove('winning');
          });

          // Generate random scatter positions (11-14 scatters)
          const scatterCount = Math.floor(Math.random() * 4) + 11;
          const scatterPositions = [];

          // Reset display first
          this.setDefaultDisplay();

          // Initialize bet amount
          this.betAmount = parseFloat(this.betInput.value) || 2.0;

          // Place scatters randomly with multipliers
          for (let i = 0; i < scatterCount; i++) {
               let row, reel;
               do {
                    row = Math.floor(Math.random() * 3);
                    reel = Math.floor(Math.random() * 5);
               } while (this.display[row][reel] === 11);

               this.display[row][reel] = 11;

               // Generate and store multiplier for this coin
               const multiplier = this.getRandomMultiplier();
               this.setCoinMultiplier(row, reel, multiplier);

               scatterPositions.push([row, reel]);
          }

          // Update UI to show initial scatters
          this.updateDisplayUI();

          // Highlight scatter symbols
          for (const [row, col] of scatterPositions) {
               const symbolElement = document.getElementById(`symbol-${row}-${col}`);
               if (symbolElement) {
                    symbolElement.classList.add('scatter', 'bonus-coin');
               }
          }

          this.logMessage(`${scatterCount} Scatter symbols! Bonus game triggered!`, true);

          // Start bonus game after a short delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          const bonusWin = await this.handleBonusGame();

          // Re-enable controls
          this.isSpinning = false;
          this.spinButton.disabled = false;
          this.testSpinButton.disabled = false;
          this.simulateButton.disabled = false;
          this.runDiagButton.disabled = false;
          this.bonusGameButton.disabled = false;
          this.betInput.disabled = false;

          return bonusWin;
     }

     // Simulate bonus game without UI updates
     simulateBonusNoUI(betAmount = 2.0) {
          // Count the number of coins
          let coinCount = 0;
          const coins = [];

          for (let row = 0; row < 3; row++) {
               for (let reel = 0; reel < 5; reel++) {
                    if (this.display[row][reel] === 11) {
                         const multiplier = this.getCoinMultiplier(row, reel);
                         coins.push({ multiplier: multiplier });
                         coinCount++;
                    }
               }
          }

          //Simulate bonus spins
          let bonusFreeSpins = 3;
          while (bonusFreeSpins > 0 && coinCount < 15) {
               const emptyPositions = 15 - coinCount;
               let newCoins = 0;

               for (let i = 0; i < emptyPositions; i++) {
                    const probability = this.scatterProbability[coinCount + newCoins + 1] || 0.01;
                    if (Math.random() < probability) {
                         const multiplier = this.getRandomMultiplier();
                         coins.push({ multiplier: multiplier });
                         newCoins++;
                         bonusFreeSpins = 3;
                    }
               }

               coinCount += newCoins;
               if (newCoins === 0) {
                    bonusFreeSpins--;
               }
          }

          // Calculate total win
          let totalWin = 0;
          for (const coin of coins) {
               totalWin += betAmount * coin.multiplier;
          }

          if (coinCount === 15) {
               totalWin += betAmount * this.GrandJackpot;
          }

          return totalWin;
     }

     // Make sure this method exists to update the UI
     updateDisplayUI() {
          for (let row = 0; row < 3; row++) {
               for (let reel = 0; reel < 5; reel++) {
                    const symbolId = this.display[row][reel];
                    const symbolElement = document.getElementById(`symbol-${row}-${reel}`);

                    if (symbolElement) {
                         // Handle coins with their stored multipliers
                         if (symbolId === 11) {
                              const multiplier = this.getCoinMultiplier(row, reel);
                              const value = this.betAmount * multiplier;
                              symbolElement.textContent = `${this.symbols[11]} x${value.toFixed(2)}`;
                         } else {
                              symbolElement.textContent = this.getShortSymbolName(symbolId);
                         }

                         // Reset classes
                         symbolElement.className = 'symbol';

                         // Add special styling
                         if (symbolId === 0) symbolElement.classList.add('wild');
                         if (symbolId === 11) symbolElement.classList.add('scatter', 'bonus-coin');
                    }
               }
          }
     }
}

// Initialize the game when page loads
export default MayanSlotGame;
