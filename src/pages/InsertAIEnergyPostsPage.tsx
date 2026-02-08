import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InsertAIEnergyPostsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [insertedPosts, setInsertedPosts] = useState<string[]>([]);

  const handleInsertPosts = async () => {
    setLoading(true);
    setSuccess(false);
    setInsertedPosts([]);

    try {
      // Call backend function to get blog posts data
      const { data: blogPosts, error: generateError } = await window.ezsite.apis.run({
        path: "blog/insertAIEnergyPosts",
        methodName: "insertAIEnergyPosts",
        param: []
      });

      if (generateError) {
        throw new Error(generateError);
      }

      if (!blogPosts || blogPosts.length === 0) {
        throw new Error('No blog posts were generated');
      }

      // Insert each blog post into the database
      const BLOG_TABLE_ID = 74747;
      const titles: string[] = [];

      for (const post of blogPosts) {
        const { error: insertError } = await window.ezsite.apis.tableCreate(BLOG_TABLE_ID, post);

        if (insertError) {
          throw new Error(`Failed to insert post "${post.title}": ${insertError}`);
        }

        titles.push(post.title);
      }

      setInsertedPosts(titles);
      setSuccess(true);

      toast({
        title: "Success!",
        description: `Successfully inserted ${blogPosts.length} AI Energy blog posts into the database.`
      });

    } catch (error) {
      console.error('Error inserting blog posts:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to insert blog posts',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Insert AI Energy Blog Posts - AI Energy Optimizer</title>
        <meta name="description" content="Insert new AI Energy blog posts into the database" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Insert AI Energy Blog Posts
              </h1>
              <p className="text-lg text-slate-600">
                Generate and insert 5 high-quality blog posts about AI Energy use cases and future trends
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">What will be created:</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>5 comprehensive blog posts (500-800 words each)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Topics: AI Energy forecasting, carbon reduction, renewable integration, smart grids, and future trends</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Publication dates: Within the last 7 days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Categories: "Use Cases" and "Future of AI Energy"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>SEO-optimized with featured images</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleInsertPosts}
                  disabled={loading || success}
                  size="lg"
                  className="px-8 py-6 text-lg">

                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {success && <CheckCircle2 className="mr-2 h-5 w-5" />}
                  {loading ? 'Inserting Posts...' : success ? 'Posts Inserted Successfully' : 'Insert Blog Posts'}
                </Button>
              </div>

              {success && insertedPosts.length > 0 &&
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-900">Successfully Inserted Posts:</h3>
                  </div>
                  <ul className="space-y-2">
                    {insertedPosts.map((title, index) =>
                  <li key={index} className="text-green-800 flex items-start">
                        <span className="mr-2">{index + 1}.</span>
                        <span>{title}</span>
                      </li>
                  )}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <a
                    href="/blog"
                    className="text-green-700 hover:text-green-800 font-medium inline-flex items-center">

                      View all blog posts →
                    </a>
                  </div>
                </div>
              }

              {!success &&
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1">Note:</h3>
                      <p className="text-amber-800 text-sm">
                        This will insert 5 new blog posts into your database. 
                        Make sure you have the necessary permissions to create blog posts.
                      </p>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>);

}