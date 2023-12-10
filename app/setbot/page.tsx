// app/setbot/page.tsx
import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

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
		<div className="container relative h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
		  <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
			<div className="absolute inset-0 bg-zinc-900" />
			<div className="relative z-20 flex items-center text-lg font-medium">
			  <svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="mr-2 h-6 w-6"
			  >
				<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
			  </svg>
			  Connect your bot
			</div>
			<div className="relative z-20 mt-auto">
			  <blockquote className="space-y-2">
				<p className="text-lg">
				  &ldquo;Admin permissions are required.&rdquo;
				</p>
				<footer className="text-sm">Random text</footer>
			  </blockquote>
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