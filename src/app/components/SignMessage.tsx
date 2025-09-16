import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import {ed25519} from "@noble/curves/ed25519";
import { useState } from "react";

export function SignMessage() {
    const {publicKey, signMessage} = useWallet();
    const [isSigning, setIsSigning] = useState(false);
    const [message, setMessage] = useState("");

    async function onClick() {
        if(!publicKey) {
            alert("Wallet not connected");
            return;
        }
        
        if(!signMessage) {
            alert("Wallet does not support message signing");
            return;
        }
        
        if (!message) {
            alert("Please enter a message to sign");
            return;
        }
        
        try {
            setIsSigning(true);
            const encodedMessage = new TextEncoder().encode(message);
            const signedMessage = await signMessage(encodedMessage);
            const signatureBase58 = bs58.encode(signedMessage);
            
            if(!ed25519.verify(signedMessage, encodedMessage, publicKey.toBytes())) {
                throw new Error("Signature verification failed");
            }
            
            alert(`Message signed successfully!\nSignature (base58): ${signatureBase58}`);
        } catch (error) {
            console.error("Error signing message:", error);
            alert("Failed to sign message. Please try again.");
        } finally {
            setIsSigning(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col">
                <label htmlFor="sign-message" className="mb-2 text-sm font-medium">Message to Sign</label>
                <input 
                    type="text" 
                    placeholder="Enter your message" 
                    id="sign-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-indigo-900 bg-opacity-50 border border-indigo-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none"
                />
            </div>
            <button 
                onClick={onClick}
                disabled={isSigning}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50"
            >
                {isSigning ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Sign Message
                    </>
                )}
            </button>
        </div>
    )
}