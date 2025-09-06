'use client';

import {ArtisanCircle} from './artisan-circle';
import {DashboardHeader} from './header';
import {DashboardLayout} from './layout';
import {MarketPulse} from './market-pulse';
import {StoryStudio} from './story-studio';
import {TheMuse} from './the-muse';
import type {getDictionary} from '@/lib/i18n/dictionaries';
import {useRouter, usePathname} from 'next/navigation';
import { i18n } from '@/lib/i18n/i18n-config';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['dashboard'];

export function Dashboard({dictionary}: {dictionary: Dictionary}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    const newPath = `/${lang}`;
    router.replace(newPath);
  };
  
  const langFromPath = pathname.split('/')[1];
  const currentLang = i18n.locales.find(l => l === langFromPath) ?? i18n.defaultLocale;


  return (
    <DashboardLayout dictionary={dictionary}>
      <DashboardHeader
        language={currentLang}
        setLanguage={handleLanguageChange}
        dictionary={dictionary}
      />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
          <div className="flex flex-col gap-6 xl:gap-8">
            <MarketPulse dictionary={dictionary} />
            <ArtisanCircle dictionary={dictionary} />
          </div>
          <div className="flex flex-col gap-6 xl:gap-8">
            <StoryStudio language={currentLang} dictionary={dictionary} />
            <TheMuse dictionary={dictionary} />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
