import { TheMuse } from "@/components/dashboard/the-muse";
import { Dashboard } from "@/components/dashboard/dashboard";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { i18n } from "@/lib/i18n/i18n-config";

export async function generateStaticParams() {
    return i18n.locales.map(locale => ({ lang: locale }));
}

export default async function TheMusePage({ params: { lang } }: { params: { lang: string } }) {
    const locale = i18n.locales.find(l => l === lang) ?? i18n.defaultLocale;
    const dictionary = await getDictionary(locale);

    return (
        <Dashboard dictionary={dictionary.dashboard}>
            <TheMuse dictionary={dictionary.dashboard} />
        </Dashboard>
    );
}
