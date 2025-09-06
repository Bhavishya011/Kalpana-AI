"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brush } from "lucide-react";
import Image from "next/image";
import type {getDictionary} from '@/lib/i18n/dictionaries';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['dashboard'];

const creations = [
  {
    name: "Hand-painted Diya",
    image: "https://picsum.photos/200/200?random=4",
    hint: 'painted diya'
  },
  {
    name: "Brass Elephant Statue",
    image: "https://picsum.photos/200/200?random=5",
    hint: 'brass elephant'
  },
  {
    name: "Woven Silk Scarf",
    image: "https://picsum.photos/200/200?random=6",
    hint: 'silk scarf'
  },
  {
    name: "Terracotta Pot",
    image: "https://picsum.photos/200/200?random=7",
    hint: 'terracotta pot'
  },
];

export function RecentCreations({dictionary}: {dictionary: Dictionary}) {
  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Brush className="text-primary" />
          <span className="font-headline">{dictionary.recentCreations.title}</span>
        </CardTitle>
        <CardDescription>
          {dictionary.recentCreations.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {creations.map((creation) => (
            <div key={creation.name} className="flex flex-col items-center gap-2">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <Image
                  src={creation.image}
                  alt={creation.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={creation.hint}
                />
              </div>
              <p className="text-center text-sm font-medium">{creation.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
