import SEOHead from '@/components/SEOHead';
import SolutionsCTA from '@/components/SolutionsCTA';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Zap,
  Wind,
  Battery,
  Network,
  Shield,
  Users,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Globe } from
'lucide-react';

export default function UtilitiesIndustryPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI Solutions for Utility Companies",
    "description": "Comprehensive AI-powered solutions for electric utilities including grid optimization, demand forecasting, renewable integration, and customer engagement.",
    "provider": {
      "@type": "Organization",
      "name": "EnergyAI"
    },
    "serviceType": "Utility Management Software",
    "audience": {
      "@type": "Audience",
      "audienceType": "Utility Companies"
    }
  };

  return (
    <>
      <SEOHead
        title="AI Solutions for Utilities | Grid Optimization & Demand Management"
        description="Empower your utility with AI-driven grid optimization, renewable integration, demand forecasting, and customer engagement. Improve reliability, reduce costs, and accelerate clean energy transition."
        keywords="utility AI, grid optimization, demand management, renewable integration, utility forecasting, smart grid, electric utility software"
        canonicalUrl="/industries/utilities"
        ogImage="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=630&fit=crop"
        schema={schema} />


      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-500/10 via-background to-background border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                For Utility Companies
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                AI-Powered Solutions for Modern Electric Utilities
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Transform grid operations with advanced AI for demand forecasting, renewable integration, 
                outage prevention, and customer engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="text-lg">
                  <Link to="/onboarding">
                    Request Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link to="/dashboard/utility">
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Challenges Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Utility Industry Challenges</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Navigate the complex landscape of modern utility operations with AI.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                {
                  challenge: "Grid Reliability & Resilience",
                  description: "Maintaining stable operations with increasing complexity from distributed energy resources, aging infrastructure, and extreme weather events.",
                  solution: "AI-powered predictive maintenance, real-time grid monitoring, and automated fault detection prevent outages before they occur."
                },
                {
                  challenge: "Renewable Energy Integration",
                  description: "Balancing intermittent solar and wind generation while maintaining grid stability and meeting regulatory clean energy mandates.",
                  solution: "Advanced forecasting and optimization algorithms seamlessly integrate renewables, optimize storage, and balance supply-demand in real-time."
                },
                {
                  challenge: "Peak Demand Management",
                  description: "Meeting surging peak demand without expensive infrastructure upgrades while managing capacity and wholesale market costs.",
                  solution: "AI-driven demand response programs and load forecasting enable proactive peak shaving and optimal resource dispatch."
                },
                {
                  challenge: "Customer Expectations",
                  description: "Delivering personalized experiences, billing transparency, and energy management tools that modern customers demand.",
                  solution: "AI-powered customer portals, usage insights, and targeted engagement programs improve satisfaction and enable demand flexibility."
                }].
                map((item, index) =>
                <Card key={index} className="p-8 space-y-4">
                    <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                      {item.challenge}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                    <div className="pt-4 border-t">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold mb-1">Our Solution</div>
                          <p className="text-sm text-muted-foreground">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Core Capabilities Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Comprehensive Utility Solutions</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  End-to-end AI platform designed specifically for utility operations.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                {
                  icon: TrendingUp,
                  title: "Load Forecasting",
                  description: "Predict system-wide and regional demand with 95%+ accuracy across all time horizons.",
                  benefits: [
                  "Day-ahead market optimization",
                  "Unit commitment planning",
                  "Reserve requirement optimization",
                  "Multi-timeframe predictions"],

                  link: "/solutions/demand-forecasting"
                },
                {
                  icon: Wind,
                  title: "Renewable Integration",
                  description: "Maximize clean energy utilization while maintaining grid stability and reliability.",
                  benefits: [
                  "Solar and wind generation forecasting",
                  "Battery storage optimization",
                  "Curtailment minimization",
                  "Virtual power plant orchestration"],

                  link: "/solutions/sustainability"
                },
                {
                  icon: Network,
                  title: "Grid Optimization",
                  description: "Real-time optimization of generation dispatch, voltage control, and reactive power.",
                  benefits: [
                  "Economic dispatch optimization",
                  "Voltage and VAR optimization",
                  "Congestion management",
                  "Topology optimization"],

                  link: "/solutions/ai-energy-optimization"
                },
                {
                  icon: Users,
                  title: "Demand Response",
                  description: "Engage customers and manage flexible loads to reduce peak demand and costs.",
                  benefits: [
                  "Automated DR program management",
                  "Customer targeting and enrollment",
                  "Real-time event optimization",
                  "Performance verification"],

                  link: "/solutions/cost-optimization"
                },
                {
                  icon: Shield,
                  title: "Outage Prevention",
                  description: "Predict and prevent equipment failures and service interruptions.",
                  benefits: [
                  "Predictive maintenance alerts",
                  "Fault detection and isolation",
                  "Transformer monitoring",
                  "Weather impact prediction"],

                  link: "/solutions/ai-energy-optimization"
                },
                {
                  icon: Battery,
                  title: "Energy Storage",
                  description: "Optimize battery systems for maximum value across multiple use cases.",
                  benefits: [
                  "Charge/discharge optimization",
                  "Multi-use stacking",
                  "Degradation modeling",
                  "Market participation"],

                  link: "/solutions/cost-optimization"
                }].
                map((capability, index) =>
                <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow group">
                    <div className="inline-flex p-3 rounded-lg bg-blue-500/10">
                      <capability.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold">{capability.title}</h3>
                    <p className="text-muted-foreground text-sm">{capability.description}</p>
                    <ul className="space-y-2">
                      {capability.benefits.map((benefit, idx) =>
                    <li key={idx} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                    )}
                    </ul>
                    <Button asChild variant="link" className="px-0 text-sm group-hover:translate-x-1 transition-transform">
                      <Link to={capability.link}>
                        Learn more
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Proven Utility Use Cases</h2>
              </div>

              <div className="space-y-6">
                {[
                {
                  utility: "Regional Electric Cooperative",
                  challenge: "Managing peak demand growth without infrastructure upgrades",
                  solution: "Implemented AI-driven demand response program and load forecasting",
                  results: [
                  "Reduced peak demand by 12% (18 MW)",
                  "Avoided $25M substation upgrade",
                  "Increased renewable penetration to 35%",
                  "Improved customer satisfaction scores by 28%"]

                },
                {
                  utility: "Municipal Electric Utility",
                  challenge: "Integrating large-scale solar while maintaining grid reliability",
                  solution: "Deployed renewable forecasting and battery storage optimization",
                  results: [
                  "Achieved 55% renewable energy mix",
                  "Reduced solar curtailment by 80%",
                  "Saved $4.2M in wholesale power costs",
                  "Zero weather-related outages in 18 months"]

                },
                {
                  utility: "Investor-Owned Utility (IOU)",
                  challenge: "Optimizing generation dispatch across diverse asset portfolio",
                  solution: "Implemented AI-powered economic dispatch and unit commitment",
                  results: [
                  "$12M annual fuel cost savings",
                  "15% reduction in emissions",
                  "Improved day-ahead market performance",
                  "20% faster response to grid events"]

                }].
                map((caseStudy, index) =>
                <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                    <div className="space-y-6">
                      <div>
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                          Case Study {index + 1}
                        </div>
                        <h3 className="text-2xl font-semibold mb-3">{caseStudy.utility}</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <div className="font-semibold mb-2">Challenge</div>
                            <p className="text-muted-foreground">{caseStudy.challenge}</p>
                          </div>
                          <div>
                            <div className="font-semibold mb-2">Solution</div>
                            <p className="text-muted-foreground">{caseStudy.solution}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold mb-3">Results</div>
                        <div className="grid md:grid-cols-2 gap-3">
                          {caseStudy.results.map((result, idx) =>
                        <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground">{result}</span>
                            </div>
                        )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Seamless System Integration</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Connect with your existing utility infrastructure and systems.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                "SCADA Systems",
                "Energy Management Systems (EMS)",
                "Distribution Management Systems (DMS)",
                "Outage Management Systems (OMS)",
                "Customer Information Systems (CIS)",
                "Meter Data Management (MDM)",
                "Weather Data Providers",
                "Market Management Systems"].
                map((system, index) =>
                <Card key={index} className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                      <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="font-semibold">{system}</div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Summary Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Measurable Utility Benefits</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                {
                  metric: "10-15%",
                  label: "Operating Cost Reduction"
                },
                {
                  metric: "95%+",
                  label: "Load Forecast Accuracy"
                },
                {
                  metric: "30-40%",
                  label: "More Renewable Integration"
                },
                {
                  metric: "50%",
                  label: "Fewer Unplanned Outages"
                }].
                map((stat, index) =>
                <Card key={index} className="p-8 text-center space-y-2">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {stat.metric}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                )}
              </div>

              <div className="pt-8">
                <Card className="p-8 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-background border-blue-500/20">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 space-y-3">
                      <h3 className="text-2xl font-semibold">Explore Utility Dashboard</h3>
                      <p className="text-muted-foreground text-lg">
                        See how our AI platform transforms utility operations with real-time insights and optimization.
                      </p>
                    </div>
                    <Button asChild size="lg">
                      <Link to="/dashboard/utility">
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
                <h2 className="text-3xl md:text-5xl font-bold">Explore Our Solutions</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                {
                  title: "Demand Forecasting",
                  description: "Industry-leading load prediction accuracy",
                  link: "/solutions/demand-forecasting",
                  icon: TrendingUp
                },
                {
                  title: "Grid Optimization",
                  description: "Real-time AI-powered operations",
                  link: "/solutions/ai-energy-optimization",
                  icon: Zap
                },
                {
                  title: "Sustainability",
                  description: "Clean energy transition enablement",
                  link: "/solutions/sustainability",
                  icon: Wind
                }].
                map((solution, index) =>
                <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow group">
                    <div className="inline-flex p-3 rounded-lg bg-blue-500/10">
                      <solution.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                title="Transform Your Utility Operations"
                description="Join leading utilities using AI to improve reliability, integrate renewables, and deliver exceptional customer value."
                primaryButtonText="Schedule Consultation" />

            </div>
          </div>
        </section>
      </div>
    </>);

}