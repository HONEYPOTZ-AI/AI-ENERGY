import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BlogFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function BlogFilters({
  categories,
  selectedCategory,
  onCategoryChange
}: BlogFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === '' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategoryChange('')}
      >
        All Articles
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}