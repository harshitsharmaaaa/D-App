'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export function ShowBalance() {
    const {connection} = useConnection();
    const wallet = useWallet();
    const [balance, setBalance] = useState<string>("...");

    async function getBalance() {
        if(!wallet.publicKey) {
            setBalance("Connect wallet");
            return;
        }
        
        try {
            const balance = await connection.getBalance(wallet.publicKey);
            const balanceInSol = balance / LAMPORTS_PER_SOL;
            setBalance(balanceInSol.toFixed(4));
        } catch (error) {
            console.error("Error fetching balance:", error);
            setBalance("Error");
        }
    }
    
    useEffect(() => {
        getBalance();
    }, [wallet.connected, wallet.publicKey]);
    
  return (
    <div className="flex items-baseline">
      <span className="text-3xl font-bold mr-2">{balance}</span>
      <span className="text-indigo-300">SOL</span>
    </div>
  )
}