import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, Building2, Users, Zap, Award } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function PressKit() {
  const keyFeatures = [
  'AI-Powered Load Forecasting',
  'Real-time Grid Optimization',
  'ESG Reporting & Analytics',
  'Synthetic Data Generation',
  'Multi-horizon Predictions',
  'Carbon Intensity Tracking'];


  const companyFacts = [
  { icon: Building2, label: 'Founded', value: '2024' },
  { icon: Users, label: 'Team Size', value: '50+ Experts' },
  { icon: Zap, label: 'Energy Optimized', value: '10+ GWh' },
  { icon: Award, label: 'Recognition', value: 'Industry Leader' }];


  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Press Kit</CardTitle>
        <CardDescription>
          Download our press kit for media coverage and distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Overview */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Company Overview</h3>
          <p className="text-muted-foreground leading-relaxed">
            AI ENERGY Optimizer is a leading provider of artificial intelligence-powered energy 
            management solutions. Our platform helps utilities and enterprises optimize energy 
            consumption, reduce costs, and achieve sustainability goals through advanced forecasting, 
            real-time optimization, and comprehensive ESG reporting.
          </p>
        </div>

        <Separator />

        {/* Key Features */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {keyFeatures.map((feature, index) =>
            <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-sm">{feature}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Company Facts */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Company Facts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {companyFacts.map((fact, index) =>
            <div key={index} className="text-center">
                <fact.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">{fact.label}</div>
                <div className="font-semibold">{fact.value}</div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Media Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Media Contact</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Company:</strong> AI ENERGY Optimizer</p>
            <p><strong>Email:</strong> press@aienergyoptimizer.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105</p>
          </div>
        </div>

        <Separator />

        {/* Boilerplate */}
        <div>
          <h3 className="font-semibold text-lg mb-3">About AI ENERGY Optimizer</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI ENERGY Optimizer is revolutionizing energy management through cutting-edge artificial 
            intelligence and machine learning technologies. Founded in 2024, our platform empowers 
            utilities and enterprises to make data-driven decisions, optimize energy consumption, 
            and accelerate the transition to sustainable energy systems. With advanced forecasting 
            capabilities, real-time optimization algorithms, and comprehensive ESG reporting, 
            AI ENERGY Optimizer is helping organizations achieve their energy efficiency and 
            sustainability goals while reducing operational costs.
          </p>
        </div>

        {/* Download Actions */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Download Press Kit
          </Button>
          <Button variant="outline" onClick={() => window.location.href = 'mailto:press@aienergyoptimizer.com'}>
            <Mail className="w-4 h-4 mr-2" />
            Contact Media Team
          </Button>
        </div>
      </CardContent>
    </Card>);

}