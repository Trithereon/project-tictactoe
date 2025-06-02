// Factory function for the Gameboard which gives access to 
// functions getBoard, placeToken, and printBoard.
function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    // Nested loop to create the 3x3 gameboard template. 
    // Each iteration in the outer loop creates a row, 
    // which the inner loop fills with 3 Cell() objects,
    // each in their own column.
    // Note: cells are accessible by board[row][column].
    // The board is essentially: [
    //     [Cell(), Cell(), Cell()],  // Row 0 (3 rows)
    //     [Cell(), Cell(), Cell()],  // Row 1
    //     [Cell(), Cell(), Cell()]   // Row 2
    // ];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (row, column, player) => {
        // consider that board[] is an array of arrays of Cell() objects.
        const targetCell = board[row][column];

        // If targetCell is available, apply player's token.
        if (targetCell.getValue() === 0) targetCell.applyPlayerToken(player);
        else throw new Error('Invalid position selected');
    }

    // Prints board state to the console.
    // Nested map method loops through entire 2D array.
    // boardWithCellValues becomes a new array holding all updated Cell() values.
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) =>
        cell.getValue()));
        console.log(boardWithCellValues);
    }

    return {getBoard, placeToken, printBoard};
}

// Factory function for the Cell which gives access to
// functions applyPlayerToken and getValue.
function Cell() {
    let value = 0;
    /* Cell values
        0 = No token.
        1 = Player 1 token placed.
        2 = Player 2 token placed. 
    */

    const applyPlayerToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {applyPlayerToken, getValue};
}

// Factory function for the GameController which gives access to
// functions playRound and getActivePlayer.
// It controls the flow of the game.
function GameController(
    playerOneName = "Player One", 
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 1 // Will be displayed as X in UI.
        },
        {
            name: playerTwoName,
            token: 2 // Will be displayed as O in UI.
        }
    ];

    // Player 1 starts, then each turn switch alternates between players.
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        board.placeToken(row, column, getActivePlayer().token);
        console.log(`Placing ${getActivePlayer().name}'s token in row ${row} and column ${column}.`);
        if (gameEndingCheck()) return;
        switchPlayerTurn();
        printNewRound();
    };

    const gameEndingCheck = () => {
        const player = getActivePlayer();
        const currentBoard = board.getBoard();

        // "Is there some row where every cell value in the row
        // equal the current player's token?"
        const isRowWin = currentBoard.some(row => 
            row.every(cell => cell.getValue() === player.token));

        // "Is there some column where every cell value in the rows of that column
        // equal the current player's token, for column 0, 1, 2?"
        const isColumnWin = [0, 1, 2].some(column => 
            currentBoard.every(row => row[column].getValue() === player.token));
        
        // Diagonals are either [0][0],[1][1],[2][2], OR [2][0],[1][1],[0][2].
        const isDiagonalWin = [0, 1, 2].every(i => currentBoard[i][i].getValue() === player.token) ||
            [0, 1, 2].every(i => currentBoard[i][2 - i].getValue() === player.token);
        
        // "If all cells are filled but there is no winner."
        const isTie = !isRowWin && !isColumnWin && !isDiagonalWin &&
            currentBoard.every(row =>
                row.every(cell => cell.getValue() !== 0));

        // To test a tie game quickly, copy this into console:
            // game.playRound(0, 0); // Top-left
            // game.playRound(0, 1); // Top-middle
            // game.playRound(0, 2); // Top-right
            // game.playRound(1, 1); // Center
            // game.playRound(1, 0); // Middle-left
            // game.playRound(2, 0); // Bottom-left
            // game.playRound(1, 2); // Middle-right
            // game.playRound(2, 2); // Bottom-right
            // game.playRound(2, 1); // Bottom-middle
        
        if (isRowWin || isColumnWin || isDiagonalWin) {
            victory(player.name);
            return true;
        }
        
        if (isTie) {
            tie();
            return true;        
        }

        else return false;
    }

    const victory = (player) => {
        console.log(`${player} has won the game!`);
        reset();
    }

    const tie = () => {
        console.log('The game has ended in a tie!');
        reset();
    }

    // Resets all cell values
    const reset = () => {
        ScreenController();
        switchPlayerTurn();
    }

    // First round start message.
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

function ScreenController() {
    const game = GameController(); // Custom player names can be added as arguments instead.
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        // Clear the board.
        boardDiv.textContent = "";

        // Get the latest board and player turn.
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn.
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                // Anything clickable should be a button!
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;

                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedCellRow = e.target.dataset.row;
        const selectedCellColumn = e.target.dataset.column;

        // Make sure a cell was correctly clicked.
        if (!selectedCellRow && !selectedCellColumn) return; 

        game.playRound(selectedCellRow, selectedCellColumn); // playRound expects (column,row).
        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandlerBoard);

    // Initial render.
    updateScreen();

}

ScreenController();