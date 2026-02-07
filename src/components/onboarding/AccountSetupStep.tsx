import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { OnboardingData } from '@/pages/OnboardingPage';
import { UserCircle, Eye, EyeOff } from 'lucide-react';

interface AccountSetupStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const AccountSetupStep = ({ data, updateData }: AccountSetupStepProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
        <p className="text-gray-600">Set up your login credentials</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="required">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@company.com"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className="text-base"
          />
          <p className="text-xs text-gray-500">This will be your username for login</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="required">
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a secure password"
              value={data.password}
              onChange={(e) => updateData({ password: e.target.value })}
              className="text-base pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">Must be at least 6 characters</p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={data.acceptedTerms}
              onCheckedChange={(checked) => 
                updateData({ acceptedTerms: checked as boolean })
              }
              className="mt-1"
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-700 cursor-pointer leading-relaxed"
            >
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              <span className="text-red-500 ml-1">*</span>
            </Label>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">🔒 Your data is secure.</span> We use industry-standard 
            encryption and never share your information with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSetupStep;