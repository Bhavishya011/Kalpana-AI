"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dna, 
  QrCode, 
  Download, 
  Share2, 
  Leaf, 
  Award,
  MapPin,
  Calendar,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface CraftDNAData {
  heritage_id: string;
  heritage_url: string;
  created_at: string;
  qr_code: {
    image_base64: string;
    url: string;
    format: string;
    size: string;
    printable: boolean;
  };
  artisan: {
    name: string;
    village: string | null;
    state: string | null;
    lineage: string | null;
    craft_tradition_years: number | null;
    personal_story: string;
  };
  craft: {
    technique: string;
    regional_tradition: string;
    materials: string[];
    cultural_context: string;
    endangered_status: string;
  };
  heritage_narrative: string;
  cultural_analysis: {
    historical_origin: string;
    cultural_rituals: string;
    symbolic_meaning: string;
    endangered_risk: string;
    modern_relevance: string;
  };
  eco_impact: {
    carbon_footprint: {
      value: number;
      unit: string;
      vs_industrial: string;
    };
    water_usage: {
      vs_industrial: string;
    };
    renewable_materials: number;
    sustainability_score: number;
    eco_claims: string[];
  };
  metadata: {
    craft_category: string;
    preservation_priority: string;
    unesco_relevant: boolean;
  };
}

interface CraftDNAFormData {
  artisanStory: string;
  craftTechnique: string;
  regionalTradition: string;
  materials: string;
  culturalContext: string;
  artisanName: string;
  artisanVillage: string;
  artisanState: string;
  artisanLineage: string;
  yearsOfExperience: string;
}

