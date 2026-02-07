import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface BlogCardProps {
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

export default function BlogCard({
  title,
  slug,
  excerpt,
  featured_image,
  category,
  published_date,
  reading_time,
  author
}: BlogCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link to={`/blog/${slug}`}>
        <div className="relative overflow-hidden h-48">
          <img
            src={featured_image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

          <Badge className="absolute top-4 right-4 bg-primary">
            {category}
          </Badge>
        </div>
      </Link>
      
      <CardHeader>
        <Link to={`/blog/${slug}`}>
          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(published_date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{reading_time} min read</span>
          </div>
        </div>
      </CardFooter>
    </Card>);

}