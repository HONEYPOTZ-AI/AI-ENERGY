import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import CompanyInfoStep from '@/components/onboarding/CompanyInfoStep';
import UseCaseStep from '@/components/onboarding/UseCaseStep';
import AccountSetupStep from '@/components/onboarding/AccountSetupStep';
import CompletionStep from '@/components/onboarding/CompletionStep';

export interface OnboardingData {
  companyName: string;
  industry: string;
  companySize: string;
  contactName: string;
  phone: string;
  useCases: string[];
  email: string;
  password: string;
  acceptedTerms: boolean;
}

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    companyName: '',
    industry: '',
    companySize: '',
    contactName: '',
    phone: '',
    useCases: [],
    email: '',
    password: '',
    acceptedTerms: false,
  });

  const steps = [
    { id: 0, name: 'Welcome', component: WelcomeStep },
    { id: 1, name: 'Company Info', component: CompanyInfoStep },
    { id: 2, name: 'Use Cases', component: UseCaseStep },
    { id: 3, name: 'Account', component: AccountSetupStep },
    { id: 4, name: 'Complete', component: CompletionStep },
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1: // Company Info
        if (!onboardingData.companyName.trim()) {
          toast({ title: 'Error', description: 'Company name is required', variant: 'destructive' });
          return false;
        }
        if (!onboardingData.industry.trim()) {
          toast({ title: 'Error', description: 'Industry is required', variant: 'destructive' });
          return false;
        }
        if (!onboardingData.companySize) {
          toast({ title: 'Error', description: 'Company size is required', variant: 'destructive' });
          return false;
        }
        if (!onboardingData.contactName.trim()) {
          toast({ title: 'Error', description: 'Contact name is required', variant: 'destructive' });
          return false;
        }
        return true;

      case 2: // Use Cases
        if (onboardingData.useCases.length === 0) {
          toast({ title: 'Error', description: 'Please select at least one use case', variant: 'destructive' });
          return false;
        }
        return true;

      case 3: // Account Setup
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!onboardingData.email.trim()) {
          toast({ title: 'Error', description: 'Email is required', variant: 'destructive' });
          return false;
        }
        if (!emailRegex.test(onboardingData.email)) {
          toast({ title: 'Error', description: 'Please enter a valid email address', variant: 'destructive' });
          return false;
        }
        if (!onboardingData.password) {
          toast({ title: 'Error', description: 'Password is required', variant: 'destructive' });
          return false;
        }
        if (onboardingData.password.length < 6) {
          toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
          return false;
        }
        if (!onboardingData.acceptedTerms) {
          toast({ title: 'Error', description: 'Please accept the terms and conditions', variant: 'destructive' });
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (currentStep === 3) {
      // Last step before completion - submit data
      if (!validateStep()) return;
      
      setIsSubmitting(true);
      try {
        // Create user account
        const { error: registerError } = await window.ezsite.apis.register({
          email: onboardingData.email,
          password: onboardingData.password,
          name: onboardingData.contactName,
        });

        if (registerError) {
          throw new Error(registerError);
        }

        // Save to leads table
        const { error: leadsError } = await window.ezsite.apis.tableCreate(74746, {
          company_name: onboardingData.companyName,
          contact_person_name: onboardingData.contactName,
          email: onboardingData.email,
          phone: onboardingData.phone || '',
          industry: onboardingData.industry,
          company_size: onboardingData.companySize,
          use_case: onboardingData.useCases.join(','),
          onboarding_status: 'completed',
          lead_source: 'onboarding_wizard',
          notes: `Use cases selected: ${onboardingData.useCases.join(', ')}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (leadsError) {
          throw new Error(leadsError);
        }

        // Move to completion step
        setCurrentStep(4);
        toast({ title: 'Success', description: 'Account created successfully!' });
      } catch (error: any) {
        toast({ 
          title: 'Error', 
          description: error.message || 'Failed to complete onboarding. Please try again.',
          variant: 'destructive' 
        });
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep < totalSteps - 1) {
      if (validateStep()) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard/utility');
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="p-6 md:p-8">
          {/* Progress Bar */}
          {currentStep < totalSteps - 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Step {currentStep + 1} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                data={onboardingData}
                updateData={updateData}
                onNext={currentStep === 4 ? handleGoToDashboard : handleNext}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep < totalSteps - 1 && (
            <div className="flex items-center justify-between mt-8 gap-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2 min-w-[100px]"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center gap-2 min-w-[100px]"
              >
                {isSubmitting ? 'Submitting...' : currentStep === 3 ? 'Complete' : 'Next'}
                {!isSubmitting && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;