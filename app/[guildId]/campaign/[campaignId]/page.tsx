import { Metadata } from "next"
import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { InviteMenu } from "./components/invite-menu"
import { taskSchema } from "./data/schema"

import { JoinEvent } from '@/models/joinEvents';
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
  
  const campaignMembers = await getCampaignMembers(params.campaignId)

  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Invite name from DB</h2>
            <p className="text-muted-foreground">
              Navigation tab goes here
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <InviteMenu />
          </div>
        </div>
        <DataTable data={campaignMembers || []} columns={columns} />
      </div>
    </>
  )
}
