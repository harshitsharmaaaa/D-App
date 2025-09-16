import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import {ed25519} from "@noble/curves/ed25519";

export function SignMessage() {
    
    const {publicKey, signMessage} = useWallet();

    async function onClick() {
        if(!publicKey) throw new Error("Wallet not connected");
        if(!signMessage) throw new Error("Wallet does not support message signing");
        let message = document.getElementById("message") as HTMLInputElement | null;
        const encodedMessage = new TextEncoder().encode(message?.value!);
        const signedMessage = await signMessage(encodedMessage);
        const signatureBase58 = bs58.encode(signedMessage);
        if(!ed25519.verify(signedMessage, encodedMessage, publicKey.toBytes())) {
            throw new Error("Signature verification failed");
        }
        alert(`Signature (base58): ${signatureBase58}`);
        
    }

    return (
        <div>
            <input type="text" placeholder="Message" id="message"/>
            <button onClick={onClick}>Sign</button>
        </div>
    )
}