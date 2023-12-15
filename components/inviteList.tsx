import * as React from "react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { ScrollArea } from "./ui/scroll-area";
import { InviteCard } from "./inviteCards";
import { Input } from "./ui/input"



//Adding types for Invite to manage typeScript expectations
interface Invite {
  _id: string;
  name: string;
  guildId: string;
  guild: string
  // Add other properties as needed
}

//props are guildId more to be added
const InviteList = () => {

const router = useRouter();

const [invitesData, setInvitesData] = useState<Invite[]>([]);


  useEffect(() => {
    // Fetching invites from the API Invites with Arthur's discordId
    fetch(
      `https://crm-discord-bot-production.up.railway.app/invites/1045256538169823253`
    )
      .then((response) => response.json())
      .then((invitesApiData) => {
        if (!invitesApiData.result) {
          console.log("Result is false check invites API");
        } else {
          const invites = invitesApiData.invites.map((invite : any) => ({...invite,
            // handleClick: () => router.push(`/${guildId}/campaign/${invite._id}`),
          }));
          setInvitesData(invites);
        }
      });
  }, []);


  //props used down are from the end point above attention to guildId in this Section
  const invitesDisplay = invitesData.map((invite, i) => (
    <div key={i} className="flex flex-row justify-between mb-2" style={{ marginRight: i < invitesData.length - 1 ? "8px" : 0 }}>
      <InviteCard name={invite.name} guildId={invite.guild} campaignId={invite._id} /> 
    </div>
  ));

  
    return (
      <>
      <div className="flex items-center">
      <Input placeholder="Search" className="h-9 w-full flex-grow border rounded-md"/>
              <svg
                width="20"
                height="20"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-5 py-55 transform -translate-y-1/2 text-gray-400"
              >
                <path
                  d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>     
      </div>

      <ScrollArea className="w-full mt-2 h-[450px]">
       {invitesDisplay}
      </ScrollArea>
      </>
    );
  };
  
  export { InviteList };