import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogFilters from '@/components/blog/BlogFilters';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  category: string;
  published_date: string;
  reading_time: number;
  author: string;
}

const BLOG_TABLE_ID = 74747; // Update this with actual table ID after creation

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, searchTerm, pageNo]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(BLOG_TABLE_ID, {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: 'category',
        IsAsc: true,
        Filters: [
          { name: 'is_published', op: 'Equal', value: true }
        ]
      });

      if (error) throw new Error(error);

      if (data?.List) {
        const uniqueCategories = [...new Set(data.List.map((p: any) => p.category))];
        setCategories(uniqueCategories as string[]);
      }
    } catch (error: any) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      const filters: any[] = [
        { name: 'is_published', op: 'Equal', value: true }
      ];

      if (selectedCategory) {
        filters.push({ name: 'category', op: 'Equal', value: selectedCategory });
      }

      if (searchTerm) {
        filters.push({ name: 'title', op: 'StringContains', value: searchTerm });
      }

      const { data, error } = await window.ezsite.apis.tablePage(BLOG_TABLE_ID, {
        PageNo: pageNo,
        PageSize: pageSize,
        OrderByField: 'published_date',
        IsAsc: false,
        Filters: filters
      });

      if (error) throw new Error(error);

      if (data?.List) {
        setPosts(data.List);
        setTotalCount(data.VirtualCount || 0);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load blog posts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPageNo(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPageNo(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <Helmet>
        <title>Blog & News - AI ENERGY Optimizer</title>
        <meta name="description" content="Stay updated with the latest insights, guides, and news about AI-powered energy optimization, sustainability, and smart grid technology." />
        <meta property="og:title" content="Blog & News - AI ENERGY Optimizer" />
        <meta property="og:description" content="Stay updated with the latest insights, guides, and news about AI-powered energy optimization." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Blog & News
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Insights, guides, and updates on AI-powered energy optimization
              </p>
              <BlogSearch value={searchTerm} onChange={handleSearch} />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-12">
          {/* Filters */}
          <div className="mb-8">
            <BlogFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Blog Grid */}
          {!loading && posts.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => (
                  <BlogCard key={post.id} {...post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPageNo(p => Math.max(1, p - 1))}
                    disabled={pageNo === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center px-4">
                    Page {pageNo} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPageNo(p => Math.min(totalPages, p + 1))}
                    disabled={pageNo === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No articles found. Try adjusting your filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}