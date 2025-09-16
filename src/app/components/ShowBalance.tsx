'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect } from "react";

export function ShowBalance() {
    const {connection} = useConnection();
    const wallet = useWallet()

    async function getBalance() {
        if(!wallet.publicKey) return;
        const balance = connection.getBalance(wallet.publicKey);
        const balancee = await balance/LAMPORTS_PER_SOL;
        document.getElementById("balance")!.innerText =  (await balancee).toString();
    }
    useEffect(() => {
        getBalance();
    },[wallet]);
  return (
    <div>
      Balance is <span id="balance">...</span>
    </div>
  )
}

