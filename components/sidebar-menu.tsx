"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";


import { InviteList } from "./inviteList";
import { AccountCard } from "./accountCard";

import Form from "@/components/logout-form";

export interface Workspace {
  _id: string;
  guild_name: string;
  name: string;
  username: string;
  // Add other properties as needed
}

interface SideBarMenuProps {
  guildId: string;
  memberId: string;
  sessionData: {
    data: {
      memberId: string;
    };
    status: string;
  };
}

export default function SideBarMenu({
  guildId,
  memberId,
  sessionData,
}: SideBarMenuProps) {
  const router = useRouter();

  console.log('sessionData in SideBarMenu:', sessionData);
  console.log('Member ID from session data:', sessionData?.data?.memberId);



  return (
    <>
      <div className="space-y-4 py-4">
        <Image
          src="/LogoDiscordCRM.png"
          alt=""
          width={100}
          height={35}
          className="relative top-15 px-5 py-5"
        ></Image>
        <div className="px-4 py-12">
          <div className="py-3 flex justify-between items-center">
            <div className="flex-grow">
              <h2 className="text-4xl font-bold justify-start tracking-tight">
                My Campaigns
              </h2>
            </div>
            <Button variant="default" className="justify-end">
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
          <div className="py-1">
            <div className="invite-list-container">
              <InviteList guildId={guildId}></InviteList>
            </div>
          </div>
          <div>
            <AccountCard 
            guildId={guildId}
            memberId={memberId}
            onData={(data) => console.log(data)}></AccountCard>
          </div>
        </div>
      </div>
    </>
  );
}
