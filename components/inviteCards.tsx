import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"


const InviteCard =
  ({ ...props }) => {

    const [open, setIsOpen] = React.useState<boolean>(false)
  const [linkName, setLinkName] = React.useState<string>('')
  const [linkDescription, setLinkDescription] = React.useState<string>('')
  const [isHovered, setIsHovered] = React.useState<boolean>(false);

     const linkId: any = props.campaignId
     console.log(linkId)
    
    // props are GuildId, CampaignId, name
    const router = useRouter();

    const handleClick = () => router.push(`/${props.guildId.replace(/^0+/, '')}/campaign/${props.campaignId}`)
    
    const fetchUrl = process.env.NODE_ENV === 'development'
    ? `http://localhost:4000/invites/edit/${linkId}` // LOCAL DEV discord redirect URI goes here 
    : `${process.env.NEXT_PUBLIC_PROD_BOT_URI}/invites/edit/${linkId}` // PROD discord redirect URI goes here

    const handleSave = async () =>{ 
      await fetch(fetchUrl, {
        method:'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: linkName, description: linkDescription}),
      }).then(response=>response.json()).then(data=>{        
        setIsOpen(false)
        props.refreshPage(props.campaignId)
        console.log(props)
      })
    }

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  
 

    return (
        <Button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        variant = "ghost"
        className="flex-row items-center justify-between w-[300px] bg-white p-5 mt-3 rounded-lg"
        type="button"
      >
        {props.name}
        
    
        {isHovered && <p>{linkDescription}</p>}
        <Dialog open={open} onOpenChange={setIsOpen} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
            <DialogDescription>
            You can change the name of your invite and its description
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <h4 className="text-sm text-muted-foreground">
              Invites informations
            </h4>
            <div className="flex items-start justify-between space-x-4 pt-3">
              <Label className="grid gap-1 font-normal" htmlFor="show">
                                 <span className="font-semibold">
                                     
                                 </span>
                                 <div className="grid gap-2">
                                     <Label htmlFor="name">Name</Label>
                                     <Input id="name" type="text" autoFocus placeholder="name" 
                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLinkName(event.target.value ?? '')} value={linkName}  
                                     />
                                 </div>
                                 <div className="grid gap-2">
                                     <Label htmlFor="description">Description</Label>
                                     <Input id="description" type="text" placeholder="description" 
                                       onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLinkDescription(event.target.value ?? '')} value={linkDescription}  
                                     />
                                 </div>
                             </Label>
            </div>
          </div>
          <DialogFooter>
          <Button variant="secondary" onClick={()=>handleSave()}>
                Save
            </Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            Edit
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>


        
      </Button>
    )
  }

export { InviteCard }



