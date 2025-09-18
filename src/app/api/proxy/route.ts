
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  const serviceUrl = 'https://kalpana-ai-api-418149026163.us-central1.run.app';
  
  try {
    const body = await request.json();

    const apiResponse = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        return new NextResponse(errorText, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new NextResponse(JSON.stringify({ error: 'Failed to proxy request', details: errorMessage }), { status: 500 });
  }
}
