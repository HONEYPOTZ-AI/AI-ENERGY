import SEOHead from '@/components/SEOHead';
import SolutionsCTA from '@/components/SolutionsCTA';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Target,
  Clock,
  Brain,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle2,
  Activity,
  AlertCircle } from
'lucide-react';

export default function DemandForecastingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI Demand Forecasting",
    "description": "Advanced machine learning models for accurate energy demand prediction with 95%+ accuracy, enabling optimal resource planning and cost reduction.",
    "provider": {
      "@type": "Organization",
      "name": "EnergyAI"
    },
    "serviceType": "Predictive Analytics Software"
  };

  return (
    <>
      <SEOHead
        title="AI Demand Forecasting | 95%+ Accuracy for Energy Prediction"
        description="Predict energy demand with unprecedented 95%+ accuracy using advanced machine learning. Optimize resource allocation, reduce costs, and improve grid reliability with intelligent forecasting."
        keywords="demand forecasting, energy prediction, load forecasting, AI forecasting, machine learning prediction, energy analytics, demand planning"
        canonicalUrl="/solutions/demand-forecasting"
        ogImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop"
        schema={schema} />


      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-500/10 via-background to-background border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium">
                <LineChart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Predictive Analytics
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Predict Energy Demand with 95%+ Accuracy
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Leverage advanced machine learning and time series analysis to forecast energy demand 
                with industry-leading accuracy, enabling optimal planning and resource allocation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="text-lg">
                  <Link to="/onboarding">
                    Try Forecasting
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link to="/dashboard/forecasting">
                    View Live Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Accuracy & Performance Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Industry-Leading Accuracy</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Our AI models deliver consistent, reliable predictions across all time horizons.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                {
                  title: "Short-Term",
                  timeframe: "Next 24-48 hours",
                  accuracy: "95-97%",
                  description: "Ideal for operational planning, real-time optimization, and day-ahead market participation.",
                  icon: Clock
                },
                {
                  title: "Medium-Term",
                  timeframe: "1-4 weeks",
                  accuracy: "92-95%",
                  description: "Perfect for maintenance scheduling, staffing decisions, and resource procurement planning.",
                  icon: Target
                },
                {
                  title: "Long-Term",
                  timeframe: "1-12 months",
                  accuracy: "88-92%",
                  description: "Essential for capacity planning, infrastructure investment, and strategic decision-making.",
                  icon: TrendingUp
                }].
                map((forecast, index) =>
                <Card key={index} className="p-8 space-y-4 hover:shadow-lg transition-shadow">
                    <div className="inline-flex p-3 rounded-lg bg-blue-500/10">
                      <forecast.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-semibold">{forecast.title}</h3>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">{forecast.timeframe}</div>
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {forecast.accuracy}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{forecast.description}</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Advanced Forecasting Methodology</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Combining multiple AI techniques for superior prediction accuracy.
                </p>
              </div>

              <div className="space-y-6">
                {[
                {
                  title: "Multi-Model Ensemble",
                  description: "We combine predictions from multiple algorithms (LSTM, Prophet, ARIMA, XGBoost) to achieve superior accuracy and robustness.",
                  icon: Brain,
                  features: [
                  "Deep learning neural networks for pattern recognition",
                  "Statistical models for trend analysis",
                  "Gradient boosting for feature importance",
                  "Ensemble weighting based on historical performance"]

                },
                {
                  title: "Comprehensive Data Integration",
                  description: "Our models consider dozens of variables to understand the full context of energy demand patterns.",
                  icon: Activity,
                  features: [
                  "Historical consumption patterns and seasonality",
                  "Weather forecasts (temperature, humidity, cloud cover)",
                  "Calendar effects (holidays, day of week, events)",
                  "Economic indicators and business activity"]

                },
                {
                  title: "Continuous Learning",
                  description: "Models automatically adapt to changing patterns and improve over time with new data.",
                  icon: TrendingUp,
                  features: [
                  "Daily model retraining with latest data",
                  "Automatic anomaly detection and handling",
                  "Performance monitoring and optimization",
                  "Feedback loop integration from actual results"]

                }].
                map((method, index) =>
                <Card key={index} className="p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="inline-flex p-4 rounded-lg bg-blue-500/10">
                          <method.icon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-semibold">{method.title}</h3>
                        <p className="text-lg text-muted-foreground">{method.description}</p>
                        <ul className="grid md:grid-cols-2 gap-3 pt-2">
                          {method.features.map((feature, idx) =>
                        <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </li>
                        )}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Business Value Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Measurable Business Value</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Accurate forecasting drives better decisions and significant cost savings.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                {
                  title: "Cost Reduction",
                  stat: "15-25%",
                  description: "Lower energy procurement costs through better planning and market timing.",
                  benefits: [
                  "Avoid expensive peak demand charges",
                  "Optimize day-ahead market participation",
                  "Reduce reserve capacity requirements",
                  "Minimize penalty costs for imbalances"]

                },
                {
                  title: "Operational Efficiency",
                  stat: "30%",
                  description: "Improve resource utilization and reduce manual planning overhead.",
                  benefits: [
                  "Automate scheduling and dispatch",
                  "Optimize maintenance windows",
                  "Reduce emergency interventions",
                  "Improve staff allocation"]

                },
                {
                  title: "Grid Reliability",
                  stat: "99.9%",
                  description: "Enhance system stability and prevent outages through proactive planning.",
                  benefits: [
                  "Predict and prevent overload situations",
                  "Optimize spinning reserve levels",
                  "Improve load balancing",
                  "Support renewable integration"]

                },
                {
                  title: "Renewable Integration",
                  stat: "40%",
                  description: "Maximize clean energy utilization with accurate generation and demand forecasts.",
                  benefits: [
                  "Optimize battery storage charging",
                  "Balance intermittent generation",
                  "Reduce curtailment of renewables",
                  "Enable demand response programs"]

                }].
                map((value, index) =>
                <Card key={index} className="p-8 space-y-6">
                    <div className="flex items-start justify-between">
                      <h3 className="text-2xl font-semibold">{value.title}</h3>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {value.stat}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{value.description}</p>
                    <ul className="space-y-2">
                      {value.benefits.map((benefit, idx) =>
                    <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                    )}
                    </ul>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Forecasting Across Industries</h2>
              </div>

              <div className="space-y-6">
                {[
                {
                  industry: "Utility Companies",
                  scenario: "Grid Load Forecasting",
                  description: "Predict regional and system-wide electricity demand to optimize generation dispatch, reserve requirements, and market participation.",
                  link: "/industries/utilities"
                },
                {
                  industry: "Manufacturing",
                  scenario: "Production Energy Planning",
                  description: "Forecast facility energy needs based on production schedules, enabling optimal procurement and peak demand management.",
                  link: "/industries/enterprises"
                },
                {
                  industry: "Commercial Real Estate",
                  scenario: "Building Load Prediction",
                  description: "Anticipate HVAC and lighting needs across property portfolios to minimize costs while maintaining comfort.",
                  link: "/solutions/cost-optimization"
                },
                {
                  industry: "Data Centers",
                  scenario: "Capacity Planning",
                  description: "Predict computing load and cooling requirements to ensure reliability while optimizing energy consumption.",
                  link: "/industries/enterprises"
                }].
                map((useCase, index) =>
                <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            {useCase.industry}
                          </div>
                          <h3 className="text-2xl font-semibold mt-1">{useCase.scenario}</h3>
                        </div>
                        <Button asChild variant="outline">
                          <Link to={useCase.link}>
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-lg">{useCase.description}</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Powerful Forecasting Features</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                {
                  icon: LineChart,
                  title: "Interactive Visualizations",
                  description: "Explore forecasts with intuitive charts, confidence intervals, and scenario comparisons."
                },
                {
                  icon: AlertCircle,
                  title: "Anomaly Detection",
                  description: "Automatic identification of unusual patterns and potential forecast errors."
                },
                {
                  icon: Zap,
                  title: "Real-Time Updates",
                  description: "Forecasts automatically update as new data becomes available."
                },
                {
                  icon: Target,
                  title: "Scenario Planning",
                  description: "Model different conditions and their impact on energy demand."
                },
                {
                  icon: Activity,
                  title: "Confidence Intervals",
                  description: "Understand prediction uncertainty with probabilistic forecasts."
                },
                {
                  icon: Brain,
                  title: "Explainable AI",
                  description: "See which factors are driving forecasted changes."
                }].
                map((feature, index) =>
                <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                    <div className="inline-flex p-3 rounded-lg bg-blue-500/10">
                      <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                )}
              </div>

              <div className="pt-8">
                <Card className="p-8 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-background border-blue-500/20">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 space-y-3">
                      <h3 className="text-2xl font-semibold">Try Live Forecasting</h3>
                      <p className="text-muted-foreground text-lg">
                        Explore our forecasting dashboard with real-time predictions and analytics.
                      </p>
                    </div>
                    <Button asChild size="lg">
                      <Link to="/dashboard/forecasting">
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
                <h2 className="text-3xl md:text-5xl font-bold">Complete AI Platform</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                {
                  title: "AI Energy Optimization",
                  description: "Use forecasts to drive intelligent optimization",
                  link: "/solutions/ai-energy-optimization",
                  icon: Brain
                },
                {
                  title: "Cost Optimization",
                  description: "Minimize expenses with predictive planning",
                  link: "/solutions/cost-optimization",
                  icon: TrendingUp
                },
                {
                  title: "Utility Solutions",
                  description: "Grid-scale forecasting and management",
                  link: "/industries/utilities",
                  icon: Zap
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
                title="Experience Forecasting Excellence"
                description="See how accurate demand prediction can transform your energy management and drive significant cost savings."
                primaryButtonText="Start Forecasting" />

            </div>
          </div>
        </section>
      </div>
    </>);

}