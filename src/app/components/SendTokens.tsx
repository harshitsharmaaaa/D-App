import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export  function SendTokens() {
    const {connection}= useConnection();
    const wallet = useWallet();

    async function sendTokens() {
        let to = document.getElementById("to")as HTMLInputElement | null;
        let amount = document.getElementById("amount")as HTMLInputElement | null;
        const transaction = new Transaction();
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey!,
                toPubkey: new PublicKey(to?.value!),
                lamports: amount?.value ? Number(amount.value) * LAMPORTS_PER_SOL : 0,
            })
        );  
        await wallet.sendTransaction(transaction, connection); 
        alert ("Transaction sent!")

    }

    return (
        <div>
            <input type="text" placeholder="Public Key" id="to"/>
            <input type="text" placeholder="AMount" id="amount"/>
            <button onClick={sendTokens}>Send</button>
        </div>
    )
}
