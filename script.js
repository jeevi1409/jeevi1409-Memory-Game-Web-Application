// Game Variables
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let score = 0;
let timer = 0;
let timerInterval;
let bestTime = localStorage.getItem('bestTime') || null;

// Card Symbols
const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🥝', '🍋', '🍑'];

// Create and Shuffle Cards
function initGame() {
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = '';
  cards = [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => createCard(symbol, index));
  cards.forEach(card => gameBoard.appendChild(card));
  resetStats();
}

// Create a Card Element
function createCard(symbol, index) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.symbol = symbol;
  card.dataset.index = index;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back">${symbol}</div>
    </div>
  `;

  card.addEventListener('click', () => flipCard(card));
  return card;
}

// Flip a Card
function flipCard(card) {
  if (flippedCards.length >= 2 || card.classList.contains('flip')) return;

  card.classList.add('flip');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// Check if Cards Match
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.symbol === card2.dataset.symbol) {
    score++;
    matchedCount += 2;
    flippedCards = [];

    // Check for Game Win
    if (matchedCount === cards.length) {
      clearInterval(timerInterval);
      const timeTaken = timer;
      if (!bestTime || timeTaken < bestTime) {
        bestTime = timeTaken;
        localStorage.setItem('bestTime', bestTime);
      }
      showGameFinishOverlay(score, timeTaken, bestTime);
      showGlitters();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flip');
      card2.classList.remove('flip');
      flippedCards = [];
    }, 1000);
  }
  document.getElementById('score').textContent = score;
}

// Timer
function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  document.getElementById('time').textContent = timer;

  timerInterval = setInterval(() => {
    timer++;
    document.getElementById('time').textContent = timer;
  }, 1000);
}

// Reset Game Stats
function resetStats() {
  flippedCards = [];
  matchedCount = 0;
  score = 0;
  document.getElementById('score').textContent = score;
  startTimer();
}

// Show Full-Screen Overlay
function showGameFinishOverlay(score, timeTaken, bestTime) {
  const overlay = document.createElement('div');
  overlay.className = 'game-finish-overlay';

  overlay.innerHTML = `
    <div class="game-finish-content">
      <h1>🎉 Game Finished! 🎉</h1>
      <p>Time Taken: <strong>${timeTaken}s</strong></p>
      <p>Score: <strong>${score}</strong></p>
      <p>${bestTime === timeTaken ? '🏆 New Best Time!' : `Best Time: <strong>${bestTime}s</strong>`}</p>
      <button id="restart-btn">Restart Game</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('restart-btn').addEventListener('click', () => {
    overlay.remove();
    initGame();
  });
}

// Show Glitters
function showGlitters() {
  const glitterContainer = document.createElement('div');
  glitterContainer.className = 'glitters';
  document.body.appendChild(glitterContainer);

  for (let i = 0; i < 50; i++) {
    const glitter = document.createElement('div');
    glitter.className = 'glitter';
    glitter.style.left = Math.random() * 100 + '%';
    glitter.style.top = Math.random() * 100 + '%';
    glitterContainer.appendChild(glitter);
  }

  setTimeout(() => glitterContainer.remove(), 3000);
}

// Restart Game
document.getElementById('restart').addEventListener('click', initGame);

// Initialize Game on Page Load
window.addEventListener('load', initGame);

// Glitter CSS
const style = document.createElement('style');
style.textContent = `
.game-finish-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1000;
}
.game-finish-content {
  text-align: center;
}
.game-finish-content h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}
.game-finish-content p {
  font-size: 1.5rem;
  margin: 10px 0;
}
.game-finish-content button {
  padding: 10px 20px;
  font-size: 1.2rem;
  margin-top: 20px;
  cursor: pointer;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.game-finish-content button:hover {
  background-color: #e68900;
}
.glitters {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}
.glitter {
  position: absolute;
  width: 10px;
  height: 10px;
  background: radial-gradient(circle, #ff0, #f80);
  border-radius: 50%;
  animation: glitter-animation 1.5s ease-out infinite;
}
@keyframes glitter-animation {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}
`;
document.head.appendChild(style);
