'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant tags based on content metadata.
 *
 * The flow uses the ai.generate function to call an LLM to generate tag suggestions.
 *
 * @interface SuggestRelevantTagsInput - Represents the input schema for the suggestRelevantTags flow.
 * @interface SuggestRelevantTagsOutput - Represents the output schema for the suggestRelevantTags flow.
 * @function suggestRelevantTags - A server function that takes SuggestRelevantTagsInput and returns SuggestRelevantTagsOutput.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantTagsInputSchema = z.object({
  platform: z.string().describe('The platform the content is from (e.g., Instagram, Twitter).'),
  text: z.string().describe('The text or caption associated with the content.'),
});
export type SuggestRelevantTagsInput = z.infer<typeof SuggestRelevantTagsInputSchema>;

const SuggestRelevantTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of relevant tags suggested by the AI.'),
});
export type SuggestRelevantTagsOutput = z.infer<typeof SuggestRelevantTagsOutputSchema>;

export async function suggestRelevantTags(input: SuggestRelevantTagsInput): Promise<SuggestRelevantTagsOutput> {
  return suggestRelevantTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantTagsPrompt',
  input: {schema: SuggestRelevantTagsInputSchema},
  output: {schema: SuggestRelevantTagsOutputSchema},
  prompt: `Suggest relevant tags for the following content, given the platform and text.\n\nPlatform: {{{platform}}}\nText: {{{text}}}\n\nTags:`,
});

const suggestRelevantTagsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantTagsFlow',
    inputSchema: SuggestRelevantTagsInputSchema,
    outputSchema: SuggestRelevantTagsOutputSchema,
  },
  async input => {
    // Simulate AI inference securely offline
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate some contextual mock tags based on the input text
    const textLower = input.text.toLowerCase();
    const suggestedTags = [];
    if (textLower.includes('ai') || textLower.includes('model')) suggestedTags.push('ArtificialIntelligence');
    if (textLower.includes('tech') || textLower.includes('app')) suggestedTags.push('TechNews');
    if (textLower.includes('breakthrough') || textLower.includes('new')) suggestedTags.push('Innovation');
    
    // Always provide a fallback
    if (suggestedTags.length === 0) suggestedTags.push('LocalDiscovery', 'Trending');

    return { tags: suggestedTags };
  }
);
