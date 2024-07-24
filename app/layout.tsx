import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { WalletProvider } from "@/components/ui/shared/Wallet";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});



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
      {/*<WalletProvider>*/}
        <html lang="en">
    
        
          <body className={poppins.className}>
            {children}
            </body>
      
        </html>
     {/* </WalletProvider> */}
     
    </ClerkProvider>
  );
}
