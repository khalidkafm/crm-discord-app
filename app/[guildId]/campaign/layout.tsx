import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

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
     {children}
    </>

  );
}
