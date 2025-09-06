"use client";

import { generateEmotionalProductStory, type GenerateEmotionalProductStoryOutput } from "@/ai/flows/generate-emotional-product-story";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Upload } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { LoadingKolam } from "../loading-kolam";

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function StoryStudio({ language }: { language: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [artisanBackground, setArtisanBackground] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] =
    useState<GenerateEmotionalProductStoryOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (!file || !artisanBackground) {
      toast({
        title: "Missing Information",
        description: "Please upload a photo and describe your background.",
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      try {
        const productPhotoDataUri = await fileToDataUri(file);
        const response = await generateEmotionalProductStory({
          productPhotoDataUri,
          artisanBackground,
          language,
        });
        setResult(response);
      } catch (error) {
        console.error("Error generating story:", error);
        toast({
          title: "Generation Failed",
          description:
            "Could not generate story. Please check the console for errors.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Sparkles className="text-primary" />
          <span className="font-headline">Story Studio</span>
        </CardTitle>
        <CardDescription>
          Turn your product into a story that sells. Upload a photo and tell us
          about yourself.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result && !isPending && (
          <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="product-photo">Product Photo</Label>
              <Input
                id="product-photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {preview && (
              <div className="relative h-48 w-48 overflow-hidden rounded-lg border">
                <Image
                  src={preview}
                  alt="Product preview"
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint="product photo"
                />
              </div>
            )}
            <div className="grid w-full gap-1.5">
              <Label htmlFor="artisan-background">
                Your background or story
              </Label>
              <Textarea
                placeholder="e.g., I'm a third-generation potter from Khurja..."
                id="artisan-background"
                value={artisanBackground}
                onChange={(e) => setArtisanBackground(e.target.value)}
              />
            </div>
          </>
        )}
        {isPending && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <LoadingKolam />
            <p className="text-muted-foreground">Crafting your story...</p>
          </div>
        )}
        {result && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-headline text-lg">Generated Story</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.emotionalStory}</p>
            </div>
            <div className="space-y-4">
               <h3 className="font-headline text-lg">AI Enhanced Image</h3>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <Image
                  src={result.aiEnhancedImage}
                  alt="AI enhanced product"
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint="product photo"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {result ? (
          <>
            <Button variant="outline" onClick={() => {setResult(null); setPreview(null); setFile(null);}}>
              Create Another
            </Button>
            <Button>
              <Upload className="mr-2 h-4 w-4" />1-Click Publish
            </Button>
          </>
        ) : (
          <Button onClick={handleSubmit} disabled={isPending}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Story
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