export function CraftDNASection({ productId }: { productId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [craftDNA, setCraftDNA] = useState<CraftDNAData | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CraftDNAFormData>({
    artisanStory: "",
    craftTechnique: "",
    regionalTradition: "",
    materials: "",
    culturalContext: "",
    artisanName: "",
    artisanVillage: "",
    artisanState: "",
    artisanLineage: "",
    yearsOfExperience: "",
  });

  const handleInputChange = (
    field: keyof CraftDNAFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateCraftDNA = async () => {
    setIsGenerating(true);
    try {
      // Validate required fields
      if (!formData.artisanStory || !formData.craftTechnique || !formData.regionalTradition) {
        toast({
          title: "Missing Information",
          description: "Please fill in at least: Artisan Story, Craft Technique, and Regional Tradition",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      const formBody = new FormData();
      formBody.append("product_id", productId);
      formBody.append("artisan_story", formData.artisanStory);
      formBody.append("craft_technique", formData.craftTechnique);
      formBody.append("regional_tradition", formData.regionalTradition);
      formBody.append("materials", formData.materials);
      formBody.append("cultural_context", formData.culturalContext);
      formBody.append("artisan_name", formData.artisanName);
      formBody.append("artisan_village", formData.artisanVillage);
      formBody.append("artisan_state", formData.artisanState);
      formBody.append("artisan_lineage", formData.artisanLineage);
      formBody.append("years_of_experience", formData.yearsOfExperience);

      const response = await fetch(
        "https://support-chatbot-api-508329185712.us-central1.run.app/api/craft-dna/generate",
        {
          method: "POST",
          body: formBody,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCraftDNA(result.craft_dna);
        toast({
          title: "🎉 Craft DNA Generated!",
          description: "Your craft's heritage has been permanently preserved",
        });
      } else {
        throw new Error(result.error || "Failed to generate Craft DNA");
      }
    } catch (error) {
      console.error("Error generating Craft DNA:", error);
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error ? error.message : "Failed to generate Craft DNA",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!craftDNA) return;

    const link = document.createElement("a");
    link.href = `data:image/png;base64,${craftDNA.qr_code.image_base64}`;
    link.download = `craft-dna-qr-${craftDNA.heritage_id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Code Downloaded",
      description: "Attach this to your product packaging",
    });
  };

  const shareHeritageURL = () => {
    if (!craftDNA) return;

    navigator.clipboard.writeText(craftDNA.heritage_url);
    toast({
      title: "Link Copied!",
      description: "Heritage page URL copied to clipboard",
    });
  };

  if (!isExpanded && !craftDNA) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Dna className="h-6 w-6 text-purple-600" />
            <span className="font-headline">🧬 Craft DNA - Digital Heritage</span>
          </CardTitle>
          <CardDescription>
            Preserve your craft's cultural authenticity with a permanent digital heritage record and scannable QR code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setIsExpanded(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Create Craft DNA Record
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!craftDNA) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Dna className="h-6 w-6 text-purple-600" />
            <span className="font-headline">Create Craft DNA Record</span>
          </CardTitle>
          <CardDescription>
            Tell us about your craft's heritage to generate a permanent digital record
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="artisan-name">Your Name *</Label>
                <Input
                  id="artisan-name"
                  placeholder="e.g., Ramesh Kumar"
                  value={formData.artisanName}
                  onChange={(e) => handleInputChange("artisanName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="craft-technique">Craft Technique *</Label>
                <Input
                  id="craft-technique"
                  placeholder="e.g., Jaipur brass casting and etching"
                  value={formData.craftTechnique}
                  onChange={(e) => handleInputChange("craftTechnique", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="regional-tradition">Regional Tradition *</Label>
                <Input
                  id="regional-tradition"
                  placeholder="e.g., Rajasthani metalwork"
                  value={formData.regionalTradition}
                  onChange={(e) =>
                    handleInputChange("regionalTradition", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="materials">Materials Used (comma-separated)</Label>
                <Input
                  id="materials"
                  placeholder="e.g., recycled brass, natural lacquer, beeswax"
                  value={formData.materials}
                  onChange={(e) => handleInputChange("materials", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  placeholder="e.g., Amber"
                  value={formData.artisanVillage}
                  onChange={(e) => handleInputChange("artisanVillage", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="e.g., Rajasthan"
                  value={formData.artisanState}
                  onChange={(e) => handleInputChange("artisanState", e.target.value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="artisan-story">Your Craft Story *</Label>
                <Textarea
                  id="artisan-story"
                  placeholder="Tell us how you learned this craft, your family tradition, how long you've been practicing..."
                  className="min-h-[150px]"
                  value={formData.artisanStory}
                  onChange={(e) => handleInputChange("artisanStory", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cultural-context">Cultural Context</Label>
                <Textarea
                  id="cultural-context"
                  placeholder="Festivals, rituals, or occasions where this craft is used..."
                  className="min-h-[100px]"
                  value={formData.culturalContext}
                  onChange={(e) =>
                    handleInputChange("culturalContext", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="lineage">Craft Lineage</Label>
                <Input
                  id="lineage"
                  placeholder="e.g., 4th generation artisan"
                  value={formData.artisanLineage}
                  onChange={(e) => handleInputChange("artisanLineage", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="e.g., 25"
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    handleInputChange("yearsOfExperience", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={generateCraftDNA}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating Heritage Record...
                </>
              ) : (
                <>
                  <Dna className="mr-2 h-4 w-4" />
                  Generate Craft DNA
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsExpanded(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            * Required fields. Your craft's story will be permanently preserved and accessible via QR code.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Display generated Craft DNA
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Dna className="h-6 w-6 text-purple-600" />
            <span className="font-headline">🧬 Craft DNA Generated!</span>
          </CardTitle>
          <CardDescription>
            Your craft's heritage is now permanently preserved
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code and Quick Actions */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-lg border">
            <div className="text-center space-y-3">
              <div className="relative w-64 h-64 mx-auto">
                <Image
                  src={`data:image/png;base64,${craftDNA.qr_code.image_base64}`}
                  alt="Craft Heritage QR Code"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm font-medium">Scan to View Heritage Page</p>
              <p className="text-xs text-muted-foreground">
                Heritage ID: {craftDNA.heritage_id}
              </p>
            </div>

            <div className="space-y-3 flex-1">
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <Button onClick={downloadQRCode} className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
              <Button onClick={shareHeritageURL} className="w-full" variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Copy Heritage Link
              </Button>
              <Button
                onClick={() => window.open(craftDNA.heritage_url, "_blank")}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                <QrCode className="mr-2 h-4 w-4" />
                View Heritage Page
              </Button>
            </div>
          </div>

          {/* Artisan & Craft Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Artisan Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Name:</strong> {craftDNA.artisan.name}</p>
                {craftDNA.artisan.village && (
                  <p><strong>Village:</strong> {craftDNA.artisan.village}</p>
                )}
                {craftDNA.artisan.state && (
                  <p><strong>State:</strong> {craftDNA.artisan.state}</p>
                )}
                {craftDNA.artisan.lineage && (
                  <p><strong>Lineage:</strong> {craftDNA.artisan.lineage}</p>
                )}
                {craftDNA.artisan.craft_tradition_years && (
                  <p><strong>Experience:</strong> {craftDNA.artisan.craft_tradition_years} years</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Craft Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Technique:</strong> {craftDNA.craft.technique}</p>
                <p><strong>Tradition:</strong> {craftDNA.craft.regional_tradition}</p>
                <p><strong>Category:</strong> {craftDNA.metadata.craft_category}</p>
                <Badge variant={craftDNA.craft.endangered_status.includes("At Risk") ? "destructive" : "secondary"}>
                  {craftDNA.craft.endangered_status}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Sustainability Score */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                Sustainability Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sustainability Score</span>
                  <span className="text-2xl font-bold text-green-600">
                    {craftDNA.eco_impact.sustainability_score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                    style={{ width: `${craftDNA.eco_impact.sustainability_score}%` }}
                  ></div>
                </div>
                <div className="grid gap-2 text-xs">
                  {craftDNA.eco_impact.eco_claims.slice(0, 3).map((claim, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{claim}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {craftDNA.eco_impact.carbon_footprint.vs_industrial}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Heritage Narrative Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Heritage Narrative (AI-Generated)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-6">
                {craftDNA.heritage_narrative}
              </p>
              <Button
                variant="link"
                className="mt-2 p-0"
                onClick={() => window.open(craftDNA.heritage_url, "_blank")}
              >
                Read full story →
              </Button>
            </CardContent>
          </Card>

          <div className="text-center p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
              💜 "Your craft isn't just a product — it's a living story."
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              Attach the QR code to your product so buyers can discover its heritage
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
