"use client"

//import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

//import { useConfig } from "@/hooks/use-config"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
//import { themes } from "@/registry/themes"

interface CardsMetricProps {
  data: { day: string; sevenDayAverage: number; volume: number }[];
}

export function CardsMetric({ data }: CardsMetricProps) {
  //const { theme: mode } = useTheme()
  //const [config] = useConfig()

  //const theme = themes.find((theme) => theme.name === config.theme)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily messages sent</CardTitle>
        <CardDescription>
          Visualize the activity trend from this cohort
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <Tooltip
                content={({ active, payload }) => {
                  
                  const date = active && payload && payload[0] && payload[0].payload
                  ? payload[0].payload.day
                  : 'Unknown Date';
                  
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {date}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.50rem] uppercase text-muted-foreground">
                              Volume
                            </span>
                            <span className="font-bold">
                              {payload[1].value}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.50rem] uppercase text-muted-foreground">
                              7d Average
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].value}
                            </span>
                          </div>
         
                        </div>
                      </div>
                    )
                  }

                  return null
                }}
              />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="sevenDayAverage"
                activeDot={{
                  r: 6,
                  //fill: "black",
                  opacity: 0.25,
                  //style: { fill: "black", opacity: 0.25 },
                }}
                stroke= "var(--theme-primary)"
                style={
                  {
                    stroke: "black",
                    opacity: 0.25,
                //    "--theme-primary": `hsl(${
                //      theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
                //    })`,
                  } as React.CSSProperties
                }
              />
              <Line
                type="monotone"
                dataKey="volume"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                  //fill: "var(--theme-primary)",
                  //style: { fill: "black" },

                }}
                stroke= "var(--theme-primary)"
                style={
                  {
                    stroke: "black",
                //    "--theme-primary": `hsl(${
                //      theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
                //    })`,
                  } as React.CSSProperties
                }
              />
              </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
