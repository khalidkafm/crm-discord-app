// app/page.tsx
import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { Message } from "../../models/message";
import { User } from "../../models/user";

import WarningHeader from "@/components/warning-header";


const GuildIdPage = async ({ params }: { params: { guildId: string } }) => {
  console.log(params);

  // Same code as app/login/page.tsx
  // this code can be re-used to redirect the user from /login to / when already connected
  // There is probably a middleware solution to handle this --> BETTER SOLUTION
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (!session) redirect("/login");

  // Fetch messages from MongoDB
  let messages: any;

  const { username } = await User.findOne({ _id: session.user.userId }).exec();
  await Message.find().then((data: any) => {
    messages = data;
  });

  // const { guilId } = await Message.findOne({ guildId: session.user.userId}).exec()

  return (
    <>
      <h1>this is Guild Page</h1>
      <p>Username: {username} </p>
      <p>User id :{session.user.userId}</p>
      <p>Guild id : {params.guildId}</p>
    </>
  );
};

export default GuildIdPage;
