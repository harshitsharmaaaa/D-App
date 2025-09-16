'use client';
import React, { useMemo, useState, useEffect } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter 
} from "@solana/wallet-adapter-wallets";
import RequestAirdrop from "./components/RequestAirdrop";
import { ShowBalance } from "./components/ShowBalance";
import { SendTokens } from "./components/SendTokens";
import { SignMessage } from "./components/SignMessage";

// Custom Wallet Connect Button
const CustomWalletButton = () => {
  const { connected, disconnect, publicKey, wallet, connect, connecting } = useWallet();
  const [showModal, setShowModal] = useState(false);
  
  const handleConnect = () => {
    setShowModal(true);
  };
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Close modal when wallet connects successfully
  useEffect(() => {
    if (connected) {
      setShowModal(false);
    }
  }, [connected]);

  return (
    <>
      {connected ? (
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-700 text-white py-2 px-4 rounded-lg">
            {publicKey ? formatAddress(publicKey.toString()) : "Connected"}
          </span>
          <button 
            onClick={() => disconnect()}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          onClick={handleConnect}
          disabled={connecting}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {connecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
      
      {showModal && (
        <WalletModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

// Custom Wallet Modal
const WalletModal = ({ onClose }: { onClose: () => void }) => {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );
  
  const { select } = useWallet();
  
  const handleWalletSelect = async (walletName: string) => {
    try {
      select(walletName as any);
      // The wallet connection will happen automatically after selection
    } catch (error) {
      console.error("Error selecting wallet:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-96 max-w-full border border-indigo-500 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Select Wallet</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleWalletSelect(wallet.name)}
              className="w-full flex items-center space-x-4 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              {wallet.icon && (
                <img 
                  src={wallet.icon} 
                  alt={wallet.name} 
                  className="w-8 h-8"
                />
              )}
              <span className="font-medium">{wallet.name}</span>
            </button>
          ))}
        </div>
        
        <p className="mt-6 text-sm text-gray-400 text-center">
          By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default function Home() {
  const endpoint = "https://api.devnet.solana.com";
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
          {/* Header */}
          <header className="bg-black bg-opacity-20 backdrop-blur-md border-b border-indigo-500 sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg"></div>
                <h1 className="text-xl font-bold">Solana Wallet</h1>
              </div>
              <CustomWalletButton />
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Balance and Actions */}
              <div className="space-y-8">
                {/* Balance Card */}
                <div className="bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-6 border border-indigo-500 shadow-xl">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Wallet Balance
                  </h2>
                  <div className="flex items-end">
                    <ShowBalance />
                  </div>
                </div>

                {/* Airdrop Card */}
                <div className="bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-6 border border-indigo-500 shadow-xl">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Request Airdrop
                  </h2>
                  <RequestAirdrop />
                </div>
              </div>

              {/* Right Column - Transactions and Signing */}
              <div className="space-y-8">
                {/* Send Tokens Card */}
                <div className="bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-6 border border-indigo-500 shadow-xl">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Tokens
                  </h2>
                  <SendTokens />
                </div>

                {/* Sign Message Card */}
                <div className="bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-6 border border-indigo-500 shadow-xl">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Sign Message
                  </h2>
                  <SignMessage />
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-12 py-6 text-center text-indigo-300 border-t border-indigo-800">
            <p>Solana Wallet Interface - Built with ❤️ for the Solana ecosystem</p>
          </footer>
        </div>
      </WalletProvider>
    </ConnectionProvider>
  );
}