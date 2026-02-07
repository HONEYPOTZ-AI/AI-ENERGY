import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, Play } from 'lucide-react';

interface OptimizationConfigProps {
  onRunOptimization: (config: any) => Promise<void>;
  isLoading: boolean;
}

export default function OptimizationConfig({ onRunOptimization, isLoading }: OptimizationConfigProps) {
  const [optimizationType, setOptimizationType] = useState<string>('cost_minimization');
  const [timeHorizon, setTimeHorizon] = useState<number>(24);
  const [storageCapacity, setStorageCapacity] = useState<number>(500);
  const [maxChargeRate, setMaxChargeRate] = useState<number>(100);
  const [maxDischargeRate, setMaxDischargeRate] = useState<number>(100);
  const [gridCapacity, setGridCapacity] = useState<number>(1000);
  const [renewableCapacity, setRenewableCapacity] = useState<number>(300);
  const [location, setLocation] = useState<string>('region-1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const config = {
      optimizationType,
      timeHorizon,
      storageCapacity,
      maxChargeRate,
      maxDischargeRate,
      gridCapacity,
      renewableCapacity,
      location
    };

    await onRunOptimization(config);
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-gray-100">Optimization Configuration</CardTitle>
        <CardDescription className="dark:text-gray-300">Configure your optimization parameters and constraints</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Optimization Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="optimizationType">Optimization Type</Label>
            <Select value={optimizationType} onValueChange={setOptimizationType}>
              <SelectTrigger id="optimizationType">
                <SelectValue placeholder="Select optimization type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cost_minimization">Cost Minimization</SelectItem>
                <SelectItem value="carbon_reduction">Carbon Reduction</SelectItem>
                <SelectItem value="peak_shaving">Peak Shaving</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Horizon */}
          <div className="space-y-2">
            <Label htmlFor="timeHorizon">Time Horizon (hours)</Label>
            <Select value={String(timeHorizon)} onValueChange={(v) => setTimeHorizon(Number(v))}>
              <SelectTrigger id="timeHorizon">
                <SelectValue placeholder="Select time horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 hours (1 day)</SelectItem>
                <SelectItem value="168">168 hours (1 week)</SelectItem>
                <SelectItem value="720">720 hours (1 month)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., region-1"
            />
          </div>

          {/* Storage Configuration Section */}
          <div className="pt-4 border-t dark:border-gray-700">
            <h3 className="text-sm font-medium mb-4 dark:text-gray-200">Energy Storage Configuration</h3>
            
            <div className="space-y-4">
              {/* Storage Capacity */}
              <div className="space-y-2">
                <Label htmlFor="storageCapacity">Storage Capacity (kWh)</Label>
                <Input
                  id="storageCapacity"
                  type="number"
                  value={storageCapacity}
                  onChange={(e) => setStorageCapacity(Number(e.target.value))}
                  min={0}
                  step={10}
                />
              </div>

              {/* Max Charge Rate */}
              <div className="space-y-2">
                <Label htmlFor="maxChargeRate">Max Charge Rate (kW)</Label>
                <Input
                  id="maxChargeRate"
                  type="number"
                  value={maxChargeRate}
                  onChange={(e) => setMaxChargeRate(Number(e.target.value))}
                  min={0}
                  step={10}
                />
              </div>

              {/* Max Discharge Rate */}
              <div className="space-y-2">
                <Label htmlFor="maxDischargeRate">Max Discharge Rate (kW)</Label>
                <Input
                  id="maxDischargeRate"
                  type="number"
                  value={maxDischargeRate}
                  onChange={(e) => setMaxDischargeRate(Number(e.target.value))}
                  min={0}
                  step={10}
                />
              </div>
            </div>
          </div>

          {/* Grid and Renewable Configuration */}
          <div className="pt-4 border-t dark:border-gray-700">
            <h3 className="text-sm font-medium mb-4 dark:text-gray-200">Grid & Renewable Configuration</h3>
            
            <div className="space-y-4">
              {/* Grid Capacity */}
              <div className="space-y-2">
                <Label htmlFor="gridCapacity">Grid Connection Capacity (kW)</Label>
                <Input
                  id="gridCapacity"
                  type="number"
                  value={gridCapacity}
                  onChange={(e) => setGridCapacity(Number(e.target.value))}
                  min={0}
                  step={10}
                />
              </div>

              {/* Renewable Capacity */}
              <div className="space-y-2">
                <Label htmlFor="renewableCapacity">Renewable Generation Capacity (kW)</Label>
                <Input
                  id="renewableCapacity"
                  type="number"
                  value={renewableCapacity}
                  onChange={(e) => setRenewableCapacity(Number(e.target.value))}
                  min={0}
                  step={10}
                />
              </div>
            </div>
          </div>

          {/* Run Button */}
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Optimization...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Optimization
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
