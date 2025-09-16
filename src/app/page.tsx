'use client';
import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { 
  PhantomWalletAdapter, 
  UnsafeBurnerWalletAdapter,
  SolflareWalletAdapter 
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import RequestAirdrop from "./components/RequestAirdrop";
import { ShowBalance } from "./components/ShowBalance";
import { SendTokens } from "./components/SendTokens";
import { SignMessage } from "./components/SignMessage";

export default function Home() {
  
  const endpoint = "https://solana-devnet.g.alchemy.com/v2/1L0y01lpBfy7BswckhuTR";


  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
      <WalletModalProvider>
            <div className="w-100vw  display-flex justify-end p-4">
              <WalletMultiButton/>
              <WalletDisconnectButton />
            </div>
            <div className="w-100vw  display-flex justify-end p-4">
            <RequestAirdrop />
            <ShowBalance/>
            <SendTokens/>
            <SignMessage/>
            </div>
      </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
