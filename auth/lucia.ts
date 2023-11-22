// auth/lucia.ts
import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { mongoose } from "@lucia-auth/adapter-mongoose";
import mongodb from "mongoose"

import { discord } from "@lucia-auth/oauth/providers";

import "lucia/polyfill/node"; // required for Node versions before Node.js v20

import { User } from '../models/user';
import { Key } from '../models/key';
import { Session } from '../models/session';

// expect error (see next section)
export const auth = lucia({
    adapter: mongoose({
		User,
		Key,
		Session
	}),
	env: process.env.NODE_ENV === "development" ? "DEV" : "PROD", // "PROD" if deployed to HTTPS
	middleware: nextjs_future(), // NOT nextjs()
	sessionCookie: {
		expires: false
	},
	getUserAttributes: (data) => {
		return {
			githubUsername: data.username
		};
	}
});

const connectionString = 'mongodb+srv://admin:r0sOemPyVSWVmPSF@lacapsule.hssychg.mongodb.net/crmdiscord'

// handle connection
mongodb.connect( connectionString, {connectTimeoutMS:2000})
    .then(() => console.log('crmdiscord db connected'))
    .catch(error => console.log(error))

export const discordAuth = discord(auth, {
	clientId: process.env.DISCORD_CLIENT_ID ?? "",
	clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
	redirectUri:"http://localhost:3000/login/discord/callback" //discord redirect URI goes here
});
 
export type Auth = typeof auth; 