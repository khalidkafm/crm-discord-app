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
const InviteList = ({ guildId }: { guildId: string }) => {

const router = useRouter();

const [invitesData, setInvitesData] = useState<Invite[]>([]);

console.log('guildId in invitlist', guildId)

/// HERE FETCH OF WORKSPACES
const memberId = "TO CATCH FROM PARAMS OR SESSION LUCIA"

const fetchUrl = process.env.NODE_ENV === 'development'
? `http://localhost:4000/workspaces/${memberId}` // LOCAL DEV discord redirect URI goes here 
: `${process.env.PROD_BOT_URI}/workspaces/${memberId}` // PROD discord redirect URI goes here 

  useEffect(() => {
    // Fetching invites from the API Invites with Arthur's discordId
    fetch(fetchUrl)
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
      </div>

      <ScrollArea className="w-full mt-2 h-[450px]">
       {invitesDisplay}
      </ScrollArea>
      </>
    );
  };
  
  export { InviteList };