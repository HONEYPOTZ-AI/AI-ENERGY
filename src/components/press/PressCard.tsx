import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface PressCardProps {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  release_date: string;
  location: string;
}

export default function PressCard({ 
  title, 
  slug, 
  summary, 
  category, 
  release_date,
  location 
}: PressCardProps) {
  const categoryLabels: Record<string, string> = {
    launch: 'Product Launch',
    feature: 'Feature Update',
    partnership: 'Partnership',
    recognition: 'Industry Recognition',
    general: 'General'
  };

  return (
    <Link to={`/press/${slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary">{categoryLabels[category] || category}</Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(release_date), 'MMM d, yyyy')}
            </div>
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-xs">{location}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {summary}
          </p>
          <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
            Read Full Release
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}