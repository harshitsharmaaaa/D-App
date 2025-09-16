'use client'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";


export default function RequestAirdrop() {
    const lamports = 1000000000;
    const wallet = useWallet();
    const {connection } = useConnection();
    
    function reqAirdrop() {
        const pubKey = wallet.publicKey!;
        const amountInput = document.getElementById("amount") as HTMLInputElement | null;
        const amountValue = amountInput?.value ? Number(amountInput.value) * lamports : 0;
        connection.requestAirdrop(pubKey, amountValue).then((sig) => {
            console.log("Airdrop signature", sig);
        });
    }
  return (
    <div>
        <input type="text" placeholder="AMount" id="amount"/>
        <button onClick={reqAirdrop}>Airdrop</button>
    </div>
  )
}


