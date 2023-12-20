
// import { User } from '../models/user'
// import * as React from "react"
// import { Button, ButtonProps } from "@/components/ui/button";
// import { Label } from "@radix-ui/react-label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
// import { Switch } from "./ui/switch";
// import { Input } from "@/components/ui/input"
// import {findOneInvite} from "@/lib/testData"


// interface EditInviteModalProps {
//     handleModal: () => void;
//     open: boolean,
//     linkName: string,
//     setLinkName: ()=>void,
//     linkDescription: string,
//     linkId: string,
//     campaignId: string,
//     setLinkDescription: ()=>void
//     changeDescription: (event)=>void
    

// }

// const EditInviteModal =
//     ({ ...props }:EditInviteModalProps) => {
//         console.log(props)
        
        // const alink = Invite.findOne({name: ''}).exec()
        // console.log('test Invite: ', alink)

            // const handleSave = async () =>{
            //     await Invite.updateOne({discordId: props.linkId}, {name: props.linkName, description: props.linkDescription}).exec()
            //     console.log('ça marche: ', props.linkId)
            // }

            // const handleSave = async () => {
            //     try {
            //       await Invite.updateOne({ discordId: props.linkId }, { description: props.linkDescription });
            //       console.log('Modification enregistrée avec succès.');
            //       props.setIsOpen(false)
            //     } catch (error) {
            //       console.error('Erreur lors de la mise à jour en base de données :', error);
            //     }
            //   };
       

            // const fetchData = async () => {
            //     try {
            //         const data = await Invite.findOne({ code: props.campaignId }).exec();
            //         console.log('Data retrieved successfully:', data);
            //     } catch (error) {
            //         console.error('Error fetching data from MongoDB:', error);
            //     }
            // };

            // let data;

            // const fetchData = async () => {
            //     try {
            //         data = await Invite.findOne({ code: '657c8793f08cb9a86c3491f7' }).exec();//props.campaignId
            //         console.log('Data retrieved successfully:', data);
            //     } catch (error) {
            //         console.error('Error fetching data from MongoDB:', error);
            //     }
            // };
        
            // Appelez fetchData au montage du composant (ou lorsque vous en avez besoin)
            // React.useEffect(() => {
            //     fetchData();
            // }, []); // L'utilisation du tableau de dépendances vide assure que cela ne se déclenchera qu'une fois au montage.
        

            // console.log('khalid test', props.linkId)
            // const newtest = Invite.findOne({code : props.campaignId}).then(data=>console.log('test succeed', data))
            // console.log('newtest : ', newtest)
         
        //     const handleClose = () =>{
        //                   console.log(props)
        //                          props.setIsOpen(false)
        //                      }

        //     const handleSave = ()=>{

        //     }

        //     // const mydata = findOneInvite("first", "second");
        //     // console.log('new new test : ', mydata)

        // return (

        //     <Dialog open={props.open} >
        // <DialogContent>
        //   <DialogHeader>
        //     <DialogTitle>Content filter preferences</DialogTitle>
        //     <DialogDescription>
        //     You can change the name of your invite name and its description
        //     </DialogDescription>
        //   </DialogHeader>
        //   <div className="py-6">
        //     <h4 className="text-sm text-muted-foreground">
        //       Playground Warnings
        //     </h4>
        //     <div className="flex items-start justify-between space-x-4 pt-3">
        //       <Label className="grid gap-1 font-normal" htmlFor="show">
        //                          <span className="font-semibold">
        //                              Show a warning when content is flagged
          //                        </span>
          //                        <div className="grid gap-2">
          //                            <Label htmlFor="name">Name</Label>
          //                            <Input id="name" type="text" autoFocus placeholder="name" 
          //                               onChange={(event)=>setLinkName(event.target.value)} value={linkName}  
          //                            />
          //                        </div>
          //                        <div className="grid gap-2">
          //                            <Label htmlFor="description">Description</Label>
          //                            <Input id="description" type="text" placeholder="description" 
          //                              onChange={(event) => setLinkDescription(event.target.value)} value={linkDescription}  
          //                            />
          //                        </div>
          //                    </Label>
          //   </div>
          // </div>
          // <DialogFooter>
          // <Button variant="secondary" onClick={()=>handleSave()} >
          //       Save
          //   </Button>
//             <Button variant="secondary" onClick={() => handleClose()}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//         )
//     }

// export { EditInviteModal };


// "use server"

// import * as React from "react"
// import { Button, ButtonProps } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { Dialog } from "@/components/ui/dialog"
// import { DotsHorizontalIcon } from "@radix-ui/react-icons"
// import { Input } from "@/components/ui/input"
// import {
//     AlertDialog,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import {
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Label } from "@/components/ui/label"
// // import { Switch } from "@/components/ui/switch"
// import { toast } from "@/components/ui/use-toast"
// import { Invite } from '@/models/invites'
// import { Guild } from '../models/guild'
// import * as context from "next/headers";
// import { redirect } from "next/navigation";

// interface EditInviteModalProps {
//     setIsOpen: () => void;
//     linkId: string,
//     linkDescription: string,

// }

// const EditInviteModal =
//     ({ ...props }:EditInviteModalProps) => {
        
        
//         // const alink = Invite.findOne({name: ''}).exec()
//         // console.log('test Invite: ', alink)

//             // const handleSave = async () =>{
//             //     await Invite.updateOne({discordId: props.linkId}, {name: props.linkName, description: props.linkDescription}).exec()
//             //     console.log('ça marche: ', props.linkId)
//             // }

//             const handleSave = async () => {
//                 try {
//                   await Invite.updateOne({ discordId: props.linkId }, { description: props.linkDescription });
//                   console.log('Modification enregistrée avec succès.');
//                   props.setIsOpen(false)
//                 } catch (error) {
//                   console.error('Erreur lors de la mise à jour en base de données :', error);
//                 }
//               };
       
         
//             const handleClose = () =>{
//                 console.log(props)
//                 props.setIsOpen(false)
//             }


//         return (

//             <>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Edit</DialogTitle>
//                         <DialogDescription>
//                             You can change the name of your invite name and its description
//                         </DialogDescription>
//                     </DialogHeader>

//                     <div className="py-6">

//                         <div className="flex items-start justify-between space-x-4 pt-3">
//                             <Label className="grid gap-1 font-normal" htmlFor="show">
//                                 <span className="font-semibold">
//                                     Show a warning when content is flagged
//                                 </span>
//                                 <div className="grid gap-2">
//                                     <Label htmlFor="name">Name</Label>
//                                     <Input id="name" type="text" autoFocus placeholder="name" onChange={(event) => props.linkId(event.target.value)} value={props.linkId} />
//                                 </div>
//                                 <div className="grid gap-2">
//                                     <Label htmlFor="description">Description</Label>
//                                     <Input id="description" type="text" placeholder="description" onChange={(event) => props.setLinkDescription(event.target.value)} value={props.linkDescription} />
//                                 </div>
//                             </Label>
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         <Button variant="secondary" onClick={() => handleSave()} >
//                             Save
//                         </Button>
//                         <Button variant="secondary" onClick={() => handleClose()}>
//                             Close
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>

//             </>

//         )
//     }

// export { EditInviteModal };
