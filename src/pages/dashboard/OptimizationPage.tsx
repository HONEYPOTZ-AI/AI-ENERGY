import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import OptimizationConfig from '@/components/optimization/OptimizationConfig';
import OptimizationResults from '@/components/optimization/OptimizationResults';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OptimizationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleRunOptimization = async (config: any) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await window.ezsite.apis.run({
        path: 'optimization/runOptimization',
        methodName: 'runOptimization',
        param: [
          config.objective,
          config.timeHorizon,
          config.constraints,
          config.location
        ]
      });

      if (error) {
        throw new Error(error);
      }

      setResults(data);
      toast({
        title: 'Optimization Complete',
        description: `Successfully optimized for ${config.objective}. Cost savings: $${data.savings.costSavings.toFixed(2)}`,
      });
    } catch (err: any) {
      toast({
        title: 'Optimization Failed',
        description: err.message || 'Failed to run optimization',
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
          <h1 className="text-3xl font-bold tracking-tight">Optimization Engine</h1>
          <p className="text-muted-foreground">
            Configure and run energy optimization to minimize costs and reduce emissions
          </p>
        </div>

        <Tabs defaultValue="configure" className="space-y-6">
          <TabsList>
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            <OptimizationConfig
              onRunOptimization={handleRunOptimization}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {results && <OptimizationResults results={results} />}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
