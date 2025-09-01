import React, { useEffect } from 'react';
import { IEvent } from '@/lib/mongodb/database/models/event.model';
import { Button } from '../button';
import { checkoutOrder } from '@/lib/actions/order.actions';

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

  // Basic placeholder purchase handler (Stellar integration removed)
  const handlePurchaseClick = async () => {
    try {
      await checkoutOrder({
        eventTitle: event.title,
        eventId: event._id,
        price: event.price,
        isFree: event.isFree,
        buyerId: userId,
      });
      console.log('Checkout initiated');
    } catch (err) {
      console.error('Checkout failed', err);
    }
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
    <Button type="button" onClick={handlePurchaseClick} size="lg" className="button sm:w-fit">
      Buy Ticket
    </Button>
  );
};

export default Checkout;
