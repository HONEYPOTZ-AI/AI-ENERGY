import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Zap, Database, TrendingUp, Shield, Leaf, BarChart3, Settings, ArrowRight } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
  {
    icon: Database,
    title: "Synthetic Data Generator",
    description: "Generate realistic energy consumption patterns for training and testing AI models",
    color: "text-blue-500"
  },
  {
    icon: TrendingUp,
    title: "AI Forecasting",
    description: "Predict energy demand with high accuracy using advanced machine learning algorithms",
    color: "text-purple-500"
  },
  {
    icon: Settings,
    title: "Optimization Engine",
    description: "Optimize energy distribution and reduce operational costs with AI-driven insights",
    color: "text-green-500"
  },
  {
    icon: Shield,
    title: "ESG Compliance",
    description: "Track and report environmental, social, and governance metrics effortlessly",
    color: "text-orange-500"
  }];


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Energy Optimizer
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="ghost">About</Button>
              <Button onClick={() => navigate('/dashboard/utility')}>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Leaf className="h-3 w-3 mr-1" />
              Powered by Advanced AI
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              AI-Powered Energy Optimization
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                for Utilities & Enterprises
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your energy management with intelligent forecasting, optimization, and ESG compliance. 
              Reduce costs, improve efficiency, and meet sustainability goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" onClick={() => navigate('/dashboard/utility')} className="text-lg">
                Utility Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/dashboard/enterprise')} className="text-lg">
                Enterprise Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">98%</div>
              <div className="text-sm text-gray-600 mt-1">Forecast Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">35%</div>
              <div className="text-sm text-gray-600 mt-1">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600 mt-1">Real-time Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">Zero</div>
              <div className="text-sm text-gray-600 mt-1">Carbon Target</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Comprehensive Energy Solutions</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to optimize energy management, reduce costs, and achieve sustainability goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border ${feature.color}`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>);

            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardHeader className="text-center space-y-4 py-12">
              <CardTitle className="text-3xl text-white">Ready to Optimize Your Energy?</CardTitle>
              <CardDescription className="text-lg text-blue-50">
                Start making data-driven decisions today with our AI-powered platform
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" onClick={() => navigate('/dashboard/utility')}>
                  Launch Utility Dashboard
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white bg-white text-[#171717]" onClick={() => navigate('/dashboard/enterprise')}>
                  Launch Enterprise Dashboard
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold">AI Energy Optimizer</span>
          </div>
          <p className="text-gray-600">© {new Date().getFullYear()} AI Energy Optimizer. All rights reserved.</p>
          <p className="text-sm text-gray-500 mt-2">Powering sustainable energy management worldwide</p>
        </div>
      </footer>
    </div>);

};

export default HomePage;