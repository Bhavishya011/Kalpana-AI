'use server';

/**
 * @fileOverview Generates an emotional product story and AI-enhanced images based on an artisan's product photo and description.
 *
 * - generateEmotionalProductStory - A function that handles the story generation process.
 * - GenerateEmotionalProductStoryInput - The input type for the generateEmotionalProductStory function.
 * - GenerateEmotionalProductStoryOutput - The return type for the generateEmotionalProductStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmotionalProductStoryInputSchema = z.object({
  productPhotoDataUri: z
    .string()
    .describe(
      "A photo of the artisan's product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  artisanBackground: z.string().describe('A short description of the artisan and their background.'),
  language: z.string().describe('The language in which to generate the story.'),
});

export type GenerateEmotionalProductStoryInput = z.infer<typeof GenerateEmotionalProductStoryInputSchema>;

const GenerateEmotionalProductStoryOutputSchema = z.object({
  emotionalStory: z.string().describe('The generated emotional story for the product.'),
  aiEnhancedImage: z
    .string()
    .describe(
      'An AI-enhanced image of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // escaping the single quote
    ),
});

export type GenerateEmotionalProductStoryOutput = z.infer<typeof GenerateEmotionalProductStoryOutputSchema>;

export async function generateEmotionalProductStory(
  input: GenerateEmotionalProductStoryInput
): Promise<GenerateEmotionalProductStoryOutput> {
  return generateEmotionalProductStoryFlow(input);
}

const generateEmotionalProductStoryPrompt = ai.definePrompt({
  name: 'generateEmotionalProductStoryPrompt',
  input: {schema: GenerateEmotionalProductStoryInputSchema},
  output: {schema: GenerateEmotionalProductStoryOutputSchema},
  prompt: `You are a skilled storyteller helping artisans connect with customers on a deeper level.

  Based on the artisan's background and a photo of their product, craft an emotional story that highlights the product's unique qualities and the artisan's passion.
  Also generate an AI enhanced version of the product photo to make it more appealing for online marketplaces.

  Artisan Background: {{{artisanBackground}}}
  Product Photo: {{media url=productPhotoDataUri}}
  Language: {{{language}}}

  Instructions:
  1.  Write an emotional story (between 150 and 200 words) in the specified language.
  2.  Generate an AI-enhanced image of the product to make it more visually appealing for online marketplaces.
  `, // escaping the single quote
});

const generateEmotionalProductStoryFlow = ai.defineFlow(
  {
    name: 'generateEmotionalProductStoryFlow',
    inputSchema: GenerateEmotionalProductStoryInputSchema,
    outputSchema: GenerateEmotionalProductStoryOutputSchema,
  },
  async input => {
    const {output} = await generateEmotionalProductStoryPrompt(input);
    return output!;
  }
);
