
"use client"

import { IEvent } from '@/lib/mongodb/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from '../button'
import Checkout from './Checkout'
import { link } from "fs";

const CheckoutButton = ({ event }: { event: IEvent }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();
  
  
  

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">Sorry, tickets are no longer available.</p>
      ): (
        <>
          <SignedIn>

            <Button  asChild className="button rounded-full" size="lg">
            <Checkout  event={event} userId={userId} />
                
            
            </Button>
          </SignedIn>
        

        </>
      )}
    </div>
  )
}

export default CheckoutButton