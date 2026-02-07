import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataGeneratorForm from '@/components/data-generator/DataGeneratorForm';
import DataVisualization from '@/components/data-generator/DataVisualization';
import DatasetManagement from '@/components/data-generator/DatasetManagement';

export default function DataGeneratorPage() {
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerate = (data: any) => {
    setGeneratedData(data);
    setRefreshKey((prev) => prev + 1);
  };

  const handleView = (data: any) => {
    setGeneratedData(data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-gray-100">Synthetic Data Generator</h1>
          <p className="text-muted-foreground dark:text-gray-300 mt-2">
            Generate realistic synthetic datasets for testing and development
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DataGeneratorForm onGenerate={handleGenerate} />
          </div>
          <div className="lg:col-span-2">
            <DataVisualization data={generatedData} />
          </div>
        </div>

        <DatasetManagement onView={handleView} refreshTrigger={refreshKey} />
      </div>
    </DashboardLayout>);

}