# Crypto Snakes & Ladders DApp

A decentralized version of the classic Snakes and Ladders board game built on Ethereum Sepolia testnet.

## Features

- **Blockchain-based gameplay**: All game logic runs on Ethereum smart contracts
- **MetaMask integration**: Connect your wallet to play
- **Discord integration**: Show your Discord profile and avatar on the game board
- **Multiplayer UI**: See other players online and in active games
- **Profile system**: Track game statistics and earnings
- **Fair randomness**: On-chain dice rolling (demo version)
- **Prize system**: Win 0.01 ETH by reaching position 100
- **Visual game board**: Interactive 10x10 board with snakes and ladders
- **Real-time updates**: Live game state from the blockchain

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Sepolia testnet ETH (get from [Sepolia faucet](https://sepoliafaucet.com/))

### Installation

1. Clone the repository:
```bash
cd crypto-snakes-ladders
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5174](http://localhost:5174) in your browser

### Smart Contract Deployment

1. Open [Remix IDE](https://remix.ethereum.org/)

2. Create a new file `SnakesAndLadders.sol` and paste the contract code from `contracts/SnakesAndLadders.sol`

3. Compile the contract:
   - Select Solidity compiler version 0.8.20+
   - Click "Compile SnakesAndLadders.sol"

4. Deploy to Sepolia:
   - Switch to "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask" as environment
   - Make sure MetaMask is connected to Sepolia testnet
   - Click "Deploy"
   - Confirm the transaction in MetaMask

5. Copy the deployed contract address

6. Update the frontend:
   - Open `app/hooks/useGame.ts`
   - Replace `YOUR_CONTRACT_ADDRESS_HERE` with your deployed contract address

### Discord Integration Setup (Optional)

1. Create a Discord Application:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and give it a name
   - Go to "OAuth2" section
   - Copy the Client ID and Client Secret

2. Configure OAuth2:
   - In OAuth2 settings, add redirect URL: `http://localhost:5174/auth/discord/callback`
   - For production, use your deployed domain

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Discord Client ID and Secret
   - Update redirect URI if needed

4. Restart the development server to load new environment variables

## How to Play

1. **Connect Wallet**: Click "Connect MetaMask" and approve the connection
2. **Discord Integration** (Optional): Click "Connect Discord" to show your profile on the board
3. **Switch Network**: Ensure you're on Sepolia testnet
4. **View Players**: See other online players and active games in the sidebar
5. **Start Game**: Click "Start Game" and pay 0.01 ETH bet
6. **Roll Dice**: Click "Roll Dice" to move forward
7. **Navigate Board**: Climb ladders (🪜) and avoid snakes (🐍)
8. **Watch Others**: See other players' avatars moving on the board
9. **Win**: Land exactly on position 100 to win the prize!

## Game Rules

- **Bet Amount**: 0.01 ETH per game
- **Movement**: Roll dice (1-6) to advance
- **Ladders**: Instant climb to higher position
- **Snakes**: Slide down to lower position  
- **Winning**: Must land exactly on position 100
- **Prize**: Winner gets the full bet amount back

## Board Layout

The game uses a traditional 10x10 Snakes and Ladders board:

### Snakes (Head → Tail)
- 16 → 6, 47 → 26, 49 → 11, 56 → 53, 62 → 19
- 64 → 60, 87 → 24, 93 → 73, 95 → 75, 98 → 78

### Ladders (Bottom → Top)
- 1 → 38, 4 → 14, 9 → 21, 21 → 42, 28 → 84
- 36 → 44, 51 → 67, 71 → 91, 80 → 100

## Technical Stack

- **Frontend**: React Router (Remix-style), TypeScript, Tailwind CSS
- **Blockchain**: Ethereum, Solidity ^0.8.20
- **Web3**: Ethers.js v6, MetaMask
- **Network**: Sepolia Testnet

## Contract Functions

### Public Functions
- `startGame()`: Start new game with 0.01 ETH bet
- `rollDice()`: Roll dice and move player
- `resetGame()`: Reset current game (forfeit bet)
- `getGameState(address)`: Get player's game state

### View Functions
- `getAllSnakes()`: Get all snake positions
- `getAllLadders()`: Get all ladder positions
- `BET_AMOUNT()`: Get required bet amount (0.01 ETH)

## Events
- `GameStarted`: Game started with bet
- `DiceRolled`: Player rolled dice
- `SnakeHit`: Player hit a snake
- `LadderClimbed`: Player climbed a ladder
- `GameWon`: Player won the game
- `GameReset`: Game was reset

## Development

### Build for Production
```bash
npm run build
```

### Type Checking
```bash
npm run typecheck
```

### Project Structure
```
crypto-snakes-ladders/
├── app/
│   ├── components/          # React components
│   ├── hooks/              # Custom hooks
│   ├── routes/             # Route components
│   └── types/              # TypeScript types
├── contracts/              # Solidity contracts
└── public/                 # Static assets
```

## Security Considerations

⚠️ **This is a demo version with limitations:**

- **Randomness**: Uses simple on-chain randomness (not secure for mainnet)
- **Testnet Only**: Designed for Sepolia testnet
- **Educational Purpose**: Not audited for production use

For production deployment:
- Implement Chainlink VRF for secure randomness
- Add proper access controls
- Conduct security audit
- Add emergency pause functionality

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## License

MIT License - see LICENSE file for details

## Support

- [Sepolia Faucet](https://sepoliafaucet.com/) - Get test ETH
- [MetaMask Guide](https://metamask.io/download/) - Install wallet
- [Remix IDE](https://remix.ethereum.org/) - Deploy contracts

## Future Enhancements

- Multiplayer support
- Leaderboards
- NFT rewards
- Variable bet amounts
- Chainlink VRF integration
- Mobile responsive design
