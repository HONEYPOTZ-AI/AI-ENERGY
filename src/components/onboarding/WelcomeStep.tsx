import { Zap, TrendingUp, Leaf, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Zap className="w-10 h-10 text-white" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Welcome to AI ENERGY Optimizer
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Your AI-Powered Energy Intelligence Platform
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8">
        <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-blue-50">
          <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">AI Forecasting</h3>
            <p className="text-sm text-gray-600">Predict energy demand with precision</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-green-50">
          <Leaf className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">ESG Reports</h3>
            <p className="text-sm text-gray-600">Track sustainability metrics</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-purple-50">
          <Database className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Synthetic Data</h3>
            <p className="text-sm text-gray-600">Generate realistic datasets</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-orange-50">
          <Zap className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Optimization</h3>
            <p className="text-sm text-gray-600">Reduce costs and emissions</p>
          </div>
        </div>
      </div>

      <Button
        onClick={onNext}
        size="lg"
        className="w-full sm:w-auto px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">

        Get Started
      </Button>
    </div>);

};

export default WelcomeStep;