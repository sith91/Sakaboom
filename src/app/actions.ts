'use server';

import { predictEmergingTrends, PredictEmergingTrendsInput, PredictEmergingTrendsOutput } from '@/ai/flows/predict-emerging-trends';
import { suggestRelevantTags, SuggestRelevantTagsInput, SuggestRelevantTagsOutput } from '@/ai/flows/suggest-relevant-tags';

export async function predictEmergingTrendsAction(input: PredictEmergingTrendsInput): Promise<PredictEmergingTrendsOutput> {
  try {
    const result = await predictEmergingTrends(input);
    return result;
  } catch (error) {
    console.error('Error in predictEmergingTrendsAction:', error);
    throw new Error('Failed to predict emerging trends.');
  }
}

export async function suggestRelevantTagsAction(input: SuggestRelevantTagsInput): Promise<SuggestRelevantTagsOutput> {
  try {
    const result = await suggestRelevantTags(input);
    return result;
  } catch (error) {
    console.error('Error in suggestRelevantTagsAction:', error);
    throw new Error('Failed to suggest relevant tags.');
  }
}
