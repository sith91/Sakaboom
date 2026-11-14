'use server';

/**
 * @fileOverview Predicts emerging trends by analyzing content metadata and social signals.
 *
 * - predictEmergingTrends - A function that predicts emerging trends.
 * - PredictEmergingTrendsInput - The input type for the predictEmergingTrends function.
 * - PredictEmergingTrendsOutput - The return type for the predictEmergingTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictEmergingTrendsInputSchema = z.object({
  tags: z.array(z.string()).describe('A list of content tags.'),
  socialSignals: z.record(z.number()).describe('A record of social signals for the content, e.g., likes, shares, comments.'),
  metadata: z.record(z.string()).optional().describe('Additional metadata about the content.'),
});
export type PredictEmergingTrendsInput = z.infer<typeof PredictEmergingTrendsInputSchema>;

const PredictEmergingTrendsOutputSchema = z.object({
  emergingTrends: z.array(z.string()).describe('A list of predicted emerging trends.'),
  reasoning: z.string().describe('The reasoning behind the trend predictions.'),
});
export type PredictEmergingTrendsOutput = z.infer<typeof PredictEmergingTrendsOutputSchema>;

export async function predictEmergingTrends(input: PredictEmergingTrendsInput): Promise<PredictEmergingTrendsOutput> {
  return predictEmergingTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictEmergingTrendsPrompt',
  input: {schema: PredictEmergingTrendsInputSchema},
  output: {schema: PredictEmergingTrendsOutputSchema},
  prompt: `You are an expert in trend analysis, specializing in identifying emerging trends from social media data.

  Analyze the following content metadata and social signals to predict emerging trends. Provide a list of predicted emerging trends and the reasoning behind them.

  Content Tags: {{tags}}
  Social Signals: {{socialSignals}}
  Metadata: {{metadata}}

  Emerging Trends:
  Reasoning: `,
});

const predictEmergingTrendsFlow = ai.defineFlow(
  {
    name: 'predictEmergingTrendsFlow',
    inputSchema: PredictEmergingTrendsInputSchema,
    outputSchema: PredictEmergingTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
