// app/page.tsx
import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

import Form from "@/components/form"; // expect error - see next section

const Page = async () => {
	// Same code as app/login/page.tsx
	// this code can be re-used to redirect the user from /login to / when already connected
	// There is probably a middleware solution to handle this --> BETTER SOLUTION
	const authRequest = auth.handleRequest("GET", context);
	const session = await authRequest.validate();
	if (!session) redirect("/login");
	return (
		<>
			<h1>Profile</h1>
			<p>User id: {session.user.userId}</p>
			<p>Username: {session.user.username}</p>
			<Form action="/api/logout">
				<input type="submit" value="Sign out" />
			</Form>
		</>
	);
};

export default Page;