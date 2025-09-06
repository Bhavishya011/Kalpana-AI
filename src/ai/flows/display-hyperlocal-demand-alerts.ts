'use server';

/**
 * @fileOverview A hyperlocal demand alert AI agent.
 *
 * - displayHyperlocalDemandAlerts - A function that handles the demand alert process.
 * - DisplayHyperlocalDemandAlertsInput - The input type for the displayHyperlocalDemandAlerts function.
 * - DisplayHyperlocalDemandAlertsOutput - The return type for the displayHyperlocalDemandAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisplayHyperlocalDemandAlertsInputSchema = z.object({
  location: z.string().describe('The location of the artisan.'),
  craftType: z.string().describe('The type of craft the artisan produces.'),
});
export type DisplayHyperlocalDemandAlertsInput = z.infer<typeof DisplayHyperlocalDemandAlertsInputSchema>;

const DisplayHyperlocalDemandAlertsOutputSchema = z.object({
  alert: z.string().describe('The hyperlocal demand alert message.'),
  demandMultiplier: z.number().describe('The demand multiplier for the craft in the area.'),
});
export type DisplayHyperlocalDemandAlertsOutput = z.infer<typeof DisplayHyperlocalDemandAlertsOutputSchema>;

export async function displayHyperlocalDemandAlerts(
  input: DisplayHyperlocalDemandAlertsInput
): Promise<DisplayHyperlocalDemandAlertsOutput> {
  return displayHyperlocalDemandAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'displayHyperlocalDemandAlertsPrompt',
  input: {schema: DisplayHyperlocalDemandAlertsInputSchema},
  output: {schema: DisplayHyperlocalDemandAlertsOutputSchema},
  prompt: `You are an AI assistant that provides hyperlocal demand alerts for artisans.

  Based on the artisan's location ({{{location}}}) and craft type ({{{craftType}}}), you will generate a demand alert message and a demand multiplier.
  The demand multiplier should be a number indicating how much higher the demand is compared to the average.
  The demand alert message should be short and attention-grabbing, highlighting the increased demand.
  `,
});

const displayHyperlocalDemandAlertsFlow = ai.defineFlow(
  {
    name: 'displayHyperlocalDemandAlertsFlow',
    inputSchema: DisplayHyperlocalDemandAlertsInputSchema,
    outputSchema: DisplayHyperlocalDemandAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
