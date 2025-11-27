
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
import { useTranslatedObject } from "@/hooks/use-translation";
import { useTranslatedDictionary } from "@/hooks/use-dictionary-translation";
import { Sparkles, Upload, Mic, Edit2, Check, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { LoadingKolam } from "../loading-kolam";
import { CraftDNASection } from "./craft-dna-section";
import type { getDictionary } from "@/lib/i18n/dictionaries";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>["dashboard"];

interface ProductPost {
  image_url: string | null;
  description: string;
}

interface StoryPost {
  image_url: string | null;
  story: string;
  caption: string;
}

interface MarketingKit {
  story_title: string;
  story_text: string;
  emotional_theme: string;
  pricing?: {
    suggested_price: number;
    price_range: {
      min: number;
      max: number;
    };
    justification: string;
    success_probability: number;
    breakdown: {
      heritage_score: number;
      complexity_score: number;
      market_score: number;
      combined_score: number;
      base_price: number;
      price_multiplier: number;
    };
  };
  assets: {
    story_images: string[];
    image_prompts: string[];
    enhanced_photos?: string[];
    original_photo?: string;
    social_post?: string;
  };
}

interface ProcessingInfo {
  curator_used: boolean;
  photo_enhanced: boolean;
  story_images_generated: number;
  social_post_created: boolean;
  enhanced_photos_count: number;
  pricing_calculated?: boolean;
  processing_time_seconds?: number;
  files_generated?: number;
}

interface GenerateEmotionalProductStoryOutput {
  status: string;
  marketing_kit: MarketingKit;
  asset_id: string;
  message: string;
  processing_info: ProcessingInfo;
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
  const [materialCost, setMaterialCost] = useState<string>("100");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] =
    useState<GenerateEmotionalProductStoryOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [customPrice, setCustomPrice] = useState<string>("");
  const { toast } = useToast();

  // Translate static dictionary text
  const t = dictionary; // Already translated server-side

  // Automatically translate the API response
  const { data: translatedResult, isTranslating } = useTranslatedObject(
    result?.marketing_kit || null,
    language
  );

  // Use translated result if available, otherwise use original
  const displayResult = result && translatedResult ? {
    ...result,
    marketing_kit: translatedResult
  } : result;

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
    if (!file && !artisanBackground) {
      toast({
        title: t.addProduct.missingInfoTitle,
        description: t.addProduct.missingInfoDescription,
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      try {
        setLoadingStep("🎨 Analyzing your product and story...");

        const formData = new FormData();
        if (file) {
          formData.append('photo', file);
        }
        formData.append('description', artisanBackground);
        formData.append('material_cost', materialCost || "100");
        formData.append('enable_generation', "true");

        setLoadingStep("📖 Creating compelling stories...");

        const apiResponse = await fetch('/api/proxy', {
          method: 'POST',
          body: formData,
        });

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          throw new Error(`HTTP error! status: ${apiResponse.status} - ${errorText}`);
        }

        setLoadingStep("🖼️ Generating enhanced images...");

        const response: GenerateEmotionalProductStoryOutput = await apiResponse.json();

        console.log("📦 API Response:", JSON.stringify(response, null, 2));

        // Validate response structure
        if (!response.marketing_kit) {
          console.error("❌ Invalid response structure:", response);
          throw new Error("Invalid response: marketing_kit is missing");
        }

        setLoadingStep("✨ Finalizing your marketing kit...");

        // Simulate a brief delay to show the final step
        await new Promise(resolve => setTimeout(resolve, 1000));

        setResult(response);
        setLoadingStep("");

        toast({
          title: "🎉 Success!",
          description: "Your marketing kit has been generated with enhanced stories and images!",
        });

      } catch (error) {
        console.error("Error generating story:", error);
        setLoadingStep("");
        toast({
          title: t.addProduct.generationFailedTitle,
          description: error instanceof Error ? error.message : t.addProduct.generationFailedDescription,
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
    setMaterialCost("100");
    setLoadingStep("");
    setIsEditingPrice(false);
    setCustomPrice("");
  }

  // ... inside AddProduct component ...
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleVoiceRecord = async () => {
    // STOP RECORDING
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setLoadingStep("🎤 Processing your voice...");
      }
      return;
    }

    // START RECORDING
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

        // Send to Backend
        startTransition(async () => {
          try {
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.webm");

            const response = await fetch("/api/transcribe", {
              method: "POST",
              body: formData,
            });

            const data = await response.json();

            if (data.success && data.transcription) {
              // Append transcription to existing text
              setArtisanBackground((prev) =>
                prev ? `${prev}\n${data.transcription}` : data.transcription
              );
              toast({
                title: "Voice Added!",
                description: "Your story has been transcribed successfully.",
              });
            } else {
              throw new Error(data.error || "Transcription failed");
            }
          } catch (error) {
            console.error(error);
            toast({
              title: "Error",
              description: "Could not process audio. Please try again.",
              variant: "destructive",
            });
          } finally {
            setLoadingStep("");
            // Stop all tracks to release microphone
            stream.getTracks().forEach(track => track.stop());
          }
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({ title: "🎙️ Listening...", description: "Speak your story now." });

    } catch (err) {
      console.error("Microphone error:", err);
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access to record.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Sparkles className="text-primary" />
          <span className="font-headline">{t.addProduct.title}</span>
        </CardTitle>
        <CardDescription>{t.addProduct.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!result && !isPending && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="product-photo">{t.addProduct.productPhoto}</Label>
                <Input
                  id="product-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              {preview && (
                <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-lg border hover-scale cursor-pointer shadow-sm hover:shadow-md transition-all">
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
                <Label htmlFor="artisan-background">{t.addProduct.yourBackground}</Label>
                <Textarea
                  placeholder={t.addProduct.backgroundPlaceholder}
                  id="artisan-background"
                  value={artisanBackground}
                  onChange={(e) => setArtisanBackground(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="material-cost">Material Cost (₹)</Label>
                <Input
                  id="material-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter material cost in ₹"
                  value={materialCost}
                  onChange={(e) => setMaterialCost(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Base cost of materials used in crafting this product
                </p>
              </div>
              <Button
                variant={isRecording ? "destructive" : "outline"}
                className={`w-full transition-all duration-300 ${isRecording ? "animate-pulse" : ""}`}
                onClick={handleVoiceRecord}
                disabled={isPending && !isRecording} // Disable if other API calls are running
              >
                {isRecording ? (
                  <>
                    <span className="mr-2 h-3 w-3 rounded-full bg-white animate-ping" />
                    Stop Recording...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Record Story
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        {isPending && (
          <div className="flex flex-col items-center justify-center gap-6 py-12">
            <LoadingKolam />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground">
                {loadingStep || "🎼 Starting your storytelling journey..."}
              </p>
              <p className="text-sm text-muted-foreground">
                AI is crafting your personalized marketing kit with enhanced images and compelling stories
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        {result && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-headline text-primary">🎉 Your Marketing Kit is Ready!</h2>
              <p className="text-muted-foreground">AI-generated stories and enhanced visuals for your artisan craft</p>
              {result.processing_info && (
                <div className="flex flex-wrap gap-4 justify-center mt-4 text-xs text-muted-foreground">
                  <span>📸 Enhanced: {result.processing_info.enhanced_photos_count}</span>
                  <span>🖼️ Images: {result.processing_info.story_images_generated}</span>
                  <span>💰 Pricing: {result.processing_info.pricing_calculated ? '✅' : '❌'}</span>
                  <span>⏱️ Time: {result.processing_info.processing_time_seconds?.toFixed(1)}s</span>
                  <span>🎭 Curator: {result.processing_info.curator_used ? '✅' : '❌'}</span>
                </div>
              )}
            </div>

            {/* Story Header */}
            {displayResult?.marketing_kit?.story_title && (
              <section className="text-center space-y-4 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
                <h2 className="text-2xl font-headline text-primary">{displayResult.marketing_kit.story_title}</h2>
                <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">{displayResult.marketing_kit.story_text}</p>
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                  Theme: {displayResult.marketing_kit.emotional_theme}
                </span>
              </section>
            )}

            {/* AI Dynamic Pricing */}
            {displayResult?.marketing_kit?.pricing ? (
              <section className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-headline text-2xl mb-4 flex items-center gap-2 text-green-700 dark:text-green-300">
                  <span className="text-2xl">💰</span>
                  AI Dynamic Pricing Analysis
                </h3>

                {/* Main Pricing Display with Material Cost */}
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                    <h4 className="font-semibold text-sm text-green-600 dark:text-green-400 mb-2">Minimum Price</h4>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      ₹{(displayResult.marketing_kit.pricing.price_range.min + parseFloat(materialCost || "0")).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ₹{displayResult.marketing_kit.pricing.price_range.min.toFixed(2)} + ₹{parseFloat(materialCost || "0").toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Budget range</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-lg border-2 border-green-300 dark:border-green-600">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-green-600 dark:text-green-400">Recommended Price</h4>
                      {!isEditingPrice && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCustomPrice((displayResult.marketing_kit.pricing.suggested_price + parseFloat(materialCost || "0")).toFixed(2));
                            setIsEditingPrice(true);
                          }}
                          className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-200"
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                    
                    {isEditingPrice ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Input
                              type="number"
                              value={customPrice}
                              onChange={(e) => setCustomPrice(e.target.value)}
                              className="text-center text-xl font-bold"
                              placeholder="Enter price"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Price Updated!",
                                description: `Your custom price ₹${parseFloat(customPrice).toFixed(2)} has been set.`,
                              });
                              setIsEditingPrice(false);
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsEditingPrice(false);
                              setCustomPrice("");
                            }}
                            className="flex-1"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          AI Suggested: ₹{(displayResult.marketing_kit.pricing.suggested_price + parseFloat(materialCost || "0")).toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                          ₹{customPrice ? parseFloat(customPrice).toFixed(2) : (displayResult.marketing_kit.pricing.suggested_price + parseFloat(materialCost || "0")).toFixed(2)}
                        </p>
                        {customPrice && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                            Custom Price
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          ₹{displayResult.marketing_kit.pricing.suggested_price.toFixed(2)} + ₹{parseFloat(materialCost || "0").toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">{customPrice ? "Your custom price" : "AI suggested"}</p>
                        <span className="inline-block px-2 py-1 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 text-xs rounded-full">
                          ⭐ {displayResult.marketing_kit.pricing.success_probability.toFixed(1)}% Success Rate
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                    <h4 className="font-semibold text-sm text-green-600 dark:text-green-400 mb-2">Maximum Price</h4>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      ₹{(displayResult.marketing_kit.pricing.price_range.max + parseFloat(materialCost || "0")).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ₹{displayResult.marketing_kit.pricing.price_range.max.toFixed(2)} + ₹{parseFloat(materialCost || "0").toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Premium range</p>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="grid gap-3 md:grid-cols-3 mb-4">
                  <div className="p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-muted-foreground">Heritage Value</span>
                      <span className="text-sm font-bold text-primary">{displayResult.marketing_kit.pricing.breakdown.heritage_score.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5 rounded-full"
                        style={{ width: `${displayResult.marketing_kit.pricing.breakdown.heritage_score * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-muted-foreground">Craft Complexity</span>
                      <span className="text-sm font-bold text-primary">{displayResult.marketing_kit.pricing.breakdown.complexity_score.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${displayResult.marketing_kit.pricing.breakdown.complexity_score * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-muted-foreground">Market Demand</span>
                      <span className="text-sm font-bold text-primary">{displayResult.marketing_kit.pricing.breakdown.market_score.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${displayResult.marketing_kit.pricing.breakdown.market_score * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Pricing Justification */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-lg mt-0.5">💡</span>
                    <span>
                      <strong>AI Analysis:</strong> {displayResult.marketing_kit.pricing.justification}
                    </span>
                  </p>
                </div>
              </section>
            ) : (
              <section className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="font-headline text-2xl mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <span className="text-2xl">💰</span>
                  Pricing Unavailable
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Dynamic pricing analysis could not be completed. Please try again or contact support.
                </p>
              </section>
            )}

            {/* Enhanced Photos Section */}
            {displayResult?.marketing_kit.assets?.enhanced_photos && displayResult.marketing_kit.assets.enhanced_photos.length > 0 && (
              <section>
                <h3 className="font-headline text-2xl mb-6 flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  AI Enhanced Photos
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {displayResult.marketing_kit.assets.enhanced_photos.map((photoUrl, index) => (
                    <div key={`enhanced-${index}`} className="space-y-4 p-4 border rounded-lg bg-card/50 backdrop-blur-sm">
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-border/50">
                        <Image
                          src={photoUrl.startsWith('/generated') ? `/api${photoUrl}` : photoUrl}
                          alt={`AI enhanced ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                          data-ai-hint="enhanced product photo"
                          className="transition-transform hover:scale-105"
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-sm text-primary">
                          {photoUrl.includes('studio') ? '🏢 Studio Shot' :
                            photoUrl.includes('lifestyle') ? '� Lifestyle' :
                              photoUrl.includes('mask') ? '🎭 Debug Mask' :
                                `Enhanced ${index + 1}`}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Original Photo */}
            {displayResult?.marketing_kit.assets?.original_photo && (
              <section>
                <h3 className="font-headline text-2xl mb-6 flex items-center gap-2">
                  <span className="text-2xl">📷</span>
                  Original Photo
                </h3>
                <div className="max-w-md mx-auto">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-border/50">
                    <Image
                      src={displayResult.marketing_kit.assets.original_photo.startsWith('/generated') ? `/api${displayResult.marketing_kit.assets.original_photo}` : displayResult.marketing_kit.assets.original_photo}
                      alt="Original uploaded photo"
                      fill
                      style={{ objectFit: "cover" }}
                      data-ai-hint="original product photo"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Story Images Section */}
            {displayResult?.marketing_kit.assets?.story_images && displayResult.marketing_kit.assets.story_images.length > 0 && (
              <section>
                <h3 className="font-headline text-2xl mb-6 flex items-center gap-2">
                  <span className="text-2xl">�️</span>
                  AI Generated Story Images
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {displayResult.marketing_kit.assets.story_images.map((imageUrl, index) => (
                    <div key={`story-${index}`} className="space-y-4 p-4 border rounded-lg bg-card/50 backdrop-blur-sm">
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-border/50">
                        <Image
                          src={imageUrl.startsWith('/generated') ? `/api${imageUrl}` : imageUrl}
                          alt={`AI story image ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                          data-ai-hint="AI generated story image"
                          className="transition-transform hover:scale-105"
                        />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-primary">Story Visual {index + 1}</h4>
                        {displayResult.marketing_kit.assets.image_prompts?.[index] && (
                          <p className="text-xs text-muted-foreground italic">
                            "{displayResult.marketing_kit.assets.image_prompts[index]}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Social Media Post */}
            {displayResult?.marketing_kit.assets?.social_post && (
              <section>
                <h3 className="font-headline text-2xl mb-6 flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  Social Media Post
                </h3>
                <div className="max-w-md mx-auto">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-border/50">
                    <Image
                      src={displayResult.marketing_kit.assets.social_post.startsWith('/generated') ? `/api${displayResult.marketing_kit.assets.social_post}` : displayResult.marketing_kit.assets.social_post}
                      alt="Social media post"
                      fill
                      style={{ objectFit: "cover" }}
                      data-ai-hint="social media post"
                      className="transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">Ready for Instagram, Facebook & more!</p>
                  </div>
                </div>
              </section>
            )}

            {/* Craft DNA Section */}
            <section>
              <CraftDNASection productId={result.asset_id} />
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
              {t.addProduct.createAnother}
            </Button>
            <Button className="btn-ripple">
              <Upload className="mr-2 h-4 w-4" />
              {t.addProduct.publish}
            </Button>
          </>
        ) : (
          <Button onClick={handleSubmit} disabled={isPending} className="btn-ripple transition-all duration-300 hover:shadow-lg">
            <Sparkles className="mr-2 h-4 w-4" />
            {t.addProduct.generateStory || "Process"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
