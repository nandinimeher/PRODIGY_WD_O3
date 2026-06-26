// Screen Elements
const startScreen = document.getElementById('start-screen');
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');

// Buttons & Controls
const initBtn = document.getElementById('init-btn');
const playBtn = document.getElementById('play-btn');
const resetBtn = document.getElementById('reset-btn');
const backBtn = document.getElementById('back-btn');
const modeComp = document.getElementById('mode-comp');
const modeP2 = document.getElementById('mode-p2');

// Game Config Inputs
const p1TokenSelect = document.getElementById('p1-token');
const p2TokenSelect = document.getElementById('p2-token');
const themeSelect = document.getElementById('theme-select');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const board = document.querySelector('.board');

// Game State Variables
let isVsComputer = true;
let p1Token = '🔴';
let p2Token = '🔵';
let currentPlayer = 'p1'; // 'p1' or 'p2'
let gameState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// --- Navigation Flows ---
initBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
});

modeComp.addEventListener('click', () => { modeComp.classList.add('active'); modeP2.classList.remove('active'); isVsComputer = true; });
modeP2.addEventListener('click', () => { modeP2.classList.add('active'); modeComp.classList.remove('active'); isVsComputer = false; });

themeSelect.addEventListener('change', (e) => {
    document.body.className = ''; // Reset class
    document.body.classList.add(e.target.value);
});

playBtn.addEventListener('click', () => {
    p1Token = p1TokenSelect.value;
    p2Token = p2TokenSelect.value;
    
    if(p1Token === p2Token) {
        alert("Bhai, dono players ka token same nahi ho sakta! Alag alag choose karo.");
        return;
    }

    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    resetGame();
});

backBtn.addEventListener('click', () => {
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});

// --- Core Game Logic ---
function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Block clicks if cell is filled, game is over, or if it's the computer's turn to think
    if (gameState[clickedCellIndex] !== "" || !isGameActive || (currentPlayer === 'p2' && isVsComputer)) {
        return;
    }

    // Determine the active player's token dynamically
    const currentToken = currentPlayer === 'p1' ? p1Token : p2Token;
    makeMove(clickedCellIndex, currentToken);

    // Only trigger the computer if vsComputer mode is active and it is now Player 2's turn
    if (isGameActive && isVsComputer && currentPlayer === 'p2') {
        setTimeout(computerMove, 500); // Computer takes a brief moment to "think"
    }
}

function makeMove(index, token) {
    gameState[index] = token;
    cells[index].textContent = token;
    
    if (checkResult(token)) return;

    // Switch turns seamlessly
    currentPlayer = currentPlayer === 'p1' ? 'p2' : 'p1';
    statusText.textContent = currentPlayer === 'p1' ? "Player 1's turn" : (isVsComputer ? "🤖 Computer is thinking..." : "Player 2's turn");
}

function computerMove() {
    if (!isGameActive) return;

    // Find available spaces
    let emptyCells = [];
    gameState.forEach((val, idx) => { if(val === "") emptyCells.push(idx); });

    if(emptyCells.length > 0) {
        // Random AI Move
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex, p2Token);
    }
}

function checkResult(token) {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === token && gameState[b] === token && gameState[c] === token) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        const winnerName = token === p1Token ? "Player 1" : (isVsComputer ? "Computer 🤖" : "Player 2");
        statusText.textContent = `${winnerName} Wins! 🎉`;
        isGameActive = false;
        return true;
    }

    if (!gameState.includes("")) {
        statusText.textContent = "It's a Draw! 👔";
        isGameActive = false;
        return true;
    }
    return false;
}

function resetGame() {
    currentPlayer = 'p1';
    gameState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    statusText.textContent = "Player 1's turn";
    cells.forEach(cell => cell.textContent = "");
}

// Event Listeners for Game
board.addEventListener('click', (e) => {
    if(e.target.classList.contains('cell')) handleCellClick(e);
});
resetBtn.addEventListener('click', resetGame);