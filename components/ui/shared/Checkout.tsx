import React, { useEffect } from 'react';
import { IEvent } from '@/lib/mongodb/database/models/event.model';
import { Button } from '../button';
import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
const Checkout = ({ event, userId }: { event: IEvent, userId: string }) => {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId
    };

    // Here we simulate the onCheckout returning an array of arguments for the transaction
    return [order.eventId, order.price];
  };
  async function example() {
    console.log(
      "This example will create two accounts (Alice and Bob), fund them, and transfer between them.",
    );
   
    // Setup the client
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
    const ledgerInfo = await aptos.getLedgerInfo();
const modules = await aptos.getAccountModules({ accountAddress: "0x95ec84bf3d2a1b5f5b20f3d9672903cb950c26ae3f01bba9dc8ada21792fb213" });
const tokens = await aptos.getAccountOwnedTokens({ accountAddress: "0x95ec84bf3d2a1b5f5b20f3d9672903cb950c26ae3f01bba9dc8ada21792fb213" });
  }
 
  
  

  return (
    <form action={onCheckout} method="post">
      <Button type="submit" role="link" size="lg" className="button sm:w-fit" onClick={example} >
        {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
      </Button>
    </form>
  );
}

export default Checkout;
