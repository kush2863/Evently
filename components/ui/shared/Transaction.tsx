import { requestAccess, signTransaction } from "@stellar/freighter-api";

type PublicKey = string;
type SignedTransaction = string;

const retrievePublicKey = async (): Promise<PublicKey> => {
  try {
    const publicKey = await requestAccess();
    return publicKey;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
  }
};

const userSignTransaction = async (
  xdr: string,
  network: string,
  signWith: PublicKey,
): Promise<SignedTransaction> => {
  try {
    const signedTransaction = await signTransaction(xdr, {
      network,
      accountToSign: signWith,
    });
    return signedTransaction;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
  }
};

const Transaction = async () => {
    try {
      const retrievedPublicKey = await retrievePublicKey();
      const xdr = "1"; // replace this with an xdr string of the transaction you want to sign
      const userSignedTransaction = await userSignTransaction(xdr, "TESTNET", retrievedPublicKey);
      return userSignedTransaction;
    } catch (error) {
      throw new Error((error instanceof Error ? error.message : "Unknown error occurred") as string);
    }
  };
  

export default Transaction;
