import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, FileText } from 'lucide-react';

interface ESGReportConfigProps {
  onGenerateReport: (config: any) => Promise<void>;
  isLoading: boolean;
}

export default function ESGReportConfig({ onGenerateReport, isLoading }: ESGReportConfigProps) {
  const [reportType, setReportType] = useState<string>('sec_climate');
  const [scopeSelector, setScopeSelector] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('monthly');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState<string>('region-1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const config = {
      reportType,
      scopeSelector,
      dateRange,
      endDate: new Date(endDate).toISOString(),
      location
    };

    await onGenerateReport(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ESG Report Configuration</CardTitle>
        <CardDescription>Generate compliance reports for SEC Climate Disclosure or GHG Protocol</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="reportType">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sec_climate">SEC Climate Disclosure</SelectItem>
                <SelectItem value="ghg_protocol">GHG Protocol</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scope Selector */}
          <div className="space-y-2">
            <Label htmlFor="scopeSelector">Emissions Scope</Label>
            <Select value={scopeSelector} onValueChange={setScopeSelector}>
              <SelectTrigger id="scopeSelector">
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scope1">Scope 1 (Direct Emissions)</SelectItem>
                <SelectItem value="scope2">Scope 2 (Electricity)</SelectItem>
                <SelectItem value="scope3">Scope 3 (Supply Chain)</SelectItem>
                <SelectItem value="all">All Scopes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="dateRange">Reporting Period</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger id="dateRange">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)} />

          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., region-1" />

          </div>

          {/* Generate Button */}
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ?
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </> :

            <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            }
          </Button>
        </form>
      </CardContent>
    </Card>);

}