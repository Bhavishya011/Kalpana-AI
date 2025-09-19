
"use client";

import * as React from "react";
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
import { BookOpen, Camera, Lightbulb, Mic, TrendingUp, Award } from "lucide-react";
import type { getDictionary } from "@/lib/i18n/dictionaries";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>["dashboard"];

const mentorTopics = [
  {
    icon: Lightbulb,
    key: 'unlockingTheMuse',
    title: "Unlocking 'The Muse'",
    content:
      "Learn how to use 'The Muse' to generate endless design variations. Upload a photo of your craft, and let the AI co-pilot inspire you with new patterns, color combinations, and stylistic ideas based on a vast library of Indian art forms.",
  },
  {
    icon: TrendingUp,
    key: 'readingMarketPulse',
    title: "Reading the 'Market Pulse'",
    content:
      "Discover what's trending in your area. 'Market Pulse' shows you which crafts are in high demand, helping you decide what to create next. It provides a demand multiplier and key trends to guide your production.",
  },
  {
    icon: Camera,
    key: 'takingPhotos',
    title: "Taking Stunning Product Photos",
    content:
      "A great photo is the first step to a sale. Learn the basics of lighting, composition, and background to make your product stand out. Use a simple, clean background and natural light for the best results.",
  },
  {
    icon: Mic,
    key: 'tellingYourStory',
    title: "Telling Your Story",
    content:
      "Your story sells your craft. When adding a product, describe your inspiration, the tradition behind your work, and what makes it unique. A personal story connects you with buyers on an emotional level.",
  },
];

const dailySkills = [
    { key: 'hashtags', content: "Use hashtags on Instagram to reach more customers. Try #handicraft #indianartisan #madeinindia." },
    { key: 'packaging', content: "How to package your crafts safely for international shipping. Use bubble wrap and sturdy boxes." },
    { key: 'reviews', content: "Responding to customer reviews, even the negative ones, shows you care. Always be polite and helpful." },
    { key: 'videos', content: "Create a short video (15-30 seconds) of your crafting process. It's great content for social media!" },
    { key: 'seo', content: "Use descriptive keywords in your product titles. Instead of 'Vase', try 'Hand-painted Terracotta Flower Vase'."},
];

export function ArtisanMentor({ dictionary }: { dictionary: Dictionary }) {
  const mentorDict = dictionary.artisanMentor;
  const [skillOfTheDay, setSkillOfTheDay] = React.useState({key: '', content: ''});

  React.useEffect(() => {
    const dayOfMonth = new Date().getDate();
    const skill = dailySkills[dayOfMonth % dailySkills.length];
    setSkillOfTheDay(skill);
  }, []);


  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Award className="text-primary" />
            <span className="font-headline">{mentorDict.skillOfTheDay.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90">{mentorDict.skillOfTheDay.skills[skillOfTheDay.key as keyof typeof mentorDict.skillOfTheDay.skills] || skillOfTheDay.content}</p>
        </CardContent>
      </Card>
      
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
                    <span className="font-semibold">{mentorDict.coreSkills[topic.key as keyof typeof mentorDict.coreSkills].title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-11">
                  {mentorDict.coreSkills[topic.key as keyof typeof mentorDict.coreSkills].content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
