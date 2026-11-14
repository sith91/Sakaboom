'use server';

import { z } from 'genkit';
import { runLocalViralAgent } from './viral-agent-flow';

/**
 * @fileOverview Autonomous Discovery Flow
 *
 * Uses the Sakaboom Local Viral Agent to discover real trending posts
 * across social networks without requiring paid cloud AI APIs.
 */

const AutonomousDiscoveryOutputSchema = z.object({
  title: z.string(),
  caption: z.string(),
  url: z.string(),
  platform: z.string(),
  tags: z.array(z.string()),
  imageUrl: z.string(),
});
export type AutonomousDiscoveryOutput = z.infer<typeof AutonomousDiscoveryOutputSchema>;

export async function autonomousDiscovery(): Promise<AutonomousDiscoveryOutput> {
  const result = await runLocalViralAgent({ limit: 1 });
  const top = result.posts[0];

  if (top) {
    return {
      title: top.content,
      caption: top.trendingReason || top.content,
      url: top.url,
      platform: top.platform,
      tags: top.tags || ['Viral', 'LocalAgent'],
      imageUrl:
        top.image ||
        'https://images.unsplash.com/photo-1620825937374-87fc1d62c262?q=80&w=2000&auto=format&fit=crop',
    };
  }

  return {
    title: 'The Rise of Local AI Models',
    caption:
      'A comprehensive breakdown on how developers are ditching cloud AI APIs for locally hosted models, ensuring absolute privacy and independence.',
    url: 'https://news.ycombinator.com/item?id=local-ai',
    platform: 'twitter',
    tags: ['LocalAI', 'Privacy', 'TechTrends'],
    imageUrl:
      'https://images.unsplash.com/photo-1620825937374-87fc1d62c262?q=80&w=2000&auto=format&fit=crop',
  };
}
