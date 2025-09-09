// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SnakesAndLadders {
    uint256 public constant BET_AMOUNT = 0.01 ether;
    uint256 public constant WINNING_POSITION = 100;
    
    struct GameState {
        bool gameInProgress;
        uint256 currentPosition;
        uint256 prizePool;
        address player;
    }
    
    mapping(address => GameState) public games;
    
    mapping(uint256 => uint256) public snakes;
    mapping(uint256 => uint256) public ladders;
    
    event GameStarted(address indexed player, uint256 betAmount);
    event DiceRolled(address indexed player, uint256 diceValue, uint256 newPosition);
    event SnakeHit(address indexed player, uint256 fromPosition, uint256 toPosition);
    event LadderClimbed(address indexed player, uint256 fromPosition, uint256 toPosition);
    event GameWon(address indexed player, uint256 prizeAmount);
    event GameReset(address indexed player);
    
    constructor() {
        _initializeSnakesAndLadders();
    }
    
    function _initializeSnakesAndLadders() private {
        // Snakes (head -> tail)
        snakes[16] = 6;
        snakes[47] = 26;
        snakes[49] = 11;
        snakes[56] = 53;
        snakes[62] = 19;
        snakes[64] = 60;
        snakes[87] = 24;
        snakes[93] = 73;
        snakes[95] = 75;
        snakes[98] = 78;
        
        // Ladders (bottom -> top)
        ladders[1] = 38;
        ladders[4] = 14;
        ladders[9] = 21;
        ladders[21] = 42;
        ladders[28] = 84;
        ladders[36] = 44;
        ladders[51] = 67;
        ladders[71] = 91;
        ladders[80] = 100;
    }
    
    function startGame() external payable {
        require(msg.value == BET_AMOUNT, "Incorrect bet amount");
        require(!games[msg.sender].gameInProgress, "Game already in progress");
        
        games[msg.sender] = GameState({
            gameInProgress: true,
            currentPosition: 0,
            prizePool: msg.value,
            player: msg.sender
        });
        
        emit GameStarted(msg.sender, msg.value);
    }
    
    function rollDice() external returns (uint256) {
        require(games[msg.sender].gameInProgress, "No active game");
        
        // Simple pseudo-randomness for demo purposes (NOT secure for mainnet)
        uint256 diceValue = (uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender
        ))) % 6) + 1;
        
        uint256 newPosition = games[msg.sender].currentPosition + diceValue;
        
        // Check if player goes beyond winning position
        if (newPosition > WINNING_POSITION) {
            emit DiceRolled(msg.sender, diceValue, games[msg.sender].currentPosition);
            return diceValue; // Stay at current position
        }
        
        games[msg.sender].currentPosition = newPosition;
        emit DiceRolled(msg.sender, diceValue, newPosition);
        
        // Check for snakes
        if (snakes[newPosition] != 0) {
            uint256 snakeTail = snakes[newPosition];
            games[msg.sender].currentPosition = snakeTail;
            emit SnakeHit(msg.sender, newPosition, snakeTail);
            return diceValue;
        }
        
        // Check for ladders
        if (ladders[newPosition] != 0) {
            uint256 ladderTop = ladders[newPosition];
            games[msg.sender].currentPosition = ladderTop;
            emit LadderClimbed(msg.sender, newPosition, ladderTop);
        }
        
        // Check for win condition
        if (games[msg.sender].currentPosition == WINNING_POSITION) {
            _endGame(msg.sender);
        }
        
        return diceValue;
    }
    
    function _endGame(address player) private {
        uint256 prize = games[player].prizePool;
        games[player].gameInProgress = false;
        games[player].currentPosition = 0;
        games[player].prizePool = 0;
        
        payable(player).transfer(prize);
        emit GameWon(player, prize);
    }
    
    function resetGame() external {
        require(games[msg.sender].gameInProgress, "No active game");
        
        games[msg.sender].gameInProgress = false;
        games[msg.sender].currentPosition = 0;
        games[msg.sender].prizePool = 0;
        
        emit GameReset(msg.sender);
    }
    
    function getGameState(address player) external view returns (
        bool gameInProgress,
        uint256 currentPosition,
        uint256 prizePool
    ) {
        GameState memory game = games[player];
        return (
            game.gameInProgress,
            game.currentPosition,
            game.prizePool
        );
    }
    
    function getSnakePosition(uint256 position) external view returns (uint256) {
        return snakes[position];
    }
    
    function getLadderPosition(uint256 position) external view returns (uint256) {
        return ladders[position];
    }
    
    function getAllSnakes() external view returns (uint256[] memory positions, uint256[] memory destinations) {
        uint256[] memory snakePositions = new uint256[](10);
        uint256[] memory snakeDestinations = new uint256[](10);
        
        snakePositions[0] = 16; snakeDestinations[0] = snakes[16];
        snakePositions[1] = 47; snakeDestinations[1] = snakes[47];
        snakePositions[2] = 49; snakeDestinations[2] = snakes[49];
        snakePositions[3] = 56; snakeDestinations[3] = snakes[56];
        snakePositions[4] = 62; snakeDestinations[4] = snakes[62];
        snakePositions[5] = 64; snakeDestinations[5] = snakes[64];
        snakePositions[6] = 87; snakeDestinations[6] = snakes[87];
        snakePositions[7] = 93; snakeDestinations[7] = snakes[93];
        snakePositions[8] = 95; snakeDestinations[8] = snakes[95];
        snakePositions[9] = 98; snakeDestinations[9] = snakes[98];
        
        return (snakePositions, snakeDestinations);
    }
    
    function getAllLadders() external view returns (uint256[] memory positions, uint256[] memory destinations) {
        uint256[] memory ladderPositions = new uint256[](9);
        uint256[] memory ladderDestinations = new uint256[](9);
        
        ladderPositions[0] = 1; ladderDestinations[0] = ladders[1];
        ladderPositions[1] = 4; ladderDestinations[1] = ladders[4];
        ladderPositions[2] = 9; ladderDestinations[2] = ladders[9];
        ladderPositions[3] = 21; ladderDestinations[3] = ladders[21];
        ladderPositions[4] = 28; ladderDestinations[4] = ladders[28];
        ladderPositions[5] = 36; ladderDestinations[5] = ladders[36];
        ladderPositions[6] = 51; ladderDestinations[6] = ladders[51];
        ladderPositions[7] = 71; ladderDestinations[7] = ladders[71];
        ladderPositions[8] = 80; ladderDestinations[8] = ladders[80];
        
        return (ladderPositions, ladderDestinations);
    }
}