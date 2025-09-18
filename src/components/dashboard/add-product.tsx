
"use client";

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
import { Sparkles, Upload, Mic } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { LoadingKolam } from "../loading-kolam";
import type { getDictionary } from "@/lib/i18n/dictionaries";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>["dashboard"];

interface ProductPost {
  image_url: string;
  description: string;
}

interface StoryPost {
  image_url: string;
  story: string;
  caption: string;
}

interface MarketingKit {
    productPosts: ProductPost[];
    storyPosts: StoryPost[];
}

interface GenerateEmotionalProductStoryOutput {
  marketing_kit: MarketingKit;
}


export function AddProduct({
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
        title: dictionary.addProduct.missingInfoTitle,
        description: dictionary.addProduct.missingInfoDescription,
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      try {
        const formData = new FormData();
        if(file) {
            formData.append('photo', file);
        }
        formData.append('description', artisanBackground);
        
        const apiResponse = await fetch('/api/proxy', {
          method: 'POST',
          body: formData,
        });

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          throw new Error(`HTTP error! status: ${apiResponse.status} - ${errorText}`);
        }

        const response: GenerateEmotionalProductStoryOutput = await apiResponse.json();
        setResult(response);
      } catch (error) {
        console.error("Error generating story:", error);
        toast({
          title: dictionary.addProduct.generationFailedTitle,
          description: error instanceof Error ? error.message : dictionary.addProduct.generationFailedDescription,
          variant: "destructive",
        });
      }
    });
  };
  
  const handleReset = () => {
    setResult(null);
    setPreview(null);
    setFile(null);
    setArtisanBackground("");
  }

  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Sparkles className="text-primary" />
          <span className="font-headline">{dictionary.addProduct.title}</span>
        </CardTitle>
        <CardDescription>{dictionary.addProduct.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!result && !isPending && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
               <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="product-photo">{dictionary.addProduct.productPhoto}</Label>
                <Input
                  id="product-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              {preview && (
                <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-lg border">
                  <Image
                    src={preview}
                    alt="Product preview"
                    fill
                    style={{ objectFit: "cover" }}
                    data-ai-hint="product photo"
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="artisan-background">{dictionary.addProduct.yourBackground}</Label>
                <Textarea
                  placeholder={dictionary.addProduct.backgroundPlaceholder}
                  id="artisan-background"
                  value={artisanBackground}
                  onChange={(e) => setArtisanBackground(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <Button variant="outline" className="w-full">
                <Mic className="mr-2 h-4 w-4" />
                {dictionary.addProduct.recordStory || "Record Story (Coming Soon)"}
              </Button>
            </div>
          </div>
        )}
        {isPending && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <LoadingKolam />
            <p className="text-muted-foreground">{dictionary.addProduct.generating}</p>
          </div>
        )}
        {result && (
          <div className="space-y-8">
            <section>
              <h3 className="font-headline text-2xl mb-4">{dictionary.addProduct.productPosts || "Product Posts"}</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {result.marketing_kit.productPosts.map((post, index) => (
                  <div key={`product-${index}`} className="space-y-4">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                      <Image
                        src={post.image_url}
                        alt={`AI enhanced product ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        data-ai-hint="product photo"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.description}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h3 className="font-headline text-2xl mb-4">{dictionary.addProduct.storyPosts || "Story Posts"}</h3>
                <div className="grid gap-8">
                    {result.marketing_kit.storyPosts.map((post, index) => (
                      <div key={`story-${index}`} className="grid md:grid-cols-2 gap-6 items-start">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                          <Image
                            src={post.image_url}
                            alt={`AI story image ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            data-ai-hint="artistic craft"
                          />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground font-semibold italic">"{post.caption}"</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.story}</p>
                        </div>
                      </div>
                    ))}
                </div>
            </section>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 mt-4">
        {result ? (
          <>
            <Button
              variant="outline"
              onClick={handleReset}
            >
              {dictionary.addProduct.createAnother}
            </Button>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              {dictionary.addProduct.publish}
            </Button>
          </>
        ) : (
          <Button onClick={handleSubmit} disabled={isPending}>
            <Sparkles className="mr-2 h-4 w-4" />
            {dictionary.addProduct.generateStory || "Process"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

    