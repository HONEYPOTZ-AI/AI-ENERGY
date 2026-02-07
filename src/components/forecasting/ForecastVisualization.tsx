import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

interface ForecastVisualizationProps {
  forecastData: any[];
  historicalData: any[];
}

export default function ForecastVisualization({ forecastData, historicalData }: ForecastVisualizationProps) {
  const [visibleSeries, setVisibleSeries] = useState({
    historical: true,
    forecast: true,
    confidence: true
  });

  const toggleSeries = (series: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({ ...prev, [series]: !prev[series] }));
  };

  // Combine historical and forecast data
  const chartData = [
    ...historicalData.map(d => ({
      timestamp: new Date(d.timestamp).getTime(),
      actual: d.load_value,
      type: 'historical'
    })),
    ...forecastData.map(f => ({
      timestamp: new Date(f.target_timestamp).getTime(),
      forecast: f.predicted_load,
      lower: f.lower_bound,
      upper: f.upper_bound,
      type: 'forecast'
    }))
  ].sort((a, b) => a.timestamp - b.timestamp);

  const formatXAxis = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM dd HH:mm');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Forecast Visualization</CardTitle>
            <CardDescription>Interactive view of historical and forecasted values</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={visibleSeries.historical ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSeries('historical')}
            >
              {visibleSeries.historical ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
              Historical
            </Button>
            <Button
              variant={visibleSeries.forecast ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSeries('forecast')}
            >
              {visibleSeries.forecast ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
              Forecast
            </Button>
            <Button
              variant={visibleSeries.confidence ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSeries('confidence')}
            >
              {visibleSeries.confidence ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
              Confidence
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              scale="time"
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis label={{ value: 'Load (kW)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy HH:mm')}
              formatter={(value: number) => [`${value.toFixed(2)} kW`, '']}
            />
            <Legend />

            {visibleSeries.confidence && (
              <Area
                type="monotone"
                dataKey="upper"
                stackId="1"
                stroke="none"
                fill="#10b981"
                fillOpacity={0.1}
                name="Confidence Band"
              />
            )}
            {visibleSeries.confidence && (
              <Area
                type="monotone"
                dataKey="lower"
                stackId="1"
                stroke="none"
                fill="#10b981"
                fillOpacity={0.1}
              />
            )}

            {visibleSeries.historical && (
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Historical Actual"
              />
            )}

            {visibleSeries.forecast && (
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                name="Forecasted"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
