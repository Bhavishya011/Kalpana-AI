/**
 * Dynamic Translation Service using Backend API
 * This service translates any text content dynamically
 */

// Locale to language name mapping for better translation context
const localeToLanguageName: Record<string, string> = {
  'en-US': 'English',
  'hi-IN': 'Hindi',
  'bn-IN': 'Bengali',
  'ta-IN': 'Tamil',
  'te-IN': 'Telugu',
  'mr-IN': 'Marathi',
  'gu-IN': 'Gujarati',
  'kn-IN': 'Kannada',
};

/**
 * Client-side translation using backend API
 */
export async function translateText(
  text: string,
  targetLocale: string,
  sourceLocale: string = 'en-US'
): Promise<string> {
  // Skip if source and target are the same
  if (sourceLocale === targetLocale || targetLocale === 'en-US') {
    return text;
  }

  // Skip if text is empty
  if (!text || text.trim() === '') {
    return text;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLocale,
        sourceLocale,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Translation API error:', response.status, errorData);
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translation || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

/**
 * Translate an array of text strings
 */
export async function translateTexts(
  texts: string[],
  targetLocale: string,
  sourceLocale: string = 'en-US'
): Promise<string[]> {
  // Skip if source and target are the same
  if (sourceLocale === targetLocale || targetLocale === 'en-US') {
    return texts;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts,
        targetLocale,
        sourceLocale,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Batch translation API error:', response.status, errorData);
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translations || texts;
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
}

/**
 * Translate an object deeply (recursively translates all string values)
 * Uses batch translation for efficiency
 */
export async function translateObject<T extends Record<string, any>>(
  obj: T,
  targetLocale: string,
  sourceLocale: string = 'en-US'
): Promise<T> {
  // Skip if source and target are the same
  if (sourceLocale === targetLocale || targetLocale === 'en-US') {
    return obj;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        object: obj,
        targetLocale,
        sourceLocale,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Object translation API error:', response.status, errorData);
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translation || obj;
  } catch (error) {
    console.error('Object translation error:', error);
    return obj;
  }
}

/**
 * Get language name from locale
 */
export function getLanguageName(locale: string): string {
  return localeToLanguageName[locale] || locale;
}
