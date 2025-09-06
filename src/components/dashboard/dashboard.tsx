
"use client";
import {useRouter, usePathname} from 'next/navigation';
import { i18n } from '@/lib/i18n/i18n-config';
import type {getDictionary} from '@/lib/i18n/dictionaries';
import { DashboardHeader } from './header';
import { DashboardLayout } from './layout';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['dashboard'];

export function Dashboard({
  dictionary,
  children
}: {
  dictionary: Dictionary,
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    const currentPath = pathname;
    const langSegment = currentPath.split('/')[1];
    const newPath = currentPath.replace(`/${langSegment}`, `/${lang}`);
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
        {children}
      </main>
    </DashboardLayout>
  );
}
