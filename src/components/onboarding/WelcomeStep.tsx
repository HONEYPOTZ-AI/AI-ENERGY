import { Zap, TrendingUp, Leaf, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center mb-6">
        <Logo className="h-20 w-auto" alt="Company Logo" />
      </div>
      
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to AI-ENERGY optimizer developed by Honeypotz Inc
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Your AI-Powered Energy Intelligence Platform
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8">
        <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Forecasting</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Predict energy demand with precision</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
          <Leaf className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">ESG Reports</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Track sustainability metrics</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <Database className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Synthetic Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Generate realistic datasets</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
          <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Optimization</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Reduce costs and emissions</p>
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