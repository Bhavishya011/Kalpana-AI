
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Camera, Lightbulb, Mic, TrendingUp } from "lucide-react";
import type { getDictionary } from "@/lib/i18n/dictionaries";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>["dashboard"];

const mentorTopics = [
  {
    icon: Lightbulb,
    title: "Unlocking 'The Muse'",
    content:
      "Learn how to use 'The Muse' to generate endless design variations. Upload a photo of your craft, and let the AI co-pilot inspire you with new patterns, color combinations, and stylistic ideas based on a vast library of Indian art forms.",
  },
  {
    icon: TrendingUp,
    title: "Reading the 'Market Pulse'",
    content:
      "Discover what's trending in your area. 'Market Pulse' shows you which crafts are in high demand, helping you decide what to create next. It provides a demand multiplier and key trends to guide your production.",
  },
  {
    icon: Camera,
    title: "Taking Stunning Product Photos",
    content:
      "A great photo is the first step to a sale. Learn the basics of lighting, composition, and background to make your product stand out. Use a simple, clean background and natural light for the best results.",
  },
  {
    icon: Mic,
    title: "Telling Your Story",
    content:
      "Your story sells your craft. When adding a product, describe your inspiration, the tradition behind your work, and what makes it unique. A personal story connects you with buyers on an emotional level.",
  },
];

export function ArtisanMentor({ dictionary }: { dictionary: Dictionary }) {
  const mentorDict = dictionary.artisanMentor || { title: "Artisan Mentor", description: "Learn and grow your skills." };

  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <BookOpen className="text-primary" />
          <span className="font-headline">{mentorDict.title}</span>
        </CardTitle>
        <CardDescription>{mentorDict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {mentorTopics.map((topic, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <topic.icon className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{topic.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-11">
                {topic.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
