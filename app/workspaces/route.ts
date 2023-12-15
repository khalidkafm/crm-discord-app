import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { User } from '../../models/user'

import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {

const authRequest = auth.handleRequest("GET", context);
const session = await authRequest.validate();

if (!session) redirect("/login");

// Fetch messages from MongoDB
let messages: any;

const { username, discordId } = await User.findOne({ _id: session.user.userId}).exec()

let response = await fetch(`http://localhost:4000/users/workspaces/${discordId}`);

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