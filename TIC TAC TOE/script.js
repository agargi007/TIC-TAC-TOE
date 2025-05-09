// Get game mode from URL
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || '2p'; // default to 2 players

const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('gameStatus');
const restartBtn = document.getElementById('restartButton');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;

// Winning combinations
const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

    if (board[cellIndex] !== "" || !isGameActive) {
        return;
    }

    makeMove(cellIndex, currentPlayer);

    if (mode === "cpu" && isGameActive && currentPlayer === "O") {
        setTimeout(computerMove, 500); // small delay for realism
    }
}

function makeMove(cellIndex, player) {
    board[cellIndex] = player;
    cells[cellIndex].textContent = player;

    if (checkWin()) {
        statusText.textContent = `Player ${player} wins!`;
        isGameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a Draw!";
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (mode === "cpu") {
        statusText.textContent = currentPlayer === "X" ? "Your turn" : "Computer's turn";
    } else {
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWin() {
    return winConditions.some(condition => {
        const [a, b, c] = condition;
        return (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        );
    });
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    statusText.textContent = mode === "cpu" ? "Your turn" : `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
}

// Basic AI: Random move
function computerMove() {
    if (!isGameActive) return;
    // Find all empty cells
    const emptyIndices = board.map((val, idx) => val === "" ? idx : null).filter(idx => idx !== null);
    if (emptyIndices.length === 0) return;
    // Pick random empty cell
    const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    makeMove(move, "O");
}

// Event Listeners
if (cells.length > 0) {
    cells.forEach(cell => cell.addEventListener('click', function(e) {
        if (mode === "cpu" && currentPlayer === "O") return; // prevent user playing as O in cpu mode
        handleCellClick(e);
    }));
}
if (restartBtn) restartBtn.addEventListener('click', restartGame);

// Set initial status text
if (statusText) {
    if (mode === "cpu") {
        statusText.textContent = "Your turn";
    } else {
        statusText.textContent = "Player X's turn";
    }
}
