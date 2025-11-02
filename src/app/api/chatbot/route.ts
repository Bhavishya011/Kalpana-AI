import { NextRequest, NextResponse } from 'next/server';

const CHATBOT_API_URL = 'https://kalpana-support-chatbot-508329185712.us-central1.run.app';

export async function POST(request: NextRequest) {
  console.log('🤖 Chatbot Proxy: Forwarding chat request');
  
  try {
    const body = await request.json();
    console.log('📋 Chat request body keys:', Object.keys(body));

    const endpoint = body.endpoint || 'chat';
    const apiUrl = `${CHATBOT_API_URL}/${endpoint}`;
    
    console.log(`📡 Sending to: ${apiUrl}`);
    
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body.data || body),
    });

    console.log('📥 Chatbot response status:', apiResponse.status);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('❌ Chatbot API Error:', errorText);
      return new NextResponse(errorText, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    console.log('✅ Chatbot response received');
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Chatbot proxy error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(
      JSON.stringify({ error: 'Chatbot request failed', details: errorMessage }), 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Handle quick-help and other GET requests
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const endpoint = searchParams.get('endpoint') || 'quick-help';
  
  try {
    const apiUrl = `${CHATBOT_API_URL}/${endpoint}${category ? `?category=${category}` : ''}`;
    console.log(`📡 GET request to: ${apiUrl}`);
    
    const apiResponse = await fetch(apiUrl, {
      method: 'POST', // quick-help uses POST
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('❌ Chatbot API Error:', errorText);
      return new NextResponse(errorText, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Chatbot proxy error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(
      JSON.stringify({ error: 'Chatbot request failed', details: errorMessage }), 
      { status: 500 }
    );
  }
}
