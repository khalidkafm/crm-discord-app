// app/login/page.tsx
import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";


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
			<h1>Sign in</h1>
			<a href="/login/discord">Sign in with Discord</a>
		</>
	);
};

export default Page;