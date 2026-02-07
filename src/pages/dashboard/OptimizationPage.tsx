import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import OptimizationConfig from '@/components/optimization/OptimizationConfig';
import OptimizationResults from '@/components/optimization/OptimizationResults';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Clock, DollarSign, Leaf, TrendingDown } from 'lucide-react';

export default function OptimizationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('configure');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await window.ezsite.apis.run({
        path: 'optimization/getOptimizationHistory',
        methodName: 'getOptimizationHistory',
        param: [20, null]
      });

      if (error) {
        throw new Error(error);
      }

      setHistory(data || []);
    } catch (err: any) {
      console.error('Failed to load history:', err);
      toast({
        title: 'Failed to Load History',
        description: err.message || 'Could not retrieve optimization history',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleRunOptimization = async (config: any) => {
    setIsLoading(true);

    try {
      const { data, error } = await window.ezsite.apis.run({
        path: 'optimization/runOptimization',
        methodName: 'runOptimization',
        param: [
        config.optimizationType,
        config.timeHorizon,
        config.storageCapacity,
        config.maxChargeRate,
        config.maxDischargeRate,
        config.gridCapacity,
        config.renewableCapacity,
        config.location]

      });

      if (error) {
        throw new Error(error);
      }

      setResults(data);
      setActiveTab('results');

      // Reload history to include the new run
      loadHistory();

      toast({
        title: 'Optimization Complete',
        description: `Successfully optimized for ${config.optimizationType.replace('_', ' ')}. Cost savings: $${data.savings.cost.absolute.toFixed(2)}`
      });
    } catch (err: any) {
      toast({
        title: 'Optimization Failed',
        description: err.message || 'Failed to run optimization',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOptimizationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cost_minimization: 'Cost Minimization',
      carbon_reduction: 'Carbon Reduction',
      peak_shaving: 'Peak Shaving'
    };
    return labels[type] || type;
  };

  const getOptimizationTypeBadge = (type: string) => {
    const variants: Record<string, any> = {
      cost_minimization: 'default',
      carbon_reduction: 'secondary',
      peak_shaving: 'outline'
    };
    return (
      <Badge variant={variants[type] || 'default'}>
        {getOptimizationTypeLabel(type)}
      </Badge>);

  };

  return (
    <DashboardLayout dashboardType="enterprise">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-gray-100">Optimization Engine</h1>
          <p className="text-muted-foreground dark:text-gray-300">
            Configure and run energy optimization to minimize costs and reduce emissions
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            <OptimizationConfig
              onRunOptimization={handleRunOptimization}
              isLoading={isLoading} />

          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {results && <OptimizationResults results={results} />}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="dark:text-gray-100">Optimization History</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      View past optimization runs and their results
                    </CardDescription>
                  </div>
                  <Button
                    onClick={loadHistory}
                    disabled={isLoadingHistory}
                    variant="outline"
                    size="sm">

                    {isLoadingHistory ?
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Refreshing...
                      </> :

                    <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </>
                    }
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ?
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div> :
                history.length === 0 ?
                <div className="text-center py-12">
                    <p className="text-muted-foreground dark:text-gray-400">
                      No optimization history yet. Run your first optimization to see results here.
                    </p>
                  </div> :

                <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="dark:text-gray-200">Date</TableHead>
                          <TableHead className="dark:text-gray-200">Type</TableHead>
                          <TableHead className="dark:text-gray-200">Location</TableHead>
                          <TableHead className="dark:text-gray-200">Duration</TableHead>
                          <TableHead className="dark:text-gray-200">Cost Savings</TableHead>
                          <TableHead className="dark:text-gray-200">CO₂ Reduction</TableHead>
                          <TableHead className="dark:text-gray-200">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((run) =>
                      <TableRow key={run.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <TableCell className="dark:text-gray-200">
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                {formatDate(run.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getOptimizationTypeBadge(run.runType)}
                            </TableCell>
                            <TableCell className="dark:text-gray-200">
                              {run.configuration.location}
                            </TableCell>
                            <TableCell className="dark:text-gray-200">
                              {run.configuration.timeHorizon}h
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <DollarSign className="mr-1 h-3 w-3 text-green-600" />
                                <span className="font-medium dark:text-gray-100">
                                  ${run.savings.cost.absolute}
                                </span>
                                <Badge variant="secondary" className="ml-2 text-xs text-green-600">
                                  <TrendingDown className="mr-1 h-3 w-3 inline" />
                                  {run.savings.cost.percentage}%
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Leaf className="mr-1 h-3 w-3 text-green-600" />
                                <span className="font-medium dark:text-gray-100">
                                  {run.savings.emissions.absolute} kg
                                </span>
                                <Badge variant="secondary" className="ml-2 text-xs text-green-600">
                                  <TrendingDown className="mr-1 h-3 w-3 inline" />
                                  {run.savings.emissions.percentage}%
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={run.status === 'completed' ? 'default' : 'destructive'}>
                                {run.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                      )}
                      </TableBody>
                    </Table>
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>);

}