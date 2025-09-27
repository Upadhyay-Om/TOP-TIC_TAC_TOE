// Game Board Controller Single instance using IIFE
const Gameboard = (() => {
    let  board  = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const setMark = (index,marker) => {
        if (board[index] === ""){
            board[index] = marker;
            return true;
        }
        return false;
    };
    const resetBoard = () => {
        for (let i=0;i< board.length;i++){
            board[i] = "";
        }
    };
    const isFull = () => !board.includes("");

    return {
        getBoard,
        setMark,
        resetBoard,
        isFull
    }

})();
// Player Factory
const Player = (name,marker) => {
    return {name,marker};
};
const GameController = (() => {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ]
    let running = false;
    let player1 = Player("Player 1","X")
    let player2 = Player("Player 2","O")
    let currentPlayer = player1;
    
    const getCurrentPlayer = () => currentPlayer;
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
    const checkWinner = () => {
        const board = Gameboard.getBoard();
        for (let condition of winConditions){
            const[a,b,c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]){
                return currentPlayer;
            }
        }
        if (Gameboard.isFull()){
            return "tie"
        }
        return null;
    };
    const playRound = (index) => {
        if (!running) return null;
        if (Gameboard.setMark(index, currentPlayer.marker)) {
            const result = checkWinner();
            
            if (result) {
                running = false;
                return result;
            } else {
                switchPlayer();
                return "continue";
            }
        }
        return "invalid";
    };
    const startGame = () => {
        running = true;
        currentPlayer = player1;
        Gameboard.resetBoard();
    }
    const isGameActive = () => running;
    const setPlayerNames = (I_stab96,OM) => {
        player1 = Player(I_stab96,"X");
        player2 = Player(OM,"O"); 
        currentPlayer = player1;
    }
    return {
        getCurrentPlayer,
        playRound,
        startGame,
        isGameActive,
        setPlayerNames
    };

})();
// Display Controller Module - Single instance using IIFE
const DisplayController = (() => {
    const gameboardElement = document.getElementById('gameboard');
    const statusText = document.getElementById('statusText');
    const restartBtn = document.getElementById('restartButton');
    
    const createBoard = () => {
        gameboardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            gameboardElement.appendChild(cell);
        }
    };
    
    const renderBoard = () => {
        const board = Gameboard.getBoard();
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };
    
    const updateStatus = (message) => {
        statusText.textContent = message;
    };
    
    const handleCellClick = (e) => {
        const index = parseInt(e.target.dataset.index);
        const result = GameController.playRound(index);
        
        switch (result) {
            case "continue":
                renderBoard();
                updateStatus(`${GameController.getCurrentPlayer().name}'s turn`);
                break;
            case "tie":
                renderBoard();
                updateStatus("It's a tie!");
                break;
            case "invalid":
                // Do nothing for invalid moves
                break;
            default:
                if (result && result.name) {
                    renderBoard();
                    updateStatus(`${result.name} wins!`);
                }
                break;
        }
    };
    
    const handleRestart = () => {
        GameController.startGame();
        renderBoard();
        updateStatus(`${GameController.getCurrentPlayer().name}'s turn`);
    };
    
    const bindEvents = () => {
        gameboardElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                handleCellClick(e);
            }
        });
        
        restartBtn.addEventListener('click', handleRestart);
    };
    
    const init = () => {
        createBoard();
        bindEvents();
        GameController.startGame();
        updateStatus(`${GameController.getCurrentPlayer().name}'s turn`);
        renderBoard();
    };
    
    return {
        init,
        renderBoard,
        updateStatus
    };
})();

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    DisplayController.init();
});