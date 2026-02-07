import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader2, Play } from 'lucide-react';

interface OptimizationConfigProps {
  onRunOptimization: (config: any) => Promise<void>;
  isLoading: boolean;
}

export default function OptimizationConfig({ onRunOptimization, isLoading }: OptimizationConfigProps) {
  const [objective, setObjective] = useState<string>('cost');
  const [timeHorizon, setTimeHorizon] = useState<string>('24h');
  const [maxLoad, setMaxLoad] = useState<number>(1000);
  const [renewableTarget, setRenewableTarget] = useState<number>(30);
  const [demandResponse, setDemandResponse] = useState<boolean>(true);
  const [location, setLocation] = useState<string>('region-1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const config = {
      objective,
      timeHorizon,
      constraints: {
        maxLoad,
        renewableTarget,
        demandResponse
      },
      location
    };

    await onRunOptimization(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimization Configuration</CardTitle>
        <CardDescription>Configure your optimization parameters and constraints</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Objective Selector */}
          <div className="space-y-2">
            <Label htmlFor="objective">Optimization Objective</Label>
            <Select value={objective} onValueChange={setObjective}>
              <SelectTrigger id="objective">
                <SelectValue placeholder="Select objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cost">Minimize Cost</SelectItem>
                <SelectItem value="co2">Reduce CO₂ Emissions</SelectItem>
                <SelectItem value="hybrid">Hybrid (Cost + Emissions)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Horizon */}
          <div className="space-y-2">
            <Label htmlFor="timeHorizon">Time Horizon</Label>
            <Select value={timeHorizon} onValueChange={setTimeHorizon}>
              <SelectTrigger id="timeHorizon">
                <SelectValue placeholder="Select time horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Next 24 Hours</SelectItem>
                <SelectItem value="weekly">Next Week (168 hours)</SelectItem>
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
              placeholder="e.g., region-1" />

          </div>

          {/* Constraints Section */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-4">Constraints</h3>
            
            <div className="space-y-4">
              {/* Max Load */}
              <div className="space-y-2">
                <Label htmlFor="maxLoad">Maximum Load (kW)</Label>
                <Input
                  id="maxLoad"
                  type="number"
                  value={maxLoad}
                  onChange={(e) => setMaxLoad(Number(e.target.value))}
                  min={0}
                  step={10} />

              </div>

              {/* Renewable Target */}
              <div className="space-y-2">
                <Label htmlFor="renewableTarget">Renewable Energy Target (%)</Label>
                <Input
                  id="renewableTarget"
                  type="number"
                  value={renewableTarget}
                  onChange={(e) => setRenewableTarget(Number(e.target.value))}
                  min={0}
                  max={100}
                  step={1} />

              </div>

              {/* Demand Response */}
              <div className="flex items-center justify-between">
                <Label htmlFor="demandResponse" className="cursor-pointer">
                  Enable Demand Response
                </Label>
                <Switch
                  id="demandResponse"
                  checked={demandResponse}
                  onCheckedChange={setDemandResponse} />

              </div>
            </div>
          </div>

          {/* Run Button */}
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ?
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Optimization...
              </> :

            <>
                <Play className="mr-2 h-4 w-4" />
                Run Optimization
              </>
            }
          </Button>
        </form>
      </CardContent>
    </Card>);

}