import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, DollarSign, Leaf, Zap, Download, Battery } from 'lucide-react';

interface OptimizationResultsProps {
  results: any;
}

export default function OptimizationResults({ results }: OptimizationResultsProps) {
  if (!results) return null;

  const { baseline, optimized, savings } = results;

  // Prepare comparison data for charts
  const comparisonData = [
  {
    metric: 'Cost',
    Baseline: baseline.metrics.totalCost,
    Optimized: optimized.metrics.totalCost,
    unit: '$'
  },
  {
    metric: 'Emissions',
    Baseline: baseline.metrics.totalEmissions,
    Optimized: optimized.metrics.totalEmissions,
    unit: 'kg CO₂'
  },
  {
    metric: 'Peak Load',
    Baseline: baseline.metrics.peakDemand,
    Optimized: optimized.metrics.peakDemand,
    unit: 'kW'
  }];


  // Energy source breakdown for optimized schedule
  const renewablePercent = optimized.metrics.renewablePercentage;
  const energySourceData = [
  { name: 'Renewable', value: renewablePercent, color: '#10b981' },
  { name: 'Grid', value: 100 - renewablePercent, color: '#6366f1' }];


  // Hourly schedule comparison (show first 24 hours)
  const scheduleData = baseline.schedule.slice(0, 24).map((item: any, index: number) => ({
    hour: new Date(item.timestamp).getHours(),
    baselineLoad: item.load,
    optimizedLoad: optimized.schedule[index]?.load || 0,
    renewable: optimized.schedule[index]?.renewable || 0,
    storage: optimized.schedule[index]?.storage || 0
  }));

  // Storage activity over time (first 24 hours)
  const storageData = optimized.schedule.slice(0, 24).map((item: any) => ({
    hour: new Date(item.timestamp).getHours(),
    soc: item.storageSoC,
    charge: item.storageCharge,
    discharge: -item.storageDischarge
  }));

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100">Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">${savings.cost.absolute.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-300">
              <Badge variant="secondary" className="text-green-600">
                <TrendingDown className="h-3 w-3 mr-1 inline" />
                {savings.cost.percentage}%
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100">CO₂ Reduction</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{savings.emissions.absolute.toFixed(2)} kg</div>
            <p className="text-xs text-muted-foreground dark:text-gray-300">
              <Badge variant="secondary" className="text-green-600">
                <TrendingDown className="h-3 w-3 mr-1 inline" />
                {savings.emissions.percentage}%
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100">Peak Reduction</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{savings.peakDemand.absolute.toFixed(2)} kW</div>
            <p className="text-xs text-muted-foreground dark:text-gray-300">
              <Badge variant="secondary" className="text-green-600">
                <TrendingDown className="h-3 w-3 mr-1 inline" />
                {savings.peakDemand.percentage}%
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100">Renewable Energy</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{optimized.metrics.renewablePercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-300">
              Self-consumption: {optimized.metrics.selfConsumptionRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Bar Chart */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Baseline vs Optimized Comparison</CardTitle>
          <CardDescription className="dark:text-gray-300">Side-by-side comparison of key metrics</CardDescription>
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
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Hourly Energy Schedule</CardTitle>
            <CardDescription className="dark:text-gray-300">Load distribution and renewable generation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scheduleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Load (kW)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="baselineLoad" stroke="#94a3b8" name="Baseline" strokeWidth={2} />
                <Line type="monotone" dataKey="optimizedLoad" stroke="#3b82f6" name="Optimized" strokeWidth={2} />
                <Line type="monotone" dataKey="renewable" stroke="#10b981" name="Renewable" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Storage Activity */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Storage Activity</CardTitle>
            <CardDescription className="dark:text-gray-300">Charge/discharge schedule and state of charge</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={storageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottom', offset: -5 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="soc" stroke="#8b5cf6" name="State of Charge (kWh)" strokeWidth={2} />
                <Line type="monotone" dataKey="charge" stroke="#10b981" name="Charging (kW)" strokeWidth={2} />
                <Line type="monotone" dataKey="discharge" stroke="#ef4444" name="Discharging (kW)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Source Breakdown */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Energy Source Breakdown</CardTitle>
            <CardDescription className="dark:text-gray-300">Renewable vs grid energy</CardDescription>
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

        {/* Key Performance Indicators */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Key Performance Indicators</CardTitle>
            <CardDescription className="dark:text-gray-300">Optimization efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium dark:text-gray-200">Avg Cost per kWh:</span>
                <span className="text-sm dark:text-gray-100">${optimized.metrics.averageCostPerKWh.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium dark:text-gray-200">Avg Emissions per kWh:</span>
                <span className="text-sm dark:text-gray-100">{optimized.metrics.averageEmissionsPerKWh.toFixed(2)} g CO₂</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium dark:text-gray-200">Total Load:</span>
                <span className="text-sm dark:text-gray-100">{optimized.metrics.totalLoad.toFixed(2)} kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium dark:text-gray-200">Total Renewable:</span>
                <span className="text-sm dark:text-gray-100">{optimized.metrics.totalRenewable.toFixed(2)} kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium dark:text-gray-200">Storage Efficiency:</span>
                <span className="text-sm dark:text-gray-100">{optimized.metrics.storageEfficiency.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium dark:text-gray-200">Grid Import:</span>
                <span className="text-sm dark:text-gray-100">{optimized.metrics.totalGridImport.toFixed(2)} kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium dark:text-gray-200">Grid Export:</span>
                <span className="text-sm dark:text-gray-100">{optimized.metrics.totalGridExport.toFixed(2)} kWh</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Button */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <Button
            onClick={() => {
              const csv = convertToCSV(results);
              downloadCSV(csv, `optimization_report_${Date.now()}.csv`);
            }}
            className="w-full">

            <Download className="mr-2 h-4 w-4" />
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
  `Optimization Type,${results.optimizationType}`,
  `Time Horizon,${results.timeHorizon} hours`,
  `Location,${results.location}`,
  '',
  'Metrics,Baseline,Optimized,Savings,Savings %',
  `Cost ($),${results.baseline.metrics.totalCost},${results.optimized.metrics.totalCost},${results.savings.cost.absolute},${results.savings.cost.percentage}%`,
  `Emissions (kg CO2),${results.baseline.metrics.totalEmissions},${results.optimized.metrics.totalEmissions},${results.savings.emissions.absolute},${results.savings.emissions.percentage}%`,
  `Peak Load (kW),${results.baseline.metrics.peakDemand},${results.optimized.metrics.peakDemand},${results.savings.peakDemand.absolute},${results.savings.peakDemand.percentage}%`,
  '',
  'Configuration',
  `Storage Capacity,${results.configuration.storageCapacity} kWh`,
  `Max Charge Rate,${results.configuration.maxChargeRate} kW`,
  `Max Discharge Rate,${results.configuration.maxDischargeRate} kW`,
  `Grid Capacity,${results.configuration.gridCapacity} kW`,
  `Renewable Capacity,${results.configuration.renewableCapacity} kW`,
  '',
  'Hourly Schedule',
  'Hour,Baseline Load (kW),Optimized Load (kW),Renewable (kW),Storage (kW),Grid Import (kW),Price ($/kWh),Carbon Intensity (g/kWh)'];


  results.baseline.schedule.forEach((item: any, i: number) => {
    const hour = new Date(item.timestamp).getHours();
    const baselineLoad = item.load;
    const opt = results.optimized.schedule[i];
    lines.push(
      `${hour},${baselineLoad},${opt?.load || 0},${opt?.renewable || 0},${opt?.storage || 0},${opt?.gridImport || 0},${opt?.price || 0},${opt?.carbonIntensity || 0}`
    );
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