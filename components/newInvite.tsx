import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"


const NewInvite =
    ({ ...props }) => {
        console.log('newInvite : ', props)
        const [open, setIsOpen] = React.useState<boolean>(false)
        const [linkName, setLinkName] = React.useState<string>('')
        const [linkDescription, setLinkDescription] = React.useState<string>('')

        // const linkId: any = props.campaignId


        // props are GuildId, CampaignId, name
        const router = useRouter();

        const handleClick = () => router.push(`/${props.guildId}/campaign/${props.campaignId}`)

        const fetchUrl = process.env.NODE_ENV === 'development'
            ? `http://localhost:4000/invites/newLink` // LOCAL DEV discord redirect URI goes here 
            : `${process.env.NEXT_PUBLIC_PROD_BOT_URI}/invites/newLink` // PROD discord redirect URI goes here

        const handleSave = async () => {
            await fetch(fetchUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // _id: '658302a5e96125b3224b5164',//à récupérer sur Discord 
                    // code: 'F36peZ',// à récupérer sur Discord 
                    name: linkName,
                    guild: props.IDGuild, // à dynamiser
                    description: linkDescription,
                    creator: 'khalids bot'// on verra si on récupère sur Discord ou si on met celui de la personne connectée
                }),
            }).then(response => response.json()).then(data => {
                setIsOpen(false)
                // props.refreshPage(props.campaignId)
                // console.log(props)
                window.location.reload()
            })
        }


        return (
            <Button
                // onClick={handleClick}
                onClick={() => setIsOpen(true)}
                variant="default"
                className="justify-end"
                type="button"
            >
                <PlusCircledIcon className="mr-2 h-4 w-4" />
                New



                <Dialog open={open} onOpenChange={setIsOpen} >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a new link</DialogTitle>
                            <DialogDescription>
                                You can choose the name of your invite and its description
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
                            <Button variant="secondary" onClick={() => handleSave()}>
                                Save
                            </Button>
                            <Button variant="secondary" onClick={() => setIsOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


            </Button>
        )
    }

export { NewInvite }

