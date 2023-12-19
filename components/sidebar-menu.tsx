"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { InviteList } from "./inviteList";


import Form from "@/components/logout-form";

export interface Workspace {
  _id: string;
  guild_name: string;
  name: string;
  username: string;
  // Add other properties as needed
}

const workspacesData = {
  result: true,
  arraylength: 4,
  tableau: [
    {
      guild_id: "1045256538169823253",
      guild_name: "ArthurOnTime",
      user_id: "870287994173661254",
      username: "arthurontime",
      roles_array: [
        "1054392508106428436",
        "1065660542649389128",
        "1045256538169823253",
      ],
      permissions: [
        "CreateInstantInvite",
        "KickMembers",
        "BanMembers",
        "Administrator",
        "ManageChannels",
        "ManageGuild",
        "AddReactions",
        "ViewAuditLog",
        "PrioritySpeaker",
        "Stream",
        "ViewChannel",
        "SendMessages",
        "SendTTSMessages",
        "ManageMessages",
        "EmbedLinks",
        "AttachFiles",
        "ReadMessageHistory",
        "MentionEveryone",
        "UseExternalEmojis",
        "ViewGuildInsights",
        "Connect",
        "Speak",
        "MuteMembers",
        "DeafenMembers",
        "MoveMembers",
        "UseVAD",
        "ChangeNickname",
        "ManageNicknames",
        "ManageRoles",
        "ManageWebhooks",
        "ManageEmojisAndStickers",
        "ManageGuildExpressions",
        "UseApplicationCommands",
        "RequestToSpeak",
        "ManageEvents",
        "ManageThreads",
        "CreatePublicThreads",
        "CreatePrivateThreads",
        "UseExternalStickers",
        "SendMessagesInThreads",
        "UseEmbeddedActivities",
        "ModerateMembers",
        "ViewCreatorMonetizationAnalytics",
        "UseSoundboard",
        "UseExternalSounds",
        "SendVoiceMessages",
      ],
    },
    {
      guild_id: "1064902906500886631",
      guild_name: "Test server #1",
      user_id: "870287994173661254",
      username: "arthurontime",
      roles_array: ["1064902906500886631"],
      permissions: [
        "CreateInstantInvite",
        "KickMembers",
        "BanMembers",
        "Administrator",
        "ManageChannels",
        "ManageGuild",
        "AddReactions",
        "ViewAuditLog",
        "PrioritySpeaker",
        "Stream",
        "ViewChannel",
        "SendMessages",
        "SendTTSMessages",
        "ManageMessages",
        "EmbedLinks",
        "AttachFiles",
        "ReadMessageHistory",
        "MentionEveryone",
        "UseExternalEmojis",
        "ViewGuildInsights",
        "Connect",
        "Speak",
        "MuteMembers",
        "DeafenMembers",
        "MoveMembers",
        "UseVAD",
        "ChangeNickname",
        "ManageNicknames",
        "ManageRoles",
        "ManageWebhooks",
        "ManageEmojisAndStickers",
        "ManageGuildExpressions",
        "UseApplicationCommands",
        "RequestToSpeak",
        "ManageEvents",
        "ManageThreads",
        "CreatePublicThreads",
        "CreatePrivateThreads",
        "UseExternalStickers",
        "SendMessagesInThreads",
        "UseEmbeddedActivities",
        "ModerateMembers",
        "ViewCreatorMonetizationAnalytics",
        "UseSoundboard",
        "UseExternalSounds",
        "SendVoiceMessages",
      ],
    },
    {
      guild_id: "1105467155295772694",
      guild_name: "Demo for Pierre",
      user_id: "870287994173661254",
      username: "arthurontime",
      roles_array: ["1105467155295772694"],
      permissions: [
        "CreateInstantInvite",
        "KickMembers",
        "BanMembers",
        "Administrator",
        "ManageChannels",
        "ManageGuild",
        "AddReactions",
        "ViewAuditLog",
        "PrioritySpeaker",
        "Stream",
        "ViewChannel",
        "SendMessages",
        "SendTTSMessages",
        "ManageMessages",
        "EmbedLinks",
        "AttachFiles",
        "ReadMessageHistory",
        "MentionEveryone",
        "UseExternalEmojis",
        "ViewGuildInsights",
        "Connect",
        "Speak",
        "MuteMembers",
        "DeafenMembers",
        "MoveMembers",
        "UseVAD",
        "ChangeNickname",
        "ManageNicknames",
        "ManageRoles",
        "ManageWebhooks",
        "ManageEmojisAndStickers",
        "ManageGuildExpressions",
        "UseApplicationCommands",
        "RequestToSpeak",
        "ManageEvents",
        "ManageThreads",
        "CreatePublicThreads",
        "CreatePrivateThreads",
        "UseExternalStickers",
        "SendMessagesInThreads",
        "UseEmbeddedActivities",
        "ModerateMembers",
        "ViewCreatorMonetizationAnalytics",
        "UseSoundboard",
        "UseExternalSounds",
        "SendVoiceMessages",
      ],
    },
    {
      guild_id: "1111297199654060212",
      guild_name: "Black",
      user_id: "870287994173661254",
      username: "arthurontime",
      roles_array: ["1111297199654060212"],
      permissions: [
        "CreateInstantInvite",
        "KickMembers",
        "BanMembers",
        "Administrator",
        "ManageChannels",
        "ManageGuild",
        "AddReactions",
        "ViewAuditLog",
        "PrioritySpeaker",
        "Stream",
        "ViewChannel",
        "SendMessages",
        "SendTTSMessages",
        "ManageMessages",
        "EmbedLinks",
        "AttachFiles",
        "ReadMessageHistory",
        "MentionEveryone",
        "UseExternalEmojis",
        "ViewGuildInsights",
        "Connect",
        "Speak",
        "MuteMembers",
        "DeafenMembers",
        "MoveMembers",
        "UseVAD",
        "ChangeNickname",
        "ManageNicknames",
        "ManageRoles",
        "ManageWebhooks",
        "ManageEmojisAndStickers",
        "ManageGuildExpressions",
        "UseApplicationCommands",
        "RequestToSpeak",
        "ManageEvents",
        "ManageThreads",
        "CreatePublicThreads",
        "CreatePrivateThreads",
        "UseExternalStickers",
        "SendMessagesInThreads",
        "UseEmbeddedActivities",
        "ModerateMembers",
        "ViewCreatorMonetizationAnalytics",
        "UseSoundboard",
        "UseExternalSounds",
        "SendVoiceMessages",
      ],
    },
  ],
};

