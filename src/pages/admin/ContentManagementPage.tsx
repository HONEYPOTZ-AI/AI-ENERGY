import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle2, AlertCircle, Clock, ExternalLink, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SiteNavigation from '@/components/SiteNavigation';

export default function ContentManagementPage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [generatedArticles, setGeneratedArticles] = useState<Array<{slug: string;title: string;}>>([]);
  const totalCount = 5;

  // Check if user is administrator
  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: userInfo, error } = await window.ezsite.apis.getUserInfo();

      if (error || !userInfo) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access this page',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }

      // Check if user has Administrator role
      const roles = userInfo.Roles?.split(',') || [];
      if (!roles.includes('Administrator')) {
        toast({
          title: 'Access Denied',
          description: 'This page is only accessible to administrators',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }

      setIsCheckingAuth(false);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/');
    }
  };

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your OpenAI API key',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedCount(0);
    setGeneratedArticles([]);

    try {
      // Generate articles using backend
      const { data, error } = await window.ezsite.apis.run({
        path: 'blog/generateAIBlogPosts',
        methodName: 'generateAIBlogPosts',
        param: [apiKey, 'openai', [], 'AI Energy Optimizer Team']
      });

      if (error) {
        throw new Error(error);
      }

      // Save each article to database
      const tableId = 74747; // blog_posts table ID
      let savedCount = 0;
      const savedArticles: Array<{slug: string;title: string;}> = [];

      for (const article of data.articles) {
        const { error: saveError } = await window.ezsite.apis.tableCreate(tableId, article);

        if (saveError) {
          console.error(`Failed to save article: ${article.title}`, saveError);
          throw new Error(`Failed to save article: ${article.title}`);
        }

        savedCount++;
        setGeneratedCount(savedCount);
        savedArticles.push({ slug: article.slug, title: article.title });
      }

      setGeneratedArticles(savedArticles);

      toast({
        title: 'Success! 🎉',
        description: `Generated and saved ${savedCount} SEO-optimized blog articles!`
      });

      // Clear API key for security
      setApiKey('');

    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate blog posts',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>);

  }

  return (
    <>
      <Helmet>
        <title>Content Management - AI Energy Optimizer</title>
        <meta name="description" content="Admin content management and blog generation" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <SiteNavigation />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Content Management
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              Administrator tools for generating and managing blog content
            </p>
          </div>

          {/* Scheduling Reminder */}
          <Alert className="border-amber-200 bg-amber-50">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900">Daily Content Generation Reminder</AlertTitle>
            <AlertDescription className="text-amber-800">
              <p className="mb-2">
                For optimal blog freshness and SEO performance, consider running this tool daily or setting up a scheduled task.
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Recommended: Generate 5 new articles daily</li>
                <li>Best time: Run during off-peak hours (e.g., early morning)</li>
                <li>Tip: Keep your OpenAI API key handy for quick generation</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Generation Card */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Generate AI Blog Posts</CardTitle>
              <CardDescription>
                Create 5 SEO-optimized articles about AI energy optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Key Input */}
              <div className="space-y-2">
                <Label htmlFor="apiKey">
                  OpenAI API Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-proj-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isGenerating} />

                <p className="text-xs text-slate-500">
                  Your API key is only used for this session and never stored
                </p>
              </div>

              {/* Progress Indicator */}
              {isGenerating &&
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Generating articles... {generatedCount} of {totalCount}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${generatedCount / totalCount * 100}%` }} />

                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    This may take 1-2 minutes. Please don't close this page.
                  </p>
                </div>
              }

              {/* Success Message with Links */}
              {!isGenerating && generatedArticles.length > 0 &&
              <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-900">Successfully Generated {generatedArticles.length} Articles!</AlertTitle>
                  <AlertDescription className="text-green-800">
                    <p className="mb-3">View your newly generated articles:</p>
                    <div className="space-y-2">
                      {generatedArticles.map((article, index) =>
                    <Link
                      key={index}
                      to={`/blog/${article.slug}`}
                      className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 hover:underline">

                          <ExternalLink className="w-3 h-3" />
                          {article.title}
                        </Link>
                    )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <Link to="/blog" className="text-sm font-medium text-green-700 hover:text-green-900 hover:underline">
                        View All Blog Posts →
                      </Link>
                    </div>
                  </AlertDescription>
                </Alert>
              }

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !apiKey}
                className="w-full h-12 text-lg"
                size="lg">

                {isGenerating ?
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Articles...
                  </> :

                <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate 5 Articles
                  </>
                }
              </Button>

              {/* Info Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  What will be generated:
                </h4>
                <ul className="text-sm text-slate-600 space-y-1 ml-6 list-disc">
                  <li>5 unique, high-quality articles (800-1200 words each)</li>
                  <li>SEO-optimized titles and meta descriptions</li>
                  <li>Relevant categories and tags</li>
                  <li>Proper URL slugs and reading time estimates</li>
                  <li>HTML-formatted content with headings and structure</li>
                  <li>Automatic publication dates (staggered over last 30 days)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Additional Admin Links */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Other admin tools and pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/blog" className="block p-2 hover:bg-slate-100 rounded-md transition-colors">
                <span className="font-medium">View All Blog Posts</span>
                <p className="text-sm text-slate-600">Browse and manage published articles</p>
              </Link>
              <Link to="/admin/seed-blog" className="block p-2 hover:bg-slate-100 rounded-md transition-colors">
                <span className="font-medium">Seed Blog Data</span>
                <p className="text-sm text-slate-600">Create sample blog posts for testing</p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>);

}