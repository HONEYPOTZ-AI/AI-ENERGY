import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DataVisualizationProps {
  data: any;
}

export default function DataVisualization({ data }: DataVisualizationProps) {
  if (!data) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="py-12 text-center text-muted-foreground dark:text-gray-400">
          Generate data to see visualization
        </CardContent>
      </Card>);

  }

  const chartData = data.dataPoints.slice(0, 168).map((point: any) => ({
    timestamp: new Date(point.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit'
    }),
    value: parseFloat(point.value.toFixed(2)),
    ...(point.humidity && { humidity: parseFloat(point.humidity.toFixed(2)) }),
    ...(point.windSpeed && { windSpeed: parseFloat(point.windSpeed.toFixed(2)) })
  }));

  const downloadCSV = () => {
    const headers = Object.keys(data.dataPoints[0]).join(',');
    const rows = data.dataPoints.map((point: any) =>
    Object.values(point).map((v) => `"${v}"`).join(',')
    );
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthetic_data_${data.datasetType}_${Date.now()}.csv`;
    a.click();

    toast({ title: 'CSV Downloaded' });
  };

  const downloadJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthetic_data_${data.datasetType}_${Date.now()}.json`;
    a.click();

    toast({ title: 'JSON Downloaded' });
  };

  const hasMultipleMetrics = data.dataPoints[0].humidity !== undefined;

  return (
    <div className="space-y-4">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="dark:text-gray-100">Time Series Visualization</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={downloadJSON}>
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }} />

              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                name={data.dataPoints[0]?.unit || 'Value'} />

              {hasMultipleMetrics &&
              <>
                  <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                  name="Humidity (%)" />

                  <Line
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="#ffc658"
                  strokeWidth={2}
                  dot={false}
                  name="Wind Speed (m/s)" />

                </>
              }
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground dark:text-gray-400">Minimum</p>
              <p className="text-2xl font-bold dark:text-gray-100">{data.stats.min.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground dark:text-gray-400">Maximum</p>
              <p className="text-2xl font-bold dark:text-gray-100">{data.stats.max.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground dark:text-gray-400">Average</p>
              <p className="text-2xl font-bold dark:text-gray-100">{data.stats.avg.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground dark:text-gray-400">Std Dev</p>
              <p className="text-2xl font-bold dark:text-gray-100">{data.stats.stdDev.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground dark:text-gray-400">Data Points</p>
              <p className="text-2xl font-bold dark:text-gray-100">{data.stats.count}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

}