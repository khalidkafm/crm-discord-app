"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { InviteCard } from "./inviteCards"
// import { AccordionTest } from "@/components/accordionComponent"

import Form from "@/components/logout-form";
import CampaignId from "@/app/[guildId]/campaign/page";

export interface Workspace {
  _id: string;
  guild_name: string;
  name: string;
  username: string;
  // Add other properties as needed
}

// const invitesData = [
//   { name: "abceeed", _id: "55555555555555" },
//   { name: "defsasd", _id: "44444444444444" },
//   { name: "assdded", _id: "4444442f24f4ff" },
//   { name: "ouieiub", _id: "99999992929929" },
//   { name: "ekjbkef", _id: "29299393920399" },
//   { name: "lwenfjk", _id: "1-29u0192u21-9" },
//   { name: "einefio", _id: "30879216492982" },
//   { name: "weoouee", _id: "1123u9209u209u3" },
//   { name: "weoioie", _id: "123u09u1209u209" },
//   { name: "eofioie", _id: "1209u30912u33uu" },
//   { name: "weofiho", _id: "1209u309uu3u3u2" },
//   { name: "wefoubo", _id: "12093u092u10u30" },
// ];

const workspacesData = {"result":true,"arraylength":4,"tableau":[{"guild_id":"1045256538169823253","guild_name":"ArthurOnTime","user_id":"870287994173661254","username":"arthurontime","roles_array":["1054392508106428436","1065660542649389128","1045256538169823253"],"permissions":["CreateInstantInvite","KickMembers","BanMembers","Administrator","ManageChannels","ManageGuild","AddReactions","ViewAuditLog","PrioritySpeaker","Stream","ViewChannel","SendMessages","SendTTSMessages","ManageMessages","EmbedLinks","AttachFiles","ReadMessageHistory","MentionEveryone","UseExternalEmojis","ViewGuildInsights","Connect","Speak","MuteMembers","DeafenMembers","MoveMembers","UseVAD","ChangeNickname","ManageNicknames","ManageRoles","ManageWebhooks","ManageEmojisAndStickers","ManageGuildExpressions","UseApplicationCommands","RequestToSpeak","ManageEvents","ManageThreads","CreatePublicThreads","CreatePrivateThreads","UseExternalStickers","SendMessagesInThreads","UseEmbeddedActivities","ModerateMembers","ViewCreatorMonetizationAnalytics","UseSoundboard","UseExternalSounds","SendVoiceMessages"]},{"guild_id":"1064902906500886631","guild_name":"Test server #1","user_id":"870287994173661254","username":"arthurontime","roles_array":["1064902906500886631"],"permissions":["CreateInstantInvite","KickMembers","BanMembers","Administrator","ManageChannels","ManageGuild","AddReactions","ViewAuditLog","PrioritySpeaker","Stream","ViewChannel","SendMessages","SendTTSMessages","ManageMessages","EmbedLinks","AttachFiles","ReadMessageHistory","MentionEveryone","UseExternalEmojis","ViewGuildInsights","Connect","Speak","MuteMembers","DeafenMembers","MoveMembers","UseVAD","ChangeNickname","ManageNicknames","ManageRoles","ManageWebhooks","ManageEmojisAndStickers","ManageGuildExpressions","UseApplicationCommands","RequestToSpeak","ManageEvents","ManageThreads","CreatePublicThreads","CreatePrivateThreads","UseExternalStickers","SendMessagesInThreads","UseEmbeddedActivities","ModerateMembers","ViewCreatorMonetizationAnalytics","UseSoundboard","UseExternalSounds","SendVoiceMessages"]},{"guild_id":"1105467155295772694","guild_name":"Demo for Pierre","user_id":"870287994173661254","username":"arthurontime","roles_array":["1105467155295772694"],"permissions":["CreateInstantInvite","KickMembers","BanMembers","Administrator","ManageChannels","ManageGuild","AddReactions","ViewAuditLog","PrioritySpeaker","Stream","ViewChannel","SendMessages","SendTTSMessages","ManageMessages","EmbedLinks","AttachFiles","ReadMessageHistory","MentionEveryone","UseExternalEmojis","ViewGuildInsights","Connect","Speak","MuteMembers","DeafenMembers","MoveMembers","UseVAD","ChangeNickname","ManageNicknames","ManageRoles","ManageWebhooks","ManageEmojisAndStickers","ManageGuildExpressions","UseApplicationCommands","RequestToSpeak","ManageEvents","ManageThreads","CreatePublicThreads","CreatePrivateThreads","UseExternalStickers","SendMessagesInThreads","UseEmbeddedActivities","ModerateMembers","ViewCreatorMonetizationAnalytics","UseSoundboard","UseExternalSounds","SendVoiceMessages"]},{"guild_id":"1111297199654060212","guild_name":"Black","user_id":"870287994173661254","username":"arthurontime","roles_array":["1111297199654060212"],"permissions":["CreateInstantInvite","KickMembers","BanMembers","Administrator","ManageChannels","ManageGuild","AddReactions","ViewAuditLog","PrioritySpeaker","Stream","ViewChannel","SendMessages","SendTTSMessages","ManageMessages","EmbedLinks","AttachFiles","ReadMessageHistory","MentionEveryone","UseExternalEmojis","ViewGuildInsights","Connect","Speak","MuteMembers","DeafenMembers","MoveMembers","UseVAD","ChangeNickname","ManageNicknames","ManageRoles","ManageWebhooks","ManageEmojisAndStickers","ManageGuildExpressions","UseApplicationCommands","RequestToSpeak","ManageEvents","ManageThreads","CreatePublicThreads","CreatePrivateThreads","UseExternalStickers","SendMessagesInThreads","UseEmbeddedActivities","ModerateMembers","ViewCreatorMonetizationAnalytics","UseSoundboard","UseExternalSounds","SendVoiceMessages"]}]};

