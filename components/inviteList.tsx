import * as React from "react";
import { useRouter } from "next/navigation";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { useEffect, useState } from "react";

import { ScrollArea } from "./ui/scroll-area";
import { InviteCard } from "./inviteCards";
import { Input } from "./ui/input";
import { NewInvite } from "./newInvite";

//Adding types for Invite to manage typeScript expectations
interface Invite {
  _id: string;
  name: string;
  guildId: string;
  guild: string;
  description: string
  code: string;
  // Add other properties as needed
}

//props are guildId more to be added
const InviteList: React.FC<{ guildId: string}> = ({
  guildId,
}) => {
  const router = useRouter();

  const [invitesData, setInvitesData] = useState<Invite[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

const [refresh, setRefresh] = React.useState<boolean>(false);
//const [actualPage, setActualPage] = React.useState<string>('');

console.log('guildId in invitlist', guildId)
  // console.log("guildId in invitlist", guildId);

const refreshPage=(myPage: any)=>{
  //setActualPage(myPage)
  console.log('invitesData : ', invitesData[0]._id, "myPage : ", myPage)
  if(refresh){

    setRefresh(false)
  }else if(!refresh){
    setRefresh(true)
  }
  console.log('test page invitelist: ', invitesData[0]._id )
    
    const actualUrl = window.location.href
    const match = actualUrl.match(/\/campaign\/([^\/]+)/);
      if (match) {
        router.refresh()
      }
}



  useEffect(() => {
    const fetchUrl =
      process.env.NODE_ENV === "development"
        ? `http://localhost:4000/invites/${guildId}` // LOCAL DEV discord redirect URI goes here
        : `${process.env.NEXT_PUBLIC_PROD_BOT_URI}/invites/${guildId}`; // PROD discord redirect URI goes here
    // Fetching invites from the API Invites with Arthur's discordId
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((invitesApiData) => {
        if (!invitesApiData.result) {
          console.log("Result is false check invites API");
        } else {
          const invites = invitesApiData.invites.map((invite: any) => ({
            ...invite,
          }));
          setInvitesData(invites);
        }
      });
  }, [refresh,guildId]);
  // console.log('invitesData:', invitesData);

  // Filter the list of invites based on the searchQuery.
  // Each invite is an object with a 'code' property, and we want to check
  // if the lowercase, trimmed 'code' includes the lowercase, trimmed 'searchQuery'.
  // This helps in searching and displaying only the invites that match the search query.
  const filteredInvites = invitesData.filter((invite) => {
  // Extract the 'code' property from the invite, defaulting to an empty string if undefined.
    const name = invite.name || "";
    const match =
      // Check if the lowercase, trimmed 'code' includes the lowercase, trimmed 'searchQuery'.
      name.trim().toLowerCase().includes(searchQuery.trim().toLowerCase());
    // Return true if there's a match, indicating that this invite should be included in the filtered list.
    return match;
  });

  // Map the filteredInvites array to create an array of React elements representing the filtered invite cards.
  // Each invite card is wrapped in a <div> with flex styling for layout purposes.
  const filteredInvitesElements = filteredInvites.map((invite, i) => (
    <div
      key={i}
      className="flex flex-row justify-between mb-2"
      style={{ marginRight: i < filteredInvites.length - 1 ? "8px" : 0 }}
    >
      <InviteCard
        name={invite.name}
        description={invite.description}
        guildId={invite.guild}
        campaignId={invite._id}
        refreshPage={refreshPage}
      />
    </div>
  ));

  return (
    <>
      <div className="py-3 flex justify-between items-start pl-3 pr-3 flex-col md:flex-row">
        <h2 className="text-2xl font-bold tracking-tight">
          Campaigns
        </h2>
        <NewInvite IDGuild={guildId} refreshPage={refreshPage} guildId={guildId}/>
      </div>
      <div className="flex items-center w-full">

    <div className="relative flex-grow pl-2 pr-2">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
      <Input
        placeholder="Search"
        value={searchQuery}
        className="h-9 w-full pl-10 border rounded-md"
        onChange={(event) => setSearchQuery(event.target.value)}
      />
    </div>
  </div>
  <ScrollArea className="w-full mt-1 h-[500px]">
    {filteredInvitesElements}
  </ScrollArea>
    </>
  );
};

export { InviteList };
