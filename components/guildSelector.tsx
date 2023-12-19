"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { any, string } from "zod";

import Form from "@/components/logout-form";
import { Icon } from "@radix-ui/react-select";

interface Workspace {
  guild_id: string;
  guild_name: string;
  guild_icon:string;
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

// interface CommandInputProps {
//     placeholder: string; 
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   // ... other command input-related props
// }

type Server = {
  label: string;
  value: string;
//   icon: string;
};

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

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
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedGuild, setSelectedGuild] = React.useState<Server | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [guildIcon, setGuildIcon] = useState<string | null>(initialGuildIcon);

  const fetchUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:4000/users/workspaces/${memberId}`
      : `${process.env.NEXT_PUBLIC_PROD_BOT_URI}/workspaces/${memberId}`;
  //   console.log("Received data from fetchUrl:", { memberId });

  useEffect(() => {
    console.log("Fetching data for memberId:", memberId);
    console.log("Current Search Term:", searchTerm);

    fetch(fetchUrl)
      .then((response) => response.json())
      .then((workspacesApiData) => {
        // console.log("Received workspaces API data:", workspacesApiData);

        if (!workspacesApiData.result) {
          //   console.log("Result is false, check invites API");
        } else {
          const userData = workspacesApiData.tableau.find((data: any) => {
            console.log("Checking data:", data);
            console.log("Guild Icon in API data:", data.guild_icon);
            // return data.user_id === memberId
            return data.user_id === memberId;
          });

          if (userData) {
            console.log("User Data:", userData);

            setWorkspacesData([userData]);
            onData(userData); // Call the callback with the user data
            setSelectedGuild({
              label: userData.guild_name,
              value: userData.guild_id,
            });
          }
          setGuildIcon(userData.guild_icon);
        }
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [memberId, router, fetchUrl, guildIcon, onData, searchTerm]);

  const filteredWorkspaces = workspacesData.filter((workspace) =>
    workspace.guild_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
 
    <div>
    <Dialog  open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover  open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full">
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
                      src={`https://cdn.discordapp.com/icons/${selectedGuild.value}/${guildIcon}.webp?size=240`}
                      alt={selectedGuild.label}
                    />
                    <AvatarFallback>H</AvatarFallback>
                  </Avatar>
                  {selectedGuild.label}
                  <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </>
              )}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
        
          <Command >
            <CommandList>
              <CommandInput
                placeholder="Search server..."
                // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                //   setSearchTerm(e.target.value);
                //   console.log("Search Term:", e.target.value);
                // }}
              />    
              {filteredWorkspaces.length === 0 && (
                <CommandEmpty>No Server found.</CommandEmpty>
              )}
              {filteredWorkspaces.map((workspace) => (
                <CommandGroup
                  key={workspace.guild_id}
                  heading="My workspace"
                  style={{ fontSize: "10px" }}
                >
                  <CommandItem
                    onSelect={() => {
                      setSelectedGuild({
                        label: workspace.guild_name,
                        value: workspace.guild_id,
                        // icon: workspace.guild_icon,
                      });
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://cdn.discordapp.com/icons/${workspace.guild_id}/${guildIcon}.webp?size=240`}
                        alt={workspace.guild_name}
                        className="grayscale"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {workspace.guild_name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedGuild?.value === workspace.guild_id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    add guild
                  </CommandItem>
                </DialogTrigger>
                {selectedGuild && (
                  <div className="flex items-center justify-between">
                    <p className="px-6mr-2 h-5 w-5">
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
        <DialogHeader>
          <DialogTitle>add guild</DialogTitle>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
};
