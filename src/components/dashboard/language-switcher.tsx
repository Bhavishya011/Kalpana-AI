"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

const supportedLanguages = [
  { value: "en-US", label: "English" },
  { value: "hi-IN", label: "हिन्दी" },
  { value: "bn-IN", label: "বাংলা" },
  { value: "ta-IN", label: "தமிழ்" },
  { value: "te-IN", label: "తెలుగు" },
  { value: "mr-IN", label: "मराठी" },
  { value: "gu-IN", label: "ગુજરાતી" },
  { value: "kn-IN", label: "ಕನ್ನಡ" },
];

type LanguageSwitcherProps = {
  language: string;
  setLanguage: (lang: string) => void;
};

export function LanguageSwitcher({
  language,
  setLanguage,
}: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <Languages className="h-5 w-5 text-muted-foreground" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-[120px] border-0 bg-transparent text-sm shadow-none focus:ring-0">
          <SelectValue placeholder="Language" />
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
