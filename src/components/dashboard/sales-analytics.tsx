"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart } from "lucide-react";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>["dashboard"];

const salesData = [
  { month: "Jan", sales: 1200 },
  { month: "Feb", sales: 1500 },
  { month: "Mar", sales: 1800 },
  { month: "Apr", sales: 2100 },
  { month: "May", sales: 2500 },
  { month: "Jun", sales: 2800 },
];

export function SalesAnalytics({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <LineChart className="text-primary" />
          <span className="font-headline">{dictionary.salesAnalytics.title}</span>
        </CardTitle>
        <CardDescription>{dictionary.salesAnalytics.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
