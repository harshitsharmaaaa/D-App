import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";

export  function SendTokens() {
    const {connection}= useConnection();
    const wallet = useWallet();
    const [isSending, setIsSending] = useState(false);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    async function sendTokens() {
        if (!wallet.publicKey) {
            alert("Please connect your wallet first");
            return;
        }
        
        if (!recipient || !amount) {
            alert("Please fill all fields");
            return;
        }
        
        try {
            setIsSending(true);
            const transaction = new Transaction();
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports: Number(amount) * LAMPORTS_PER_SOL,
                })
            );  
            
            const signature = await wallet.sendTransaction(transaction, connection);
            alert (`Transaction sent! Signature: ${signature}`);
            
            // Clear form
            setRecipient("");
            setAmount("");
        } catch (error) {
            console.error("Error sending tokens:", error);
            alert("Transaction failed. Please try again.");
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col">
                <label htmlFor="send-to" className="mb-2 text-sm font-medium">Recipient Address</label>
                <input 
                    type="text" 
                    placeholder="Enter recipient address" 
                    id="send-to"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-indigo-900 bg-opacity-50 border border-indigo-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="send-amount" className="mb-2 text-sm font-medium">Amount (SOL)</label>
                <input 
                    type="number" 
                    placeholder="Enter amount" 
                    id="send-amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-indigo-900 bg-opacity-50 border border-indigo-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none"
                />
            </div>
            <button 
                onClick={sendTokens}
                disabled={isSending}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50"
            >
                {isSending ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Tokens
                    </>
                )}
            </button>
        </div>
    )
}