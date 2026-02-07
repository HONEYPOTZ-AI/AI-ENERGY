import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import UtilityDashboard from "./pages/dashboard/UtilityDashboard";
import EnterpriseDashboard from "./pages/dashboard/EnterpriseDashboard";
import DataGeneratorPage from "./pages/dashboard/DataGeneratorPage";
import ForecastingPage from "./pages/dashboard/ForecastingPage";
import OptimizationPage from "./pages/dashboard/OptimizationPage";
import ESGReportsPage from "./pages/dashboard/ESGReportsPage";
import OnboardingPage from "./pages/OnboardingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import ErrorFallback from "./components/error-fallback";
import { CanonicalManager } from "./components/canonical-manager";

const queryClient = new QueryClient();

const App = () =>
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onError={(error, errorInfo) => {
    console.error(`Error Boundary caught an error(pathname:${location.pathname + location.search}):`, error, errorInfo);
    setTimeout(() => {
      throw error;
    }, 0);
  }}>

    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route element={<CanonicalManager />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard/utility" element={<UtilityDashboard />} />
                <Route path="/dashboard/enterprise" element={<EnterpriseDashboard />} />
                <Route path="/dashboard/data-generator" element={<DataGeneratorPage />} />
                <Route path="/dashboard/forecasting" element={<ForecastingPage />} />
                <Route path="/dashboard/optimization" element={<OptimizationPage />} />
                <Route path="/dashboard/esg-reports" element={<ESGReportsPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>;


export default App;