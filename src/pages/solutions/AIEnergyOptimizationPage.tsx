import SEOHead from '@/components/SEOHead';
import SolutionsCTA from '@/components/SolutionsCTA';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Zap,
  Brain,
  TrendingDown,
  Clock,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Activity } from
'lucide-react';

export default function AIEnergyOptimizationPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI-Powered Energy Optimization",
    "description": "Advanced artificial intelligence solutions for optimizing energy consumption, reducing costs, and improving operational efficiency.",
    "provider": {
      "@type": "Organization",
      "name": "EnergyAI"
    },
    "serviceType": "Energy Management Software",
    "areaServed": "Worldwide"
  };

  return (
    <>
      <SEOHead
        title="AI-Powered Energy Optimization | Reduce Costs & Improve Efficiency"
        description="Leverage advanced AI and machine learning to optimize energy consumption, reduce operational costs by up to 30%, and improve grid stability with real-time predictive analytics."
        keywords="AI energy optimization, machine learning energy management, predictive energy analytics, smart grid optimization, energy efficiency AI"
        canonicalUrl="/solutions/ai-energy-optimization"
        ogImage="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=630&fit=crop"
        schema={schema} />


      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                <Brain className="h-4 w-4" />
                AI-Powered Solutions
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Transform Energy Management with Artificial Intelligence
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Harness the power of advanced machine learning algorithms to optimize energy consumption, 
                predict demand patterns, and reduce operational costs by up to 30%.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="text-lg">
                  <Link to="/onboarding">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link to="/solutions/demand-forecasting">
                    View Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">How AI Energy Optimization Works</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Our intelligent platform combines multiple AI technologies to deliver unprecedented energy efficiency.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                {
                  icon: Activity,
                  title: "Data Collection",
                  description: "Real-time monitoring of energy consumption, weather patterns, and operational metrics across all facilities."
                },
                {
                  icon: Brain,
                  title: "AI Analysis",
                  description: "Machine learning algorithms analyze patterns, detect anomalies, and identify optimization opportunities."
                },
                {
                  icon: BarChart3,
                  title: "Predictive Insights",
                  description: "Advanced forecasting models predict future demand and recommend optimal resource allocation."
                },
                {
                  icon: Zap,
                  title: "Automated Actions",
                  description: "Intelligent systems automatically adjust operations to maximize efficiency and minimize waste."
                }].
                map((step, index) =>
                <Card key={index} className="p-6 space-y-4 relative overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5">
                      {index + 1}
                    </div>
                    <div className="relative">
                      <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Key Benefits of AI Optimization</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Transform your energy operations with measurable results and ROI.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                {
                  icon: TrendingDown,
                  title: "Reduce Costs by 30%",
                  description: "Optimize energy consumption patterns and eliminate waste to achieve significant cost savings."
                },
                {
                  icon: Clock,
                  title: "Real-Time Optimization",
                  description: "Make instant adjustments based on current conditions and market prices."
                },
                {
                  icon: BarChart3,
                  title: "Predictive Accuracy",
                  description: "Forecast energy demand with 95%+ accuracy using advanced ML models."
                },
                {
                  icon: Shield,
                  title: "Enhanced Reliability",
                  description: "Prevent outages and equipment failures with predictive maintenance alerts."
                },
                {
                  icon: Cpu,
                  title: "Automated Control",
                  description: "Reduce manual intervention with intelligent automation systems."
                },
                {
                  icon: Zap,
                  title: "Peak Demand Management",
                  description: "Avoid expensive peak charges with smart load balancing."
                }].
                map((benefit, index) =>
                <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                      <benefit.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
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
                <h2 className="text-3xl md:text-5xl font-bold">Real-World Use Cases</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  See how organizations across industries are leveraging AI for energy optimization.
                </p>
              </div>

              <div className="space-y-8">
                {[
                {
                  title: "Smart Grid Management",
                  description: "Utility companies use AI to balance supply and demand in real-time, integrating renewable energy sources and preventing grid instability.",
                  link: "/industries/utilities",
                  linkText: "Learn more about utility solutions"
                },
                {
                  title: "Manufacturing Optimization",
                  description: "Industrial facilities reduce energy costs by optimizing production schedules, equipment usage, and HVAC systems based on predictive analytics.",
                  link: "/industries/enterprises",
                  linkText: "Explore enterprise solutions"
                },
                {
                  title: "Commercial Building Efficiency",
                  description: "Office buildings and retail spaces achieve 25-35% energy savings through intelligent climate control and lighting optimization.",
                  link: "/solutions/cost-optimization",
                  linkText: "Discover cost optimization"
                },
                {
                  title: "Renewable Energy Integration",
                  description: "AI forecasts solar and wind generation patterns to optimize battery storage and maximize renewable energy utilization.",
                  link: "/solutions/sustainability",
                  linkText: "View sustainability impact"
                }].
                map((useCase, index) =>
                <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-2xl font-semibold">{useCase.title}</h3>
                        <p className="text-muted-foreground text-lg">{useCase.description}</p>
                        <Button asChild variant="link" className="px-0">
                          <Link to={useCase.link}>
                            {useCase.linkText}
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

        {/* Technology Overview Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Advanced AI Technology Stack</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Built on cutting-edge machine learning and data science technologies.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 space-y-4">
                  <h3 className="text-2xl font-semibold">Machine Learning Models</h3>
                  <ul className="space-y-3">
                    {[
                    "Time series forecasting (LSTM, Prophet, ARIMA)",
                    "Deep neural networks for pattern recognition",
                    "Ensemble methods for improved accuracy",
                    "Reinforcement learning for optimization"].
                    map((item, index) =>
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    )}
                  </ul>
                </Card>

                <Card className="p-8 space-y-4">
                  <h3 className="text-2xl font-semibold">Data Processing</h3>
                  <ul className="space-y-3">
                    {[
                    "Real-time data streaming and processing",
                    "Multi-source data integration",
                    "Anomaly detection and alerting",
                    "Historical data analysis and insights"].
                    map((item, index) =>
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    )}
                  </ul>
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
                <h2 className="text-3xl md:text-5xl font-bold">Explore Related Solutions</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                {
                  title: "Demand Forecasting",
                  description: "Predict energy demand with unprecedented accuracy",
                  link: "/solutions/demand-forecasting",
                  icon: BarChart3
                },
                {
                  title: "Cost Optimization",
                  description: "Maximize savings and ROI with intelligent pricing",
                  link: "/solutions/cost-optimization",
                  icon: TrendingDown
                },
                {
                  title: "Sustainability",
                  description: "Reduce carbon footprint and achieve ESG goals",
                  link: "/solutions/sustainability",
                  icon: Zap
                }].
                map((solution, index) =>
                <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow group">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                      <solution.icon className="h-6 w-6" />
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
              <SolutionsCTA />
            </div>
          </div>
        </section>
      </div>
    </>);

}