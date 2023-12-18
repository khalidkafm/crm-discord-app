import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface Workspace {
  guild_id: string;
  guild_name: string;
  user_id: string;
  username: string;
  roles_array: string[];
  permissions: string[];
}

interface AccountCardsProps {
  memberId: string;
  guildId: string;
  onData: (data: Workspace) => void;
}

export const AccountCard: React.FC<AccountCardsProps> = ({ memberId, guildId, onData }) => {
  const router = useRouter();
  const [workspacesData, setWorkspacesData] = useState<Workspace[]>([]);

  const fetchUrl =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:4000/users/workspaces/${memberId}`
      : `${process.env.NEXT_PUBLIC_PROD_BOT_URI}/workspaces/${memberId}`;
      console.log('Received data from fetchUrl:',{memberId});


  useEffect(() => {
    console.log('Fetching data for memberId:', memberId);

    fetch(fetchUrl)
      .then((response) => response.json())
      .then((workspacesApiData) => {
        console.log('Received workspaces API data:', workspacesApiData);

        // if (!workspacesApiData.result) {
        //   console.log('Result is false, check invites API');
        // } else {
        //   const userData = workspacesApiData.tableau.find((data: any) => data.user_id === memberId);
        //   if (userData) {
        //     setWorkspacesData([userData]);
        //     onData(userData); // Call the callback with the user data
        //   }
        // }
      })
      
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [memberId, router, fetchUrl, onData]);

  const renderServers = (servers: string[]) => {
    return servers.map((serverId) => (
      <p key={serverId} className="text-[14px]">
        {serverId}
      </p>
    ));
  };

  const renderAccordionItems = () => {
    console.log('Rendering Accordion items:', workspacesData);
    return workspacesData.map((workspace) => (
      <AccordionItem key={workspace.guild_id} className="flex flex-row justify-center" value={workspace.guild_id}>
        <AccordionTrigger className="flex justify-evenly">
          <div className="flex justify-evenly">
            <p className="text-[16px]">{workspace.guild_name}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex ml-100 flex-row justify-center overflow-hidden w-[220px] bg-zinc-200 text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-up">
          <div className="flex flex-col">
            <div>
              <h3
                style={{
                  backgroundColor: "zinc",
                  padding: "1rem",
                  fontSize: "20px",
                }}
              >
                Select Workspace
              </h3>
              {renderServers(workspace.roles_array)}
              <Button style={{ backgroundColor: "black", padding: "1rem" }}>Add new server</Button>
            </div>
            <div className="flex flex-row">
              <p>Username: {workspace.username}</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    ));
  };

  console.log('Rendering AccountCard with memberId:', memberId);

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="flex flex-col h-[50px] w-[350px] rounded-md border p-6 ml-6 items-center justify-evenly py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
      >
        {renderAccordionItems()}
      </Accordion>
    </>
  );
};