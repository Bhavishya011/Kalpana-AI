'use server';
/**
 * @fileOverview Generates AI design variations for a given craft photo using Muse Agent API.
 *
 * - generateAIDesignVariations - A function that handles the generation of AI design variations.
 * - GenerateAIDesignVariationsInput - The input type for the generateAIDesignVariations function.
 * - GenerateAIDesignVariationsOutput - The return type for the generateAIDesignVariations function.
 */

import {z} from 'genkit';

const GenerateAIDesignVariationsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the craft, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateAIDesignVariationsInput = z.infer<typeof GenerateAIDesignVariationsInputSchema>;

const GenerateAIDesignVariationsOutputSchema = z.object({
  designVariations: z.array(
    z.string().describe('A URL of an AI-generated design variation image.')
  ).describe('Array of AI-generated design variations (2 traditional + 2 modern).')
});
export type GenerateAIDesignVariationsOutput = z.infer<typeof GenerateAIDesignVariationsOutputSchema>;

const MUSE_AGENT_API = 'https://muse-agent-api-508329185712.us-central1.run.app';

export async function generateAIDesignVariations(
  input: GenerateAIDesignVariationsInput
): Promise<GenerateAIDesignVariationsOutput> {
  try {
    // Convert data URI to Blob
    const response = await fetch(input.photoDataUri);
    const blob = await response.blob();
    
    // Create FormData and append the file with the correct field name 'image'
    const formData = new FormData();
    formData.append('image', blob, 'craft-image.jpg');
    
    // Call Muse Agent API
    const apiResponse = await fetch(`${MUSE_AGENT_API}/generate`, {
      method: 'POST',
      body: formData,
    });
    
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Muse Agent API error response:', errorText);
      throw new Error(`Muse Agent API error: ${apiResponse.status} - ${errorText}`);
    }
    
    const result = await apiResponse.json();
    
    if (result.status !== 'success') {
      throw new Error(result.message || 'Failed to generate design variations');
    }
    
    // Extract all image URLs from the response
    const designVariations: string[] = [];
    
    // Add traditional variations
    if (result.data?.traditional_images) {
      result.data.traditional_images.forEach((img: { url: string } | string) => {
        const url = typeof img === 'string' ? img : img.url;
        if (url) designVariations.push(url);
      });
    }
    
    // Add modern variations
    if (result.data?.modern_images) {
      result.data.modern_images.forEach((img: { url: string } | string) => {
        const url = typeof img === 'string' ? img : img.url;
        if (url) designVariations.push(url);
      });
    }
    
    // Validate we got 4 images
    if (designVariations.length < 4) {
      console.warn(`Expected 4 images, got ${designVariations.length}`);
    }
    
    return { designVariations };
  } catch (error) {
    console.error('Error calling Muse Agent API:', error);
    throw new Error(`Failed to generate design variations: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
