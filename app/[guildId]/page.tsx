// app/page.tsx
import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { Message } from "../../models/message";
import { User } from "../../models/user";


const GuildIdPage = async ({ params }: { params: { guildId: string } }) => {

  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  const { username } = await User.findOne({ _id: session.user.userId }).exec();

  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome {username}</h2>
            <p className="text-muted-foreground">
              Select an invite from {params.guildId}
            </p>
            <p className="text-muted-foreground">
              to view its performance 
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuildIdPage;
