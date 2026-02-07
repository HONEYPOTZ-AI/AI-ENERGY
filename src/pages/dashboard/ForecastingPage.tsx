import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import ForecastConfigPanel from '@/components/forecasting/ForecastConfigPanel';
import ForecastVisualization from '@/components/forecasting/ForecastVisualization';
import ForecastHistory from '@/components/forecasting/ForecastHistory';
import ForecastPerformance from '@/components/forecasting/ForecastPerformance';

export default function ForecastingPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [newForecastCount, setNewForecastCount] = useState(0);
  const [lastCheck, setLastCheck] = useState(Date.now());

  // Load initial data
  useEffect(() => {
    loadLatestForecasts();
    loadHistoricalData();
  }, [refreshTrigger]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      checkForNewForecasts();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [lastCheck]);

  const loadLatestForecasts = async () => {
    try {
      const { data, error } = await window.ezsite.apis.run({
        path: 'forecasting/getForecastHistory',
        methodName: 'getLatestForecasts',
        param: []
      });

      if (error) throw new Error(error);

      if (data && data.length > 0) {
        // Add confidence intervals
        const forecastsWithIntervals = data.map((f: any) => ({
          ...f,
          lower_bound: f.predicted_load * (1 - (1 - f.confidence_score) * 2),
          upper_bound: f.predicted_load * (1 + (1 - f.confidence_score) * 2)
        }));
        setForecastData(forecastsWithIntervals);
      }
    } catch (error: any) {
      console.error('Failed to load forecasts:', error.message);
    }
  };

  const loadHistoricalData = async () => {
    try {
      const { data, error } = await window.ezsite.apis.sqlQuery({
        Sql: 'SELECT timestamp, load_value FROM energy_load_data ORDER BY timestamp DESC LIMIT 48',
        Parameters: []
      });

      if (error) throw new Error(error);

      setHistoricalData((data || []).reverse());
    } catch (error: any) {
      console.error('Failed to load historical data:', error.message);
    }
  };

  const checkForNewForecasts = async () => {
    try {
      const { data, error } = await window.ezsite.apis.sqlQuery({
        Sql: `SELECT COUNT(*) as count FROM forecasts WHERE created_at > @lastCheck`,
        Parameters: [
        {
          name: 'lastCheck',
          value: new Date(lastCheck).toISOString(),
          valueType: 'DateTime'
        }]

      });

      if (error) throw new Error(error);

      const count = data && data.length > 0 ? data[0] : 0;

      if (count > 0) {
        setNewForecastCount((prev) => prev + count);
        toast({
          title: 'New Forecasts Available',
          description: `${count} new forecast(s) have been generated`
        });
        setRefreshTrigger((prev) => prev + 1);
      }

      setLastCheck(Date.now());
    } catch (error: any) {
      console.error('Failed to check for new forecasts:', error.message);
    }
  };

  const handleForecastGenerated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setNewForecastCount(0);
  };

  const handleViewNewForecasts = () => {
    setNewForecastCount(0);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-gray-100">AI Forecasting Dashboard</h1>
          <p className="text-muted-foreground dark:text-gray-300">
            Generate and analyze energy load forecasts using advanced time-series models
          </p>
        </div>
        {newForecastCount > 0 &&
        <button
          onClick={handleViewNewForecasts}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700">

            <Bell className="h-5 w-5" />
            <Badge variant="secondary" className="ml-1 dark:bg-gray-700 dark:text-gray-200">
              {newForecastCount} new
            </Badge>
          </button>
        }
      </div>

      {/* Performance Metrics */}
      <ForecastPerformance refreshTrigger={refreshTrigger} />

      {/* Configuration Panel */}
      <ForecastConfigPanel onForecastGenerated={handleForecastGenerated} />

      {/* Visualization */}
      {forecastData.length > 0 &&
      <ForecastVisualization
        forecastData={forecastData}
        historicalData={historicalData} />

      }

      {/* Forecast History */}
      <ForecastHistory refreshTrigger={refreshTrigger} />
    </div>);

}