import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
type AvailableWallets = "Petra" | "Martian" | "OtherWallet"; // Example

const optInWallets: AvailableWallets[] = ["Petra", "Martian"];
 
const dappInfo = {
  aptosConnect: {
    dappName: "My awesome dapp"  ,// defaults to document's title
    dappImageURI: "..."  // defaults to dapp's favicon
  },
};


export const metadata: Metadata = {
  title: "College Connect",
  description: "Platform for evently",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <ClerkProvider>
  {/*  <AptosWalletAdapterProvider  dappInfo={dappInfo}
    autoConnect
  optInWallets={optInWallets}> */}
        <html lang="en">
    
        
          <body className={poppins.className}>
            {children}
            </body>
      
        </html>
       
     {/*  </AptosWalletAdapterProvider> */}
     
    </ClerkProvider>
  );
}
