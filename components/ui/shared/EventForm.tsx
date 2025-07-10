"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { eventFormSchema } from "@/lib/validator"
import * as z from 'zod'
import { eventDefaultValues } from "@/constants"
import Dropdown from "./Dropdown"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "./FileUploader"
import { useState } from "react"
import Image from "next/image"
import DatePicker from "react-datepicker";
import { useUploadThing } from '@/lib/uploadthing'

import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "../checkbox"
import { useRouter } from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import { IEvent } from "@/lib/mongodb/database/models/event.model"
import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

type EventFormProps = {
  userId: string
  type: "Create" | "Update"
  event?: IEvent,
  eventId?: string
}

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([])
  const initialValues = event && type === 'Update'
    ? {
      ...event,
      startDateTime: new Date(event.startDateTime),
      endDateTime: new Date(event.endDateTime)
    }
    : eventDefaultValues;
  const router = useRouter();

  const { startUpload } = useUploadThing('imageUploader')

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues
  })

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files)

      if (!uploadedImages) {
        return
      }

      uploadedImageUrl = uploadedImages[0].url
    }

    if (type === 'Create') {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: '/profile'
        })

        if (newEvent) {
          await addEventToAptosBlockchain(newEvent)
          form.reset();
          router.push(`/events/${newEvent._id}`)
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === 'Update') {
      if (!eventId) {
        router.back()
        return;
      }

      try {
        const updatedEvent = await updateEvent({
          userId,
          event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
          path: `/events/${eventId}`
        })

        if (updatedEvent) {
          await addEventToAptosBlockchain(updatedEvent)
          form.reset();
          router.push(`/events/${updatedEvent._id}`)
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function addEventToAptosBlockchain(event: IEvent) {
    try {
      const config = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(config);

      const Useraddress = Account.generate();
      console.log(Useraddress.accountAddress);

      // Fund the account using the Aptos faucet with the required header
      await fetch('https://faucet.testnet.aptoslabs.com/fund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-is-jwt': 'true',
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ3YWU0OWM0YzlkM2ViODVhNTI1NDA3MmMzMGQyZThlNzY2MWVmZTEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVGVjaCBWWSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMWm5FWlV4THBpU2xuV2NGLVpGR3cxVWh2QkpRQkczLXRTcFJWTWZ0WU5sUjJwRmc9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXB0b3MtYXBpLWdhdGV3YXktcHJvZCIsImF1ZCI6ImFwdG9zLWFwaS1nYXRld2F5LXByb2QiLCJhdXRoX3RpbWUiOjE3NTIxNDQyNjIsInVzZXJfaWQiOiJ4TUtDT1RMcU56Z0wxbTltdXF3ZG9xOU5BOG8xIiwic3ViIjoieE1LQ09UTHFOemdMMW05bXVxd2RvcTlOQThvMSIsImlhdCI6MTc1MjE0NDI2MiwiZXhwIjoxNzUyMTQ3ODYyLCJlbWFpbCI6InRlY2hAdm9sdW50ZWVyeWF0cmEuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDYzMjY0MzUwMDU1ODAxMTA3NTMiXSwiZW1haWwiOlsidGVjaEB2b2x1bnRlZXJ5YXRyYS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.cCrFn0rJbPBPV_q24IQ05bM70bcJ6ouLy4FtbCuBuk_qkSlJsYhtQTLuZhq6QY0_BPXfqFu5e9WO4BdRq13rW8qYwhn7B4whxqRFSOql8cpYRcwt1YEFEUlayH8GElGm4WEtGC8MlQlGdwI6VlKXs8g7CGPb6Eo1t9c_u-6fg5hCf2ORhF4cmojQ96yBVkFUZfrC5LJznlQKLM0s11w7VIOIn-mwar9ya5WZ271k0GTgyLQPpb9ot7ZHAQnfy30KVOZf4x-r71Kd2Wex4PnT9Hm487prlEwIGHuy6vakOKaLcSsYOe2Lzf6wlw1g87UO0t9HkEtlv7i7ou90Qupu-w',
        },
        body: JSON.stringify({
          address: Useraddress.accountAddress.toString(),
          amount: 100_000_000,
        }),
      });
  
      // 1. Initialize the EventStore for the account (only needs to be done once per account)
      const initTx = await aptos.transaction.build.simple({
        sender: Useraddress.accountAddress,
        data: {
          function: "0x5a11629621d7f79fe39531900297eec60bb30e5d1b8eab1547bb4de58e15cc1a::create_event::initialize_account",
          functionArguments: [],
          typeArguments: [],
        },
      });
      const initAuth = aptos.transaction.sign({
        signer: Useraddress,
        transaction: initTx,
      });
      const initResult = await aptos.transaction.submit.simple({
        transaction: initTx,
        senderAuthenticator: initAuth,
      });
      // Wait for confirmation before proceeding
      await aptos.waitForTransaction({ transactionHash: initResult.hash });

      // 2. Call create_event with event details
      console.log('Arguments:', event.title, event.description, event.url, event.imageUrl);
      const createTx = await aptos.transaction.build.simple({
        sender: Useraddress.accountAddress,
        data: {
          function: "0x5a11629621d7f79fe39531900297eec60bb30e5d1b8eab1547bb4de58e15cc1a::create_event::create_event",
          typeArguments: [],
          functionArguments: [
            event.title,
            event.description,
            event.url,
            event.imageUrl,
          ],
        },
      });

      const createAuth = aptos.transaction.sign({
        signer: Useraddress,
        transaction: createTx,
      });
      console.log(createAuth);

      const submittedTransaction = await aptos.transaction.submit.simple({
        transaction: createTx,
        senderAuthenticator: createAuth,
      });

      await aptos.waitForTransaction({ transactionHash: submittedTransaction.hash });
      console.log("Event successfully created on Aptos blockchain!", submittedTransaction);
      return true;
    } catch (error) {
      console.error("Failed to create event on Aptos blockchain:", error);
      return false;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Event title" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Dropdown onChangeHandler={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea placeholder="Description" {...field} className="textarea rounded-2xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                    />

                    <Input placeholder="Event location or Online" {...field} className="input-field" />
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">Start Date:</p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">End Date:</p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="dollar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <Input type="number" placeholder="Price" {...field} className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center">
                              <label htmlFor="isFree" className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Free Ticket</label>
                              <Checkbox
                                onCheckedChange={field.onChange}
                                checked={field.value}
                                id="isFree" className="mr-2 h-5 w-5 border-2 border-primary-500" />
                            </div>

                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="link"
                      width={24}
                      height={24}
                    />

                    <Input placeholder="URL" {...field} className="input-field" />
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? (
            'Submitting...'
          ) : `${type} Event `}
        </Button>
      </form>
    </Form>
  )
}

export default EventForm