interface Invite {
  _id: string;
  name: string;
  // Add other properties as needed
}

export default function SideBarMenu({ guildId }: { guildId: string }) {
  const router = useRouter();
  const [invitesData, setInvitesData] = useState<Invite[]>([]);
  const [workspacesData, setWorkspacesData] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  useEffect(() => {
    // Fetch invites from the API Invites with Arthur's discordId
    fetch(
      `https://crm-discord-bot-production.up.railway.app/invites/1045256538169823253`
    )
      .then((response) => response.json())
      .then((invitesApiData) => {
        if (!invitesApiData.result) {
          console.log("Result is false check invites API");
        } else {
          const invites = invitesApiData.invites.map((invite : any) => ({...invite,
            handleClick: () => router.push(`/${guildId}/campaign/${invite._id}`),
          }));
          setInvitesData(invites);
        }
      });
  }, [guildId, router]);

  // useEffect(() => {
  //   fetch(`https://crm-discord-bot-production.up.railway.app/users/workspaces/1181620672582135900`)
  //   .then((response) => response.json())
  //   .then((workspaceApiData) => {
  //     if (!workspaceApiData.result){
  //       console.log("Result is false check invites API");
  //     } else {
  //       const workspace = workspaceApiData.tableau.map((workspace) => ({...workspace,
  //       handleClick: () => setSelectedWorkspace(workspace.name),
  //      }));
  //      setWorkspacesData(workspace);
  //     }
  //   })
  // })

  const invitesDisplay = invitesData.map((invite, i) => (
    <div key={i} className="flex flex-row justify-between">
      <InviteCard name={invite.name} guildId={guildId} campaignId={invite._id} /> 
      {/* <Button
        onClick={invite.handleClick}
        style={{ backgroundColor: "black", padding: "1rem" }}
        className="flex-row items-center justify-between w-[300px] bg-white p-5 mt-3 rounded-lg"
        type="button"
      >
        {invite.name}
      </Button> */}
    </div>
  ));


  return (
    <>
      <div className="flex justify-center items-center flex-col h-screen">
        <Image
          src="/Logo-Mockup.png"
          alt=""
          width={300}
          height={100}
          style={{ margin: "10px", padding: "10px", borderRadius: "20px" }}
        ></Image>
        <div className="flex flex-col h-[100%] w-[350px] justify-center items-center">
          <div className="flex justify-evenly items-baseline p-6 h-[100px] w-[350px]">
            <p className="ml-6">MY CAMPAIGNS</p>
            <Button style={{ backgroundColor: "black", padding: "1rem" }}>
              New
            </Button>
          </div>
          <div className="flex">
            <Input
              style={{ backgroundColor: "zinc", padding: "1rem" }}
              placeholder="Search"
              className="p-1 pl-6 ml-14 mb-2 w-[350px] rounded-md bg-gray-200 p-6 [&[data-state=open]>svg] "
            ></Input>
            <div>
              <svg
                width="30"
                height="30"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className=""
              >
                <path
                  d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>

          <ScrollArea className="h-[450px] w-[350px] rounded-md border p-6 ml-6">
          {invitesDisplay}
          </ScrollArea>
          <Accordion
            type="single"
            collapsible
            className="flex flex-col h-[50px] w-[350px] rounded-md border p-6 ml-6 items-center justify-evenly py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
          >
            <AccordionItem
              className="flex flex-row justify-center"
              value="item-1"
            >
              <AccordionTrigger className="flex justify-evenly">
                <div className="flex justify-evenly">
                  <p className="text-{100px}">My server 2</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex ml-100 flex-row justify-center overflow-hidden w-[220px] bg-zinc-200 text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-up">
                <div className="flex flex-col">
                  <div>
                    <h3
                      style={{
                        backgroundColor: "zinc",
                        padding: "1rem",
                        fontSize: "200",
                      }}
                    >
                      Select Workspace
                    </h3>
                    <div>
                      
                    </div>
                    <p className="text-{50px}">My server 1</p>
                    <p>My server 5</p>
                    <Button
                      style={{ backgroundColor: "black", padding: "1rem" }}
                    >
                      add new server
                    </Button>
                  </div>
                  <div className="flex flex-row">
                    <p>Username:</p>
                    <Form action="/api/logout">
                      <input type="submit" value="Sign out" />
                    </Form>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
}
