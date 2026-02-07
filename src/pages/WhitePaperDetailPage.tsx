
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, Download, FileText, ArrowRight, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function WhitePaperDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [whitePaper, setWhitePaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWhitePaper();
  }, [slug]);

  const loadWhitePaper = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.run({
        path: 'resources/getResourceBySlug',
        methodName: 'getResourceBySlug',
        param: [slug]
      });

      if (error) throw new Error(error);
      if (!data || data.type !== 'white_paper') {
        navigate('/resources');
        return;
      }
      setWhitePaper(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      navigate('/resources');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>);

  }

  if (!whitePaper) return null;

  const formattedDate = new Date(whitePaper.publish_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": whitePaper.title,
    "description": whitePaper.excerpt,
    "image": whitePaper.featured_image,
    "datePublished": whitePaper.publish_date,
    "author": {
      "@type": "Organization",
      "name": "AI Energy Optimizer"
    }
  };

  return (
    <>
      <Helmet>
        <title>{whitePaper.title} - White Paper | AI Energy Optimizer</title>
        <meta name="description" content={whitePaper.meta_description || whitePaper.excerpt} />
        <meta property="og:title" content={whitePaper.title} />
        <meta property="og:description" content={whitePaper.excerpt} />
        <meta property="og:type" content="article" />
        {whitePaper.featured_image && <meta property="og:image" content={whitePaper.featured_image} />}
        <link rel="canonical" href={`${window.location.origin}/resources/white-paper/${slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/resources">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resources
              </Link>
            </Button>

            <div className="flex items-center gap-4 mb-4">
              <Badge className="bg-blue-500">White Paper</Badge>
              {whitePaper.industry && <Badge variant="outline">{whitePaper.industry}</Badge>}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{whitePaper.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{whitePaper.excerpt}</p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {whitePaper.read_time} min read
              </div>
              {whitePaper.author && <div>By {whitePaper.author}</div>}
            </div>

            {whitePaper.download_url &&
            <Button size="lg" asChild>
                <a href={whitePaper.download_url} download>
                  <Download className="mr-2 w-5 h-5" />
                  Download PDF
                </a>
              </Button>
            }
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Sidebar */}
            {whitePaper.toc && whitePaper.toc.length > 0 &&
            <aside className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="w-5 h-5" />
                      Table of Contents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      {whitePaper.toc.map((item: any, idx: number) =>
                    <a
                      key={idx}
                      href={`#section-${idx}`}
                      className="block text-sm hover:text-primary transition-colors py-1">

                          {item.title}
                        </a>
                    )}
                    </nav>
                  </CardContent>
                </Card>
              </aside>
            }

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Executive Summary */}
              {whitePaper.executive_summary &&
              <section>
                  <Card className="bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-2xl">Executive Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg leading-relaxed whitespace-pre-line">
                        {whitePaper.executive_summary}
                      </p>
                    </CardContent>
                  </Card>
                </section>
              }

              {/* Content Sections */}
              {whitePaper.content && whitePaper.content.sections &&
              <>
                  {whitePaper.content.sections.map((section: any, idx: number) =>
                <section key={idx} id={`section-${idx}`}>
                      <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                      
                      {section.content &&
                  <Card className="mb-4">
                          <CardContent className="pt-6">
                            <div className="prose prose-lg max-w-none">
                              <p className="whitespace-pre-line leading-relaxed">{section.content}</p>
                            </div>
                          </CardContent>
                        </Card>
                  }

                      {section.subsections && section.subsections.map((subsection: any, subIdx: number) =>
                  <div key={subIdx} className="mb-6">
                          <h3 className="text-2xl font-semibold mb-3 ml-4">{subsection.title}</h3>
                          <Card>
                            <CardContent className="pt-6">
                              <div className="prose max-w-none">
                                <p className="whitespace-pre-line leading-relaxed">{subsection.content}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                  )}

                      {section.key_points && section.key_points.length > 0 &&
                  <Card className="bg-blue-50 dark:bg-blue-950/20 mt-4">
                          <CardContent className="pt-6">
                            <h4 className="font-semibold mb-3">Key Points:</h4>
                            <ul className="space-y-2">
                              {section.key_points.map((point: string, pointIdx: number) =>
                        <li key={pointIdx} className="flex items-start gap-2">
                                  <span className="text-primary mt-1">▪</span>
                                  <span>{point}</span>
                                </li>
                        )}
                            </ul>
                          </CardContent>
                        </Card>
                  }
                    </section>
                )}
                </>
              }

              {/* Conclusion */}
              {whitePaper.content?.conclusion &&
              <section>
                  <h2 className="text-3xl font-bold mb-4">Conclusion</h2>
                  <Card className="bg-gradient-to-br from-green-500/5 to-transparent border-2 border-green-500/20">
                    <CardContent className="pt-6">
                      <p className="text-lg leading-relaxed whitespace-pre-line">
                        {whitePaper.content.conclusion}
                      </p>
                    </CardContent>
                  </Card>
                </section>
              }

              <Separator className="my-8" />

              {/* CTA Section */}
              <Card className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
                <CardContent className="pt-6 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-4">Put These Insights Into Action</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Start optimizing your energy management with AI today
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {whitePaper.download_url &&
                    <Button size="lg" variant="secondary" asChild>
                        <a href={whitePaper.download_url} download>
                          <Download className="mr-2 w-5 h-5" />
                          Download PDF
                        </a>
                      </Button>
                    }
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                      asChild>

                      <Link to="/onboarding">
                        Get Started
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>);

}