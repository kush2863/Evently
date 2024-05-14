import React, { useEffect } from 'react';
import { IEvent } from '@/lib/mongodb/database/models/event.model';
import { Button } from '../button';
import { checkoutOrder } from '@/lib/actions/order.actions';
import {
  isConnected,
  requestAccess,
  signAuthEntry,
  signTransaction,
  signBlob,
  getPublicKey,
} from "@stellar/freighter-api";
import {  TransactionBuilder } from "@stellar/stellar-sdk";
import server from "@stellar/stellar-sdk";

const Checkout = ({ event, userId }: { event: IEvent, userId: string }) => {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }
    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop a round and checkout when you’re ready.');
    }
  }, []);

  const Transaction = async () => {
    if (await isConnected()) {
      alert("User has Freighter!");
    }
    
    const publicKey = await getPublicKey();
    console.log(publicKey);

    const userSignTransaction = async (
      xdr: string,
      network: string,
      networkPassphrase:string,
      signWith: string,
    ) => {
      try {
        return await signTransaction(xdr, {
          network,
          networkPassphrase,
          accountToSign: signWith,
        });
      } catch (e) {
        throw e; // Better to throw the error for proper error handling
      }
    };

    const xdr = event.price; // Replace this with an xdr string of the transaction you want to sign

    const userSignedTransaction = await userSignTransaction(xdr, "FUTURENET","Test SDF Future Network ; October 2022", publicKey);

    const SERVER_URL = "https://horizon-futurenet.stellar.org";
    const Server = new server(SERVER_URL);

    const transactionToSubmit = TransactionBuilder.fromXDR(
      userSignedTransaction,
      SERVER_URL
    );

    const response = await Server.submitTransaction(transactionToSubmit);
  };

  const onCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId
    };
    await checkoutOrder(order);
  };

  return (
    <form onSubmit={onCheckout}>
      <Button type="button" onClick={Transaction} role="link" size="lg" className="button sm:w-fit">
        Buy Ticket
      </Button>
    </form>
  );
};

export default Checkout;
