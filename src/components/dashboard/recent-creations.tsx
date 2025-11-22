"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brush } from "lucide-react";
import Image from "next/image";
import type { getDictionary } from '@/lib/i18n/dictionaries';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['dashboard'];

const creations = [
  {
    name: {
      'en-US': 'Hand-painted Diya',
      'hi-IN': 'हाथ से चित्रित दिया',
      'bn-IN': 'হাতে আঁকা দিয়া',
      'ta-IN': 'கை வரைந்த தீபம்',
      'te-IN': 'చేతితో చిత్రించిన దీపం',
      'mr-IN': 'हाताने रंगवलेला दिवा',
      'gu-IN': 'હાથથી રંગેલો દિવો',
      'kn-IN': 'ಕೈಯಿಂದ ಚಿತ್ರಿಸಿದ ದೀಪ',
    },
    image: "/images/brass-diya.png",
    hint: 'painted diya'
  },
  {
    name: {
      'en-US': 'Blue Pottery Vase',
      'hi-IN': 'नीली मिट्टी का फूलदान',
      'bn-IN': 'নীল মৃৎপাত্রের ফুলদানি',
      'ta-IN': 'நீல மட்பாண்ட குவளை',
      'te-IN': 'నీలం కుండల జాడీ',
      'mr-IN': 'निळ्या मातीची फुलदाणी',
      'gu-IN': 'વાદળી માટીની ફૂલદાની',
      'kn-IN': 'ನೀಲಿ ಮಡಿಕೆ ಹೂದಾನಿ',
    },
    image: "/images/blue-pottery.png",
    hint: 'blue pottery'
  },
  {
    name: {
      'en-US': 'Banarasi Silk Saree',
      'hi-IN': 'बनारसी रेशम साड़ी',
      'bn-IN': 'বেনারসি সিল্ক শাড়ি',
      'ta-IN': 'பனாரசி பட்டு சேலை',
      'te-IN': 'బెనారసి పట్టు చీర',
      'mr-IN': 'बनारसी रेशीम साडी',
      'gu-IN': 'બનારસી રેશમ સાડી',
      'kn-IN': 'ಬನಾರಸಿ ರೇಷ್ಮೆ ಸೀರೆ',
    },
    image: "/images/silk-saree.png",
    hint: 'silk saree'
  },
  {
    name: {
      'en-US': 'Channapatna Toy',
      'hi-IN': 'चन्नपटना खिलौना',
      'bn-IN': 'চন্নপত্তনা খেলনা',
      'ta-IN': 'சன்னப்பட்டனா பொம்மை',
      'te-IN': 'చన్నపట్న బొమ్మ',
      'mr-IN': 'चन्नपटना खेळणी',
      'gu-IN': 'ચન્નાપટના રમકડું',
      'kn-IN': 'ಚನ್ನಪಟ್ಟಣದ ಆಟಿಕೆ',
    },
    image: "/images/wooden-toy.png",
    hint: 'wooden toy'
  },
];

export function RecentCreations({ dictionary, language }: { dictionary: Dictionary; language: string }) {
  // Dictionary is already translated server-side, use it directly
  const t = dictionary;

  // Get display names based on current language
  const displayCreations = creations.map(creation => ({
    ...creation,
    displayName: creation.name[language as keyof typeof creation.name] || creation.name['en-US']
  }));

  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50 card-hover animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Brush className="text-primary" />
          <span className="font-headline">{t.recentCreations.title}</span>
        </CardTitle>
        <CardDescription>
          {t.recentCreations.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {displayCreations.map((creation, index) => (
            <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-105">
                <Image
                  src={creation.image}
                  alt={creation.displayName}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={creation.hint}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </div>
              <p className="text-center text-sm font-medium transition-colors duration-300 group-hover:text-primary">{creation.displayName}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
