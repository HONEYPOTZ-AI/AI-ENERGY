import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataGeneratorFormProps {
  onGenerate: (data: any) => void;
}

export default function DataGeneratorForm({ onGenerate }: DataGeneratorFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [datasetType, setDatasetType] = useState('load_curve');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [location, setLocation] = useState('Default Location');
  const [timeInterval, setTimeInterval] = useState(60); // minutes
  const [numCustomers, setNumCustomers] = useState(1);
  const [seasonality, setSeasonality] = useState([0.5]);
  const [noiseLevel, setNoiseLevel] = useState([0.1]);

  const handleGenerate = async () => {
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      toast({
        title: 'Invalid Date Range',
        description: 'Start date must be before end date',
        variant: 'destructive',
      });
      return;
    }

    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
      toast({
        title: 'Date Range Too Large',
        description: 'Date range cannot exceed 365 days',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Generate dataset via backend
      const { data, error } = await window.ezsite.apis.run({
        path: 'dataGenerator/generateDataset',
        methodName: 'generateDataset',
        param: [
          datasetType,
          startDate,
          endDate,
          location,
          {
            seasonality: seasonality[0],
            noiseLevel: noiseLevel[0],
            timeInterval,
            numCustomers,
          }
        ],
      });

      if (error) throw new Error(error);

      // Save to database
      const { error: saveError } = await window.ezsite.apis.tableCreate(74745, {
        dataset_type: datasetType,
        timerange_start: startDate,
        timerange_end: endDate,
        location: location,
        time_interval: timeInterval,
        num_customers: numCustomers,
        generation_parameters: JSON.stringify({
          seasonality: seasonality[0],
          noiseLevel: noiseLevel[0],
          timeInterval,
          numCustomers,
        }),
        data_points: JSON.stringify(data.dataPoints),
        created_at: new Date().toISOString(),
      });

      if (saveError) throw new Error(saveError);

      onGenerate(data);
      toast({
        title: 'Dataset Generated',
        description: `Successfully generated ${data.dataPoints.length} data points`,
      });
    } catch (err: any) {
      toast({
        title: 'Generation Failed',
        description: err.message || 'Failed to generate dataset',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Dataset</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dataset Type */}
        <div className="space-y-2">
          <Label>Dataset Type</Label>
          <Select value={datasetType} onValueChange={setDatasetType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="load_curve">Load Curve</SelectItem>
              <SelectItem value="weather">Weather Data</SelectItem>
              <SelectItem value="carbon_intensity">Carbon Intensity</SelectItem>
              <SelectItem value="prices">Electricity Prices</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            type="text"
            placeholder="e.g., San Francisco, CA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Time Interval */}
        <div className="space-y-2">
          <Label>Time Interval (minutes)</Label>
          <Select value={timeInterval.toString()} onValueChange={(v) => setTimeInterval(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="240">4 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Number of Customers/Sites */}
        <div className="space-y-2">
          <Label>Number of Customers/Sites</Label>
          <Input
            type="number"
            min="1"
            max="1000"
            value={numCustomers}
            onChange={(e) => setNumCustomers(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Generate data for multiple customers or sites (1-1000)
          </p>
        </div>

        {/* Seasonality */}
        <div className="space-y-2">
          <Label>Seasonality: {seasonality[0].toFixed(2)}</Label>
          <Slider
            value={seasonality}
            onValueChange={setSeasonality}
            min={0}
            max={1}
            step={0.05}
          />
          <p className="text-xs text-muted-foreground">
            Controls seasonal variation patterns in the data
          </p>
        </div>

        {/* Noise Level */}
        <div className="space-y-2">
          <Label>Noise Level: {noiseLevel[0].toFixed(2)}</Label>
          <Slider
            value={noiseLevel}
            onValueChange={setNoiseLevel}
            min={0}
            max={0.5}
            step={0.05}
          />
          <p className="text-xs text-muted-foreground">
            Adds realistic variability to the generated data
          </p>
        </div>

        {/* Generate Button */}
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Dataset'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}