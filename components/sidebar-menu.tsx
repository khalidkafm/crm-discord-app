"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { InviteList } from "./inviteList";
import { AccountCard } from "./accountCard";

import Form from "@/components/logout-form";
import { GuildSelector } from "./guildSelector";
import { NewInvite } from "./newInvite";

export interface Workspace {
  _id: string;
  guild_name: string;
  name: string;
  username: string;
  guild_icon:string;
  description:string;

  
  // Add other properties as needed
}

interface SideBarMenuProps {
  guildId: string;
  memberId: string;
  guildIcon : string;
  sessionData: {
    data: {
      memberId: string;
    };
    status: string;
  };
  // description: string;
}

export default function SideBarMenu({
  guildId,
  memberId,
  guildIcon,
  sessionData,
  // description,
}: SideBarMenuProps) {
  const router = useRouter();

  // console.log("sessionData in SideBarMenu:", sessionData);
  // console.log("Member ID from session data:", sessionData?.data?.memberId);
  console.log('SIDEBAR : ', guildId, memberId)

  
    const IDGuild = guildId;
  

  return (
    <div>
      <div className="space-y-4 py-4 overflow-hidden">
        <Image
          src="/LogoDiscordCRM.png"
          alt=""
          width={100}
          height={35}
          className="relative top-15 px-5 py-5"
        ></Image>
        <div className="py-0 justify-between items-start">
          <div className="py-0 flex justify-between items-center">
            <div className="flex-grow">
              
            </div>
            {/* <Button variant="default" className="justify-end">
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              <NewInvite/>
              New
            </Button> */}
            <div>

            </div>
          </div>
          <div className="py-1">
            <div className="invite-list-container">
              <InviteList guildId={guildId} ></InviteList>
            </div>
          </div>
          <div className="py-5">
          <GuildSelector
            guildId={guildId}
            memberId={memberId}
            guildIcon={guildIcon}
            onData={(data) => console.log(data)}
          ></GuildSelector>
          </div>

        </div>
      </div>
    </div>
  );
}
