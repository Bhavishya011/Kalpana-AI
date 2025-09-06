"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";
import { supportedLanguages } from "@/lib/i18n/i18n-config";
import type { getDictionary } from "@/lib/i18n/dictionaries";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>["dashboard"];

type LanguageSwitcherProps = {
  language: string;
  setLanguage: (lang: string) => void;
  dictionary: Dictionary;
};

export function LanguageSwitcher({
  language,
  setLanguage,
  dictionary,
}: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <Languages className="h-5 w-5 text-muted-foreground" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-[120px] border-0 bg-transparent text-sm shadow-none focus:ring-0">
          <SelectValue placeholder={dictionary.languageSwitcher.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