interface Invite {
  _id: string;
  name: string;
  guildId: string;
  // Add other properties as needed
}

export default function SideBarMenu({ guildId }: { guildId: string }) {
  const router = useRouter();

  // const [workspacesData, setWorkspacesData] = useState<Workspace[]>([]);
  // const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  // // useEffect(() => {
  // //   fetch(`https://crm-discord-bot-production.up.railway.app/users/workspaces/1181620672582135900`)
  // //   .then((response) => response.json())
  // //   .then((workspaceApiData) => {
  // //     if (!workspaceApiData.result){
  // //       console.log("Result is false check invites API");
  // //     } else {
  // //       const workspace = workspaceApiData.tableau.map((workspace) => ({...workspace,
  // //       handleClick: () => setSelectedWorkspace(workspace.name),
  // //      }));
  // //      setWorkspacesData(workspace);
  // //     }
  // //   })
  // // })

  // const invitesDisplay = invitesData.map((invite, i) => (
  //   <div key={i} className="flex flex-row justify-between">
  //     <InviteCard name={invite.name} guildId={guildId} campaignId={invite._id} />
  //   </div>
  // ));

  return (
    <>
      <div className="space-y-4 py-4">
        <Image
          src="/Logo-Mockup.png"
          alt=""
          width={100}
          height={35}
          className="relative top-15 px-4"
        ></Image>
        <div className="px-5 py-9">
          <div className="py-10 flex  w-full">
            <h2 className="px-2 text-4xl font-bold justify-start tracking-tight">Campaign</h2>
              <Button variant="default" className="justify-end">
                <PlusCircledIcon className="mr-2 h-4 w-4" />
                New
              </Button>
          </div>
          <InviteList guildId={guildId}></InviteList>
          
        </div>
      </div>
    </>
  );
}
