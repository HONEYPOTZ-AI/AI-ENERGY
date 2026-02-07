import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingUp, Target, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ForecastPerformanceProps {
  refreshTrigger: number;
}

export default function ForecastPerformance({ refreshTrigger }: ForecastPerformanceProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [performance, setPerformance] = useState<any>(null);

  useEffect(() => {
    loadPerformance();
  }, [refreshTrigger]);

  const loadPerformance = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await window.ezsite.apis.run({
        path: 'forecasting/getForecastPerformance',
        methodName: 'getForecastPerformance',
        param: []
      });

      if (error) throw new Error(error);

      setPerformance(data);
    } catch (error: any) {
      toast({
        title: 'Failed to load performance metrics',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>);

  }

  if (!performance) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{performance.accuracy}%</div>
          <Progress value={performance.accuracy} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Based on {performance.forecastsWithActuals} verified forecasts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">MAPE</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{performance.mape}%</div>
          <p className="text-xs text-muted-foreground mt-2">
            Mean Absolute Percentage Error
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">RMSE</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{performance.rmse.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Root Mean Squared Error
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">MAE</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{performance.mae.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Mean Absolute Error
          </p>
        </CardContent>
      </Card>
    </div>);

}