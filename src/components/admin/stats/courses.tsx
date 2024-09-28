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
  ChartTooltipContentMoney,
} from "@/components/ui/chart";
import { useState } from "react";
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
import { getCoursesStats } from "@/api/stats";
import Spinner from "@/components/ui/spinner";

const chartConfig = {
  profit: {
    label: "Profit",
  },
} satisfies ChartConfig;

const getFirstAndLastDateOfCurrentMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último día del mes
  return { from: firstDay, to: lastDay };
};

export default function CourseStats() {
  const [date, setDate] = useState<DateRange | undefined>(
    getFirstAndLastDateOfCurrentMonth()
  );

  const {
    data: chartData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["course-stats", date],
    queryFn: () =>
      getCoursesStats(
        String(date?.from == undefined ? "" : format(date.from, "dd-MM-yyyy")),
        String(date?.to == undefined ? "" : format(date.to, "dd-MM-yyyy"))
      ),
  });

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 justify-between gap-1 px-3 py-3">
          <div>
            <CardTitle>Courses statistics</CardTitle>
            <CardDescription className="mt-3">
              Showing profit from{" "}
              <span className="text-white mx-1">
                {date?.from && format(date?.from, "dd/MM/yyyy")}
              </span>
              to
              <span className="text-white mx-1">
                {date?.to && format(date?.to, "dd/MM/yyyy")}{" "}
              </span>
              <span className="text-green-300 mx-1">${chartData?.total}</span>
            </CardDescription>
          </div>
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

        <div className="flex"></div>
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
          className="aspect-auto h-[350px] w-full"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartData?.courses}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <XAxis
              dataKey="course"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContentMoney hideLabel />}
            />
            <Bar dataKey="profit" fill="hsl(var(--chart-2))" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
