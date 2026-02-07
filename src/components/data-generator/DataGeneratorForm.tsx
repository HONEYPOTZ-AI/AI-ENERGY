import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DataGeneratorFormProps {
  onGenerate: (data: any) => void;
}

export default function DataGeneratorForm({ onGenerate }: DataGeneratorFormProps) {
  const [loading, setLoading] = useState(false);
  const [datasetType, setDatasetType] = useState('load_curve');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [location, setLocation] = useState('Default Location');
  const [seasonality, setSeasonality] = useState([0.5]);
  const [noiseLevel, setNoiseLevel] = useState([0.1]);

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Validation Error',
        description: 'Please select both start and end dates',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const parameters = {
        seasonality: seasonality[0],
        noiseLevel: noiseLevel[0]
      };

      const { data, error } = await window.ezsite.apis.run({
        path: 'dataGenerator/generateDataset',
        methodName: 'generateDataset',
        param: [datasetType, startDate, endDate, location, parameters]
      });

      if (error) throw new Error(error);

      // Save to database
      const { error: saveError } = await window.ezsite.apis.tableCreate(74745, {
        dataset_type: datasetType,
        timerange_start: new Date(startDate).toISOString(),
        timerange_end: new Date(endDate).toISOString(),
        generation_parameters: JSON.stringify(parameters),
        data_points: JSON.stringify(data.dataPoints),
        created_at: new Date().toISOString()
      });

      if (saveError) throw new Error(saveError);

      toast({
        title: 'Success',
        description: `Generated ${data.dataPoints.length} data points`
      });

      onGenerate(data);
    } catch (err: any) {
      toast({
        title: 'Generation Failed',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Synthetic Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Dataset Type</Label>
          <Select value={datasetType} onValueChange={setDatasetType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="load_curve">Load Curves</SelectItem>
              <SelectItem value="weather">Weather Signals</SelectItem>
              <SelectItem value="carbon_intensity">Carbon Intensity</SelectItem>
              <SelectItem value="prices">Electricity Prices</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)} />

          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)} />

          </div>
        </div>

        <div className="space-y-2">
          <Label>Location/Region</Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location" />

        </div>

        <div className="space-y-2">
          <Label>Seasonality: {seasonality[0].toFixed(2)}</Label>
          <Slider
            value={seasonality}
            onValueChange={setSeasonality}
            min={0}
            max={1}
            step={0.05}
            className="w-full" />

        </div>

        <div className="space-y-2">
          <Label>Noise Level: {noiseLevel[0].toFixed(2)}</Label>
          <Slider
            value={noiseLevel}
            onValueChange={setNoiseLevel}
            min={0}
            max={0.5}
            step={0.05}
            className="w-full" />

        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full">

          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Data
        </Button>
      </CardContent>
    </Card>);

}