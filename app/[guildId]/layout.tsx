import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

import WarningHeader from "@/components/warning-header";
import SideBarMenu from "@/components/sidebar-menu";

import { User } from "../../models/user";
import { Message } from "../../models/message";

interface GuildIdParams {
  guildId: string;
  memberId: string;
}

export default async function GuildId({
  params,
  children,
}: {
  params: GuildIdParams;
  children: React.ReactNode;
}) {
  const authRequest:any = auth.handleRequest("GET", context);
  const session = await authRequest.validate();

  if (!session) redirect("/login");

  const { username, discordId } = await User.findOne({ _id: session.user.userId }).exec();


const memberId = discordId;
console.log(memberId);

 

  return (
    <>
        <div className="flex h-screen">
        <div className="w-1/4 bg-gray-75 border-r-2 border-solid border-gray-500">
            <SideBarMenu guildId={params.guildId} memberId={memberId} sessionData={{ data: { memberId}, status: 'authenticated' }}></SideBarMenu>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
            {children}
        </div>
    </div>
    </>


  );
}
