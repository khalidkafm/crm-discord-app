// app/setbot/page.tsx
import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { DiscordLogoIcon } from "@radix-ui/react-icons"

import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { BotAuthForm } from "@/components/botSetupForm";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}


// Checking if the user is authenticated. If so, redirecting from here '/login'to '/'.
const Page = async () => {
	// Same code as app/page.tsx
	// this code can be re-used to redirect the user from protected pages if not connected
	// There is probably a middleware solution to handle this too --> BETTER
	const authRequest = auth.handleRequest("GET", context);
	const session = await authRequest.validate();
	if (!session) redirect("/login");
	return (
		<>
		<div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
		  
		  
		<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-zinc-900" />
                    <div className="relative z-20 flex flex-row items-center justify-center text-lg font-medium h-full">
                        <Image
                            src="/LogoDiscordCRM.png"
                            alt=""
                            width={230}
                            height={140}
                            className="relative bottom-15 px-5 py-5"
                        />
                        <div className="flex content-center justify-center">
                            <svg width="50" height="50" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z" fill="currentColor"></path>
                            </svg>
                            <svg width="50" height="50" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z" fill="currentColor"></path>
                            </svg>
                            <svg width="50" height="50" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <DiscordLogoIcon className="mr-2 h-60 w-60" />
                    </div>
                </div>


		  
		  <div className="lg:p-8">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			  <div className="flex flex-col space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
				  Connect the bot
				</h1>
				<p className="text-sm text-muted-foreground">
				  Click continue to connect your Discord server
				</p>
			  </div>
			  <BotAuthForm />
			  <p className="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our{" "}
				<Link
				  href="/terms"
				  className="underline underline-offset-4 hover:text-primary"
				>
				  Terms of Service
				</Link>{" "}
				and{" "}
				<Link
				  href="/privacy"
				  className="underline underline-offset-4 hover:text-primary"
				>
				  Privacy Policy
				</Link>
				.
			  </p>
			</div>
		  </div>
		</div>
	  </>
	);
};

export default Page;