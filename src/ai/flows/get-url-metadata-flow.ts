'use server';
/**
 * @fileOverview Fetches a URL and extracts its metadata (title, description, image).
 *
 * - getUrlMetadata - A function that fetches and parses URL metadata.
 * - GetUrlMetadataInput - The input type for the getUrlMetadata function.
 * - GetUrlMetadataOutput - The return type for the getUrlMetadata function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as cheerio from 'cheerio';

const GetUrlMetadataInputSchema = z.object({
  url: z.string().url().describe('The URL to fetch metadata from.'),
});
export type GetUrlMetadataInput = z.infer<typeof GetUrlMetadataInputSchema>;

const GetUrlMetadataOutputSchema = z.object({
  title: z.string().optional().describe('The title of the page.'),
  description: z.string().optional().describe('The description of the page.'),
  image: z.string().url().optional().describe('The preview image URL of the page.'),
});
export type GetUrlMetadataOutput = z.infer<typeof GetUrlMetadataOutputSchema>;

export async function getUrlMetadata(input: GetUrlMetadataInput): Promise<GetUrlMetadataOutput> {
  return getUrlMetadataFlow(input);
}

const getUrlMetadataFlow = ai.defineFlow(
  {
    name: 'getUrlMetadataFlow',
    inputSchema: GetUrlMetadataInputSchema,
    outputSchema: GetUrlMetadataOutputSchema,
  },
  async ({ url }) => {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const getMetaTag = (name: string) => {
        return $(`meta[name="${name}"]`).attr('content') || $(`meta[property="og:${name}"]`).attr('content');
      };

      const title = getMetaTag('title') || $('title').text();
      const description = getMetaTag('description');
      const image = getMetaTag('image');

      const resolveUrl = (path?: string) => {
        if (!path) return undefined;
        try {
          return new URL(path, url).toString();
        } catch {
          return undefined;
        }
      }

      return {
        title: title || undefined,
        description: description || undefined,
        image: resolveUrl(image),
      };

    } catch (error: any) {
      console.error(`Error fetching metadata for ${url}:`, error);
      // Re-throw a simpler error to avoid leaking implementation details to the client
      throw new Error(`Could not retrieve metadata from the provided URL.`);
    }
  }
);
