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
import type { getDictionary } from "@/lib/i18n/dictionaries";

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

type Dictionary = Awaited<ReturnType<typeof getDictionary>>["dashboard"];

export function StoryStudio({
  language,
  dictionary,
}: {
  language: string;
  dictionary: Dictionary;
}) {
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
        title: dictionary.storyStudio.missingInfoTitle,
        description: dictionary.storyStudio.missingInfoDescription,
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
          title: dictionary.storyStudio.generationFailedTitle,
          description: dictionary.storyStudio.generationFailedDescription,
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
          <span className="font-headline">{dictionary.storyStudio.title}</span>
        </CardTitle>
        <CardDescription>{dictionary.storyStudio.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result && !isPending && (
          <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="product-photo">{dictionary.storyStudio.productPhoto}</Label>
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
                  style={{ objectFit: "cover" }}
                  data-ai-hint="product photo"
                />
              </div>
            )}
            <div className="grid w-full gap-1.5">
              <Label htmlFor="artisan-background">{dictionary.storyStudio.yourBackground}</Label>
              <Textarea
                placeholder={dictionary.storyStudio.backgroundPlaceholder}
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
            <p className="text-muted-foreground">{dictionary.storyStudio.generating}</p>
          </div>
        )}
        {result && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-headline text-lg">{dictionary.storyStudio.generatedStory}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {result.emotionalStory}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-headline text-lg">{dictionary.storyStudio.aiEnhancedImage}</h3>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <Image
                  src={result.aiEnhancedImage}
                  alt="AI enhanced product"
                  fill
                  style={{ objectFit: "cover" }}
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
            <Button
              variant="outline"
              onClick={() => {
                setResult(null);
                setPreview(null);
                setFile(null);
              }}
            >
              {dictionary.storyStudio.createAnother}
            </Button>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              {dictionary.storyStudio.publish}
            </Button>
          </>
        ) : (
          <Button onClick={handleSubmit} disabled={isPending}>
            <Sparkles className="mr-2 h-4 w-4" />
            {dictionary.storyStudio.generateStory}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
