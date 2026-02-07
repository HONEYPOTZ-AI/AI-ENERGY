import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, MapPin, ArrowLeft, Newspaper } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import SocialShare from '@/components/press/SocialShare';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const PRESS_TABLE_ID = 74748;

interface PressRelease {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  release_date: string;
  location: string;
  featured_image: string;
}

export default function PressDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [release, setRelease] = useState<PressRelease | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadRelease(slug);
    }
  }, [slug]);

  const loadRelease = async (releaseSlug: string) => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage(PRESS_TABLE_ID, {
        PageNo: 1,
        PageSize: 1,
        OrderByField: 'id',
        IsAsc: false,
        Filters: [
          { name: 'slug', op: 'Equal', value: releaseSlug },
          { name: 'is_published', op: 'Equal', value: true }
        ]
      });

      if (error) throw new Error(error);

      if (data?.List && data.List.length > 0) {
        setRelease(data.List[0]);
      } else {
        throw new Error('Press release not found');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load press release',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!release) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Press Release Not Found</h1>
        <Link to="/press">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Press Releases
          </Button>
        </Link>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    launch: 'Product Launch',
    feature: 'Feature Update',
    partnership: 'Partnership',
    recognition: 'Industry Recognition',
    general: 'General'
  };

  const canonicalUrl = `${window.location.origin}/press/${release.slug}`;
  const releaseDate = new Date(release.release_date);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": release.title,
    "description": release.summary,
    "image": release.featured_image,
    "datePublished": release.release_date,
    "dateModified": release.release_date,
    "author": {
      "@type": "Organization",
      "name": "AI ENERGY Optimizer"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI ENERGY Optimizer",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  return (
    <>
      <Helmet>
        <title>{release.title} - AI ENERGY Optimizer Press Release</title>
        <meta name="description" content={release.summary} />
        <link rel="canonical" href={canonicalUrl} />
        
        <meta property="og:title" content={release.title} />
        <meta property="og:description" content={release.summary} />
        <meta property="og:image" content={release.featured_image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={release.title} />
        <meta name="twitter:description" content={release.summary} />
        <meta name="twitter:image" content={release.featured_image} />
        
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background print:p-8">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Newspaper className="w-6 h-6 text-primary" />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                AI ENERGY Optimizer
              </span>
            </Link>
          </div>
        </header>

        {/* Back Button */}
        <div className="container mx-auto px-4 pt-8 print:hidden">
          <Link to="/press">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Press Releases
            </Button>
          </Link>
        </div>

        {/* Press Release Content */}
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header Section */}
          <header className="mb-8">
            <Badge className="mb-4">{categoryLabels[release.category]}</Badge>
            
            {/* Dateline */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="font-semibold">{release.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={release.release_date}>
                  {format(releaseDate, 'MMMM d, yyyy')}
                </time>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {release.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {release.summary}
            </p>
          </header>

          {/* Featured Image */}
          {release.featured_image && (
            <div className="relative overflow-hidden rounded-lg mb-8 aspect-video">
              <img
                src={release.featured_image}
                alt={release.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Main Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none mb-12 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: release.content }}
          />

          <Separator className="my-8" />

          {/* Boilerplate */}
          <Card className="mb-8 print:border-2">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-3">About AI ENERGY Optimizer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI ENERGY Optimizer is revolutionizing energy management through cutting-edge artificial 
                intelligence and machine learning technologies. Founded in 2024, our platform empowers 
                utilities and enterprises to make data-driven decisions, optimize energy consumption, 
                and accelerate the transition to sustainable energy systems. With advanced forecasting 
                capabilities, real-time optimization algorithms, and comprehensive ESG reporting, 
                AI ENERGY Optimizer is helping organizations achieve their energy efficiency and 
                sustainability goals while reducing operational costs.
              </p>
            </CardContent>
          </Card>

          {/* Media Contact */}
          <Card className="mb-8 print:border-2">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-3">Media Contact</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Company:</strong> AI ENERGY Optimizer</p>
                <p><strong>Email:</strong> press@aienergyoptimizer.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Website:</strong> www.aienergyoptimizer.com</p>
              </div>
            </CardContent>
          </Card>

          {/* Social Share */}
          <div className="print:hidden">
            <SocialShare 
              title={release.title} 
              url={canonicalUrl}
              description={release.summary}
            />
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
}