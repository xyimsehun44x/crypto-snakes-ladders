import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import type { GameState } from '../components/SnakesAndLaddersGame';

// Contract ABI (you'll need to update this with your actual contract address after deployment)
const CONTRACT_ABI = [
  "function startGame() external payable",
  "function rollDice() external returns (uint256)",
  "function resetGame() external",
  "function getGameState(address player) external view returns (bool gameInProgress, uint256 currentPosition, uint256 prizePool)",
  "function BET_AMOUNT() external view returns (uint256)",
  "event GameStarted(address indexed player, uint256 betAmount)",
  "event DiceRolled(address indexed player, uint256 diceValue, uint256 newPosition)",
  "event SnakeHit(address indexed player, uint256 fromPosition, uint256 toPosition)",
  "event LadderClimbed(address indexed player, uint256 fromPosition, uint256 toPosition)",
  "event GameWon(address indexed player, uint256 prizeAmount)",
  "event GameReset(address indexed player)"
];

// You'll need to update this with your deployed contract address
const CONTRACT_ADDRESS = "0x3394e568B58FE88dF143815bf6c82bE24042ee17";

export function useGame(account: string | null) {
  const [gameState, setGameState] = useState<GameState>({
    gameInProgress: false,
    currentPosition: 0,
    prizePool: '0',
    isLoading: false,
    message: 'Welcome to Crypto Snakes & Ladders!'
  });

  const getContract = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum && account) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }
    return null;
  }, [account]);

  const refreshGameState = useCallback(async () => {
    if (!account) {
      return;
    }

    try {
      if (!window.ethereum) return;
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractRead = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const [gameInProgress, currentPosition, prizePool] = await contractRead.getGameState(account);
      
      setGameState(prev => ({
        ...prev,
        gameInProgress,
        currentPosition: Number(currentPosition),
        prizePool: ethers.formatEther(prizePool),
        message: gameInProgress ? 
          (currentPosition === 0 ? 'Game started! Roll the dice!' : `You're at position ${currentPosition}`) :
          (currentPosition === 100 ? 'Congratulations! You won!' : 'Ready to start a new game!')
      }));
    } catch (error) {
      console.error('Error refreshing game state:', error);
      setGameState(prev => ({
        ...prev,
        message: 'Error loading game state. Please try again.'
      }));
    }
  }, [account, getContract]);

  const startGame = useCallback(async () => {
    if (!account) {
      return;
    }

    try {
      setGameState(prev => ({ ...prev, isLoading: true, message: 'Starting game...' }));
      
      const contract = await getContract();
      if (!contract) return;

      const betAmount = ethers.parseEther("0.01");
      const tx = await contract.startGame({ value: betAmount });
      
      setGameState(prev => ({ ...prev, message: 'Transaction submitted. Waiting for confirmation...' }));
      await tx.wait();
      
      await refreshGameState();
      setGameState(prev => ({ 
        ...prev, 
        isLoading: false, 
        message: 'Game started! Roll the dice to begin!' 
      }));
    } catch (error: any) {
      console.error('Error starting game:', error);
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        message: error.message?.includes('user rejected') 
          ? 'Transaction cancelled by user' 
          : 'Error starting game. Please try again.'
      }));
    }
  }, [account, getContract, refreshGameState]);

  const rollDice = useCallback(async () => {
    if (!account) return;

    try {
      setGameState(prev => ({ ...prev, isLoading: true, message: 'Rolling dice...' }));
      
      const contract = await getContract();
      if (!contract) return;

      const tx = await contract.rollDice();
      setGameState(prev => ({ ...prev, message: 'Transaction submitted. Waiting for confirmation...' }));
      
      const receipt = await tx.wait();
      
      // Parse events to get dice roll result
      let diceRoll = null;
      let newMessage = 'Dice rolled!';
      
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed && parsed.name === 'DiceRolled') {
            diceRoll = Number(parsed.args.diceValue);
            newMessage = `You rolled a ${diceRoll}!`;
          } else if (parsed && parsed.name === 'SnakeHit') {
            newMessage += ` 🐍 Snake bite! Moved from ${parsed.args.fromPosition} to ${parsed.args.toPosition}`;
          } else if (parsed && parsed.name === 'LadderClimbed') {
            newMessage += ` 🪜 Ladder climb! Moved from ${parsed.args.fromPosition} to ${parsed.args.toPosition}`;
          } else if (parsed && parsed.name === 'GameWon') {
            newMessage = '🎉 Congratulations! You won the game!';
          }
        } catch (e) {
          // Ignore parsing errors for logs that aren't from our contract
        }
      }
      
      await refreshGameState();
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        lastDiceRoll: diceRoll || undefined,
        message: newMessage
      }));
    } catch (error: any) {
      console.error('Error rolling dice:', error);
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        message: error.message?.includes('user rejected') 
          ? 'Transaction cancelled by user' 
          : 'Error rolling dice. Please try again.'
      }));
    }
  }, [account, getContract, refreshGameState]);

  const resetGame = useCallback(async () => {
    if (!account) return;

    try {
      setGameState(prev => ({ ...prev, isLoading: true, message: 'Resetting game...' }));
      
      const contract = await getContract();
      if (!contract) return;

      const tx = await contract.resetGame();
      await tx.wait();
      
      await refreshGameState();
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        lastDiceRoll: undefined,
        message: 'Game reset. Ready to start a new game!'
      }));
    } catch (error: any) {
      console.error('Error resetting game:', error);
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        message: error.message?.includes('user rejected') 
          ? 'Transaction cancelled by user' 
          : 'Error resetting game. Please try again.'
      }));
    }
  }, [account, getContract, refreshGameState]);

  return {
    gameState,
    startGame,
    rollDice,
    resetGame,
    refreshGameState
  };
}