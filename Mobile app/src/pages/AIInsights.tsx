import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { aiAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export default function AIInsights() {
  const [insights, setInsights] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const fetchInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const response = await aiAPI.getInsights();
      setInsights(response.data.insights);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate insights. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const fetchRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const response = await aiAPI.getRecommendations();
      setRecommendations(response.data.recommendations);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    fetchRecommendations();
  }, []);

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Financial Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalized insights powered by AI
          </p>
        </div>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights">
            <TrendingUp className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Lightbulb className="w-4 h-4 mr-2" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Financial Insights</CardTitle>
                  <CardDescription>
                    AI-powered analysis of your financial health
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchInsights}
                  disabled={isLoadingInsights}
                >
                  {isLoadingInsights ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingInsights ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : insights ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {insights}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No insights available. Click refresh to generate.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <CardDescription>
                    Actionable advice to improve your finances
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchRecommendations}
                  disabled={isLoadingRecommendations}
                >
                  {isLoadingRecommendations ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingRecommendations ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : recommendations ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {recommendations}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No recommendations available. Click refresh to generate.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
