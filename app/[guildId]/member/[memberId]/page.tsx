import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

import WarningHeader from "@/components/warning-header";

const memberId = async ({ params }: { params: { memberId: string, guildId: string } }) => {
  console.log(params);

  // Same code as app/login/page.tsx
  // this code can be re-used to redirect the user from /login to / when already connected
  // There is probably a middleware solution to handle this --> BETTER SOLUTION
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (!session) redirect("/login");

  return (
    <>
     
      <h1>this is Members Page</h1>
      <p>User id :{session.user.userId}</p>
      <p>Member id : {params.memberId}</p>
    </>
  );
};

export default memberId;
