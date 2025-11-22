import { NextRequest, NextResponse } from 'next/server';

// Translation service URL - standalone microservice
const TRANSLATION_SERVICE_URL = process.env.TRANSLATION_SERVICE_URL ||
  'https://kalpana-translation-sali7hblyq-uc.a.run.app';

interface TranslationRequest {
  text?: string;
  texts?: string[];
  object?: any;
  targetLocale: string;
  sourceLocale?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslationRequest = await request.json();
    const { text, texts, object, targetLocale, sourceLocale = 'en-US' } = body;

    // Skip if English or same language
    if (targetLocale === 'en-US' || sourceLocale === targetLocale) {
      return NextResponse.json({
        translation: text || object,
        translations: texts,
        success: true,
        source_language: sourceLocale,
        target_language: targetLocale,
      });
    }

    console.log(`🌐 Translation: ${sourceLocale} → ${targetLocale}`);

    // Call translation service
    const apiUrl = `${TRANSLATION_SERVICE_URL}/translate`;
    console.log(`📡 Calling: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        texts,
        object,
        targetLocale,
        sourceLocale,
      }),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`❌ Translation service error: ${response.status}`, errorText);
      throw new Error(`Translation service returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Translation failed');
    }

    console.log('✅ Translation completed');

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('❌ Translation error:', error.message);

    // Graceful degradation - return original content
    const body: TranslationRequest = await request.json().catch(() => ({
      targetLocale: 'en-US',
      sourceLocale: 'en-US',
    }));

    return NextResponse.json({
      success: false,
      error: error.message || 'Translation service unavailable',
      translation: body.text || body.object,
      translations: body.texts,
      source_language: body.sourceLocale || 'en-US',
      target_language: body.targetLocale || 'en-US',
    });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'translation-proxy',
    backend: TRANSLATION_SERVICE_URL,
    timestamp: new Date().toISOString(),
  });
}
