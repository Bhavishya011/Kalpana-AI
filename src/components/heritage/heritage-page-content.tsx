"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dna,
  MapPin,
  Award,
  Leaf,
  Calendar,
  Share2,
  Heart,
  QrCode,
  Sparkles,
  Globe,
  Users,
} from "lucide-react";

interface HeritagePageContentProps {
  heritage_id: string;
}

export function HeritagePageContent({ heritage_id }: HeritagePageContentProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center space-y-4">
          <Dna className="h-16 w-16 text-purple-600 mx-auto animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading craft heritage...</p>
        </div>
      </div>
    );
  }

  // Placeholder data - will be replaced with Firestore data
  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <div className="flex justify-center mb-6">
          <Dna className="h-20 w-20 text-purple-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Craft DNA Heritage Page
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the cultural authenticity, origin story, and sustainability impact of this artisan craft
        </p>
        <Badge variant="outline" className="text-sm">
          Heritage ID: {heritage_id}
        </Badge>
      </div>

      {/* Coming Soon Notice */}
      <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-300 dark:border-purple-700">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full">
              <Sparkles className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Heritage Page Coming Soon!</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're building the full heritage page experience with complete artisan stories, cultural analysis, and sustainability metrics. 
              This page will showcase the rich heritage behind every handcrafted product.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8 text-left">
            <div className="space-y-2">
              <MapPin className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold">Artisan Story</h3>
              <p className="text-sm text-muted-foreground">
                Personal journey, village, craft lineage
              </p>
            </div>
            
            <div className="space-y-2">
              <Award className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold">Craft Details</h3>
              <p className="text-sm text-muted-foreground">
                Technique, materials, cultural context
              </p>
            </div>
            
            <div className="space-y-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold">Heritage Narrative</h3>
              <p className="text-sm text-muted-foreground">
                AI-generated 300+ word story
              </p>
            </div>
            
            <div className="space-y-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold">Sustainability</h3>
              <p className="text-sm text-muted-foreground">
                Carbon footprint, eco-claims, scores
              </p>
            </div>
            
            <div className="space-y-2">
              <Globe className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold">Cultural Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Historical origin, rituals, symbolism
              </p>
            </div>
            
            <div className="space-y-2">
              <Users className="h-6 w-6 text-orange-600" />
              <h3 className="font-semibold">Preservation</h3>
              <p className="text-sm text-muted-foreground">
                Endangered status, UNESCO relevance
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Button
              onClick={() => window.location.href = "/"}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Explore KalpanaAI Platform
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sample Preview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This QR code on your physical product links here, verifying authenticity and sharing the artisan's story with buyers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Support Artisans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Every purchase helps preserve traditional crafts and supports artisan communities. Your choice makes a difference.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-8 space-y-4">
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share This Heritage
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground italic">
          "Your craft isn't just a product — it's a living story."
        </p>
        
        <p className="text-xs text-muted-foreground">
          Powered by KalpanaAI Craft DNA System
        </p>
      </div>
    </div>
  );
}
