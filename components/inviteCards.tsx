import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const InviteCard =
  ({ ...props }) => {
    
    // props are GuildId, CampaignId, name
    const router = useRouter();

    const handleClick = () => router.push(`/${props.guildId}/campaign/${props.campaignId}`)
 

    return (
        <Button
        onClick={handleClick}
        style={{ backgroundColor: "black", padding: "1rem" }}
        className="flex-row items-center justify-between w-[300px] bg-white p-5 mt-3 rounded-lg"
        type="button"
      >
        {props.name}
      </Button>
    )
  }

export { InviteCard }
