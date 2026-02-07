import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  canonicalUrl?: string;
  schema?: object;
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=630&fit=crop',
  canonicalUrl,
  schema
}: SEOHeadProps) {
  const siteUrl = window.location.origin;
  const fullUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : window.location.href;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Schema.org structured data */}
      {schema &&
      <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      }
    </Helmet>);

}