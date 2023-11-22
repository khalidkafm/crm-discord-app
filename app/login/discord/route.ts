// app/login/discord/route.ts

//We generate the Authentication link with scopes here
import { discordAuth } from "@/auth/lucia";
import * as context from "next/headers";

import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
	const [url, state] = await discordAuth.getAuthorizationUrl();
	// store state
	context.cookies().set("discord_oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 60 * 60
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};