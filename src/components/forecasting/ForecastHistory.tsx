import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface ForecastHistoryProps {
  refreshTrigger: number;
}

export default function ForecastHistory({ refreshTrigger }: ForecastHistoryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadForecasts();
  }, [refreshTrigger, filter]);

  const loadForecasts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await window.ezsite.apis.run({
        path: 'forecasting/getForecastHistory',
        methodName: 'getForecastHistory',
        param: [null, null, filter]
      });

      if (error) throw new Error(error);

      setForecasts(data || []);
    } catch (error: any) {
      toast({
        title: 'Failed to load forecast history',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Forecast History</CardTitle>
            <CardDescription>Past forecasts and their accuracy</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forecasts</SelectItem>
                <SelectItem value="short_term">Short Term</SelectItem>
                <SelectItem value="long_term">Long Term</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadForecasts} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ?
        <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div> :
        forecasts.length === 0 ?
        <div className="text-center py-8 text-muted-foreground">
            No forecasts found. Generate a forecast to get started.
          </div> :

        <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created At</TableHead>
                  <TableHead>Target Time</TableHead>
                  <TableHead>Predicted Load</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Model</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecasts.map((forecast) =>
              <TableRow key={forecast.id}>
                    <TableCell className="text-sm">
                      {format(new Date(forecast.created_at), 'MMM dd, HH:mm')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(forecast.target_timestamp), 'MMM dd, HH:mm')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {forecast.predicted_load.toFixed(2)} kW
                    </TableCell>
                    <TableCell>
                      <Badge variant={forecast.confidence_score > 0.8 ? 'default' : 'secondary'}>
                        {(forecast.confidence_score * 100).toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {forecast.forecast_type === 'short_term' ? 'Short Term' : 'Long Term'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {forecast.model_version}
                    </TableCell>
                  </TableRow>
              )}
              </TableBody>
            </Table>
          </div>
        }
      </CardContent>
    </Card>);

}