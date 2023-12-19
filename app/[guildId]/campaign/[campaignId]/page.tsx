import { Metadata } from "next"
import { z } from "zod"
//import { format } from 'date-fns';
import dayjs from 'dayjs';

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
import { CopyIcon, ExternalLinkIcon, CalendarIcon } from '@radix-ui/react-icons'

import { JoinEvent } from '@/models/joinEvents';
import { Invite } from '@/models/invites';
import { Message } from '@/models/message';
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

interface joinersMetrics {
  joinEventsToday: number;
  percentageVariationToday: number;
  joinEventsThisWeek: number;
  percentageVariationThisWeek: number;
  joinEventsThisMonth: number;
  percentageVariationThisMonth: number;
}

async function getJoinersMetrics(campaignId: string): Promise<joinersMetrics> {
  try {
    const currentDate = new Date();
    const startOfToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startOfThisWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    const startOfThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const joinEventsToday = await JoinEvent.aggregate([
      { $match: { invite: new ObjectId(campaignId), timestamp: { $gte: startOfToday } } },
      { $group: { _id: "$member" } },
      { $count: "count" }
    ]);

    const joinEventsYesterday = await JoinEvent.aggregate([
      { $match: { invite: new ObjectId(campaignId), timestamp: { $gte: startOfToday, $lt: startOfToday.getTime() } } },
      { $group: { _id: "$member" } },
      { $count: "count" }
    ]);

    const joinEventsThisWeek = await JoinEvent.aggregate([
      { $match: { invite: new ObjectId(campaignId), timestamp: { $gte: startOfThisWeek, $lt: startOfToday } } },
      { $group: { _id: "$member" } },
      { $count: "count" }
    ]);

    const joinEventsPreviousWeek = await JoinEvent.aggregate([
      { $match: { invite: new ObjectId(campaignId), timestamp: { $gte: new Date(startOfThisWeek.getTime() - 7 * 24 * 60 * 60 * 1000), $lt: startOfThisWeek } } },
      { $group: { _id: "$member" } },
      { $count: "count" }
    ]);

    const joinEventsThisMonth = await JoinEvent.aggregate([
      { $match: { invite: new ObjectId(campaignId), timestamp: { $gte: startOfThisMonth, $lt: startOfToday } } },
      { $group: { _id: "$member" } },
      { $count: "count" }
    ]);

    const joinEventsPreviousMonth = await JoinEvent.aggregate([
      { $match: { invite: new ObjectId(campaignId), timestamp: { $gte: new Date(startOfThisMonth.getTime() - 30 * 24 * 60 * 60 * 1000), $lt: startOfThisMonth } } },
      { $group: { _id: "$member" } },
      { $count: "count" }
    ]);

    // Calculez les variations en pourcentage
    const percentageVariationToday = (joinEventsToday[0]?.count - (joinEventsYesterday[0]?.count || 0)) / (joinEventsYesterday[0]?.count || 1) * 100 || 0;
    const percentageVariationThisWeek = (joinEventsThisWeek[0]?.count - (joinEventsPreviousWeek[0]?.count || 0)) / (joinEventsPreviousWeek[0]?.count || 1) * 100 || 0;
    const percentageVariationThisMonth = (joinEventsThisMonth[0]?.count - (joinEventsPreviousMonth[0]?.count || 0)) / (joinEventsPreviousMonth[0]?.count || 1) * 100 || 0;

    return {
      joinEventsToday: joinEventsToday[0]?.count || 0,
      percentageVariationToday,
      joinEventsThisWeek: joinEventsThisWeek[0]?.count || 0,
      percentageVariationThisWeek,
      joinEventsThisMonth: joinEventsThisMonth[0]?.count || 0,
      percentageVariationThisMonth,
    };
  } catch (error: any) {
    // Check if the error is due to a non-existent inviteId
    if (error.name === 'CastError' && error.path === 'invite') {
      // Handle the case where the inviteId is not found
      console.error('Invite not found');
    } else {
      // Handle other errors
      console.error('Error querying join events:', error);
    }
    return {
      joinEventsToday: 0,
      percentageVariationToday: 0,
      joinEventsThisWeek: 0,
      percentageVariationThisWeek: 0,
      joinEventsThisMonth: 0,
      percentageVariationThisMonth: 0,
    };
  }
}

// un tableau avec par semaine, pour chacune des 12 dernières semaine, le % de membres ayant envoyé au moins 2 messages parmi les membres ayant un joinEvent pour ce campaign Id durant la semaine.

interface HourlyActiveMembersData {
  hour: number;
  volume: number;
}

