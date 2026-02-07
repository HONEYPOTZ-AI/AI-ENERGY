import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Newspaper, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PressCard from '@/components/press/PressCard';
import PressKit from '@/components/press/PressKit';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRESS_TABLE_ID = 74748;

interface PressRelease {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  release_date: string;
  location: string;
  is_published: boolean;
}

export default function PressListPage() {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadPressReleases();
  }, []);

  const loadPressReleases = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage(PRESS_TABLE_ID, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'release_date',
        IsAsc: false,
        Filters: [
          { name: 'is_published', op: 'Equal', value: true }
        ]
      });

      if (error) throw new Error(error);
      
      if (data?.List) {
        setPressReleases(data.List);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load press releases',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReleases = pressReleases.filter(release => {
    const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || release.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Releases' },
    { value: 'launch', label: 'Product Launch' },
    { value: 'feature', label: 'Feature Updates' },
    { value: 'partnership', label: 'Partnerships' },
    { value: 'recognition', label: 'Recognition' }
  ];

  return (
    <>
      <Helmet>
        <title>Press Releases - AI ENERGY Optimizer</title>
        <meta 
          name="description" 
          content="Latest press releases and news from AI ENERGY Optimizer. Stay updated on product launches, partnerships, and company achievements." 
        />
        <link rel="canonical" href={`${window.location.origin}/press`} />
        
        <meta property="og:title" content="Press Releases - AI ENERGY Optimizer" />
        <meta property="og:description" content="Latest press releases and news from AI ENERGY Optimizer" />
        <meta property="og:url" content={`${window.location.origin}/press`} />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Press Releases - AI ENERGY Optimizer" />
        <meta name="twitter:description" content="Latest press releases and news from AI ENERGY Optimizer" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Newspaper className="w-6 h-6 text-primary" />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                AI ENERGY Optimizer
              </span>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Press Releases
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Latest news and announcements from AI ENERGY Optimizer
              </p>
              
              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search press releases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Press Kit */}
            <PressKit />

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
              <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
                {categories.map(cat => (
                  <TabsTrigger key={cat.value} value={cat.value}>
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-8">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredReleases.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReleases.map(release => (
                      <PressCard key={release.id} {...release} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Newspaper className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Press Releases Found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Try adjusting your search criteria' : 'Check back soon for updates'}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Media Contact CTA */}
            <div className="mt-16 bg-muted rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                For media inquiries, interview requests, or additional information, 
                please contact our press team.
              </p>
              <Button size="lg" onClick={() => window.location.href = 'mailto:press@aienergyoptimizer.com'}>
                Contact Press Team
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}