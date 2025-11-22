"use client";

import { useEffect, useState } from 'react';

/**
 * Hook to translate dictionary (static UI text) dynamically
 * NOTE: We're using static JSON dictionaries directly since backend translation
 * endpoint is not yet deployed. All locale files have been completed with translations.
 */
export function useTranslatedDictionary<T extends Record<string, any>>(
  dictionary: T,
  targetLocale: string
): T {
  // Simply return the dictionary as-is
  // The dictionaries are already translated in the JSON files
  return dictionary;
}
