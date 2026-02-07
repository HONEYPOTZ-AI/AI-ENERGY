import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, AlertCircle, Download, FileJson, FileSpreadsheet, FileText as FilePdf } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ESGReportDisplayProps {
  report: any;
}

export default function ESGReportDisplay({ report }: ESGReportDisplayProps) {
  if (!report) return null;

  const { summary, reportData, compliance, trends } = report;

  // Emissions breakdown data
  const emissionsData = [
    { name: 'Scope 1', value: summary.scope1, color: '#ef4444' },
    { name: 'Scope 2', value: summary.scope2, color: '#f97316' },
    { name: 'Scope 3', value: summary.scope3, color: '#eab308' }
  ];

  // Trend data
  const trendData = trends.monthOverMonth.map((item: any) => ({
    month: item.month,
    emissions: item.avgEmissions,
    cost: item.avgCost
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalEmissions.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">tonnes CO₂e</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Energy Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalEnergy.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">MWh</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Renewable Energy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.renewablePercentage}%</div>
            <p className="text-xs text-muted-foreground">of total energy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Emissions Intensity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.emissionsIntensity.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">kg CO₂e/MWh</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Period */}
      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Report Type:</span>
            <Badge>{reportData.methodology}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Period:</span>
            <span className="text-sm font-medium">
              {report.period.start} to {report.period.end}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Frequency:</span>
            <span className="text-sm font-medium capitalize">{report.dateRange}</span>
          </div>
        </CardContent>
      </Card>

      {/* Emissions Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Scope</CardTitle>
            <CardDescription>Breakdown of GHG emissions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emissionsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(2)} t`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emissionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scope 1 (Direct):</span>
                <span className="font-medium">{summary.scope1.toFixed(2)} tonnes CO₂e</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Scope 2 (Electricity):</span>
                <span className="font-medium">{summary.scope2.toFixed(2)} tonnes CO₂e</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Scope 3 (Supply Chain):</span>
                <span className="font-medium">{summary.scope3.toFixed(2)} tonnes CO₂e</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions Trend</CardTitle>
            <CardDescription>Month-over-month comparison</CardDescription>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="emissions" stroke="#ef4444" name="Avg Emissions (kg)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Emissions Trend:</span>
                    <Badge variant={trends.emissionsTrend === 'decreasing' ? 'default' : 'destructive'}>
                      {trends.emissionsTrend}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost Trend:</span>
                    <Badge variant={trends.costTrend === 'decreasing' ? 'default' : 'destructive'}>
                      {trends.costTrend}
                    </Badge>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Insufficient data for trend analysis
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compliance Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Checklist</CardTitle>
          <CardDescription>Regulatory compliance status indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {compliance.map((item: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.item}</p>
                    <Badge variant={getStatusVariant(item.status)}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Report</CardTitle>
          <CardDescription>Download report in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => exportJSON(report)}
              variant="outline"
              className="w-full"
            >
              <FileJson className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
            <Button
              onClick={() => exportCSV(report)}
              variant="outline"
              className="w-full"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              onClick={() => exportPDF(report)}
              variant="outline"
              className="w-full"
            >
              <FilePdf className="mr-2 h-4 w-4" />
              Export PDF (Summary)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function exportJSON(report: any) {
  const json = JSON.stringify(report, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadFile(blob, `esg_report_${Date.now()}.json`);
}

function exportCSV(report: any) {
  const lines = [
    'ESG Compliance Report',
    '',
    `Report Type,${report.reportType}`,
    `Period,${report.period.start} to ${report.period.end}`,
    `Frequency,${report.dateRange}`,
    '',
    'Summary Metrics',
    'Metric,Value,Unit',
    `Total Emissions,${report.summary.totalEmissions},tonnes CO2e`,
    `Total Energy,${report.summary.totalEnergy},MWh`,
    `Renewable Percentage,${report.summary.renewablePercentage},%`,
    `Emissions Intensity,${report.summary.emissionsIntensity},kg CO2e/MWh`,
    '',
    'Emissions by Scope',
    'Scope,Emissions (tonnes CO2e)',
    `Scope 1,${report.summary.scope1}`,
    `Scope 2,${report.summary.scope2}`,
    `Scope 3,${report.summary.scope3}`,
    '',
    'Compliance Checklist',
    'Item,Status,Description',
    ...report.compliance.map((item: any) => 
      `"${item.item}",${item.status},"${item.description}"`
    )
  ];

  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadFile(blob, `esg_report_${Date.now()}.csv`);
}

function exportPDF(report: any) {
  // For PDF, we'll create a simplified text version
  const text = `
ESG COMPLIANCE REPORT
=====================

Report Type: ${report.reportType}
Period: ${report.period.start} to ${report.period.end}
Frequency: ${report.dateRange}

SUMMARY METRICS
---------------
Total Emissions: ${report.summary.totalEmissions} tonnes CO₂e
Total Energy: ${report.summary.totalEnergy} MWh
Renewable Percentage: ${report.summary.renewablePercentage}%
Emissions Intensity: ${report.summary.emissionsIntensity} kg CO₂e/MWh

EMISSIONS BY SCOPE
------------------
Scope 1 (Direct): ${report.summary.scope1} tonnes CO₂e
Scope 2 (Electricity): ${report.summary.scope2} tonnes CO₂e
Scope 3 (Supply Chain): ${report.summary.scope3} tonnes CO₂e

COMPLIANCE CHECKLIST
--------------------
${report.compliance.map((item: any) => 
  `[${item.status.toUpperCase()}] ${item.item}\n   ${item.description}`
).join('\n\n')}

Generated: ${new Date().toISOString()}
  `.trim();

  const blob = new Blob([text], { type: 'text/plain' });
  downloadFile(blob, `esg_report_${Date.now()}.txt`);
}

function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
