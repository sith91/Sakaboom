'use server';

/**
 * @fileOverview This file defines a Genkit flow for identifying the social media platform from a URL.
 *
 * @interface IdentifyPlatformInput - Represents the input schema for the identifyPlatform flow.
 * @interface IdentifyPlatformOutput - Represents the output schema for the identifyPlatform flow.
 * @function identifyPlatform - A server function that takes IdentifyPlatformInput and returns IdentifyPlatformOutput.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const platformIds = ['instagram', 'twitter', 'youtube', 'tiktok', 'facebook', 'linkedin', 'weibo', 'wechat', 'sharechat', 'roposo', 'unknown'] as const;

const IdentifyPlatformInputSchema = z.object({
  url: z.string().url().describe('The URL of the content to be identified.'),
});
export type IdentifyPlatformInput = z.infer<typeof IdentifyPlatformInputSchema>;

const IdentifyPlatformOutputSchema = z.object({
  platform: z.enum(platformIds).describe('The identified social media platform.'),
});
export type IdentifyPlatformOutput = z.infer<typeof IdentifyPlatformOutputSchema>;

export async function identifyPlatform(input: IdentifyPlatformInput): Promise<IdentifyPlatformOutput> {
  return identifyPlatformFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPlatformPrompt',
  input: {schema: IdentifyPlatformInputSchema},
  output: {schema: IdentifyPlatformOutputSchema},
  prompt: `Analyze the following URL and identify which social media platform it belongs to.

The possible platforms are: ${platformIds.join(', ')}.

If the platform is not one of the known platforms, classify it as 'unknown'.

URL: {{{url}}}
`,
});

const identifyPlatformFlow = ai.defineFlow(
  {
    name: 'identifyPlatformFlow',
    inputSchema: IdentifyPlatformInputSchema,
    outputSchema: IdentifyPlatformOutputSchema,
  },
  async input => {
    // For common platforms, we can do a simple check to save on API calls.
    if (input.url.includes('instagram.com')) return { platform: 'instagram' };
    if (input.url.includes('twitter.com') || input.url.includes('x.com')) return { platform: 'twitter' };
    if (input.url.includes('youtube.com') || input.url.includes('youtu.be')) return { platform: 'youtube' };
    if (input.url.includes('tiktok.com')) return { platform: 'tiktok' };
    if (input.url.includes('facebook.com')) return { platform: 'facebook' };
    if (input.url.includes('linkedin.com')) return { platform: 'linkedin' };
    if (input.url.includes('weibo.com')) return { platform: 'weibo' };
    if (input.url.includes('wechat.com')) return { platform: 'wechat' };
    if (input.url.includes('sharechat.com')) return { platform: 'sharechat' };
    if (input.url.includes('roposo.com')) return { platform: 'roposo' };

    // If it's not an obvious one, use the AI.
    const {output} = await prompt(input);
    return output!;
  }
);
