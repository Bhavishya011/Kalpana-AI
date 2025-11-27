
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  // Production Cloud Run URL:
  const serviceUrl = 'https://kalpana-ai-api-508329185712.us-central1.run.app/api/storytelling/generate';
  // Use local development server (comment out for production):
  // const serviceUrl = 'http://localhost:8000/api/storytelling/generate';
  
  console.log('🚀 Proxy: Forwarding request to:', serviceUrl);
  
  try {
    const formData = await request.formData();
    
    // Log form data keys (not values for privacy)
    const keys = Array.from(formData.keys());
    console.log('📋 Form data keys:', keys);

    console.log('📡 Sending request to Cloud Run...');
    const apiResponse = await fetch(serviceUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(300000), // 5 minute timeout
    });

    console.log('📥 Response status:', apiResponse.status, apiResponse.statusText);

    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('❌ API Error:', errorText);
        return new NextResponse(errorText, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    console.log('✅ Response received, keys:', Object.keys(data));
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Proxy error:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new NextResponse(JSON.stringify({ error: 'Failed to proxy request', details: errorMessage }), { status: 500 });
  }
}

    