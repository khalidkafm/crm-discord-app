import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
// import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Invite } from '../models/invites'


const InviteCard =
  ({ ...props }) => {
    const [open, setIsOpen] = React.useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
    const [linkName, setLinkName] = React.useState('')
    const [linkDescription, setLinkDescription] = React.useState('')

    
    // props are GuildId, CampaignId, name
    const router = useRouter();

    const handleClick = () => router.push(`/${props.guildId}/campaign/${props.campaignId}`)
    // const handleSave = async () => await Invite.updateOne({ name: linkName, description: linkDescription}).exec()
 

    return (
        <Button
        onClick={handleClick}
        variant = "ghost"
        className="flex-row items-center justify-between w-[300px] bg-white p-5 mt-3 rounded-lg"
        type="button"
      >
        {props.name}
        <>
      <DropdownMenu>
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
          {/* <DropdownMenuSeparator /> */}
          {/* <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            Delete preset
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
            <DialogDescription>
              You can change the name of your invite name and its description
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            
            <div className="flex items-start justify-between space-x-4 pt-3">
              <Label className="grid gap-1 font-normal" htmlFor="show">
                <span className="font-semibold">
                  Show a warning when content is flagged
                </span>
                <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" autoFocus placeholder="name" onChange={(value) => setLinkName(value)} value={linkName} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" type="text" placeholder="description" onChange={(value) => setLinkDescription(value)} value={linkDescription} />
          </div>
              </Label>
            </div>
          </div>
          <DialogFooter>
          {/* <Button variant="secondary" onClick={()=>handleSave()} >
              Save
            </Button> */}
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This preset will no longer be
              accessible by you or others you&apos;ve shared it with.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteDialog(false)
                toast({
                  description: "This preset has been deleted.",
                })
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
      </Button>
    )
  }

export { InviteCard }
