"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Video } from "lucide-react";

const mentors = [
  {
    name: "Meera Patel",
    achievement: "Sells 87% more to US buyers",
    avatar: "https://picsum.photos/100/100?random=1",
    initials: "MP",
    hint: 'woman portrait'
  },
  {
    name: "Rajesh Kumar",
    achievement: "Top seller in handwoven textiles",
    avatar: "https://picsum.photos/100/100?random=2",
    initials: "RK",
    hint: 'man portrait'
  },
  {
    name: "Anjali Singh",
    achievement: "Expert in social media marketing",
    avatar: "https://picsum.photos/100/100?random=3",
    initials: "AS",
    hint: 'woman smiling'
  },
];

export function ArtisanCircle() {
  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Users className="text-primary" />
          <span className="font-headline">Artisan Circle</span>
        </CardTitle>
        <CardDescription>
          Connect with AI-matched mentors for guidance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.name}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={mentor.avatar} alt={mentor.name} data-ai-hint={mentor.hint} />
                  <AvatarFallback>{mentor.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{mentor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {mentor.achievement}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Video className="mr-2 h-4 w-4" />
                Call
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
