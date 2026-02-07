import SEOHead from '@/components/SEOHead';
import SolutionsCTA from '@/components/SolutionsCTA';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Leaf,
  TrendingDown,
  FileText,
  Globe,
  Award,
  Target,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Wind } from
'lucide-react';

export default function SustainabilityPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Sustainability & ESG Solutions",
    "description": "Comprehensive sustainability solutions for carbon reduction, ESG reporting, and environmental impact management through AI-powered energy optimization.",
    "provider": {
      "@type": "Organization",
      "name": "EnergyAI"
    },
    "serviceType": "Environmental Management Software"
  };

  return (
    <>
      <SEOHead
        title="Sustainability & ESG Solutions | Carbon Reduction & Environmental Impact"
        description="Achieve your sustainability goals with AI-powered carbon reduction, automated ESG reporting, and comprehensive environmental impact tracking. Reduce emissions by up to 40%."
        keywords="sustainability solutions, ESG reporting, carbon reduction, environmental impact, net zero, renewable energy, carbon footprint tracking"
        canonicalUrl="/solutions/sustainability"
        ogImage="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&h=630&fit=crop"
        schema={schema} />


      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-500/10 via-background to-background border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-sm font-medium">
                <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                Sustainability Solutions
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Drive Sustainability with AI-Powered Energy Management
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Reduce carbon emissions by up to 40%, achieve net-zero goals, and automate ESG reporting 
                with intelligent energy optimization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="text-lg">
                  <Link to="/onboarding">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link to="/dashboard/esg-reports">
                    View ESG Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Carbon Reduction Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Carbon Reduction That Matters</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Achieve measurable emissions reductions through intelligent energy optimization.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 space-y-6">
                  <div className="inline-flex p-3 rounded-lg bg-green-500/10">
                    <TrendingDown className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Immediate Impact</h3>
                  <ul className="space-y-3">
                    {[
                    "Reduce Scope 2 emissions by 30-40%",
                    "Optimize renewable energy utilization",
                    "Minimize peak demand carbon intensity",
                    "Real-time carbon footprint tracking"].
                    map((item, index) =>
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    )}
                  </ul>
                </Card>

                <Card className="p-8 space-y-6">
                  <div className="inline-flex p-3 rounded-lg bg-green-500/10">
                    <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Long-Term Goals</h3>
                  <ul className="space-y-3">
                    {[
                    "Net-zero roadmap planning",
                    "Science-based targets alignment",
                    "Carbon offset optimization",
                    "Sustainability milestone tracking"].
                    map((item, index) =>
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    )}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ESG Reporting Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Automated ESG Reporting</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Streamline compliance and stakeholder reporting with comprehensive ESG analytics.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                {
                  icon: FileText,
                  title: "Compliance Ready",
                  description: "Generate reports aligned with GRI, SASB, TCFD, and CDP frameworks automatically."
                },
                {
                  icon: BarChart3,
                  title: "Real-Time Metrics",
                  description: "Track environmental KPIs with live dashboards and customizable views."
                },
                {
                  icon: Globe,
                  title: "Multi-Facility",
                  description: "Aggregate data across all locations for comprehensive organizational reporting."
                },
                {
                  icon: Award,
                  title: "Audit Trail",
                  description: "Maintain complete data lineage and verification for third-party audits."
                },
                {
                  icon: Target,
                  title: "Goal Tracking",
                  description: "Monitor progress against sustainability commitments and targets."
                },
                {
                  icon: Wind,
                  title: "Impact Analysis",
                  description: "Quantify environmental benefits and communicate results to stakeholders."
                }].
                map((feature, index) =>
                <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                    <div className="inline-flex p-3 rounded-lg bg-green-500/10">
                      <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                )}
              </div>

              <div className="pt-8">
                <Card className="p-8 bg-gradient-to-br from-green-500/10 via-green-500/5 to-background border-green-500/20">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 space-y-3">
                      <h3 className="text-2xl font-semibold">Explore ESG Reporting</h3>
                      <p className="text-muted-foreground text-lg">
                        View live ESG metrics, generate custom reports, and track your sustainability journey.
                      </p>
                    </div>
                    <Button asChild size="lg">
                      <Link to="/dashboard/esg-reports">
                        View Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Environmental Benefits Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Comprehensive Environmental Benefits</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Create positive impact across multiple environmental dimensions.
                </p>
              </div>

              <div className="space-y-8">
                {[
                {
                  title: "Reduced Carbon Footprint",
                  description: "Lower your Scope 2 emissions significantly by optimizing electricity consumption patterns and maximizing renewable energy usage. Our AI identifies the optimal times to consume energy when grid carbon intensity is lowest.",
                  stat: "30-40% reduction",
                  link: "/solutions/ai-energy-optimization"
                },
                {
                  title: "Renewable Energy Integration",
                  description: "Seamlessly integrate solar, wind, and other renewable sources with intelligent forecasting and battery storage optimization. Balance intermittent generation with demand to maximize clean energy utilization.",
                  stat: "Up to 60% renewable",
                  link: "/solutions/demand-forecasting"
                },
                {
                  title: "Resource Conservation",
                  description: "Minimize energy waste through predictive analytics and automated controls. Reduce unnecessary consumption during off-peak hours and optimize equipment operation for maximum efficiency.",
                  stat: "25% less waste",
                  link: "/solutions/cost-optimization"
                },
                {
                  title: "Circular Economy Support",
                  description: "Enable demand response programs, virtual power plants, and energy sharing initiatives. Contribute to a more resilient and sustainable energy ecosystem.",
                  stat: "Grid-positive impact",
                  link: "/industries/utilities"
                }].
                map((benefit, index) =>
                <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-shrink-0 lg:w-48">
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                          {benefit.stat}
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-2xl font-semibold">{benefit.title}</h3>
                        <p className="text-muted-foreground text-lg">{benefit.description}</p>
                        <Button asChild variant="link" className="px-0">
                          <Link to={benefit.link}>
                            Learn more
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Industry Recognition Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Industry-Leading Sustainability</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Aligned with global standards and frameworks.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                { name: "UN SDGs", description: "Supporting Sustainable Development Goals" },
                { name: "Paris Agreement", description: "Aligned with climate commitments" },
                { name: "Science Based Targets", description: "SBTi approved methodologies" },
                { name: "CDP", description: "Carbon Disclosure Project reporting" }].
                map((framework, index) =>
                <Card key={index} className="p-6 text-center space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold">{framework.name}</h3>
                    <p className="text-sm text-muted-foreground">{framework.description}</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Solutions */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Complete Sustainability Suite</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                {
                  title: "AI Energy Optimization",
                  description: "The foundation for emissions reduction",
                  link: "/solutions/ai-energy-optimization",
                  icon: TrendingDown
                },
                {
                  title: "Cost Optimization",
                  description: "Financial and environmental benefits together",
                  link: "/solutions/cost-optimization",
                  icon: BarChart3
                },
                {
                  title: "Enterprise Solutions",
                  description: "Sustainability at scale across your organization",
                  link: "/industries/enterprises",
                  icon: Globe
                }].
                map((solution, index) =>
                <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow group">
                    <div className="inline-flex p-3 rounded-lg bg-green-500/10">
                      <solution.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold">{solution.title}</h3>
                    <p className="text-muted-foreground">{solution.description}</p>
                    <Button asChild variant="link" className="px-0 group-hover:translate-x-1 transition-transform">
                      <Link to={solution.link}>
                        Explore
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <SolutionsCTA
                title="Start Your Sustainability Journey Today"
                description="Join organizations worldwide reducing emissions and achieving net-zero goals with AI-powered energy management." />

            </div>
          </div>
        </section>
      </div>
    </>);

}