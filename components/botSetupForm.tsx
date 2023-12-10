"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { DiscordLogoIcon } from '@radix-ui/react-icons'
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function BotAuthForm({ className, ...props }: UserAuthFormProps) {

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
        </div>
      </div>
      <Link href='/login/discord/bot' className={cn(
			  buttonVariants({ variant: "outline" })
			)} type="button">
        { <DiscordLogoIcon className="mr-2 h-4 w-4" /> }{" "}
        Connect the bot
      </Link>

    </div>
  )
}