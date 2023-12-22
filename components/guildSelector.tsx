"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BotAuthForm } from "./botSetupForm";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Form from "@/components/logout-form";

interface Workspace {
  guild_id: string;
  guild_name: string;
  guild_icon: string;
  user_id: string;
  username: string;
  roles_array: string[];
  permissions: string[];
}

interface AccountCardsProps {
  guildId: string;
  memberId: string;
  guildIcon: string;
  onData: (data: Workspace) => void;
}

type Server = {
  label: string;
  value: string;
  icon: string;
};

//to delete PopoverTriggerProps not used
type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

//to delete TeamSwitcherProps not used
interface TeamSwitcherProps extends PopoverTriggerProps {}

export const GuildSelector: React.FC<AccountCardsProps> = ({
  memberId,
  guildId,
  guildIcon: initialGuildIcon,
  onData,
}) => {
  const router = useRouter();
  const [workspacesData, setWorkspacesData] = useState<Workspace[]>([]);
  const [open, setOpen] = React.useState(false);
  const [showAddGuildDialog, setShowAddGuildDDialog] = React.useState(false);
  const [selectedGuild, setSelectedGuild] = React.useState<Server | null>(null);
  const [guildIcon, setGuildIcon] = useState<string | null>(initialGuildIcon);

  const fetchUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:4000/users/workspaces/${memberId}`
      : `${process.env.NEXT_PUBLIC_PROD_BOT_URI}/users/workspaces/${memberId}`;
  //console.log("Received data from fetchUrl:", { memberId });

  useEffect(() => {
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((workspacesApiData) => {
        //console.log("Received workspaces API data:", workspacesApiData);

        if (!workspacesApiData.result) {
          //console.log("Result is false, check invites API");
        } else {
          const userData = workspacesApiData.tableau.find((data: any) => {
            return data.user_id === memberId;
          });

          if (userData) {
            setWorkspacesData(workspacesApiData.tableau);
            onData(userData); // Call the callback with the user data
            setSelectedGuild({
              label: userData.guild_name,
              value: userData.guild_id,
              icon: userData.guild_icon,
            });
          }
          setGuildIcon(userData.guild_icon);
        }
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [memberId, router, fetchUrl, guildIcon, onData]);

  const activeGuildData = workspacesData.find(
    (item) => item.guild_id == guildId
  );

  //console.log('activeGuildData : ',activeGuildData)

  return (
    <div>
      <Dialog open={showAddGuildDialog} onOpenChange={setShowAddGuildDDialog}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a team"
              className={cn("w-full justify-between", memberId)}
            >
              {selectedGuild && (
                <>
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://cdn.discordapp.com/icons/${activeGuildData?.guild_id}/${activeGuildData?.guild_icon}.webp?size=240`}
                      alt={activeGuildData?.guild_name}
                    />
                    <AvatarFallback>
                      <DiscordLogoIcon></DiscordLogoIcon>
                    </AvatarFallback>
                  </Avatar>

                    <div>
                      {activeGuildData?.guild_name}
                    </div>
                    <div className="pl-3">
                  <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                 </span></div>
                  <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[398px] p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search server..." />
                <h3 className="text-foreground px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  My Workspace
                </h3>

                <CommandEmpty>No guild found.</CommandEmpty>
                <CommandSeparator />
                {workspacesData.map((workspace) => (
                  <CommandGroup
                    key={workspace.guild_id}
                    className="overflow-hidden p-1 text-foreground px-2 py-1.5 text-s font-medium text-muted-foreground"
                  >
                    <CommandItem
                      key={"value"}
                      onSelect={(value) => {
                        setSelectedGuild({
                          label: workspace.guild_name,
                          value: workspace.guild_id,
                          icon: workspace.guild_icon,
                        });
                        setOpen(false);

                        // Use the router to navigate to the guild page with the selected guildId
                        router.push(`/${workspace.guild_id}`, {
                          shallow: true,
                        });
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://cdn.discordapp.com/icons/${workspace.guild_id}/${workspace.guild_icon}.webp?size=240`}
                          alt={workspace.guild_name}
                          className=""
                        />
                        <AvatarFallback>
                          <DiscordLogoIcon></DiscordLogoIcon>
                        </AvatarFallback>
                      </Avatar>
                      {workspace.guild_name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          guildId === workspace.guild_id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
            <Command>
              <CommandSeparator />
              <CommandList>
                <CommandGroup>
                  <DialogTrigger  asChild>
                    <CommandItem
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-white aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      )}
                      onSelect={() => {
                        setOpen(false);
                        setShowAddGuildDDialog(true);
                      }}
                    >
                      <PlusCircledIcon className="mr-2 h-5 w-5" />
                      add guild
                    </CommandItem>
                  </DialogTrigger>
                  {selectedGuild && (
                    <div className="flex items-center justify-between">
                      <p className="overflow-hidden p-1 px-2 py-1.5 text-s text-muted-foreground">
                        {workspacesData[0]?.username}
                      </p>
                      <Form action="/api/logout">
                        <Button variant="destructive">logout</Button>
                      </Form>
                    </div>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <DialogContent>
          <DialogHeader></DialogHeader>
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Connect the bot
              </h1>
              <p className="text-sm text-muted-foreground">
                Click continue to connect your Discord server
              </p>
            </div>
            <BotAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
