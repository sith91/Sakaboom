'use server';

import { predictEmergingTrends, PredictEmergingTrendsInput, PredictEmergingTrendsOutput } from '@/ai/flows/predict-emerging-trends';
import { suggestRelevantTags, SuggestRelevantTagsInput, SuggestRelevantTagsOutput } from '@/ai/flows/suggest-relevant-tags';
import { identifyPlatform, IdentifyPlatformInput, IdentifyPlatformOutput } from '@/ai/flows/identify-platform-flow';
import { getUrlMetadata, GetUrlMetadataInput, GetUrlMetadataOutput } from '@/ai/flows/get-url-metadata-flow';
import { socialSearch, SocialSearchInput, SocialSearchOutput } from '@/ai/flows/social-search';
import { autonomousDiscovery, AutonomousDiscoveryOutput } from '@/ai/flows/autonomous-discovery';
import { runLocalViralAgent, ViralAgentConfig, ViralAgentRunResult } from '@/ai/flows/viral-agent-flow';

export async function predictEmergingTrendsAction(input: PredictEmergingTrendsInput): Promise<PredictEmergingTrendsOutput> {
  try {
    const result = await predictEmergingTrends(input);
    return result;
  } catch (error: any) {
    console.error('Error in predictEmergingTrendsAction:', error);
    throw new Error(error.message || 'Failed to predict emerging trends.');
  }
}

export async function suggestRelevantTagsAction(input: SuggestRelevantTagsInput): Promise<SuggestRelevantTagsOutput> {
  try {
    const result = await suggestRelevantTags(input);
    return result;
  } catch (error: any) {
    console.error('Error in suggestRelevantTagsAction:', error);
    throw new Error(error.message || 'Failed to suggest relevant tags.');
  }
}

export async function identifyPlatformAction(input: IdentifyPlatformInput): Promise<IdentifyPlatformOutput> {
    try {
        const result = await identifyPlatform(input);
        return result;
    } catch (error: any) {
        console.error('Error in identifyPlatformAction:', error);
        throw new Error(error.message || 'Failed to identify platform.');
    }
}

export async function getUrlMetadataAction(input: GetUrlMetadataInput): Promise<GetUrlMetadataOutput> {
    try {
        const result = await getUrlMetadata(input);
        return result;
    } catch (error: any) {
        console.error('Error in getUrlMetadataAction:', error);
        throw new Error(error.message || 'Failed to get URL metadata.');
    }
}

export async function socialSearchAction(input: SocialSearchInput): Promise<SocialSearchOutput> {
    try {
        const result = await socialSearch(input);
        return result;
    } catch (error: any) {
        console.error('Error in socialSearchAction:', error);
        throw new Error(error.message || 'Failed to perform social search.');
    }
}

export async function autonomousDiscoveryAction(): Promise<AutonomousDiscoveryOutput> {
    try {
        const result = await autonomousDiscovery();
        return result;
    } catch (error: any) {
        console.error('Error in autonomousDiscoveryAction:', error);
        throw new Error(error.message || 'Saka failed to discover content.');
    }
}

export async function runViralAgentAction(config: ViralAgentConfig): Promise<ViralAgentRunResult> {
    try {
        return await runLocalViralAgent(config);
    } catch (error: any) {
        console.error('Error in runViralAgentAction:', error);
        throw new Error(error.message || 'Local Viral Agent failed to scan networks.');
    }
}
