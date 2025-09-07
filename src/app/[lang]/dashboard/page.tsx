import {Dashboard} from '@/components/dashboard/dashboard';
import {getDictionary} from '@/lib/i18n/dictionaries';
import {i18n} from '@/lib/i18n/i18n-config';
import { MarketPulse } from '@/components/dashboard/market-pulse';
import { RecentCreations } from '@/components/dashboard/recent-creations';
import { ArtisanCircle } from '@/components/dashboard/artisan-circle';

export async function generateStaticParams() {
    return i18n.locales.map(locale => ({ lang: locale }));
}

export default async function DashboardPage({ params: { lang } }: { params: { lang: string } }) {
    const locale = i18n.locales.find(l => l === lang) ?? i18n.defaultLocale;
    const dictionary = await getDictionary(locale);

    return (
        <Dashboard dictionary={dictionary.dashboard}>
            <div className="grid grid-cols-1 gap-8">
                <MarketPulse dictionary={dictionary.dashboard}/>
                <RecentCreations dictionary={dictionary.dashboard}/>
                <ArtisanCircle dictionary={dictionary.dashboard}/>
            </div>
        </Dashboard>
    );
}
