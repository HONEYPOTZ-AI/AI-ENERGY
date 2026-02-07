import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function GenerateBlogPostsPage() {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('openai');
  const [author, setAuthor] = useState('AI Energy Optimizer Team');
  const [customTopics, setCustomTopics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your OpenAI or Anthropic API key',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedCount(0);
    setTotalCount(5);

    try {
      // Parse custom topics if provided
      const topicArray = customTopics.
      split('\n').
      map((t) => t.trim()).
      filter((t) => t.length > 0);

      // Generate articles using backend
      const { data, error } = await window.ezsite.apis.run({
        path: 'blog/generateAIBlogPosts',
        methodName: 'generateAIBlogPosts',
        param: [apiKey, provider, topicArray, author]
      });

      if (error) {
        throw new Error(error);
      }

      // Save each article to database
      const tableId = 74747; // blog_posts table ID
      let savedCount = 0;

      for (const article of data.articles) {
        const { error: saveError } = await window.ezsite.apis.tableCreate(tableId, article);

        if (saveError) {
          console.error(`Failed to save article: ${article.title}`, saveError);
          toast({
            title: 'Partial Success',
            description: `Saved ${savedCount} of ${data.articles.length} articles. Some articles failed to save.`,
            variant: 'destructive'
          });
          break;
        }

        savedCount++;
        setGeneratedCount(savedCount);
      }

      if (savedCount === data.articles.length) {
        toast({
          title: 'Success! 🎉',
          description: `Generated and saved ${savedCount} SEO-optimized blog articles!`
        });

        // Reset form
        setApiKey('');
        setCustomTopics('');
      }

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

  return (
    <>
      <Helmet>
        <title>Generate AI Blog Posts - AI Energy Optimizer</title>
        <meta name="description" content="Generate SEO-optimized blog articles using AI" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Blog Generator
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              Generate 5 SEO-optimized blog articles about AI energy optimization and sustainability
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Set up your AI provider and customize the article generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Provider Selection */}
              <div className="space-y-2">
                <Label htmlFor="provider">AI Provider</Label>
                <Select value={provider} onValueChange={setProvider} disabled={isGenerating}>
                  <SelectTrigger id="provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <Label htmlFor="apiKey">
                  API Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder={provider === 'openai' ? 'sk-proj-...' : 'sk-ant-...'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isGenerating} />

                <p className="text-xs text-slate-500">
                  Your API key is only used for this session and never stored
                </p>
              </div>

              {/* Author Name */}
              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  placeholder="AI Energy Optimizer Team"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  disabled={isGenerating} />

              </div>

              {/* Custom Topics */}
              <div className="space-y-2">
                <Label htmlFor="topics">Custom Topics (Optional)</Label>
                <Textarea
                  id="topics"
                  placeholder="Enter up to 5 custom topics (one per line)&#10;Leave empty to use default topics about:&#10;• AI Energy Forecasting&#10;• Carbon Reduction&#10;• ESG Reporting&#10;• Smart Energy Management&#10;• Renewable Energy AI"
                  value={customTopics}
                  onChange={(e) => setCustomTopics(e.target.value)}
                  disabled={isGenerating}
                  rows={6}
                  className="resize-none" />

                <p className="text-xs text-slate-500">
                  One topic per line. If you provide fewer than 5, default topics will be used for the rest.
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
                    Generate 5 Blog Articles
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
        </div>
      </div>
    </>);

}