
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, Building2, TrendingUp, Quote, Download, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CaseStudyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaseStudy();
  }, [slug]);

  const loadCaseStudy = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.run({
        path: 'resources/getResourceBySlug',
        methodName: 'getResourceBySlug',
        param: [slug]
      });

      if (error) throw new Error(error);
      if (!data || data.type !== 'case_study') {
        navigate('/resources');
        return;
      }
      setCaseStudy(data);
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
      </div>
    );
  }

  if (!caseStudy) return null;

  const formattedDate = new Date(caseStudy.publish_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseStudy.title,
    "description": caseStudy.excerpt,
    "image": caseStudy.featured_image,
    "datePublished": caseStudy.publish_date,
    "author": {
      "@type": "Organization",
      "name": "AI Energy Optimizer"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Energy Optimizer"
    }
  };

  return (
    <>
      <Helmet>
        <title>{caseStudy.title} - Case Study | AI Energy Optimizer</title>
        <meta name="description" content={caseStudy.meta_description || caseStudy.excerpt} />
        <meta property="og:title" content={caseStudy.title} />
        <meta property="og:description" content={caseStudy.excerpt} />
        <meta property="og:type" content="article" />
        {caseStudy.featured_image && <meta property="og:image" content={caseStudy.featured_image} />}
        <meta property="article:published_time" content={caseStudy.publish_date} />
        <link rel="canonical" href={`${window.location.origin}/resources/case-study/${slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/resources">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resources
              </Link>
            </Button>

            <div className="flex items-center gap-4 mb-4">
              <Badge>Case Study</Badge>
              {caseStudy.industry && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  {caseStudy.industry}
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{caseStudy.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{caseStudy.excerpt}</p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {caseStudy.read_time} min read
              </div>
              {caseStudy.author && (
                <div>By {caseStudy.author}</div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {caseStudy.featured_image && (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <img
              src={caseStudy.featured_image}
              alt={caseStudy.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Challenge */}
          {caseStudy.challenge && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <span className="text-red-500 text-xl">🎯</span>
                </div>
                The Challenge
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed whitespace-pre-line">{caseStudy.challenge}</p>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Solution */}
          {caseStudy.solution && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-500 text-xl">💡</span>
                </div>
                The Solution
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed whitespace-pre-line">{caseStudy.solution}</p>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Implementation */}
          {caseStudy.implementation && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <span className="text-purple-500 text-xl">⚙️</span>
                </div>
                Implementation
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed whitespace-pre-line">{caseStudy.implementation}</p>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Results & Metrics */}
          {caseStudy.results && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                Results & Impact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {caseStudy.results.metrics?.map((metric: any, idx: number) => (
                  <Card key={idx} className="bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                      <CardTitle className="text-4xl font-bold text-primary">{metric.value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{metric.label}</p>
                      {metric.description && (
                        <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              {caseStudy.results.summary && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-lg leading-relaxed">{caseStudy.results.summary}</p>
                  </CardContent>
                </Card>
              )}
            </section>
          )}

          {/* Testimonial */}
          {caseStudy.testimonial && (
            <section className="mb-12">
              <Card className="bg-gradient-to-br from-primary/5 via-blue-500/5 to-transparent border-2">
                <CardContent className="pt-6">
                  <Quote className="w-12 h-12 text-primary/20 mb-4" />
                  <blockquote className="text-xl italic leading-relaxed mb-6">
                    "{caseStudy.testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    {caseStudy.testimonial.avatar && (
                      <img
                        src={caseStudy.testimonial.avatar}
                        alt={caseStudy.testimonial.name}
                        className="w-16 h-16 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-lg">{caseStudy.testimonial.name}</p>
                      <p className="text-muted-foreground">{caseStudy.testimonial.title}</p>
                      <p className="text-sm text-muted-foreground">{caseStudy.testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          <Separator className="my-12" />

          {/* Download & CTA */}
          <section className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-8 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">Ready to Achieve Similar Results?</h2>
            <p className="text-lg mb-6 opacity-90">
              See how AI Energy Optimizer can transform your energy management
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {caseStudy.download_url && (
                <Button size="lg" variant="secondary" asChild>
                  <a href={caseStudy.download_url} download>
                    <Download className="mr-2 w-5 h-5" />
                    Download PDF
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/onboarding">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
