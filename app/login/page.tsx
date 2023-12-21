// app/login/page.tsx
import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/login-form"

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
	if (session) redirect("/");
	return (
		<>
		<div className="container absolute h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
		  <Link
			href="/login/discord"
			className={cn(
			  buttonVariants({ variant: "ghost" }),
			  "absolute right-4 top-4 md:right-8 md:top-8"
			)}
		  >
			Login
		  </Link>
		  <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex justify-center items-center">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex flex-col items-center justify-center text-lg font-medium h-full">
         <Image
          src="/LogoDiscordCRM.png"
          alt=""
          width={400}
          height={140}
          className="relative top-15 px-5 py-5"
        ></Image>

			</div>
			<div className="relative z-20 mt-auto">
			</div>
		  </div>
		  <div className="lg:p-8">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			  <div className="flex flex-col space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
				  #1 CRM for Discord
				</h1>
				<p className="text-sm text-muted-foreground">
				  Growth made simple for Discord
				</p>
			  </div>
			  <UserAuthForm />
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