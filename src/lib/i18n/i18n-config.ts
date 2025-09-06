export const i18n = {
    defaultLocale: 'en-US',
    locales: ['en-US', 'hi-IN', 'bn-IN', 'ta-IN', 'te-IN', 'mr-IN', 'gu-IN', 'kn-IN']
} as const;
  
export type Locale = (typeof i18n)['locales'][number];
  
export const supportedLanguages = [
    { value: "en-US", label: "English" },
    { value: "hi-IN", label: "हिन्दी" },
    { value: "bn-IN", label: "বাংলা" },
    { value: "ta-IN", label: "தமிழ்" },
    { value: "te-IN", label: "తెలుగు" },
    { value: "mr-IN", label: "मराठी" },
    { value: "gu-IN", label: "ગુજરાતી" },
    { value: "kn-IN", label: "ಕನ್ನಡ" },
];
  
  
export const languageLabels: {[key: string]: string} = {
    "en-US": "English",
    "hi-IN": "Hindi",
    "bn-IN": "Bengali",
    "ta-IN": "Tamil",
    "te-IN": "Telugu",
    "mr-IN": "Marathi",
    "gu-IN": "Gujarati",
    "kn-IN": "Kannada"
};