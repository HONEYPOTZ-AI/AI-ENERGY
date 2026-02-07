import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { OnboardingData } from '@/pages/OnboardingPage';
import { TrendingUp, Zap, Leaf, Database } from 'lucide-react';

interface UseCaseStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const useCases = [
{
  id: 'ai_forecasting',
  title: 'AI Forecasting',
  description: 'Predict energy demand, prices, and consumption patterns with advanced machine learning models',
  icon: TrendingUp,
  color: 'text-purple-600',
  bgColor: 'bg-purple-50'
},
{
  id: 'optimization',
  title: 'Optimization Engine',
  description: 'Optimize energy distribution, reduce costs, and minimize carbon emissions with intelligent algorithms',
  icon: Zap,
  color: 'text-orange-600',
  bgColor: 'bg-orange-50'
},
{
  id: 'esg_reporting',
  title: 'ESG Reporting',
  description: 'Generate comprehensive sustainability reports for compliance and stakeholder transparency',
  icon: Leaf,
  color: 'text-green-600',
  bgColor: 'bg-green-50'
},
{
  id: 'synthetic_data',
  title: 'Synthetic Data Generation',
  description: 'Create realistic energy datasets for testing, training, and scenario analysis',
  icon: Database,
  color: 'text-blue-600',
  bgColor: 'bg-blue-50'
}];


const UseCaseStep = ({ data, updateData }: UseCaseStepProps) => {
  const handleToggle = (useCaseId: string) => {
    const newUseCases = data.useCases.includes(useCaseId) ?
    data.useCases.filter((id) => id !== useCaseId) :
    [...data.useCases, useCaseId];
    updateData({ useCases: newUseCases });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Select Your Use Cases</h2>
        <p className="text-gray-600">Choose the features that matter most to you</p>
        <p className="text-sm text-gray-500">(Select at least one)</p>
      </div>

      <div className="space-y-3">
        {useCases.map((useCase) => {
          const Icon = useCase.icon;
          const isSelected = data.useCases.includes(useCase.id);

          return (
            <div
              key={useCase.id}
              onClick={() => handleToggle(useCase.id)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${isSelected ?
              'border-blue-500 bg-blue-50 shadow-md' :
              'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}
              `
              }>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Checkbox
                    id={useCase.id}
                    checked={isSelected}
                    onCheckedChange={() => handleToggle(useCase.id)}
                    className="w-5 h-5" />

                </div>
                
                <div className="flex-grow">
                  <div className="flex items-start gap-3">
                    <div className={`${useCase.bgColor} p-2 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${useCase.color}`} />
                    </div>
                    <div className="flex-grow">
                      <Label
                        htmlFor={useCase.id}
                        className="text-base font-semibold text-gray-900 cursor-pointer">

                        {useCase.title}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>);

        })}
      </div>
    </div>);

};

export default UseCaseStep;