"use client";

import { displayHyperlocalDemandAlerts, type DisplayHyperlocalDemandAlertsOutput } from "@/ai/flows/display-hyperlocal-demand-alerts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type {getDictionary} from '@/lib/i18n/dictionaries';
import { Badge } from "../ui/badge";
import { useTranslatedObject } from "@/hooks/use-translation";
import { useTranslatedDictionary } from "@/hooks/use-dictionary-translation";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['dashboard'];


export function MarketPulse({dictionary, language}: {dictionary: Dictionary; language: string}) {
  const [data, setData] =
    useState<DisplayHyperlocalDemandAlertsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  // Translate static dictionary text
  const t = useTranslatedDictionary(dictionary, language);
  
  // Translate dynamic API data - this will update when language OR data changes
  const { data: translatedData, isTranslating } = useTranslatedObject(data, language);
  
  // Use translated data if available and not currently translating
  const displayData = (translatedData && !isTranslating) ? translatedData : data;

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
          trends: []
        });
      } finally {
        setLoading(false);
      }
    }
    getDemand();
  }, []);

  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <TrendingUp className="text-primary" />
          <span className="font-headline">{t.marketPulse.title}</span>
        </CardTitle>
        <CardDescription>{t.marketPulse.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-lg text-foreground font-semibold">{displayData?.alert}</p>
              <p className="text-3xl font-bold text-accent">
                {displayData?.demandMultiplier}x {t.marketPulse.demand}
              </p>
            </div>
            
            <div>
              <h4 className="flex items-center gap-2 font-headline text-md mb-2">
                <Sparkles className="text-primary size-4" />
                {t.marketPulse.topTrends}
              </h4>
              <div className="flex flex-wrap gap-2">
                {displayData?.trends?.map((trend, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">{trend}</Badge>
                ))}
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground pt-2">
              {t.marketPulse.update} &bull; {t.marketPulse.interval}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
