"use client";

import { displayHyperlocalDemandAlerts, type DisplayHyperlocalDemandAlertsOutput } from "@/ai/flows/display-hyperlocal-demand-alerts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type {getDictionary} from '@/lib/i18n/dictionaries';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['dashboard'];


export function MarketPulse({dictionary}: {dictionary: Dictionary}) {
  const [data, setData] =
    useState<DisplayHyperlocalDemandAlertsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDemand() {
      setLoading(true);
      try {
        const result = await displayHyperlocalDemandAlerts({
          location: "Jaipur",
          craftType: "brass diyas",
        });
        setData(result);
      } catch (error) {
        console.error("Error fetching demand alerts:", error);
        setData({
          alert: "Could not fetch demand data.",
          demandMultiplier: 1,
        });
      } finally {
        setLoading(false);
      }
    }
    getDemand();
  }, []);

  const chartData = [{ name: dictionary.marketPulse.demand, value: data?.demandMultiplier ?? 0 }];

  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <TrendingUp className="text-primary" />
          <span className="font-headline">{dictionary.marketPulse.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-1 space-y-2">
              <p className="text-2xl font-bold text-accent">
                {data?.demandMultiplier}x
              </p>
              <p className="text-lg text-foreground">{data?.alert}</p>
              <p className="text-xs text-muted-foreground">
                {dictionary.marketPulse.update} &bull; {dictionary.marketPulse.interval}
              </p>
            </div>
            <div className="h-24 w-full sm:w-1/3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'dataMax + 2']}/>
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                    label={{ position: 'top', fill: 'hsl(var(--accent))', fontSize: 12 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
