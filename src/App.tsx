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
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import SeedBlogData from "./pages/SeedBlogData";
import PressListPage from "./pages/PressListPage";
import PressDetailPage from "./pages/PressDetailPage";
import ResourcesPage from "./pages/ResourcesPage";
import CaseStudyDetailPage from "./pages/CaseStudyDetailPage";
import WhitePaperDetailPage from "./pages/WhitePaperDetailPage";
import SeedResourcesData from "./pages/SeedResourcesData";
import SeedPressData from "./pages/SeedPressData";
import AIEnergyOptimizationPage from "./pages/solutions/AIEnergyOptimizationPage";
import SustainabilityPage from "./pages/solutions/SustainabilityPage";
import DemandForecastingPage from "./pages/solutions/DemandForecastingPage";
import CostOptimizationPage from "./pages/solutions/CostOptimizationPage";
import UtilitiesIndustryPage from "./pages/industries/UtilitiesIndustryPage";
import EnterprisesIndustryPage from "./pages/industries/EnterprisesIndustryPage";
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
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogDetailPage />} />
                <Route path="/admin/seed-blog" element={<SeedBlogData />} />
                <Route path="/press" element={<PressListPage />} />
                <Route path="/press/:slug" element={<PressDetailPage />} />
                <Route path="/admin/seed-press" element={<SeedPressData />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/resources/case-study/:slug" element={<CaseStudyDetailPage />} />
                <Route path="/resources/white-paper/:slug" element={<WhitePaperDetailPage />} />
                <Route path="/seed-resources" element={<SeedResourcesData />} />
                <Route path="/solutions/ai-energy-optimization" element={<AIEnergyOptimizationPage />} />
                <Route path="/solutions/sustainability" element={<SustainabilityPage />} />
                <Route path="/solutions/demand-forecasting" element={<DemandForecastingPage />} />
                <Route path="/solutions/cost-optimization" element={<CostOptimizationPage />} />
                <Route path="/industries/utilities" element={<UtilitiesIndustryPage />} />
                <Route path="/industries/enterprises" element={<EnterprisesIndustryPage />} />
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