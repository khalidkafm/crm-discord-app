

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import Form from "@/components/logout-form";


export default function AccordionTest({ guildId }: { guildId: string }) {
  const router = useRouter();

  const [workspacesData, setWorkspacesData] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://crm-discord-bot-production.up.railway.app/users/workspaces/1181620672582135900`)
      .then((response) => response.json())
      .then((workspaceApiData) => {
        if (!workspaceApiData.result) {
          console.log("Result is false, check workspaces API");
        } else {
          const workspaces = workspaceApiData.tableau.map((workspace) => ({
            ...workspace,
            handleClick: () => setSelectedWorkspace(workspace.guild_name),
          }));
          setWorkspacesData(workspaces);
        }
      });
  }, []);

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="flex flex-col h-[50px] w-[350px] rounded-md border p-6 ml-6 items-center justify-evenly py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
      >
        {workspacesData.map((workspace, index) => (
          <AccordionItem key={index} value={workspace.guild_name}>
            <AccordionTrigger className="flex justify-evenly">
              <div className="flex justify-evenly">
                <p className="text-{100px}">{selectedWorkspace || 'Choose a Workspace'}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex ml-100 flex-row justify-center overflow-hidden w-[220px] bg-zinc-200 text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-up">
              {workspace.guild_name}
              <div className="flex flex-col">
                <div>
                  <h3
                    style={{
                      backgroundColor: "zinc",
                      padding: "1rem",
                      fontSize: "200",
                    }}
                  >
                    Select Workspace
                  </h3>
                  <p className="text-{50px}">{workspace.name}</p>
                  {/* Other content related to the workspace */}
                  <Button
                    style={{ backgroundColor: "black", padding: "1rem" }}
                  >
                    Add new workspace
                  </Button>
                </div>
                <div className="flex flex-row">
                  <p>Username: {workspace.username}</p>
                  <Form action="/api/logout">
                    <input type="submit" value="Sign out" />
                  </Form>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
