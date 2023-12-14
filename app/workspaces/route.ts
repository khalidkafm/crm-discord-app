import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { User } from '../../models/user'


import type { NextRequest } from "next/server";


export const GET = async (request: NextRequest) => {

//__________________________________________________________________________________________________________________________________________________
//                                  code à conserver jusque
//__________________________________________________________________________________________________________________________________________________

const authRequest = auth.handleRequest("GET", context);
const session = await authRequest.validate();
if (!session) redirect("/login");

// Fetch messages from MongoDB
let messages: any;

const { username, discordId } = await User.findOne({ _id: session.user.userId}).exec()

//__________________________________________________________________________________________________________________________________________________
//                                  là
//__________________________________________________________________________________________________________________________________________________


// const userId  = User.find({_id: }).then(data=>{
//     console.log(data)
// })




let data = await fetch(`http://localhost:4000/users/workspaces/${discordId}`);

data = await data.json()
console.log('__________________________', data.tableau[0], '__________________________')

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