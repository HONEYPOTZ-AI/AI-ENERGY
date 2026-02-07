import SEOHead from '@/components/SEOHead';
import SolutionsCTA from '@/components/SolutionsCTA';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Clock, 
  Target,
  Zap,
  ArrowRight,
  CheckCircle2,
  Calculator,
  BarChart3
} from 'lucide-react';

export default function CostOptimizationPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Energy Cost Optimization",
    "description": "Advanced cost reduction strategies through AI-powered pricing optimization, demand management, and intelligent resource allocation.",
    "provider": {
      "@type": "Organization",
      "name": "EnergyAI"
    },
    "serviceType": "Energy Cost Management Software"
  };

  return (
    <>
      <SEOHead
        title="Energy Cost Optimization | Reduce Expenses by 30% with AI"
        description="Maximize energy cost savings with AI-powered pricing optimization, demand charge reduction, and intelligent resource allocation. Achieve 30%+ cost reduction and rapid ROI."
        keywords="energy cost optimization, cost reduction, pricing optimization, demand charge management, energy savings, ROI, utility bill reduction"
        canonicalUrl="/solutions/cost-optimization"
        ogImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop"
        schema={schema}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-500/10 via-background to-background border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium">
                <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Cost Optimization
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Reduce Energy Costs by Up to 30%
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Leverage AI-powered pricing optimization, demand charge reduction, and intelligent 
                resource allocation to maximize savings and achieve rapid ROI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="text-lg">
                  <Link to="/onboarding">
                    Calculate Savings
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link to="/dashboard/optimization">
                    View Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Reduction Strategies Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Multi-Dimensional Cost Reduction</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Attack energy costs from every angle with comprehensive optimization strategies.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    icon: Clock,
                    title: "Peak Demand Management",
                    savings: "20-40%",
                    description: "Dramatically reduce demand charges by intelligently shifting and curtailing loads during peak periods.",
                    strategies: [
                      "Real-time peak prediction and avoidance",
                      "Automated load shedding priorities",
                      "Battery storage optimization",
                      "Pre-cooling and thermal storage"
                    ]
                  },
                  {
                    icon: PieChart,
                    title: "Time-of-Use Optimization",
                    savings: "15-25%",
                    description: "Maximize savings by aligning consumption with lowest electricity rates throughout the day.",
                    strategies: [
                      "Automatic load shifting to off-peak hours",
                      "Production schedule optimization",
                      "EV charging management",
                      "HVAC pre-conditioning"
                    ]
                  },
                  {
                    icon: Target,
                    title: "Market Participation",
                    savings: "10-15%",
                    description: "Generate revenue and reduce costs through demand response and ancillary services programs.",
                    strategies: [
                      "Automated demand response bidding",
                      "Frequency regulation participation",
                      "Capacity market enrollment",
                      "Virtual power plant aggregation"
                    ]
                  },
                  {
                    icon: Zap,
                    title: "Efficiency Improvements",
                    savings: "15-30%",
                    description: "Eliminate waste and optimize equipment performance for ongoing cost savings.",
                    strategies: [
                      "Anomaly detection and correction",
                      "Equipment efficiency optimization",
                      "HVAC and lighting optimization",
                      "Predictive maintenance scheduling"
                    ]
                  }
                ].map((strategy, index) => (
                  <Card key={index} className="p-8 space-y-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="inline-flex p-3 rounded-lg bg-purple-500/10">
                        <strategy.icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Potential Savings</div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {strategy.savings}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">{strategy.title}</h3>
                      <p className="text-muted-foreground">{strategy.description}</p>
                    </div>
                    <ul className="space-y-2">
                      {strategy.strategies.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Rapid Return on Investment</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Most customers achieve full ROI within 12-18 months.
                </p>
              </div>

              <Card className="p-8 md:p-12 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-background border-purple-500/20">
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Calculator,
                      value: "12-18",
                      unit: "months",
                      label: "Payback Period"
                    },
                    {
                      icon: TrendingDown,
                      value: "30%",
                      unit: "average",
                      label: "Cost Reduction"
                    },
                    {
                      icon: DollarSign,
                      value: "5-10x",
                      unit: "over 5 years",
                      label: "Total ROI"
                    }
                  ].map((metric, index) => (
                    <div key={index} className="text-center space-y-3">
                      <div className="inline-flex p-4 rounded-lg bg-purple-500/10">
                        <metric.icon className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400">
                          {metric.value}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{metric.unit}</div>
                      </div>
                      <div className="font-semibold">{metric.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 bg-background/50 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-4">Example: 1 MW Industrial Facility</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Current Annual Energy Cost:</span>
                      <span className="font-semibold">$1,200,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Expected Savings (25%):</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">$300,000/year</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Implementation Cost:</span>
                      <span className="font-semibold">$350,000</span>
                    </div>
                    <div className="border-t pt-3 mt-3 flex justify-between items-center">
                      <span className="font-semibold">Payback Period:</span>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">14 months</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Optimization Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Intelligent Pricing Optimization</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Navigate complex rate structures and market conditions to minimize costs.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Real-Time Pricing",
                    description: "Automatically respond to dynamic electricity prices by adjusting consumption in real-time."
                  },
                  {
                    title: "Tariff Optimization",
                    description: "Analyze and recommend the best utility rate plans based on your consumption patterns."
                  },
                  {
                    title: "Day-Ahead Markets",
                    description: "Optimize participation in wholesale electricity markets for maximum savings."
                  },
                  {
                    title: "Capacity Bidding",
                    description: "Strategically bid available flexibility into capacity and ancillary services markets."
                  },
                  {
                    title: "Contract Management",
                    description: "Track and optimize power purchase agreements and energy supply contracts."
                  },
                  {
                    title: "Renewable Credits",
                    description: "Optimize renewable energy certificate (REC) purchases and trading strategies."
                  }
                ].map((feature, index) => (
                  <Card key={index} className="p-6 space-y-3 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Real Results from Real Customers</h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    industry: "Manufacturing",
                    company: "Leading Automotive Supplier",
                    savings: "32% reduction",
                    details: "Reduced annual energy costs by $2.4M through peak demand management and production schedule optimization.",
                    link: "/industries/enterprises"
                  },
                  {
                    industry: "Commercial Real Estate",
                    company: "Multi-Property Portfolio",
                    savings: "28% reduction",
                    details: "Achieved $850K annual savings across 15 buildings through intelligent HVAC optimization and time-of-use management.",
                    link: "/industries/enterprises"
                  },
                  {
                    industry: "Data Center",
                    company: "Regional Colocation Provider",
                    savings: "22% reduction",
                    details: "Lowered energy costs by $1.8M annually while maintaining 100% uptime through AI-optimized cooling and workload scheduling.",
                    link: "/industries/enterprises"
                  },
                  {
                    industry: "Utility",
                    company: "Municipal Electric Utility",
                    savings: "$4.2M saved",
                    details: "Optimized generation dispatch and demand response programs to reduce wholesale power costs and improve grid reliability.",
                    link: "/industries/utilities"
                  }
                ].map((story, index) => (
                  <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-shrink-0 lg:w-48">
                        <div className="space-y-2">
                          <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                            {story.industry}
                          </div>
                          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {story.savings}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-2xl font-semibold">{story.company}</h3>
                        <p className="text-muted-foreground text-lg">{story.details}</p>
                        <Button asChild variant="link" className="px-0">
                          <Link to={story.link}>
                            Learn more about {story.industry.toLowerCase()} solutions
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Comprehensive Cost Management Platform</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 space-y-4">
                  <div className="inline-flex p-3 rounded-lg bg-purple-500/10">
                    <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Analytics & Reporting</h3>
                  <ul className="space-y-3">
                    {[
                      "Real-time cost tracking and budgeting",
                      "Bill validation and error detection",
                      "Savings verification and attribution",
                      "Custom dashboards and KPI monitoring"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-8 space-y-4">
                  <div className="inline-flex p-3 rounded-lg bg-purple-500/10">
                    <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Automated Control</h3>
                  <ul className="space-y-3">
                    {[
                      "Automatic load curtailment during peaks",
                      "Smart device and equipment control",
                      "Battery storage charge/discharge optimization",
                      "Integration with building management systems"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <div className="pt-8">
                <Card className="p-8 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-background border-purple-500/20">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 space-y-3">
                      <h3 className="text-2xl font-semibold">See Optimization in Action</h3>
                      <p className="text-muted-foreground text-lg">
                        Explore our live optimization dashboard with real-time cost savings calculations.
                      </p>
                    </div>
                    <Button asChild size="lg">
                      <Link to="/dashboard/optimization">
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

        {/* Related Solutions */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Complete Solution Suite</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "AI Energy Optimization",
                    description: "The intelligence behind cost reduction",
                    link: "/solutions/ai-energy-optimization",
                    icon: BarChart3
                  },
                  {
                    title: "Demand Forecasting",
                    description: "Predict and plan for optimal savings",
                    link: "/solutions/demand-forecasting",
                    icon: TrendingDown
                  },
                  {
                    title: "Sustainability",
                    description: "Cost savings with environmental benefits",
                    link: "/solutions/sustainability",
                    icon: Target
                  }
                ].map((solution, index) => (
                  <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow group">
                    <div className="inline-flex p-3 rounded-lg bg-purple-500/10">
                      <solution.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <SolutionsCTA
                title="Start Saving on Energy Costs Today"
                description="Calculate your potential savings and see how quickly you can achieve ROI with AI-powered cost optimization."
                primaryButtonText="Calculate My Savings"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
