'use server';
/**
 * @fileOverview Generates AI design variations for a given craft photo.
 *
 * - generateAIDesignVariations - A function that handles the generation of AI design variations.
 * - GenerateAIDesignVariationsInput - The input type for the generateAIDesignVariations function.
 * - GenerateAIDesignVariationsOutput - The return type for the generateAIDesignVariations function.
 */

import {ai} from '@/ai/genkit';
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
    z.string().describe('A data URI of an AI-generated design variation image.')
  ).describe('Array of AI-generated design variations.')
});
export type GenerateAIDesignVariationsOutput = z.infer<typeof GenerateAIDesignVariationsOutputSchema>;

export async function generateAIDesignVariations(
  input: GenerateAIDesignVariationsInput
): Promise<GenerateAIDesignVariationsOutput> {
  return generateAIDesignVariationsFlow(input);
}

const generateAIDesignVariationsFlow = ai.defineFlow(
  {
    name: 'generateAIDesignVariationsFlow',
    inputSchema: GenerateAIDesignVariationsInputSchema,
    outputSchema: GenerateAIDesignVariationsOutputSchema,
  },
  async input => {
    const designVariations = [];

    for (let i = 0; i < 3; i++) {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
          { media: { url: input.photoDataUri } },
          { text: `generate a variation of this design` },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
      if (media?.url) {
        designVariations.push(media.url);
      }
    }

    return { designVariations };
  }
);
