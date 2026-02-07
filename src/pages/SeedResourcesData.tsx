
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { seedResourcesData } from '@/utils/seedResourcesData';
import { toast } from '@/hooks/use-toast';

export default function SeedResourcesData() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    try {
      setLoading(true);
      await seedResourcesData();
      toast({
        title: 'Success',
        description: 'Resources data seeded successfully!'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Seed Resources Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Click the button below to populate the database with sample resources (case studies and white papers).</p>
          <Button onClick={handleSeed} disabled={loading}>
            {loading ? 'Seeding...' : 'Seed Resources Data'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
