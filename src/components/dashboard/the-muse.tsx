"use client";

import { generateAIDesignVariations } from "@/ai/flows/generate-ai-design-variations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Palette, Wand2 } from "lucide-react";
import Image from "next/image";
import { useState, useTransition, useRef } from "react";
import { LoadingKolam } from "../loading-kolam";
import type {getDictionary} from '@/lib/i18n/dictionaries';

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['dashboard'];

export function TheMuse({dictionary}: {dictionary: Dictionary}) {
  const [results, setResults] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startTransition(async () => {
        try {
          setResults([]);
          const photoDataUri = await fileToDataUri(file);
          const response = await generateAIDesignVariations({ photoDataUri });
          setResults(response.designVariations);
        } catch (error) {
          console.error("Error generating designs:", error);
          toast({
            title: dictionary.theMuse.generationFailedTitle,
            description: dictionary.theMuse.generationFailedDescription,
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Palette className="text-primary" />
          <span className="font-headline">{dictionary.theMuse.title}</span>
        </CardTitle>
        <CardDescription>
          {dictionary.theMuse.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <LoadingKolam />
            <p className="text-muted-foreground">{dictionary.theMuse.generating}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {results.map((src, index) => (
              <div
                key={index}
                className="relative aspect-square w-full overflow-hidden rounded-lg border"
              >
                <Image
                  src={src}
                  alt={`Design variation ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                  style={{ objectFit: 'cover' }}
                  data-ai-hint="craft design"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
              <p className="mb-2 text-sm text-muted-foreground">
                {dictionary.theMuse.uploadPrompt}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <Button onClick={handleButtonClick} variant="outline" size="sm">
                <Wand2 className="mr-2 h-4 w-4" />
                {dictionary.theMuse.generateVariations}
              </Button>
            </div>
          </div>
        )}
        {results.length > 0 && (
           <div className="mt-4 flex justify-end">
             <Button onClick={() => setResults([])} variant="outline">{dictionary.theMuse.startOver}</Button>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
