import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Database, 
  TrendingUp, 
  Leaf, 
  BarChart3, 
  Settings, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  Globe,
  Shield,
  Target,
  Mail,
  Phone,
  MapPin,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: '',
    message: ''
  });

  const features = [
    {
      icon: TrendingUp,
      title: 'AI Load Forecasting',
      description: 'Predict energy demand with 98% accuracy using advanced machine learning models trained on real-world patterns',
      color: 'from-blue-500 to-cyan-500',
      iconColor: 'text-blue-500'
    },
    {
      icon: Settings,
      title: 'Energy Optimization',
      description: 'Reduce operational costs by up to 35% with intelligent energy distribution and real-time optimization algorithms',
      color: 'from-green-500 to-emerald-500',
      iconColor: 'text-green-500'
    },
    {
      icon: Database,
      title: 'Synthetic Data Generation',
      description: 'Generate realistic energy consumption patterns for AI model training, testing, and validation',
      color: 'from-purple-500 to-pink-500',
      iconColor: 'text-purple-500'
    },
    {
      icon: Leaf,
      title: 'ESG Reporting',
      description: 'Automated environmental, social, and governance compliance reporting with real-time carbon tracking',
      color: 'from-orange-500 to-red-500',
      iconColor: 'text-orange-500'
    }
  ];

  const industries = [
    'Utilities & Energy',
    'Manufacturing',
    'Healthcare',
    'Technology',
    'Retail',
    'Finance',
    'Transportation',
    'Real Estate',
    'Government',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.contactName || !formData.email) {
      toast({
        title: 'Required Fields',
        description: 'Please fill in company name, contact name, and email',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await window.ezsite.apis.tableCreate(74746, {
        company_name: formData.companyName,
        contact_person_name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        industry: formData.industry,
        onboarding_status: 'new',
        lead_source: 'website',
        notes: formData.message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      toast({
        title: 'Request Submitted!',
        description: 'Our team will contact you shortly to schedule a demo.'
      });

      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        industry: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Please try again or contact us directly.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative">
                <Zap className="h-8 w-8 text-blue-600" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Honeypotz Inc
                </h1>
                <p className="text-xs text-gray-500">AI Energy Optimizer</p>
              </div>
            </motion.div>
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                About
              </Button>
              <Button variant="ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Features
              </Button>
              <Button variant="ghost" onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Demo
              </Button>
              <Button variant="ghost" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Contact
              </Button>
              <Button onClick={() => navigate('/onboarding')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Get Started
              </Button>
            </nav>
            <Button 
              className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600" 
              size="sm"
              onClick={() => navigate('/onboarding')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Revolutionizing Energy Management with AI
              </Badge>
            </motion.div>
            
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              AI-Powered Energy
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Optimization Platform
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Transform your energy management with intelligent forecasting, optimization, and ESG compliance. 
              Reduce costs by 35%, achieve 98% forecast accuracy, and meet sustainability goals.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                size="lg" 
                onClick={() => navigate('/onboarding')} 
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-shadow"
              >
                Start Onboarding
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={scrollToDemo}
                className="text-lg px-8 py-6 border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
              >
                Request Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16 md:mt-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { value: '98%', label: 'Forecast Accuracy', color: 'text-blue-600' },
                { value: '35%', label: 'Cost Reduction', color: 'text-green-600' },
                { value: '24/7', label: 'Real-time Monitoring', color: 'text-purple-600' },
                { value: 'Zero', label: 'Carbon Target', color: 'text-orange-600' }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`text-4xl md:text-5xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm md:text-base text-gray-600 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <Badge variant="outline" className="px-3 py-1">
                <Globe className="h-3 w-3 mr-2" />
                About Honeypotz Inc
              </Badge>
              <h3 className="text-3xl md:text-5xl font-bold leading-tight">
                Leading the Future of{' '}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Sustainable Energy
                </span>
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Honeypotz Inc, we're on a mission to revolutionize how organizations manage and optimize their energy consumption. 
                By combining cutting-edge artificial intelligence with deep energy sector expertise, we empower utilities and enterprises 
                to make smarter, more sustainable decisions.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our AI Energy Optimizer platform leverages advanced machine learning algorithms to deliver unprecedented accuracy in 
                energy forecasting, optimization, and ESG reporting. We're committed to building a cleaner, more efficient energy future 
                for generations to come.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                {[
                  { icon: Target, label: 'Mission-Driven', desc: 'Zero Carbon Future' },
                  { icon: Sparkles, label: 'AI Innovation', desc: 'Cutting-Edge Tech' },
                  { icon: Shield, label: 'Trusted Partner', desc: 'Enterprise Grade' }
                ].map((item, idx) => (
                  <Card key={idx} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6 text-center">
                      <item.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                      <div className="font-semibold text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="relative">
              <motion.div
                className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">Sustainable Innovation</div>
                        <div className="text-sm text-gray-500">AI-Driven Solutions</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Pioneering AI technologies that reduce carbon emissions and optimize energy consumption across industries.
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">Global Impact</div>
                        <div className="text-sm text-gray-500">Worldwide Reach</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Partnering with organizations globally to create a more sustainable and efficient energy ecosystem.
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <BarChart3 className="h-4 w-4 mr-2" />
              Platform Capabilities
            </Badge>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">
              Comprehensive Energy Solutions
            </h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to optimize energy management, reduce costs, and achieve sustainability goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200 group">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="h-8 w-8 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-3 group-hover:text-blue-600 transition-colors">
                            {feature.title}
                          </CardTitle>
                          <CardDescription className="text-base leading-relaxed">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard/utility')}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Explore All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section id="demo-section" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
              <Sparkles className="h-4 w-4 mr-2" />
              Platform Preview
            </Badge>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">
              Experience the Power of AI
            </h3>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              See how our platform transforms energy management with real-time insights and intelligent automation
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Utility Dashboard',
                description: 'Comprehensive tools for energy providers to forecast demand, optimize distribution, and manage resources',
                link: '/dashboard/utility',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Enterprise Dashboard',
                description: 'Powerful analytics for businesses to monitor consumption, reduce costs, and track ESG metrics',
                link: '/dashboard/enterprise',
                gradient: 'from-purple-500 to-pink-500'
              }
            ].map((demo, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all h-full">
                  <CardHeader>
                    <div className={`h-40 rounded-lg bg-gradient-to-br ${demo.gradient} mb-4 flex items-center justify-center`}>
                      <BarChart3 className="h-20 w-20 text-white/80" />
                    </div>
                    <CardTitle className="text-2xl text-white mb-3">{demo.title}</CardTitle>
                    <CardDescription className="text-gray-300 text-base mb-4">
                      {demo.description}
                    </CardDescription>
                    <Button 
                      onClick={() => navigate(demo.link)}
                      className="w-full bg-white text-gray-900 hover:bg-gray-100"
                    >
                      View Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-300 mb-6">
              Ready to see it in action?
            </p>
            <Button 
              size="lg" 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-xl"
            >
              Request a Personalized Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="contact" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Mail className="h-4 w-4 mr-2" />
              Get in Touch
            </Badge>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">
              Start Your Journey to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Smart Energy</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill out the form below and our team will contact you shortly to discuss your energy optimization needs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">Request a Demo</CardTitle>
                <CardDescription className="text-base">
                  Let us show you how AI can transform your energy management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        placeholder="Your Company"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        placeholder="Your Name"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your energy optimization needs..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-shadow"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Request Demo
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <Zap className="h-10 w-10 text-blue-400" />
                  <Sparkles className="h-5 w-5 text-yellow-400 absolute -top-1 -right-1" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold">Honeypotz Inc</h4>
                  <p className="text-sm text-gray-400">AI Energy Optimizer</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Leading the future of sustainable energy with AI-powered optimization solutions for utilities and enterprises worldwide.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:contact@honeypotz.com" className="hover:text-white transition-colors">
                    contact@honeypotz.com
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-lg mb-4">Platform</h5>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => navigate('/dashboard/utility')} className="text-gray-400 hover:text-white transition-colors">
                    Utility Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/dashboard/enterprise')} className="text-gray-400 hover:text-white transition-colors">
                    Enterprise Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/onboarding')} className="text-gray-400 hover:text-white transition-colors">
                    Get Started
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-lg mb-4">Company</h5>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Honeypotz Inc. All rights reserved. Powering sustainable energy management worldwide.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;