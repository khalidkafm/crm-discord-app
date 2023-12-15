import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { User } from '../../models/user'

import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {

const authRequest = auth.handleRequest("GET", context);
const session = await authRequest.validate();

if (!session) redirect("/login");

const { discordId } = await User.findOne({ _id: session.user.userId}).exec()

const fetchUrl = process.env.NODE_ENV === 'development'
? `http://localhost:4000/users/workspaces/${discordId}` // LOCAL DEV discord redirect URI goes here 
: `${process.env.NEXT_PUBLIC_PROD_BOT_URI}/users/workspaces/${discordId}` // PROD discord redirect URI goes here 

let response = await fetch(fetchUrl);

let data: {arraylength: string[], tableau: {guild_id: string}[]} = await response.json();

// let data = await data.json()

if(!data.arraylength){
    return new Response(null, {
        status: 302,
        headers: {
            Location: "/setbot" // redirect to setbot page
        }
        
    });
}else if(data.arraylength){
    return new Response(null, {
        status: 302,
        headers:{
            Location:`/${data.tableau[0].guild_id}` // !!!!! TODO !!!!! redirect to workspaces once done
        }
    })
}
};