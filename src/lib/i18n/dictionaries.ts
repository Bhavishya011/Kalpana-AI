import 'server-only';
import type {Locale} from './i18n-config';

const dictionaries = {
  'en-US': () => import('./locales/en-US.json').then(module => module.default),
  'hi-IN': () => import('./locales/hi-IN.json').then(module => module.default),
  'bn-IN': () => import('./locales/bn-IN.json').then(module => module.default),
  'ta-IN': () => import('./locales/ta-IN.json').then(module => module.default),
  'te-IN': () => import('./locales/te-IN.json').then(module => module.default),
  'mr-IN': () => import('./locales/mr-IN.json').then(module => module.default),
  'gu-IN': () => import('./locales/gu-IN.json').then(module => module.default),
  'kn-IN': () => import('./locales/kn-IN.json').then(module => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const load = dictionaries[locale] || dictionaries['en-US'];
  return load();
};
