
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResourceCardProps {
  id: number;
  title: string;
  slug: string;
  type: 'case_study' | 'white_paper';
  excerpt: string;
  featured_image?: string;
  industry?: string;
  publish_date: string;
  read_time: number;
  tags?: string;
  download_url?: string;
}

export default function ResourceCard({
  title,
  slug,
  type,
  excerpt,
  featured_image,
  industry,
  publish_date,
  read_time,
  tags,
  download_url
}: ResourceCardProps) {
  const detailPath = type === 'case_study' ? `/resources/case-study/${slug}` : `/resources/white-paper/${slug}`;

  const formattedDate = new Date(publish_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      {featured_image &&
      <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
          src={featured_image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />

        </div>
      }
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">
            {type === 'case_study' ? 'Case Study' : 'White Paper'}
          </Badge>
          {industry && <span className="text-sm text-muted-foreground">{industry}</span>}
        </div>
        <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
          <Link to={detailPath}>{title}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{read_time} min read</span>
          </div>
        </div>
        {tags &&
        <div className="flex flex-wrap gap-2 mt-3">
            {tags.split(',').slice(0, 3).map((tag, idx) =>
          <Badge key={idx} variant="outline" className="text-xs">
                {tag.trim()}
              </Badge>
          )}
          </div>
        }
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1">
          <Link to={detailPath}>
            <FileText className="w-4 h-4 mr-2" />
            Read More
          </Link>
        </Button>
        {download_url &&
        <Button asChild variant="outline">
            <a href={download_url} download>
              <Download className="w-4 h-4" />
            </a>
          </Button>
        }
      </CardFooter>
    </Card>);

}