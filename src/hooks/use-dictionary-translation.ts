"use client";

import { useEffect, useState } from 'react';

/**
 * Hook to translate dictionary (static UI text) dynamically
 * This ensures all UI labels, buttons, etc. are translated when language changes
 */
export function useTranslatedDictionary<T extends Record<string, any>>(
  dictionary: T,
  targetLocale: string
): T {
  const [translatedDict, setTranslatedDict] = useState<T>(dictionary);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Skip if English or same language
    if (targetLocale === 'en-US') {
      setTranslatedDict(dictionary);
      return;
    }

    let isMounted = true;

    async function translateDictionary() {
      try {
        setIsTranslating(true);

        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            object: dictionary,
            targetLocale,
            sourceLocale: 'en-US',
          }),
        });

        if (!response.ok) {
          throw new Error('Translation failed');
        }

        const data = await response.json();
        
        if (isMounted && data.translation) {
          setTranslatedDict(data.translation);
        }
      } catch (error) {
        console.error('Dictionary translation error:', error);
        // Fallback to original dictionary
        if (isMounted) {
          setTranslatedDict(dictionary);
        }
      } finally {
        if (isMounted) {
          setIsTranslating(false);
        }
      }
    }

    translateDictionary();

    return () => {
      isMounted = false;
    };
  }, [dictionary, targetLocale]);

  return translatedDict;
}
