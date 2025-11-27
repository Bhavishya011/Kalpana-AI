import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const imagePath = path.join('/');
    
    // Construct the URL to the Cloud Run backend
    const backendUrl = `https://kalpana-ai-api-sali7hblyq-uc.a.run.app/generated/${imagePath}`;
    // For local development:
    // const backendUrl = `http://localhost:8000/generated/${imagePath}`;
    
    console.log(`🖼️  Proxying image request: ${request.url} -> ${backendUrl}`);
    
    // Fetch the image from the Python backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      console.error(`❌ Failed to fetch image from backend: ${response.status} ${response.statusText}`);
      return new NextResponse('Image not found', { status: 404 });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    
    // Get content type from backend response or infer from file extension
    const contentType = response.headers.get('content-type') || getContentTypeFromPath(imagePath);
    
    console.log(`✅ Successfully proxied image: ${imagePath} (${contentType})`);
    
    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (error) {
    console.error('❌ Error proxying image request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

function getContentTypeFromPath(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    case 'bmp':
      return 'image/bmp';
    default:
      return 'image/jpeg'; // Default fallback
  }
}