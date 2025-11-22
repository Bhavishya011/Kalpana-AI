"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LifeBuoy,
  MessageSquare,
  BookMarked,
  Zap,
  Sparkles,
  TrendingUp,
  BookOpen,
  Palette,
  LineChart,
  Camera,
  ShoppingBag,
  HelpCircle,
  Send,
  Target,
  Loader2,
} from "lucide-react";
import type { getDictionary } from '@/lib/i18n/dictionaries';
import { useTranslatedDictionary } from "@/hooks/use-dictionary-translation";
import { useChatbot } from "@/hooks/useChatbot";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['dashboard'];

export function SupportCenter({ dictionary, language }: { dictionary: Dictionary; language: string }) {
  const t = dictionary; // Already translated server-side

  // Use the chatbot hook with current language
  const { messages, isLoading, sendMessage, getQuickHelp } = useChatbot(language);

  const [chatMessage, setChatMessage] = React.useState("");
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // State for translated content
  const [content, setContent] = React.useState({
    subtitle: "Everything you need to know about KalpanaAI features and how to use them",
    featuresTab: "Features",
    guidesTab: "How to Use",
    chatTab: "Chat Support",
    // Feature cards
    aiProductTitle: "AI-Powered Product Creation",
    aiProductDesc: "Transform your craft ideas into professional listings",
    multilingualDesc: "Multilingual Descriptions",
    multilingualText: "Generate compelling product descriptions in multiple languages",
    aiImageTitle: "AI Image Enhancement",
    aiImageText: "Create professional product images with AI enhancement",
    smartPricingTitle: "Smart Pricing",
    smartPricingText: "Get pricing recommendations based on market trends",
    // Market Pulse
    marketPulseTitle: "Market Pulse",
    marketPulseDesc: "Real-time insights into market demand",
    hyperlocalTitle: "Hyperlocal Demand",
    hyperlocalText: "Track demand for your crafts in specific locations",
    seasonalTitle: "Seasonal Predictions",
    seasonalText: "Get alerts for upcoming festivals and seasons",
    regionalTitle: "Regional Opportunities",
    regionalText: "Discover market opportunities in different regions",
    // Artisan Mentor
    mentorTitle: "Artisan Mentor",
    mentorDesc: "AI-powered learning platform for artisans",
    personalizedTitle: "Personalized Learning",
    personalizedText: "Follow customized paths for business growth",
    achievementsTitle: "Achievements & Points",
    achievementsText: "Earn rewards as you complete lessons",
    validationTitle: "AI Validation",
    validationText: "Get instant feedback on your assignments",
    // The Muse
    museTitle: "The Muse",
    museDesc: "Creative AI assistant for artisans",
    creativeTitle: "Creative Ideas",
    creativeText: "Get inspired with innovative product concepts",
    designTitle: "Design Variations",
    designText: "Explore customization and design options",
    trendTitle: "Trend Recommendations",
    trendText: "Stay ahead with trend-based suggestions",
    // Sales Analytics
    salesTitle: "Sales Analytics",
    salesDesc: "Track your business performance",
    reportsTitle: "Sales Reports",
    reportsText: "Detailed analysis of your sales trends",
    revenueTitle: "Revenue Tracking",
    revenueText: "Monitor income and forecast future earnings",
    insightsTitle: "Performance Insights",
    insightsText: "Get actionable recommendations to grow",
    // Multilingual
    multilingualTitle: "Multilingual Support",
    multilingualSupportDesc: "Work in your preferred language",
    languagesTitle: "10+ Languages",
    languagesText: "Choose from English, Hindi, Bengali, and more",
    translationTitle: "Real-time Translation",
    translationText: "All content translates automatically",
    switchingTitle: "Easy Switching",
    switchingText: "Change language anytime from the header",
  });

  // Translate all content when language changes
  React.useEffect(() => {
    if (language === 'en-US') return;

    async function translateContent() {
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            object: {
              subtitle: "Everything you need to know about KalpanaAI features and how to use them",
              featuresTab: "Features",
              guidesTab: "How to Use",
              chatTab: "Chat Support",
              aiProductTitle: "AI-Powered Product Creation",
              aiProductDesc: "Transform your craft ideas into professional listings",
              multilingualDesc: "Multilingual Descriptions",
              multilingualText: "Generate compelling product descriptions in multiple languages",
              aiImageTitle: "AI Image Enhancement",
              aiImageText: "Create professional product images with AI enhancement",
              smartPricingTitle: "Smart Pricing",
              smartPricingText: "Get pricing recommendations based on market trends",
              marketPulseTitle: "Market Pulse",
              marketPulseDesc: "Real-time insights into market demand",
              hyperlocalTitle: "Hyperlocal Demand",
              hyperlocalText: "Track demand for your crafts in specific locations",
              seasonalTitle: "Seasonal Predictions",
              seasonalText: "Get alerts for upcoming festivals and seasons",
              regionalTitle: "Regional Opportunities",
              regionalText: "Discover market opportunities in different regions",
              mentorTitle: "Artisan Mentor",
              mentorDesc: "AI-powered learning platform for artisans",
              personalizedTitle: "Personalized Learning",
              personalizedText: "Follow customized paths for business growth",
              achievementsTitle: "Achievements & Points",
              achievementsText: "Earn rewards as you complete lessons",
              validationTitle: "AI Validation",
              validationText: "Get instant feedback on your assignments",
              museTitle: "The Muse",
              museDesc: "Creative AI assistant for artisans",
              creativeTitle: "Creative Ideas",
              creativeText: "Get inspired with innovative product concepts",
              designTitle: "Design Variations",
              designText: "Explore customization and design options",
              trendTitle: "Trend Recommendations",
              trendText: "Stay ahead with trend-based suggestions",
              salesTitle: "Sales Analytics",
              salesDesc: "Track your business performance",
              reportsTitle: "Sales Reports",
              reportsText: "Detailed analysis of your sales trends",
              revenueTitle: "Revenue Tracking",
              revenueText: "Monitor income and forecast future earnings",
              insightsTitle: "Performance Insights",
              insightsText: "Get actionable recommendations to grow",
              multilingualTitle: "Multilingual Support",
              multilingualSupportDesc: "Work in your preferred language",
              languagesTitle: "10+ Languages",
              languagesText: "Choose from English, Hindi, Bengali, and more",
              translationTitle: "Real-time Translation",
              translationText: "All content translates automatically",
              switchingTitle: "Easy Switching",
              switchingText: "Change language anytime from the header",
            },
            targetLocale: language,
            sourceLocale: 'en-US',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.translation) {
            setContent(data.translation);
          }
        }
      } catch (error) {
        console.error('Failed to translate support content:', error);
      }
    }

    translateContent();
  }, [language]);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userMessage = chatMessage;
    setChatMessage("");
    await sendMessage(userMessage);
  };

  const handleQuickQuestion = async (question: string, category: string) => {
    setChatMessage(question);
    // Get quick help from API
    await getQuickHelp(category);
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <LifeBuoy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold">{t.sidebar?.support || "Help & Support Center"}</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {content.subtitle}
        </p>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="features" className="text-base">
            <Zap className="h-5 w-5 mr-2" />
            {content.featuresTab}
          </TabsTrigger>
          <TabsTrigger value="guides" className="text-base">
            <BookMarked className="h-5 w-5 mr-2" />
            {content.guidesTab}
          </TabsTrigger>
          <TabsTrigger value="chat" className="text-base">
            <MessageSquare className="h-5 w-5 mr-2" />
            {content.chatTab}
          </TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-6 w-6 text-primary" />
                  {content.aiProductTitle}
                </CardTitle>
                <CardDescription className="text-base">
                  {content.aiProductDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">✨</Badge>
                  <div>
                    <p className="font-medium">{content.multilingualDesc}</p>
                    <p className="text-sm text-muted-foreground">{content.multilingualText}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">🎨</Badge>
                  <div>
                    <p className="font-medium">{content.aiImageTitle}</p>
                    <p className="text-sm text-muted-foreground">{content.aiImageText}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">💰</Badge>
                  <div>
                    <p className="font-medium">{content.smartPricingTitle}</p>
                    <p className="text-sm text-muted-foreground">{content.smartPricingText}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  {content.marketPulseTitle}
                </CardTitle>
                <CardDescription className="text-base">
                  {content.marketPulseDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">📊</Badge>
                  <div>
                    <p className="font-medium">{content.hyperlocalTitle}</p>
                    <p className="text-sm text-muted-foreground">{content.hyperlocalText}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">🎯</Badge>
                  <div>
                    <p className="font-medium">{content.seasonalTitle}</p>
                    <p className="text-sm text-muted-foreground">{content.seasonalText}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">🌍</Badge>
                  <div>
                    <p className="font-medium">{content.regionalTitle}</p>
                    <p className="text-sm text-muted-foreground">{content.regionalText}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                  {content.mentorTitle}
                </CardTitle>
                <CardDescription className="text-base">
                  {content.mentorDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">📚</Badge>
                  <div>
                    <p className="font-medium">{content.personalizedTitle}</p>
                    <p className="text-sm text-muted-foreground">{content.personalizedText}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">🏆</Badge>
                  <div>
                    <p className="font-medium">{content.achievementsTitle}</p>
                    <p className="text-sm text-muted-foreground">{content.achievementsText}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">✅</Badge>
                  <div>
                    <p className="font-medium">{content.validationTitle}</p>
                    <p className="text-sm text-muted-foreground">{content.validationText}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Palette className="h-6 w-6 text-primary" />
                  {content.museTitle}
                </CardTitle>
                <CardDescription className="text-base">
                  {content.museDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">💡</Badge>
                  <div>
                    <p className="font-medium">Creative Ideas</p>
                    <p className="text-sm text-muted-foreground">Get inspired with innovative product concepts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">🎭</Badge>
                  <div>
                    <p className="font-medium">Design Variations</p>
                    <p className="text-sm text-muted-foreground">Explore customization and design options</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">🌟</Badge>
                  <div>
                    <p className="font-medium">Trend Recommendations</p>
                    <p className="text-sm text-muted-foreground">Stay ahead with trend-based suggestions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <LineChart className="h-6 w-6 text-primary" />
                  Sales Analytics
                </CardTitle>
                <CardDescription className="text-base">
                  Track your business performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">📈</Badge>
                  <div>
                    <p className="font-medium">Sales Reports</p>
                    <p className="text-sm text-muted-foreground">Detailed analysis of your sales trends</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">💰</Badge>
                  <div>
                    <p className="font-medium">Revenue Tracking</p>
                    <p className="text-sm text-muted-foreground">Monitor income and forecast future earnings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">🎯</Badge>
                  <div>
                    <p className="font-medium">Performance Insights</p>
                    <p className="text-sm text-muted-foreground">Get actionable recommendations to grow</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="h-6 w-6 text-primary" />
                  Multilingual Support
                </CardTitle>
                <CardDescription className="text-base">
                  Work in your preferred language
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">🌐</Badge>
                  <div>
                    <p className="font-medium">10+ Languages</p>
                    <p className="text-sm text-muted-foreground">Choose from English, Hindi, Bengali, and more</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">🔄</Badge>
                  <div>
                    <p className="font-medium">Real-time Translation</p>
                    <p className="text-sm text-muted-foreground">All content translates automatically</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">📱</Badge>
                  <div>
                    <p className="font-medium">Easy Switching</p>
                    <p className="text-sm text-muted-foreground">Change language anytime with one click</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* How to Use Tab */}
        <TabsContent value="guides" className="space-y-6 mt-6">
          <div className="grid gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Camera className="h-6 w-6 text-primary" />
                  Step 1: Create Your Product
                </CardTitle>
                <CardDescription className="text-base">
                  Follow these steps to add your first product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Navigate to Add Product</p>
                        <p className="text-sm text-muted-foreground">
                          Click on the "Add Product" option in the sidebar menu
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Upload Product Images</p>
                        <p className="text-sm text-muted-foreground">
                          Upload clear, well-lit photos of your craft (up to 5 images recommended)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Fill in Details</p>
                        <p className="text-sm text-muted-foreground">
                          Enter product name and basic description
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">AI Enhancement</p>
                        <p className="text-sm text-muted-foreground">
                          Let AI improve images, suggest pricing, and optimize descriptions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Step 2: Monitor Market Trends
                </CardTitle>
                <CardDescription className="text-base">
                  Stay ahead of market demands
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Check Market Pulse Daily</p>
                        <p className="text-sm text-muted-foreground">
                          View real-time demand alerts for your craft type and location
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Act on Seasonal Trends</p>
                        <p className="text-sm text-muted-foreground">
                          Plan inventory based on upcoming festivals and seasons
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Adjust Pricing</p>
                        <p className="text-sm text-muted-foreground">
                          Update prices based on demand multipliers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Track Trends</p>
                        <p className="text-sm text-muted-foreground">
                          Monitor trending crafts in your region
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Step 3: Learn with Artisan Mentor
                </CardTitle>
                <CardDescription className="text-base">
                  Grow your business skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Complete Daily Lessons</p>
                        <p className="text-sm text-muted-foreground">
                          Follow personalized learning paths
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Submit Assignments</p>
                        <p className="text-sm text-muted-foreground">
                          Practice with real-world tasks
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Track Progress</p>
                        <p className="text-sm text-muted-foreground">
                          Earn points and unlock achievements
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  Step 4: Grow Your Sales
                </CardTitle>
                <CardDescription className="text-base">
                  Maximize your business potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Use AI Content</p>
                        <p className="text-sm text-muted-foreground">
                          Copy enhanced descriptions to your store
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Share on Social Media</p>
                        <p className="text-sm text-muted-foreground">
                          Post AI-generated content online
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Analyze Performance</p>
                        <p className="text-sm text-muted-foreground">
                          Check analytics to optimize
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  Pro Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">💡</Badge>
                    <p className="text-sm">Upload high-quality images in good lighting for best AI results</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">💡</Badge>
                    <p className="text-sm">Check Market Pulse before creating new products to match demand</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">💡</Badge>
                    <p className="text-sm">Complete Artisan Mentor lessons daily to improve your skills</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">💡</Badge>
                    <p className="text-sm">Use multilingual support to reach customers worldwide</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">💡</Badge>
                    <p className="text-sm">Review Sales Analytics weekly to track your growth</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">💡</Badge>
                    <p className="text-sm">Engage with The Muse for creative product ideas and inspiration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Chat Support Tab */}
        <TabsContent value="chat" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Chat Area - Takes 2 columns */}
            <Card className="lg:col-span-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Live Chat Support
                </CardTitle>
                <CardDescription className="text-base">
                  Ask questions and get help from our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat History */}
                  <ScrollArea className="h-[400px] border rounded-lg p-4 bg-muted/30">
                    <div className="space-y-4">
                      {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Hello! How can I help you today?</p>
                          <p className="text-xs mt-2">Ask me anything about KalpanaAI features!</p>
                        </div>
                      )}
                      {messages.map((chat, index) => (
                        <div
                          key={index}
                          className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${chat.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card border shadow-sm'
                              }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{chat.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(chat.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-card border shadow-sm rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <p className="text-sm text-muted-foreground">Thinking...</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Chat Input */}
                  <div className="flex gap-3">
                    <Textarea
                      placeholder="Type your message here..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[100px] resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="self-end h-[100px] px-6"
                      size="lg"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Questions Sidebar */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Quick Questions</CardTitle>
                <CardDescription>
                  Click to ask common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleQuickQuestion("How do I create a product?", "product-creation")}
                    disabled={isLoading}
                  >
                    <Camera className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">How to create products?</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleQuickQuestion("How does AI pricing work?", "pricing")}
                    disabled={isLoading}
                  >
                    <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">How does AI pricing work?</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleQuickQuestion("How to use The Muse?", "the-muse")}
                    disabled={isLoading}
                  >
                    <Palette className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">About The Muse</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleQuickQuestion("How does Artisan Mentor work?", "artisan-mentor")}
                    disabled={isLoading}
                  >
                    <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Artisan Mentor help</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleQuickQuestion("How to check sales analytics?", "getting-started")}
                    disabled={isLoading}
                  >
                    <LineChart className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Sales Analytics help</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleQuickQuestion("What is Market Pulse?", "market-pulse")}
                    disabled={isLoading}
                  >
                    <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">About Market Pulse</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
