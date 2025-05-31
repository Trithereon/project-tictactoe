function Gameboard() {
    const board = [];
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
