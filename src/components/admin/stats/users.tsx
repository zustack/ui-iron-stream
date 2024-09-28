import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/api/stats";
import Spinner from "@/components/ui/spinner";

export const description = "Users statistics";

const chartConfig = {
  views: {
    label: "Users",
  },
  all: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  windows: {
    label: "Windows",
    color: "hsl(var(--chart-1))",
  },
  linux: {
    label: "Linux",
    color: "hsl(var(--chart-2))",
  },
  mac: {
    label: "Mac",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type UserStat = {
  date: string;
  windows: number;
  mac: number;
  linux: number;
  all: number;
};

const getFirstAndLastDateOfCurrentMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último día del mes
  return { from: firstDay, to: lastDay };
};

export default function UsersStats() {
  const [date, setDate] = useState<DateRange | undefined>(
    getFirstAndLastDateOfCurrentMonth()
  );

  const {
    data: chartData,
    isLoading,
    isError,
  } = useQuery<UserStat[], Error>({
    queryKey: ["user-stats", date],
    queryFn: () =>
      getUserStats(
        String(date?.from == undefined ? "" : format(date.from, "yyyy-MM-dd")),
        String(date?.to == undefined ? "" : format(date.to, "yyyy-MM-dd"))
      ),
  });

  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("all");
  const total = useMemo(
    () => ({
      all: chartData?.reduce((acc, curr) => acc + curr.all, 0),
      windows: chartData?.reduce((acc, curr) => acc + curr.windows, 0),
      linux: chartData?.reduce((acc, curr) => acc + curr.linux, 0),
      mac: chartData?.reduce((acc, curr) => acc + curr.mac, 0),
    }),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 justify-between gap-1 px-3 py-3">
          <CardTitle>Users statistics</CardTitle>
          <CardDescription>
            <div className={cn("grid gap-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left h-8",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "dd/MM/yyyy")} -{" "}
                          {format(date.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(date.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Search between dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardDescription>
        </div>

        <div className="flex">
          {["all", "mac", "linux", "windows"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center 
                  gap-1 border-t px-6 py-1 text-left even:border-l 
                  data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-2"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading && (
          <div className="h-[100px] flex justify-center items-center">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="h-[100px] flex justify-center items-center">
            <span>An unexpected error occurred.</span>
          </div>
        )}

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-GB");
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-GB");
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
