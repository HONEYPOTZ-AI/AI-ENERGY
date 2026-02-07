import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { sampleBlogPosts } from '@/utils/seedBlogData';

const BLOG_TABLE_ID = 74747;

export default function SeedBlogData() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const seedData = async () => {
    setIsSeeding(true);
    setResults({ success: 0, failed: 0 });
    setIsComplete(false);

    let successCount = 0;
    let failCount = 0;

    for (const post of sampleBlogPosts) {
      try {
        const { error } = await window.ezsite.apis.tableCreate(BLOG_TABLE_ID, post);
        
        if (error) {
          console.error(`Failed to create post: ${post.title}`, error);
          failCount++;
        } else {
          successCount++;
        }
        
        setResults({ success: successCount, failed: failCount });
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error: any) {
        console.error(`Error creating post: ${post.title}`, error);
        failCount++;
        setResults({ success: successCount, failed: failCount });
      }
    }

    setIsSeeding(false);
    setIsComplete(true);

    if (failCount === 0) {
      toast({
        title: 'Blog Data Seeded Successfully!',
        description: `${successCount} blog posts have been created.`
      });
    } else {
      toast({
        title: 'Seeding Completed with Errors',
        description: `Success: ${successCount}, Failed: ${failCount}`,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Blog Data Seeder</CardTitle>
          <CardDescription>
            This utility will populate the blog with 6 sample articles about AI energy optimization.
            Run this once to create initial blog content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Sample Articles to be Created:</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
              {sampleBlogPosts.map((post, idx) => (
                <li key={idx}>{post.title}</li>
              ))}
            </ul>
          </div>

          {isSeeding && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <div>
                  <p className="font-medium">Seeding blog data...</p>
                  <p className="text-sm text-muted-foreground">
                    Progress: {results.success} succeeded, {results.failed} failed
                  </p>
                </div>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                {results.failed === 0 ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        Successfully created {results.success} blog posts!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        You can now visit the blog at /blog
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-900 dark:text-orange-100">
                        Completed with some errors
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        Success: {results.success}, Failed: {results.failed}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={seedData}
              disabled={isSeeding}
              className="flex-1"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Seeding Data...
                </>
              ) : (
                'Seed Blog Data'
              )}
            </Button>
            
            {isComplete && (
              <Button
                variant="outline"
                onClick={() => window.location.href = '/blog'}
              >
                Go to Blog
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Note: This should only be run once. Running it multiple times will create duplicate posts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}