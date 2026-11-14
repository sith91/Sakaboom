'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { predictEmergingTrendsAction } from '@/app/actions';
import { Post } from '@/lib/types';
import { Wand2, Loader2, Lightbulb, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AITrendPredictorProps {
  posts: Post[];
}

export default function AITrendPredictor({ posts }: AITrendPredictorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ emergingTrends: string[]; reasoning: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePredict = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const socialSignals: Record<string, number> = {};
      const allTags = new Set<string>();

      posts.forEach(post => {
        socialSignals[`booms_${post.id}`] = post.booms;
        socialSignals[`comments_${post.id}`] = post.comments;
        socialSignals[`shares_${post.id}`] = post.shares;
        post.tags.forEach(tag => allTags.add(tag));
      });

      if (allTags.size === 0) {
        throw new Error("No tags found in the current posts to analyze.");
      }

      const prediction = await predictEmergingTrendsAction({
        tags: Array.from(allTags),
        socialSignals,
      });

      setResult(prediction);
      toast({
        title: '🔮 Trends Predicted!',
        description: 'AI analysis complete. Check the sidebar for results.',
      });

    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      toast({
        variant: 'destructive',
        title: 'Error Predicting Trends',
        description: e.message || 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          <Wand2 className="w-5 h-5 mr-2 text-primary" />
          AI Trend Predictor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Analyze the current set of posts to identify emerging trends.
        </p>
        <Button onClick={handlePredict} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Analyzing...' : 'Predict Trends'}
        </Button>

        {result && (
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle className="font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4"/>Emerging Trends</AlertTitle>
            <AlertDescription>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    {result.emergingTrends.map((trend, i) => <li key={i} className="font-semibold">{trend}</li>)}
                </ul>
                <p className="mt-4 pt-2 border-t text-xs"><strong>Reasoning:</strong> {result.reasoning}</p>
            </AlertDescription>
          </Alert>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
