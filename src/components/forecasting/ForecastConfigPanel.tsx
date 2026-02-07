import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ForecastConfigPanelProps {
  onForecastGenerated: () => void;
}

export default function ForecastConfigPanel({ onForecastGenerated }: ForecastConfigPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    horizon: 12,
    targetMetric: 'load',
    location: 'default',
    modelType: 'Hybrid',
    features: {
      weather: true,
      historical: true,
      timeFeatures: true
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await window.ezsite.apis.run({
        path: 'forecasting/generateForecast',
        methodName: 'generateForecast',
        param: [
        config.horizon,
        config.targetMetric,
        config.location,
        config.features,
        config.modelType]

      });

      if (error) throw new Error(error);

      toast({
        title: 'Forecast Generated',
        description: `Successfully generated ${config.horizon}-hour forecast`
      });

      onForecastGenerated();
    } catch (error: any) {
      toast({
        title: 'Forecast Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forecast Configuration</CardTitle>
        <CardDescription>Configure parameters for AI-powered energy forecasting</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Forecast Horizon */}
            <div className="space-y-2">
              <Label htmlFor="horizon">Forecast Horizon (hours)</Label>
              <Input
                id="horizon"
                type="number"
                min={1}
                max={24}
                value={config.horizon}
                onChange={(e) => setConfig({ ...config, horizon: parseInt(e.target.value) })}
                required />

              <p className="text-xs text-muted-foreground">1-24 hours ahead</p>
            </div>

            {/* Target Metric */}
            <div className="space-y-2">
              <Label htmlFor="targetMetric">Target Metric</Label>
              <Select
                value={config.targetMetric}
                onValueChange={(value) => setConfig({ ...config, targetMetric: value })}>

                <SelectTrigger id="targetMetric">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="load">Energy Load</SelectItem>
                  <SelectItem value="price">Electricity Price</SelectItem>
                  <SelectItem value="carbon">Carbon Intensity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={config.location}
                onChange={(e) => setConfig({ ...config, location: e.target.value })}
                placeholder="e.g., Building A, Zone 1" />

            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="modelType">Model Type</Label>
              <Select
                value={config.modelType}
                onValueChange={(value) => setConfig({ ...config, modelType: value })}>

                <SelectTrigger id="modelType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LSTM">LSTM (Deep Learning)</SelectItem>
                  <SelectItem value="Hybrid">Hybrid (Statistical + ML)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feature Selection */}
          <div className="space-y-3">
            <Label>Include Features</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weather"
                  checked={config.features.weather}
                  onCheckedChange={(checked) =>
                  setConfig({
                    ...config,
                    features: { ...config.features, weather: checked as boolean }
                  })
                  } />

                <label
                  htmlFor="weather"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">

                  Weather Data
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="historical"
                  checked={config.features.historical}
                  onCheckedChange={(checked) =>
                  setConfig({
                    ...config,
                    features: { ...config.features, historical: checked as boolean }
                  })
                  } />

                <label
                  htmlFor="historical"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">

                  Historical Load Data
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timeFeatures"
                  checked={config.features.timeFeatures}
                  onCheckedChange={(checked) =>
                  setConfig({
                    ...config,
                    features: { ...config.features, timeFeatures: checked as boolean }
                  })
                  } />

                <label
                  htmlFor="timeFeatures"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">

                  Time Features (hour, day, seasonality)
                </label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ?
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Forecast...
              </> :

            'Generate Forecast'
            }
          </Button>
        </form>
      </CardContent>
    </Card>);

}