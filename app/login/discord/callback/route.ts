// app/login/discord/callback/route.ts

import { auth, discordAuth } from "@/auth/lucia";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { cookies, headers } from "next/headers";

import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
	const storedState = cookies().get("discord_oauth_state")?.value;
	const url = new URL(request.url);
	const state = url.searchParams.get("state");
	const code = url.searchParams.get("code");
	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	try {
        // Checking if the user already exists
        // Documentation here --> https://lucia-auth.com/guidebook/github-oauth/nextjs-app/#:~:text=Authenticate%20user%20with%20Lucia
		const { getExistingUser, discordUser, createUser, discordTokens } =
			await discordAuth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;
			const user = await createUser({
				attributes: {
					username: discordUser.username
				}
			});
			return user;
		};

		const user = await getUser();

		console.log('accessToken : ',discordTokens.accessToken)

	// START MANAGING GUILDS
	/*
		const getUserGuilds = async (token: string) => {
			const requestBody = {
				accessToken: token,
			}
			const response = await fetch('http://localhost:4000/users/guilds',{
				method: 'POST',
				headers: {'Content-Type':'application/json'},
				body: JSON.stringify(requestBody)
			});

			const jsonResponse = await response.json();

			if(jsonResponse.result){
				return jsonResponse.userGuilds
			} else {
				console.log(jsonResponse.message)
			}
			
		}

		const userGuilds = await getUserGuilds(discordTokens.accessToken);
		console.log(userGuilds)
	*/
	// END MANAGING GUILDS



		const session = await auth.createSession({
			userId: user.userId,
			attributes: {
			}
		});
		const authRequest = auth.handleRequest(request.method, {
			cookies,
			headers
		});
		authRequest.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/" // redirect to profile page
			}
		});
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};