import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SolutionsCTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export default function SolutionsCTA({
  title = "Ready to Transform Your Energy Management?",
  description = "Join leading organizations using AI to optimize energy consumption, reduce costs, and achieve sustainability goals.",
  primaryButtonText = "Start Free Trial",
  primaryButtonLink = "/onboarding",
  secondaryButtonText = "Contact Sales",
  secondaryButtonLink = "/onboarding"
}: SolutionsCTAProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 p-8 md:p-12">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
        <p className="text-lg text-muted-foreground">{description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="text-lg">
            <Link to={primaryButtonLink}>
              {primaryButtonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg">
            <Link to={secondaryButtonLink}>
              {secondaryButtonText}
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
