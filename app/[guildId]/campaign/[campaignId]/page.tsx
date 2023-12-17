import { Metadata } from "next"
import { z } from "zod"

import { columns } from "./componentsTable/columns"
import { DataTable } from "./componentsTable/data-table"
import { InviteMenu } from "./componentsTable/invite-menu"
import { taskSchema } from "./data/schema"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Overview } from "@/app/[guildId]/campaign/[campaignId]/componentsDashboard/overview"
import { CardsMetric } from "@/app/[guildId]/campaign/[campaignId]/componentsDashboard/metric"
import { CardsStats } from "@/app/[guildId]/campaign/[campaignId]/componentsDashboard/stats"


import { JoinEvent } from '@/models/joinEvents';
import { Invite } from '@/models/invites';
import mongodb from 'mongoose';
const { ObjectId } = mongodb.Types;

export const metadata: Metadata = {
  title: "Members",
  description: "Members list who joined from invite link",
}

// Simulate a database read for tasks.
async function getCampaignMembers(campaignId : string) {

  try {
    // Get all first joinEvent per member for the inviteId AND add the member's nb of messages sent overall + over the last 7d
    const members = await JoinEvent.aggregate([
      { $match: { invite: new ObjectId(campaignId) } },
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: "$member",
          firstJoinEvent: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$firstJoinEvent" },
      },
      {
        $lookup: {
          from: "messages",
          let: { memberId: "$member", guildId: "$guild" },
          pipeline: [
            {
              $match: {
                $expr: { $and: [{ $eq: ["$author", "$$memberId"] }, { $eq: ["$guild", "$$guildId"] }] },
              },
            },
          ],
          as: "messages",
        },
      },
      {
        $addFields: {
          totalMessages: { $size: "$messages" },
          messagesLast7Days: {
            $size: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: { $gte: ["$$message.createdTimestamp", { $subtract: [new Date(), 7 * 24 * 60 * 60 * 1000] }] },
              },
            },
          },
          messagesLast14Days: {
            $size: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: { $gte: ["$$message.createdTimestamp", { $subtract: [new Date(), 14 * 24 * 60 * 60 * 1000] }] },
              },
            },
          },
        },
      },
      {
        $project: {
          messages: 0,
        },
      },
      {
        $lookup: {
          from: "members",
          localField: "member",
          foreignField: "_id",
          as: "memberDetails",
        },
      },
      {
        $unwind: "$memberDetails",
      },
      {
        $addFields: {
          memberDiscordId: "$memberDetails.discordId",
          username: "$memberDetails.username",
          joinedTimestamp: "$memberDetails.joinedTimestamp",
        },
      },
    ]);

    const membersList = members.map(joinEvent => {
      let status = 'ghost';
      if(joinEvent.messagesLast7Days > 0){
        status = 'active-this-week';
      } else if (joinEvent.totalMessages > 0){
        status = 'inactive-this-week';
      };
      const isNew = joinEvent.totalMessages == joinEvent.messagesLast7Days;
      let evolution = 'steady';
      if(joinEvent.messagesLast7Days > (joinEvent.messagesLast14Days-joinEvent.messagesLast7Days)){
        evolution = 'growing'
      } else if (joinEvent.messagesLast7Days < (joinEvent.messagesLast14Days-joinEvent.messagesLast7Days)){
        evolution = 'slowing'
      };
      return(
        {
          "id": joinEvent.username,
          "memberDiscordId": joinEvent.memberDiscordId.toString(),
          "title": joinEvent.totalMessages.toString(),
          "status": status,
          "label": isNew ? "new" : "",
          "priority": evolution
        }
      )
    })

    return z.array(taskSchema).parse(membersList)
  

    } catch (error: any) {
      // Check if the error is due to a non-existent inviteId
      if (error.name === 'CastError' && error.path === 'invite') {
        // Handle the case where the inviteId is not found
        console.error('Invite not found');
      } else {
        // Handle other errors
        console.error('Error querying join events:', error);
      }
    }
}

export default async function InvitePage({
  params,
}: {
  params: { campaignId: string; guildId: string };
}) {
  
  const invite = await Invite.findOne({_id: params.campaignId})
  const campaignMembers = await getCampaignMembers(params.campaignId)

  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{invite.name}</h2>
            <p className="text-muted-foreground">
              Invite code: {invite.code}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <InviteMenu />
          </div>
        </div>
        <Tabs defaultValue="metrics" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="metrics" className="relative">
                          Metrics
                        </TabsTrigger>
                        <TabsTrigger value="members">Members</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent
                      value="metrics"
                      className="border-none p-0 outline-none"
                    >
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Total Revenue
                            </CardTitle>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              className="h-4 w-4 text-muted-foreground"
                            >
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-muted-foreground">
                              +20.1% from last month
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Subscriptions
                            </CardTitle>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              className="h-4 w-4 text-muted-foreground"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">+2350</div>
                            <p className="text-xs text-muted-foreground">
                              +180.1% from last month
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              className="h-4 w-4 text-muted-foreground"
                            >
                              <rect width="20" height="14" x="2" y="5" rx="2" />
                              <path d="M2 10h20" />
                            </svg>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">+12,234</div>
                            <p className="text-xs text-muted-foreground">
                              +19% from last month
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Active Now
                            </CardTitle>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              className="h-4 w-4 text-muted-foreground"
                            >
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">+573</div>
                            <p className="text-xs text-muted-foreground">
                              +201 since last hour
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="col-span-4 mt-4 mb-4">
                          <CardHeader>
                            <CardTitle>Overview</CardTitle>
                          </CardHeader>
                          <CardContent className="pl-2">
                            <Overview />
                          </CardContent>
                        </Card>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="col-span-4 mt-4 mb-4">
                          {/*<CardsMetric />*/}
                        </div>
                        <div className="col-span-4 mt-4 mb-4">
                          {/*<CardsStats />*/}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="members"
                      className="border-none p-0 outline-none"
                    >
                        <DataTable data={campaignMembers || []} columns={columns} />
                    </TabsContent>
                  </Tabs>
      </div>
    </>
  )
}
