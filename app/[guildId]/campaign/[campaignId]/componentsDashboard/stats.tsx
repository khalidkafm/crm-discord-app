"use client"

//import { useTheme } from "next-themes"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts"

//import { useConfig } from "@/hooks/use-config"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
//import { themes } from "@/registry/themes"


interface CardsStatsProps {
  data: {hourlyActiveMembers:{ hour: number; volume: number;}[], weeklyJoiners:{ totalJoiners:number; weeklyJoiners:{ volume: number }[] }};
}

export function CardsStats({ data }: CardsStatsProps) {
  //const { theme: mode } = useTheme()
  //const [config] = useConfig()

  //const theme = themes.find((theme) => theme.name === config.theme)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-normal">Active now</CardTitle>
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
          <div className="text-2xl font-bold">{data.hourlyActiveMembers[5].volume}</div>
          <p className="text-xs text-muted-foreground">
            and the messages sent over the last hours
          </p>
          <div className="h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.hourlyActiveMembers}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <Line
                  type="monotone"
                  strokeWidth={2}
                  dataKey="volume"
                  activeDot={{
                    r: 6,
                    fill: "currentColor",
                    opacity: 0.25,
                  }}
                  stroke= "currentColor"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-normal">Total joiners</CardTitle>
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
          <div className="text-2xl font-bold">{data.weeklyJoiners.totalJoiners}</div>
          <p className="text-xs text-muted-foreground">
            splited over last weeks below
          </p>
          <div className="mt-4 h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyJoiners.weeklyJoiners}>
                <Bar
                  dataKey="volume"
                  fill={`var(--theme-primary)`}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
