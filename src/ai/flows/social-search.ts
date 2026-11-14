'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {initialPosts, mockCollections} from '@/lib/data';

/**
 * @fileOverview Social Search Flow
 * 
 * Takes a user search query and uses Gemini to find the most relevant 
 * human-curated content (posts and collections) from our index.
 */

const SocialSearchInputSchema = z.object({
  query: z.string(),
});
export type SocialSearchInput = z.infer<typeof SocialSearchInputSchema>;

const SocialSearchOutputSchema = z.object({
  bestMatchPostIds: z.array(z.number()),
  bestMatchCollectionIds: z.array(z.string()),
  aiSummary: z.string(),
  explanation: z.string(),
});
export type SocialSearchOutput = z.infer<typeof SocialSearchOutputSchema>;

export async function socialSearch(input: SocialSearchInput): Promise<SocialSearchOutput> {
  return socialSearchFlow(input);
}

const socialSearchFlow = ai.defineFlow(
  {
    name: 'socialSearchFlow',
    inputSchema: SocialSearchInputSchema,
    outputSchema: SocialSearchOutputSchema,
  },
  async (input) => {
    // 1. Prepare data for ranking Mock
    // Simulating the delay for the local mock so the UI animation is visible
    await new Promise(resolve => setTimeout(resolve, 2500));

    const lowerQuery = input.query.toLowerCase().trim();

    // Whole-word regex: matches only when the query appears as a standalone word/token.
    // This prevents "ai" from matching inside "Mia", "Dubai", "Thailand", etc.
    const wordBoundaryRegex = new RegExp(`\\b${lowerQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

    // Find matching posts with a simulated relevance score
    const scoredPosts = initialPosts.map(post => {
      let score = 0;
      if (wordBoundaryRegex.test(post.text)) score += 3;
      if (post.caption && wordBoundaryRegex.test(post.caption)) score += 2;
      // Tag exact match (case-insensitive) — tags are discrete tokens so use equality or full-word test
      if (post.tags.some(tag => tag.toLowerCase() === lowerQuery || wordBoundaryRegex.test(tag))) score += 5;
      return { id: post.id, score, post };
    }).filter(p => p.score > 0).sort((a, b) => b.score - a.score);

    const matchedPostIds = scoredPosts.map(p => p.id);

    // Find matching collections
    const matchedCollections = mockCollections.filter(c =>
      wordBoundaryRegex.test(c.name) ||
      wordBoundaryRegex.test(c.description) ||
      c.tags.some(tag => tag.toLowerCase() === lowerQuery || wordBoundaryRegex.test(tag))
    ).map(c => c.id);

    // AI Summary Generation Logic
    let aiSummary = "";
    let explanation = "";

    if (matchedPostIds.length > 0) {
      const topMatch = scoredPosts[0].post;
      const totalBooms = scoredPosts.reduce((acc, p) => acc + p.post.booms, 0);
      
      aiSummary = `Sakaboom has synthesized the index and identified ${matchedPostIds.length} expert-curated results for "${input.query}". The top signal is focused on "${topMatch.text}".`;
      explanation = `These indices have collectively generated ${totalBooms.toLocaleString()} Booms from the community. Sakaboom AI identified these as the most authoritative sources because they combine high curator trust with strong social validation in the "${input.query}" category.`;
    } else {
      aiSummary = `Sakaboom analyzed the social layer but found no human-curated indices matching "${input.query}" yet.`;
      explanation = `Sakaboom relies on human curators to "Index" content first. If you have a valuable link related to "${input.query}", use the "Curate" button to add it to the global social search engine.`;
    }

    // 2. Return matched data
    return {
      bestMatchPostIds: matchedPostIds,
      bestMatchCollectionIds: matchedCollections,
      aiSummary,
      explanation,
    };
  }
);
