import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";


const CampaignId = async ({ params }: { params: { guildId: string } }) => {
    console.log(params);
    
	// Same code as app/login/page.tsx
	// this code can be re-used to redirect the user from /login to / when already connected
	// There is probably a middleware solution to handle this --> BETTER SOLUTION
	const authRequest = auth.handleRequest("GET", context);
	const session = await authRequest.validate();
	if (!session) redirect("/login");

    return (
		
		<div className="flex h-full flex-1 flex-col space-y-8 p-8">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">/campaign</h2>
					<p className="text-muted-foreground">
						Guild {params.guildId} & User { session.user.userId }
					</p>

				</div>
			</div>
		</div>

	);


};

export default CampaignId;