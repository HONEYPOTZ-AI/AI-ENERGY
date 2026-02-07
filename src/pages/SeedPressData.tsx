import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Newspaper } from 'lucide-react';
import { seedPressReleases } from '@/utils/seedPressData';
import { toast } from '@/hooks/use-toast';

export default function SeedPressData() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSeed = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const seedResults = await seedPressReleases();
      setResults(seedResults);
      
      const successCount = seedResults.filter(r => r.success).length;
      const failCount = seedResults.length - successCount;
      
      toast({
        title: 'Seeding Complete',
        description: `${successCount} press releases created successfully${failCount > 0 ? `, ${failCount} failed` : ''}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to seed press releases',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Newspaper className="w-6 h-6" />
              <CardTitle>Seed Press Release Data</CardTitle>
            </div>
            <CardDescription>
              Generate sample press releases for the press section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">This will create:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Platform Launch Announcement</li>
                <li>Feature Update Press Release</li>
                <li>Partnership Announcement</li>
                <li>Industry Recognition News</li>
              </ul>
            </div>

            <Button 
              onClick={handleSeed} 
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Seeding Press Releases...' : 'Seed Press Releases'}
            </Button>

            {results.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Results:</h3>
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 rounded border"
                  >
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{result.title}</p>
                      {result.error && (
                        <p className="text-xs text-red-500">{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}