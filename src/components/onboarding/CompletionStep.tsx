import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface CompletionStepProps {
  onNext: () => void;
}

const CompletionStep = ({ onNext }: CompletionStepProps) => {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Welcome Aboard! 🎉
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Your account has been successfully created and you're all set to start using Honeypotz Inc.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 my-8">
        <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
        <ul className="text-left space-y-2 text-sm text-gray-700 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Access your personalized dashboard</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Explore AI forecasting and optimization tools</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Generate your first synthetic dataset or ESG report</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Connect with our support team for assistance</span>
          </li>
        </ul>
      </div>

      <Button 
        onClick={onNext} 
        size="lg"
        className="w-full sm:w-auto px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base"
      >
        Go to Dashboard
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

      <p className="text-xs text-gray-500 mt-4">
        Need help? Contact us at support@honeypotz.com
      </p>
    </div>
  );
};

export default CompletionStep;