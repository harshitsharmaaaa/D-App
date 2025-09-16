'use client'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export default function RequestAirdrop() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    async function reqAirdrop() {
        if (!wallet.publicKey) {
            alert("Please connect your wallet first");
            return;
        }
        
        const amountValue = amount ? parseFloat(amount) : 0;
        
        if (amountValue <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        
        setIsLoading(true);
        
        try {
            const pubKey = wallet.publicKey;
            const lamports = amountValue * LAMPORTS_PER_SOL;
            
            console.log("Requesting airdrop of", amountValue, "SOL to", pubKey.toString());
            
            const signature = await connection.requestAirdrop(pubKey, lamports);
            console.log("Airdrop signature", signature);
            
            // Confirm the transaction
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature,
            }, 'confirmed');
            
            alert(`Airdrop successful! Signature: ${signature}`);
            setAmount("");
        } catch (error) {
            console.error("Airdrop error", error);
            alert("Airdrop failed. Please try again. Note: Devnet airdrops are limited.");
        } finally {
            setIsLoading(false);
        }
    }
    
  return (
    <div className="space-y-4">
        <div className="flex flex-col">
            <label htmlFor="airdrop-amount" className="mb-2 text-sm font-medium">Amount (SOL)</label>
            <input 
                type="number" 
                placeholder="Enter amount" 
                id="airdrop-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-indigo-900 bg-opacity-50 border border-indigo-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none"
            />
        </div>
        <button 
            onClick={reqAirdrop}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50"
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Request Airdrop
                </>
            )}
        </button>
    </div>
  )
}