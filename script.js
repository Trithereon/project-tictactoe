function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    // Nested loop to create the 3x3 gameboard. 
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

    const placeToken = (column, row, player) => {
        // Insert token placing logic here.
        // consider that board[] is an array of arrays of Cell() objects.
    }

    const availableCells = board.filter( ); // Insert filter/map to get available cells.

    const printBoard = () => {
        //const boardWithCellValues
        console.log(boardWithCellValues);
    }

    return {getBoard, placeToken, printBoard};
}

/* Cell values
0 = No token.
1 = Player 1 token placed.
2 = Player 2 token placed. */
function Cell() {
    let value = 0;

    const modifyCellState = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        modifyCellState,
        getValue
    };
}

function GameController(
    playerOneName = "Player One", 
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
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

    const playRound = (column, row) => {
        console.log(`Placing ${getActivePlayer().name}'s 
        token in column ${column} and row ${row}.`);
        board.placeToken(column, row, getActivePlayer().token);
        switchPlayerTurn();
        printNewRound();
    };

    // Initial game start message.
    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}
