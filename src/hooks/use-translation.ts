/**
 * useTranslation Hook
 * Automatically translates content based on current locale
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { translateText, translateObject } from '@/lib/i18n/translate';

export function useTranslation(locale: string) {
  // Translate a single text string
  const t = useCallback(
    async (text: string): Promise<string> => {
      if (!text || locale === 'en-US') return text;
      return await translateText(text, locale);
    },
    [locale]
  );

  // Translate an object
  const tObject = useCallback(
    async <T extends Record<string, any>>(obj: T): Promise<T> => {
      if (!obj || locale === 'en-US') return obj;
      return await translateObject(obj, locale);
    },
    [locale]
  );

  return { t, tObject, locale };
}

/**
 * useTranslatedText Hook
 * Automatically translates text and returns the translated value
 */
export function useTranslatedText(text: string, locale: string): string {
  const [translated, setTranslated] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!text || locale === 'en-US') {
      setTranslated(text);
      return;
    }

    let cancelled = false;
    setIsTranslating(true);

    translateText(text, locale)
      .then((result) => {
        if (!cancelled) {
          setTranslated(result);
          setIsTranslating(false);
        }
      })
      .catch((error) => {
        console.error('Translation error:', error);
        if (!cancelled) {
          setTranslated(text); // Fallback to original
          setIsTranslating(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [text, locale]);

  return isTranslating ? text : translated;
}

/**
 * useTranslatedObject Hook
 * Automatically translates an entire object and returns the translated version
 */
export function useTranslatedObject<T extends Record<string, any>>(
  obj: T | null,
  locale: string
): { data: T | null; isTranslating: boolean } {
  const [translated, setTranslated] = useState<T | null>(obj);
  const [isTranslating, setIsTranslating] = useState(false);
  const lastObjRef = useRef<string | null>(null);
  const lastLocaleRef = useRef<string | null>(null);

  useEffect(() => {
    // Create a stable reference using JSON
    const objString = obj ? JSON.stringify(obj) : null;
    
    // Check if the content or locale actually changed
    const contentChanged = objString !== lastObjRef.current;
    const localeChanged = locale !== lastLocaleRef.current;
    
    if (!contentChanged && !localeChanged) {
      return; // No change, skip translation
    }
    
    lastObjRef.current = objString;
    lastLocaleRef.current = locale;

    if (!obj || locale === 'en-US') {
      setTranslated(obj);
      setIsTranslating(false);
      return;
    }

    let cancelled = false;
    setIsTranslating(true);

    translateObject(obj, locale)
      .then((result) => {
        if (!cancelled) {
          setTranslated(result);
          setIsTranslating(false);
        }
      })
      .catch((error) => {
        console.error('Object translation error:', error);
        if (!cancelled) {
          setTranslated(obj); // Fallback to original
          setIsTranslating(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [obj, locale]);

  return { data: translated, isTranslating };
}
