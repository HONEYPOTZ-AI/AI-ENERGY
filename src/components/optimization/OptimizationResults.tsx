import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, DollarSign, Leaf, Zap } from 'lucide-react';

interface OptimizationResultsProps {
  results: any;
}

export default function OptimizationResults({ results }: OptimizationResultsProps) {
  if (!results) return null;

  const { baseline, optimized, savings, objective } = results;

  // Prepare comparison data for charts
  const comparisonData = [
  {
    metric: 'Cost',
    Baseline: baseline.cost,
    Optimized: optimized.cost,
    unit: '$'
  },
  {
    metric: 'Emissions',
    Baseline: baseline.emissions,
    Optimized: optimized.emissions,
    unit: 'kg CO₂'
  },
  {
    metric: 'Peak Load',
    Baseline: baseline.peakLoad,
    Optimized: optimized.peakLoad,
    unit: 'kW'
  }];


  // Energy source breakdown
  const energySourceData = [
  { name: 'Renewable', value: optimized.renewable, color: '#10b981' },
  { name: 'Fossil', value: 100 - optimized.renewable, color: '#ef4444' }];


  // Hourly schedule comparison (show first 24 hours)
  const scheduleData = baseline.schedule.slice(0, 24).map((item: any, index: number) => ({
    hour: new Date(item.timestamp).getHours(),
    baseline: item.load_value,
    optimized: optimized.schedule[index]?.load_value || 0
  }));

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${savings.costSavings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-green-600">
                <TrendingDown className="h-3 w-3 mr-1 inline" />
                {savings.costSavingsPercent}%
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Reduction</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savings.emissionsReduction.toFixed(2)} kg</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-green-600">
                <TrendingDown className="h-3 w-3 mr-1 inline" />
                {savings.emissionsReductionPercent}%
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Reduction</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savings.peakReduction.toFixed(2)} kW</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-green-600">
                <TrendingDown className="h-3 w-3 mr-1 inline" />
                {savings.peakReductionPercent}%
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Baseline vs Optimized Comparison</CardTitle>
          <CardDescription>Side-by-side comparison of key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Baseline" fill="#94a3b8" />
              <Bar dataKey="Optimized" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Energy Schedule</CardTitle>
            <CardDescription>Load distribution showing shifts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scheduleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Load (kW)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="baseline" stroke="#94a3b8" name="Baseline" strokeWidth={2} />
                <Line type="monotone" dataKey="optimized" stroke="#3b82f6" name="Optimized" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Energy Source Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Energy Source Breakdown</CardTitle>
            <CardDescription>Renewable vs fossil fuel generation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={energySourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value">

                  {energySourceData.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.color} />
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Export Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={() => {
              // Export to CSV
              const csv = convertToCSV(results);
              downloadCSV(csv, `optimization_report_${Date.now()}.csv`);
            }}
            className="w-full">

            Export Optimization Report (CSV)
          </Button>
        </CardContent>
      </Card>
    </div>);

}

function convertToCSV(results: any) {
  const lines = [
  'Optimization Report',
  '',
  'Summary',
  `Objective,${results.objective}`,
  `Time Horizon,${results.timeHorizon}`,
  '',
  'Metrics,Baseline,Optimized,Savings,Savings %',
  `Cost ($),${results.baseline.cost},${results.optimized.cost},${results.savings.costSavings},${results.savings.costSavingsPercent}%`,
  `Emissions (kg CO2),${results.baseline.emissions},${results.optimized.emissions},${results.savings.emissionsReduction},${results.savings.emissionsReductionPercent}%`,
  `Peak Load (kW),${results.baseline.peakLoad},${results.optimized.peakLoad},${results.savings.peakReduction},${results.savings.peakReductionPercent}%`,
  '',
  'Hourly Schedule',
  'Hour,Baseline Load (kW),Optimized Load (kW)'];


  results.baseline.schedule.forEach((item: any, i: number) => {
    const hour = new Date(item.timestamp).getHours();
    const baselineLoad = item.load_value;
    const optimizedLoad = results.optimized.schedule[i]?.load_value || 0;
    lines.push(`${hour},${baselineLoad},${optimizedLoad}`);
  });

  return lines.join('\n');
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}