import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

import WarningHeader from "@/components/warning-header";
import SideBarMenu from "@/components/sidebar-menu";

import { User } from "../../models/user";
import { Message } from "../../models/message";



export default async function GuildId({
  params,
  children,
}: {
  params: { guildId: string };
  children: React.ReactNode;
}) {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();

  if (!session) redirect("/login");

  return (
    <>
        <div className="flex h-screen">
          <div className="w-1/4 overflow-y-auto">
              <SideBarMenu guildId={params.guildId}></SideBarMenu>
          </div>
          <div className="flex-1 overflow-y-auto">
              {children}
          </div>
        </div>
    </>


  );
}
