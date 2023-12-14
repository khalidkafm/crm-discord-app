import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

import WarningHeader from "@/components/warning-header";
import SideBarMenu from "@/components/sidebar-menu";

import { User } from "../../../models/user";
import { Message } from "../../../models/message";



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

  // Fetch messages from MongoDB
  let messages: any;

  const { username } = await User.findOne({ _id: session.user.userId }).exec();
  await Message.find().then((data: any) => {
    messages = data;
  });
  return (
    <>
 
        <div className="flex-1 bg-gray-300 p-4 overflow-hidden">
            {children}
        </div>
    </>

  );
}
