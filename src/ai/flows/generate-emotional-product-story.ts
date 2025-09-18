
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
  artisanBackground: z.string().describe('A short description of the artisan and their background, or the story of the product.'),
  language: z.string().describe('The language in which to generate the story.'),
});

export type GenerateEmotionalProductStoryInput = z.infer<typeof GenerateEmotionalProductStoryInputSchema>;

const ProductPostSchema = z.object({
  image: z.string().describe('The data URI of an AI-enhanced image of the product.'),
  description: z.string().describe('A short, compelling product description.'),
});

const StoryPostSchema = z.object({
    image: z.string().describe('The data URI of an AI-enhanced image related to the story.'),
    story: z.string().describe('A captivating story about the product or artisan.'),
    caption: z.string().describe('A short, engaging caption for the story post.'),
});


const GenerateEmotionalProductStoryOutputSchema = z.object({
  productPosts: z.array(ProductPostSchema).describe('A list of generated product posts with images and descriptions.'),
  storyPosts: z.array(StoryPostSchema).describe('A list of generated story posts with images, stories, and captions.'),
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
  prompt: `You are a skilled marketing assistant for artisans. Based on the provided product photo and background story, generate a variety of marketing assets in the specified language.

  Artisan Background/Story: {{{artisanBackground}}}
  Product Photo: {{media url=productPhotoDataUri}}
  Language: {{{language}}}

  Instructions:
  1.  Generate 2 unique "Product Posts". Each post needs:
      - An AI-enhanced image of the product, making it look professional for an e-commerce listing.
      - A compelling product description (around 50-75 words).
  2.  Generate 3 unique "Story Posts". Each post needs:
      - An AI-enhanced image that is artistic and evokes the feeling of the story. It can be a variation of the product or a more abstract, related concept.
      - A captivating story (around 100-150 words) based on the artisan's background.
      - A short, engaging caption suitable for social media.
  `,
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

  