
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ResourceCard from '@/components/resources/ResourceCard';

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [resources, setResources] = useState<any[]>([]);
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, activeTab, searchQuery]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.run({
        path: 'resources/getResources',
        methodName: 'getResources',
        param: [null]
      });

      if (error) throw new Error(error);
      setResources(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // Filter by tab
    if (activeTab === 'case-studies') {
      filtered = filtered.filter((r) => r.type === 'case_study');
    } else if (activeTab === 'white-papers') {
      filtered = filtered.filter((r) => r.type === 'white_paper');
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((r) =>
      r.title.toLowerCase().includes(query) ||
      r.excerpt.toLowerCase().includes(query) ||
      r.industry?.toLowerCase().includes(query) ||
      r.tags?.toLowerCase().includes(query)
      );
    }

    setFilteredResources(filtered);
  };

  const caseStudiesCount = resources.filter((r) => r.type === 'case_study').length;
  const whitePapersCount = resources.filter((r) => r.type === 'white_paper').length;

  return (
    <>
      <Helmet>
        <title>Resources - AI Energy Optimizer | Case Studies & White Papers</title>
        <meta name="description" content="Explore our collection of case studies and white papers showcasing real-world AI energy optimization implementations, methodologies, and sustainability impact." />
        <meta property="og:title" content="Resources - AI Energy Optimizer" />
        <meta property="og:description" content="Explore our collection of case studies and white papers showcasing real-world AI energy optimization implementations." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/resources`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Resource Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover how AI-powered energy optimization is transforming utilities and enterprises worldwide
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search resources by title, industry, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-lg" />

              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/onboarding">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">Request a Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Resources Tabs */}
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                All ({resources.length})
              </TabsTrigger>
              <TabsTrigger value="case-studies" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Case Studies ({caseStudiesCount})
              </TabsTrigger>
              <TabsTrigger value="white-papers" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                White Papers ({whitePapersCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {loading ?
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) =>
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                )}
                </div> :
              filteredResources.length === 0 ?
              <div className="text-center py-20">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search query' : 'Check back soon for new content'}
                  </p>
                </div> :

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) =>
                <ResourceCard key={resource.id} {...resource} />
                )}
                </div>
              }
            </TabsContent>
          </Tabs>
        </section>

        {/* Bottom CTA */}
        <section className="bg-primary text-primary-foreground py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Energy Management?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join leading organizations using AI to reduce costs and improve sustainability
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/onboarding">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/dashboard">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>);

}