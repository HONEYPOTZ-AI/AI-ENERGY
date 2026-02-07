import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ESGReportConfig from '@/components/esg/ESGReportConfig';
import ESGReportDisplay from '@/components/esg/ESGReportDisplay';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ESGReportsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleGenerateReport = async (config: any) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await window.ezsite.apis.run({
        path: 'esg/generateReport',
        methodName: 'generateReport',
        param: [
          config.reportType,
          config.scopeSelector,
          config.dateRange,
          config.endDate,
          config.location
        ]
      });

      if (error) {
        throw new Error(error);
      }

      setReport(data);
      toast({
        title: 'Report Generated',
        description: `ESG ${config.reportType === 'sec_climate' ? 'SEC Climate' : 'GHG Protocol'} report generated successfully`,
      });
    } catch (err: any) {
      toast({
        title: 'Report Generation Failed',
        description: err.message || 'Failed to generate ESG report',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout dashboardType="enterprise">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ESG Compliance Reports</h1>
          <p className="text-muted-foreground">
            Generate and export ESG compliance reports for SEC Climate Disclosure and GHG Protocol
          </p>
        </div>

        <Tabs defaultValue="configure" className="space-y-6">
          <TabsList>
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="report" disabled={!report}>View Report</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            <ESGReportConfig
              onGenerateReport={handleGenerateReport}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            {report && <ESGReportDisplay report={report} />}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
