import { NextRequest, NextResponse } from 'next/server';

// Translation service URL (separate from main product API)
const TRANSLATION_SERVICE_URL = process.env.TRANSLATION_API_URL || 
  'https://kalpana-translation-508329185712.us-central1.run.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, object, targetLocale, sourceLocale = 'en-US' } = body;

    // Skip if English or same language
    if (targetLocale === 'en-US' || sourceLocale === targetLocale) {
      return NextResponse.json({
        translation: text || object,
        translations: texts,
        success: true
      });
    }

    // Forward to translation service
    const response = await fetch(`${TRANSLATION_SERVICE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        texts,
        object,
        targetLocale,
        sourceLocale
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Translation service error:', response.status, errorText);
      throw new Error(`Translation service error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { 
        error: 'Translation failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    );
  }
}
