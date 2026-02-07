import { ReactNode, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  LayoutDashboard,
  Database,
  TrendingUp,
  Settings as SettingsIcon,
  FileText,
  Menu,
  X,
  Home,
  Building2,
  Factory,
  Gauge,
  Leaf } from
"lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardLayoutProps {
  children: ReactNode;
  dashboardType: "utility" | "enterprise";
}

const DashboardLayout = ({ children, dashboardType }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: `/dashboard/${dashboardType}` },
  { icon: Database, label: "Data Generator", path: `/dashboard/data-generator` },
  { icon: TrendingUp, label: "Forecasting", path: `/dashboard/forecasting` },
  { icon: Gauge, label: "Optimization", path: `/dashboard/optimization` },
  { icon: Leaf, label: "ESG Reports", path: `/dashboard/esg-reports` }];


  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}>

              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <Link to="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg hidden sm:inline">AI ENERGY Optimizer</span>
            </Link>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <div className="flex items-center gap-2">
              {dashboardType === "utility" ?
              <Badge variant="default" className="bg-blue-600">
                  <Factory className="h-3 w-3 mr-1" />
                  Utility
                </Badge> :

              <Badge variant="default" className="bg-purple-600">
                  <Building2 className="h-3 w-3 mr-1" />
                  Enterprise
                </Badge>
              }
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(dashboardType === "utility" ? "/dashboard/enterprise" : "/dashboard/utility")}>

              Switch to {dashboardType === "utility" ? "Enterprise" : "Utility"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <Home className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            "fixed lg:sticky top-[57px] left-0 z-30 h-[calc(100vh-57px)] w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive(item.path) && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}>

                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>);

            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 w-full">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        onClick={() => setSidebarOpen(false)} />

      }
    </div>);

};

export default DashboardLayout;