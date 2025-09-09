import { useState, useEffect, useCallback } from 'react';

// Sepolia testnet chain ID
const SEPOLIA_CHAIN_ID = '0xaa36a7';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  const checkConnection = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          
          // Check network
          const chainId = await window.ethereum.request({ 
            method: 'eth_chainId' 
          });
          setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          
          // Check network after connection
          const chainId = await window.ethereum.request({ 
            method: 'eth_chainId' 
          });
          setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
          
          if (chainId !== SEPOLIA_CHAIN_ID) {
            await switchNetwork();
          }
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this application');
    }
  }, []);

  const switchNetwork = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
        setIsCorrectNetwork(true);
      } catch (error: any) {
        // If network doesn't exist in MetaMask, add it
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              }],
            });
            setIsCorrectNetwork(true);
          } catch (addError) {
            console.error('Error adding network:', addError);
          }
        } else {
          console.error('Error switching network:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsBrowser(true);
      checkConnection();
    }

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setIsConnected(false);
          setIsCorrectNetwork(false);
        } else {
          setAccount(accounts[0]);
          setIsConnected(true);
          checkConnection();
        }
      };

      const handleChainChanged = (chainId: string) => {
        setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [checkConnection]);

  return {
    account,
    isConnected: isBrowser && isConnected,
    isCorrectNetwork: isBrowser && isCorrectNetwork,
    connectWallet,
    switchNetwork,
  };
}