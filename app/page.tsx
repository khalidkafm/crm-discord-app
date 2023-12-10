// app/page.tsx
import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { Message } from '../models/message';
import { User } from '../models/user'

import Form from "@/components/logout-form"; // expect error - see next section

const Page = async () => {
	// Same code as app/login/page.tsx
	// this code can be re-used to redirect the user from /login to / when already connected
	// There is probably a middleware solution to handle this --> BETTER SOLUTION
	const authRequest = auth.handleRequest("GET", context);
	const session = await authRequest.validate();
	if (!session) redirect("/login");

	// Fetch messages from MongoDB
	let messages: any;

	const { username } = await User.findOne({ _id: session.user.userId}).exec()
	await Message.find().then((data : any) => { messages = data })

	return (
		<>
			<h1>Profile</h1>
			<p>User id: {session.user.userId}</p>
			<p>Username: { username }</p>
			<Form action="/api/logout">
				<input type="submit" value="Sign out" />
			</Form>
			<p>Messages: { messages.toString() }</p>
		</>
	);
};

export default Page;