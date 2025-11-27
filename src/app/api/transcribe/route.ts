import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://support-chatbot-api-508329185712.us-central1.run.app";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const response = await fetch(`${BACKEND_URL}/transcribe`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Backend responded with ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Transcription Proxy Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to transcribe audio" },
            { status: 500 }
        );
    }
}
