import SEOHead from '@/components/SEOHead';
import SolutionsCTA from '@/components/SolutionsCTA';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Factory, 
  Database, 
  TrendingDown, 
  Leaf,
  Shield,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Zap
} from 'lucide-react';

export default function EnterprisesIndustryPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI Energy Solutions for Enterprises",
    "description": "Enterprise energy management solutions for manufacturing, data centers, commercial real estate, and multi-site operations. Reduce costs and achieve sustainability goals.",
    "provider": {
      "@type": "Organization",
      "name": "EnergyAI"
    },
    "serviceType": "Enterprise Energy Management Software",
    "audience": {
      "@type": "Audience",
      "audienceType": "Enterprise Businesses"
    }
  };

  return (
    <>
      <SEOHead
        title="Enterprise Energy Management | AI Solutions for Multi-Site Operations"
        description="Transform enterprise energy management with AI-powered optimization across manufacturing, data centers, commercial real estate, and multi-site operations. Reduce costs by 30% and achieve sustainability goals."
        keywords="enterprise energy management, multi-site energy optimization, manufacturing energy, data center energy, commercial real estate energy, corporate sustainability"
        canonicalUrl="/industries/enterprises"
        ogImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop"
        schema={schema}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-500/10 via-background to-background border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium">
                <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                For Enterprises
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Enterprise Energy Management at Scale
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Optimize energy across your entire organization with AI-powered solutions for 
                manufacturing, data centers, commercial real estate, and multi-site operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="text-lg">
                  <Link to="/onboarding">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link to="/dashboard/enterprise">
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Challenges Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Enterprise Energy Challenges</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Address the unique complexity of large-scale energy management.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    challenge: "Multi-Site Complexity",
                    description: "Managing energy across dozens or hundreds of facilities with different usage patterns, rate structures, and operational requirements.",
                    solution: "Centralized platform with site-specific optimization and portfolio-level analytics for comprehensive visibility and control."
                  },
                  {
                    challenge: "High Energy Costs",
                    description: "Energy represents 2-10% of operating expenses for most enterprises, with peak demand charges and time-of-use rates driving up costs.",
                    solution: "AI-driven cost optimization reduces bills by 25-35% through demand management, load shifting, and rate optimization."
                  },
                  {
                    challenge: "Sustainability Commitments",
                    description: "Meeting corporate net-zero targets, ESG reporting requirements, and stakeholder expectations for environmental leadership.",
                    solution: "Automated carbon tracking, renewable energy optimization, and comprehensive ESG reporting aligned with global standards."
                  },
                  {
                    challenge: "Operational Disruption",
                    description: "Balancing energy savings with business continuity, production schedules, and customer experience requirements.",
                    solution: "Intelligent optimization respects operational constraints while maximizing savings through non-disruptive efficiency improvements."
                  }
                ].map((item, index) => (
                  <Card key={index} className="p-8 space-y-4">
                    <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                      {item.challenge}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                    <div className="pt-4 border-t">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold mb-1">Our Solution</div>
                          <p className="text-sm text-muted-foreground">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Industry Solutions Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Solutions by Industry</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Tailored approaches for different enterprise sectors.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  {
                    icon: Factory,
                    industry: "Manufacturing",
                    description: "Optimize production energy while maintaining throughput and quality",
                    features: [
                      {
                        title: "Production Schedule Optimization",
                        detail: "Align manufacturing operations with lowest electricity rates and renewable generation peaks"
                      },
                      {
                        title: "Equipment Efficiency",
                        detail: "Monitor and optimize motors, compressors, HVAC, and process equipment in real-time"
                      },
                      {
                        title: "Demand Charge Reduction",
                        detail: "Manage peak demand through load balancing and strategic equipment sequencing"
                      },
                      {
                        title: "Energy-Intensive Process Optimization",
                        detail: "Optimize heating, cooling, and chemical processes for maximum efficiency"
                      }
                    ],
                    savings: "25-35% cost reduction",
                    link: "/solutions/cost-optimization"
                  },
                  {
                    icon: Database,
                    industry: "Data Centers",
                    description: "Maximize efficiency while ensuring 100% uptime and performance",
                    features: [
                      {
                        title: "Cooling Optimization",
                        detail: "AI-driven HVAC control reduces cooling energy by 20-30% without impacting server performance"
                      },
                      {
                        title: "Workload Scheduling",
                        detail: "Shift non-critical compute jobs to off-peak hours and renewable generation windows"
                      },
                      {
                        title: "PUE Improvement",
                        detail: "Continuously optimize Power Usage Effectiveness through real-time adjustments"
                      },
                      {
                        title: "Predictive Maintenance",
                        detail: "Prevent equipment failures and optimize maintenance schedules for critical infrastructure"
                      }
                    ],
                    savings: "20-25% cost reduction",
                    link: "/solutions/ai-energy-optimization"
                  },
                  {
                    icon: Building2,
                    industry: "Commercial Real Estate",
                    description: "Reduce operating costs across property portfolios while improving tenant satisfaction",
                    features: [
                      {
                        title: "Smart Building Control",
                        detail: "Automated HVAC, lighting, and equipment control based on occupancy and weather"
                      },
                      {
                        title: "Portfolio Management",
                        detail: "Centralized visibility and control across all properties with benchmarking"
                      },
                      {
                        title: "Tenant Billing",
                        detail: "Accurate sub-metering and cost allocation with detailed usage analytics"
                      },
                      {
                        title: "Comfort Optimization",
                        detail: "Maintain ideal conditions while minimizing energy waste through predictive control"
                      }
                    ],
                    savings: "25-35% cost reduction",
                    link: "/solutions/cost-optimization"
                  }
                ].map((sector, index) => (
                  <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                    <div className="space-y-6">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <sector.icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-3xl font-bold mb-2">{sector.industry}</h3>
                              <p className="text-muted-foreground text-lg">{sector.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {sector.savings}
                              </div>
                              <div className="text-sm text-muted-foreground">Typical savings</div>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mt-6">
                            {sector.features.map((feature, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="font-semibold text-sm">{feature.title}</div>
                                <p className="text-xs text-muted-foreground">{feature.detail}</p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6">
                            <Button asChild variant="outline">
                              <Link to={sector.link}>
                                Explore {sector.industry} Solutions
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Platform Capabilities Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Enterprise Platform Capabilities</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: BarChart3,
                    title: "Multi-Site Analytics",
                    description: "Unified dashboard for portfolio-wide visibility with drill-down to individual facilities and equipment."
                  },
                  {
                    icon: TrendingDown,
                    title: "Cost Optimization",
                    description: "Automated demand management, load shifting, and rate optimization across all locations."
                  },
                  {
                    icon: Leaf,
                    title: "ESG Reporting",
                    description: "Comprehensive carbon tracking and sustainability reporting aligned with global standards."
                  },
                  {
                    icon: Shield,
                    title: "Enterprise Security",
                    description: "SOC 2 compliant with role-based access control, audit logging, and data encryption."
                  },
                  {
                    icon: Zap,
                    title: "Real-Time Control",
                    description: "Automated equipment control and demand response with operational constraint management."
                  },
                  {
                    icon: Database,
                    title: "API Integration",
                    description: "Connect with existing BMS, ERP, and facilities management systems via REST APIs."
                  }
                ].map((capability, index) => (
                  <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                    <div className="inline-flex p-3 rounded-lg bg-purple-500/10">
                      <capability.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold">{capability.title}</h3>
                    <p className="text-muted-foreground text-sm">{capability.description}</p>
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
                <h2 className="text-3xl md:text-5xl font-bold">Enterprise Success Stories</h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    company: "Global Automotive Manufacturer",
                    industry: "Manufacturing",
                    facilities: "42 facilities across 12 countries",
                    challenge: "High energy costs and aggressive carbon reduction targets",
                    results: [
                      "$12M annual energy cost savings (32% reduction)",
                      "2.8M tons CO2 reduction over 3 years",
                      "ROI achieved in 15 months",
                      "Zero production disruptions during optimization"
                    ]
                  },
                  {
                    company: "Fortune 500 Technology Company",
                    industry: "Data Centers",
                    facilities: "8 hyperscale data centers",
                    challenge: "Rising cooling costs and renewable energy integration",
                    results: [
                      "$8.5M annual savings (24% reduction)",
                      "PUE improved from 1.6 to 1.3",
                      "65% renewable energy utilization",
                      "Maintained 99.999% uptime"
                    ]
                  },
                  {
                    company: "National REIT",
                    industry: "Commercial Real Estate",
                    facilities: "180 office buildings, 2.5M sq ft",
                    challenge: "High operating costs and tenant demand for sustainability",
                    results: [
                      "$6.2M annual savings (28% reduction)",
                      "45% reduction in carbon footprint",
                      "15% increase in tenant satisfaction",
                      "Enhanced property values and marketability"
                    ]
                  }
                ].map((story, index) => (
                  <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                    <div className="space-y-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div>
                          <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                            {story.industry}
                          </div>
                          <h3 className="text-2xl font-semibold mb-2">{story.company}</h3>
                          <p className="text-muted-foreground">{story.facilities}</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="font-semibold mb-2">Challenge</div>
                          <p className="text-muted-foreground">{story.challenge}</p>
                        </div>
                        <div>
                          <div className="font-semibold mb-3">Results</div>
                          <ul className="space-y-2">
                            {story.results.map((result, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{result}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Process Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Simple Implementation Process</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  From pilot to full deployment in 90 days.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    step: "1",
                    title: "Assessment",
                    duration: "2 weeks",
                    description: "Analyze current energy usage, identify opportunities, and define success metrics"
                  },
                  {
                    step: "2",
                    title: "Pilot Program",
                    duration: "4-6 weeks",
                    description: "Deploy at 1-3 facilities to validate savings and refine approach"
                  },
                  {
                    step: "3",
                    title: "Rollout",
                    duration: "6-8 weeks",
                    description: "Scale across all facilities with phased deployment and training"
                  },
                  {
                    step: "4",
                    title: "Optimization",
                    duration: "Ongoing",
                    description: "Continuous improvement and expanding capabilities as needs evolve"
                  }
                ].map((phase, index) => (
                  <Card key={index} className="p-6 space-y-4 relative">
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
                      {phase.step}
                    </div>
                    <div className="pt-4">
                      <h3 className="text-xl font-semibold mb-1">{phase.title}</h3>
                      <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-3">
                        {phase.duration}
                      </div>
                      <p className="text-sm text-muted-foreground">{phase.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Features Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Built for Enterprise Scale</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 space-y-4">
                  <h3 className="text-2xl font-semibold">Security & Compliance</h3>
                  <ul className="space-y-3">
                    {[
                      "SOC 2 Type II certified",
                      "GDPR and CCPA compliant",
                      "Role-based access control (RBAC)",
                      "End-to-end data encryption",
                      "Regular security audits",
                      "99.9% uptime SLA"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-8 space-y-4">
                  <h3 className="text-2xl font-semibold">Support & Services</h3>
                  <ul className="space-y-3">
                    {[
                      "Dedicated customer success manager",
                      "24/7 technical support",
                      "Custom training programs",
                      "Quarterly business reviews",
                      "API support and documentation",
                      "Professional services available"
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
                      <h3 className="text-2xl font-semibold">Explore Enterprise Dashboard</h3>
                      <p className="text-muted-foreground text-lg">
                        See how our platform manages energy across multi-site enterprise operations.
                      </p>
                    </div>
                    <Button asChild size="lg">
                      <Link to="/dashboard/enterprise">
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
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Comprehensive Solution Suite</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Cost Optimization",
                    description: "Maximize savings across your enterprise",
                    link: "/solutions/cost-optimization",
                    icon: TrendingDown
                  },
                  {
                    title: "Sustainability",
                    description: "Achieve ESG goals and net-zero targets",
                    link: "/solutions/sustainability",
                    icon: Leaf
                  },
                  {
                    title: "Demand Forecasting",
                    description: "Predict energy needs with AI accuracy",
                    link: "/solutions/demand-forecasting",
                    icon: BarChart3
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
                        Learn more
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
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <SolutionsCTA
                title="Transform Your Enterprise Energy Management"
                description="Join Fortune 500 companies achieving significant cost savings and sustainability goals with AI-powered energy optimization."
                primaryButtonText="Schedule Demo"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
