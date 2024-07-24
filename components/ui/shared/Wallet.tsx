import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

import { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import { PetraWallet } from "petra-plugin-wallet-adapter";
export const WalletProvider = ({ children }: PropsWithChildren) => {
    const wallets = [new PetraWallet()];
    
 
  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      dappConfig={{ network: Network.TESTNET }}
      onError={(error) => {
    console.log("error", error);
  }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};