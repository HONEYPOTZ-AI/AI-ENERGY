import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  category: string;
  tags: string;
  author: string;
  published_date: string;
  reading_time: number;
  seo_title: string;
  seo_description: string;
  views: number;
}

const BLOG_TABLE_ID = 74747; // Update this with actual table ID after creation

export default function BlogDetailPage() {
  const { slug } = useParams<{slug: string;}>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setLoading(true);

      const { data, error } = await window.ezsite.apis.tablePage(BLOG_TABLE_ID, {
        PageNo: 1,
        PageSize: 1,
        OrderByField: 'id',
        IsAsc: false,
        Filters: [
        { name: 'slug', op: 'Equal', value: postSlug },
        { name: 'is_published', op: 'Equal', value: true }]

      });

      if (error) throw new Error(error);

      if (data?.List && data.List.length > 0) {
        const postData = data.List[0];
        setPost(postData);

        // Increment views
        await incrementViews(postData.id, postData.views);

        // Load related posts
        loadRelatedPosts(postData.category, postData.id);
      } else {
        throw new Error('Post not found');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load blog post',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (postId: number, currentViews: number) => {
    try {
      await window.ezsite.apis.tableUpdate(BLOG_TABLE_ID, {
        ID: postId,
        views: currentViews + 1
      });
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  const loadRelatedPosts = async (category: string, excludeId: number) => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(BLOG_TABLE_ID, {
        PageNo: 1,
        PageSize: 4,
        OrderByField: 'published_date',
        IsAsc: false,
        Filters: [
        { name: 'category', op: 'Equal', value: category },
        { name: 'is_published', op: 'Equal', value: true }]

      });

      if (error) throw new Error(error);

      if (data?.List) {
        const filtered = data.List.filter((p: any) => p.id !== excludeId).slice(0, 3);
        setRelatedPosts(filtered);
      }
    } catch (error) {
      console.error('Failed to load related posts:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>);

  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>);

  }

  const tags = post.tags ? post.tags.split(',').map((t) => t.trim()) : [];
  const seoTitle = post.seo_title || post.title;
  const seoDescription = post.seo_description || post.excerpt;
  const publishedDate = new Date(post.published_date);
  const canonicalUrl = `${window.location.origin}/blog/${post.slug}`;

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image,
    "datePublished": post.published_date,
    "dateModified": post.published_date,
    "author": {
      "@type": "Person",
      "name": post.author
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
        <title>{seoTitle} - AI ENERGY Optimizer</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={post.featured_image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {tags.map((tag) =>
        <meta key={tag} property="article:tag" content={tag} />
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={post.featured_image} />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <article className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-8">
          <Link to="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <header className="container mx-auto px-4 py-8 max-w-4xl">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.published_date}>
                {format(publishedDate, 'MMMM d, yyyy')}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time} min read</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg mb-8 aspect-video">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover" />

          </div>
        </header>

        {/* Article Content */}
        <div className="container mx-auto px-4 max-w-4xl">
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }} />


          {/* Tags */}
          {tags.length > 0 &&
          <>
              <Separator className="my-8" />
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {tags.map((tag) =>
              <Badge key={tag} variant="outline">{tag}</Badge>
              )}
              </div>
            </>
          }

          {/* Related Posts */}
          <RelatedPosts posts={relatedPosts} />
        </div>
      </article>
    </>);

}