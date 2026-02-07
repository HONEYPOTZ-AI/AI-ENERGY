import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingData } from '@/pages/OnboardingPage';
import { Building2 } from 'lucide-react';

interface CompanyInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const CompanyInfoStep = ({ data, updateData }: CompanyInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
        <p className="text-gray-600">Tell us about your organization</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="required">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            placeholder="Enter your company name"
            value={data.companyName}
            onChange={(e) => updateData({ companyName: e.target.value })}
            className="text-base" />

        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="required">
            Industry <span className="text-red-500">*</span>
          </Label>
          <Input
            id="industry"
            placeholder="e.g., Energy, Manufacturing, Healthcare"
            value={data.industry}
            onChange={(e) => updateData({ industry: e.target.value })}
            className="text-base" />

        </div>

        <div className="space-y-2">
          <Label htmlFor="companySize" className="required">
            Company Size <span className="text-red-500">*</span>
          </Label>
          <select
            id="companySize"
            value={data.companySize}
            onChange={(e) => updateData({ companySize: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">

            <option value="">Select company size</option>
            <option value="small">Small (1-50 employees)</option>
            <option value="medium">Medium (51-250 employees)</option>
            <option value="large">Large (251-1000 employees)</option>
            <option value="enterprise">Enterprise (1000+ employees)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactName" className="required">
            Primary Contact Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contactName"
            placeholder="Enter your full name"
            value={data.contactName}
            onChange={(e) => updateData({ contactName: e.target.value })}
            className="text-base" />

        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-gray-400">(Optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            className="text-base" />

        </div>
      </div>
    </div>);

};

export default CompanyInfoStep;