async function getHourlyActiveMembersData(campaignId: string): Promise<HourlyActiveMembersData[]> {
  try {
    const currentDate = new Date();
    const sixHoursAgo = new Date(currentDate.getTime() - 6 * 60 * 60 * 1000);

    // Step 1: Get the list of members from filtered joinEvents
    const members = await JoinEvent.distinct('member', { invite: new ObjectId(campaignId) });

    // Step 2: Query messages to get hourly active members 
    const result = await Message.aggregate([
      {
        $match: {
          author: { $in: members },
          createdTimestamp: { $gte: sixHoursAgo },
        },
      },
      {
        $group: {
          _id: {
            hour: { $hour: { $toDate: '$createdTimestamp' } },
            member: '$author',
          },
        },
      },
      {
        $group: {
          _id: '$_id.hour',
          volume: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id': 1,
        },
      },
    ]).exec();

    // Step 3: Format the result
    const formattedResult: HourlyActiveMembersData[] = Array.from({ length: 6 }, (_, index) => {
      const hour = (currentDate.getHours() - 6 + index + 24) % 24; // Calculate hour for the last 6 hours
      const matchingItem = result.find((item: any) => item._id === hour);
      return {
        hour,
        volume: matchingItem ? matchingItem.volume : 0,
      };
    });

    return formattedResult;
  } catch (error: any) {
    console.error('Error querying messages:', error);
    return Array.from({ length: 6 }, (_, index) => ({ hour: index, volume: 0 }));
  }
}

// Function working fine for the hourly volume of messages sent
/*interface HourlyActiveMembersData {
  hour: number;
  volume: number;
}

async function getHourlyActiveMembersData(campaignId: string): Promise<HourlyActiveMembersData[]> {
  try {
    const currentDate = new Date();
    const sixHoursAgo = new Date(currentDate.getTime() - 6 * 60 * 60 * 1000);

    // Step 1: Get the list of members from filtered joinEvents
    const members = await JoinEvent.distinct('member', { invite: new ObjectId(campaignId) });

    // Step 2: Query messages to get hourly active members 
    const result = await Message.aggregate([
      {
        $match: {
          author: { $in: members },
          createdTimestamp: { $gte: sixHoursAgo },
        },
      },
      {
        $group: {
          _id: {
            hour: { $hour: { $toDate: '$createdTimestamp' } },
          },
          volume: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.hour': 1,
        },
      },
    ]).exec();

    // Step 3: Format the result
    const formattedResult: HourlyActiveMembersData[] = Array.from({ length: 6 }, (_, index) => {
      const hour = (currentDate.getHours() - 6 + index + 24) % 24; // Calculate hour for the last 6 hours
      const matchingItem = result.find((item: any) => item._id.hour === hour);
      return {
        hour,
        volume: matchingItem ? matchingItem.volume : 0,
      };
    });

    return formattedResult;
  } catch (error: any) {
    console.error('Error querying messages:', error);
    return Array.from({ length: 6 }, (_, index) => ({ hour: index, volume: 0 }));
  }
}*/

//---------------------
//
//            getDailyMessagesVolume
//
//-----------------------

interface DailyMessagesVolume {
  day: string;
  volume: number;
  sevenDayAverage: number;
}

async function getDailyMessagesVolume(campaignId: string): Promise<DailyMessagesVolume[]> {
  try {
    const currentDate = new Date();
    const fifteenDaysAgo = new Date(currentDate.getTime() - 15 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Step 1: Get the list of members from filtered joinEvents
    const members = await JoinEvent.distinct('member', { invite: new ObjectId(campaignId) });

    // Step 2: Query messages to get daily active members and volume
    const result = await Message.aggregate([
      {
        $match: {
          author: { $in: members },
          createdTimestamp: { $gte: fifteenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdTimestamp' } },
          },
          volume: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.day': 1,
        },
      },
    ]).exec();

    console.log('query result',result)

    // Step 3: Create an array with dates for the last 8 days
const dateArray: string[] = Array.from({ length: 16 }, (_, index) => {
  const currentDate = new Date(fifteenDaysAgo.getTime() + index * 24 * 60 * 60 * 1000);
  return dayjs(currentDate).format('DD MMM YYYY');
});

console.log('base array', dateArray);

// Step 4: Format the result array with formattedDay and calculate 7-day rolling averag
  const formattedResult: DailyMessagesVolume[] = dateArray.map((formattedDay: string) => {
    const matchingResult = result.find((item: any) => dayjs(item._id.day).format('DD MMM YYYY') === formattedDay);
  
    const sevenDayAverage = matchingResult
      ? calculateSevenDayAverage(result, result.indexOf(matchingResult))
      : 0;
  
    return {
      day: formattedDay,
      volume: matchingResult ? matchingResult.volume : 0,
      sevenDayAverage: parseFloat(sevenDayAverage.toFixed(1)), // Round to 1 decimal place
    };
  });

    return formattedResult;
  } catch (error: any) {
    console.error('Error querying messages:', error);
    return Array.from({ length: 15 }, (_, index) => ({ day: index.toString(), volume: 0, sevenDayAverage: 0 }));
  }
}

// Helper function to calculate the 7-day rolling average
function calculateSevenDayAverage(data: any[], currentIndex: number): number {
  let sum = 0;
  let count = 0;

  // Iterate over the last 8 days, including days with volume 0
  for (let i = currentIndex; i >= 0 && count < 8; i--) {
    sum += data[i] ? data[i].volume : 0;
    count++;
  }

  // Avoid division by zero
  if (count === 0) {
    return 0;
  }

  return sum / count;
}

//---------------------
//
//            getWeeklyJoiners function
//
//-----------------------
interface WeeklyJoinersResult {
  totalJoiners: number;
  weeklyJoiners: { volume: number }[];
}

// Function to get the weekly number of joiners over the past 8 weeks
async function getWeeklyJoiners(campaignId: string): Promise<WeeklyJoinersResult> {
  const currentDate = new Date();
  const weekStartDates: Date[] = [];

  // Calculate start dates of each week for the last 8 weeks
  for (let i = 0; i < 8; i++) {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - (currentDate.getDay() + 7 * i));
    startOfWeek.setHours(0, 0, 0, 0);
    weekStartDates.push(startOfWeek);
  }

  // Get the count of join events for each week
  const weeklyJoiners: { volume: number }[] = await Promise.all(
    weekStartDates.map(async (startDate) => {
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
      const count = await getJoinEventsCountInWeek(campaignId, startDate, endDate);
      return { volume: count };
    })
  );

  // Get the total number of joiners for the campaignId
  const totalJoiners = await getTotalJoiners(campaignId);

  return { totalJoiners, weeklyJoiners };
}

// Helper function to get the count of join events in a specific week
async function getJoinEventsCountInWeek(
  campaignId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const count = await JoinEvent.countDocuments({
    invite: campaignId,
    timestamp: {
      $gte: startDate,
      $lt: endDate,
    },
  });
  return count;
}

// Helper function to get the total number of joiners for the campaignId
async function getTotalJoiners(campaignId: string): Promise<number> {
  const totalJoiners = await JoinEvent.countDocuments({ invite: new ObjectId(campaignId) });
  return totalJoiners;
}

// TO DELETE
const weeklyJoinersOld = [
  {
    volume: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    volume: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    volume: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    volume: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    volume: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    volume: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    volume: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    volume: Math.floor(Math.random() * 5000) + 1000,
  },
]

//---------------------
//
//            getweeklyConversionRates TODO
//
//-----------------------

const weeklyConversionRates = [
  {
    name: "10-17 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18-25 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18-25 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18-25 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18-25 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18-25 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18-25 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18-25 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18-25 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18-25 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18-25 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18-25 Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export default async function InvitePage({
  params,
}: {
  params: { campaignId: string; guildId: string };
}) {
  
  const invite = await Invite.findOne({_id: params.campaignId});
  const campaignMembers = await getCampaignMembers(params.campaignId);
  const joinersMetrics = await getJoinersMetrics(params.campaignId);
  const hourlyActiveMembers = await getHourlyActiveMembersData(params.campaignId);
  const dailyMessagesVolume = await getDailyMessagesVolume(params.campaignId);
  const weeklyJoiners = await getWeeklyJoiners(params.campaignId);
  
  console.log('dailyMessagesVolume',dailyMessagesVolume)
  console.log('weeklyJoiners',weeklyJoiners)

  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{invite.name}</h2>
            <p className="text-muted-foreground flex items-center">
              https://discord.gg/{invite.code}
                  <ExternalLinkIcon className="h-4 w-4 text-muted-foreground ml-2" />
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
                      
                      <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Joined today
                            </CardTitle>
                            <CalendarIcon />
                              
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{joinersMetrics.joinEventsToday}</div>
                            <p className="text-xs text-muted-foreground">
                              {joinersMetrics.percentageVariationToday}% from yesterday
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Joined this week
                            </CardTitle>
                            <CalendarIcon />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{joinersMetrics.joinEventsThisWeek}</div>
                            <p className="text-xs text-muted-foreground">
                              {joinersMetrics.percentageVariationThisWeek}% from last week
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Joined this month</CardTitle>
                            <CalendarIcon />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{joinersMetrics.joinEventsThisMonth}</div>
                            <p className="text-xs text-muted-foreground">
                              {joinersMetrics.percentageVariationThisMonth}% from last month
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="col-span-4 mt-4 mb-4">
                          <CardsStats data={{hourlyActiveMembers, weeklyJoiners}} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="col-span-4 mt-4 mb-4">
                          <CardsMetric data={dailyMessagesVolume} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="col-span-4 mt-4 mb-4">
                          <CardHeader>
                            <CardTitle>Conversion rates</CardTitle>
                            <CardDescription>
                              Visualize the joiners to active members conversion.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pl-2">
                            <Overview data={weeklyConversionRates} />
                          </CardContent>
                        </Card>
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
