'use client';

import {MarketPulse} from './market-pulse';
import type {getDictionary} from '@/lib/i18n/dictionaries';
import {useRouter, usePathname} from 'next/navigation';
import { i18n } from '@/lib/i18n/i18n-config';
import { Dashboard } from './dashboard';
import { RecentCreations } from './recent-creations';
import { ArtisanCircle } from './artisan-circle';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['dashboard'];

export function HomePage({dictionary}: {dictionary: Dictionary}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    const newPath = `/${lang}`;
    router.replace(newPath);
  };
  
  const langFromPath = pathname.split('/')[1];
  const currentLang = i18n.locales.find(l => l === langFromPath) ?? i18n.defaultLocale;


  return (
    <Dashboard dictionary={dictionary}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
        <div className="flex flex-col gap-6 xl:gap-8">
          <MarketPulse dictionary={dictionary} />
          <RecentCreations dictionary={dictionary} />
        </div>
        <div className="flex flex-col gap-6 xl:gap-8">
          <ArtisanCircle dictionary={dictionary} />
        </div>
      </div>
    </Dashboard>
  );
}
