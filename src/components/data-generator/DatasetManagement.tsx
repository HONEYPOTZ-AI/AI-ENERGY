import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Trash2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from
'@/components/ui/alert-dialog';

interface DatasetManagementProps {
  onView: (data: any) => void;
  refreshTrigger?: number;
}

export default function DatasetManagement({ onView, refreshTrigger }: DatasetManagementProps) {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadDatasets = async () => {
    setLoading(true);
    try {
      const { data, error } = await window.ezsite.apis.tablePage(74745, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: 'created_at',
        IsAsc: false,
        Filters: []
      });

      if (error) throw new Error(error);
      setDatasets(data.List);
    } catch (err: any) {
      toast({
        title: 'Error Loading Datasets',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, [refreshTrigger]);

  const handleView = (dataset: any) => {
    const dataPoints = JSON.parse(dataset.data_points);
    const parameters = JSON.parse(dataset.generation_parameters);

    onView({
      datasetType: dataset.dataset_type,
      dataPoints,
      parameters,
      stats: calculateStats(dataPoints)
    });

    toast({ title: 'Dataset Loaded' });
  };

  const calculateStats = (dataPoints: any[]) => {
    const values = dataPoints.map((p: any) => p.value);
    const sum = values.reduce((a: number, b: number) => a + b, 0);
    const mean = sum / values.length;
    const variance = values.reduce((acc: number, val: number) => acc + Math.pow(val - mean, 2), 0) / values.length;

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: mean,
      stdDev: Math.sqrt(variance),
      count: values.length
    };
  };

  const handleDownload = (dataset: any) => {
    const dataPoints = JSON.parse(dataset.data_points);
    const headers = Object.keys(dataPoints[0]).join(',');
    const rows = dataPoints.map((point: any) =>
    Object.values(point).map((v) => `"${v}"`).join(',')
    );
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataset_${dataset.id}_${dataset.dataset_type}.csv`;
    a.click();

    toast({ title: 'Dataset Downloaded' });
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await window.ezsite.apis.tableDelete(74745, { ID: deleteId });
      if (error) throw new Error(error);

      toast({ title: 'Dataset Deleted' });
      loadDatasets();
    } catch (err: any) {
      toast({
        title: 'Delete Failed',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setDeleteId(null);
    }
  };

  const getDatasetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      load_curve: 'Load Curve',
      weather: 'Weather Data',
      carbon_intensity: 'Carbon Intensity',
      prices: 'Electricity Prices'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground dark:text-gray-400" />
        </CardContent>
      </Card>);

  }

  return (
    <>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Generated Datasets</CardTitle>
        </CardHeader>
        <CardContent>
          {datasets.length === 0 ?
          <p className="text-center text-muted-foreground dark:text-gray-400 py-8">No datasets generated yet</p> :

          <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Time Range</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datasets.map((dataset) =>
                <TableRow key={dataset.id} className="dark:border-gray-700">
                      <TableCell>
                        <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">
                          {getDatasetTypeLabel(dataset.dataset_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm dark:text-gray-300">
                        {new Date(dataset.timerange_start).toLocaleDateString()} -{' '}
                        {new Date(dataset.timerange_end).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm dark:text-gray-300">
                        {new Date(dataset.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(dataset)}>

                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(dataset)}>

                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(dataset.id)}>

                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
            </div>
          }
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-gray-100">Delete Dataset</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              Are you sure you want to delete this dataset? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>);

}