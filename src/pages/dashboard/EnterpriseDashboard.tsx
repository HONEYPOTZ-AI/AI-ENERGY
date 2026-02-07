import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  DollarSign,
  Leaf,
  TrendingUp,
  Database,
  BarChart3,
  FileText,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnterpriseDashboard = () => {
  const navigate = useNavigate();

  const kpis = [
    {
      title: "Total Energy",
      value: "345K",
      unit: "kWh",
      change: "+5.2%",
      trend: "up",
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Cost Savings",
      value: "$18.3K",
      unit: "USD",
      change: "+11.7%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "CO₂ Reduction",
      value: "52",
      unit: "tons",
      change: "+18.5%",
      trend: "up",
      icon: Leaf,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Forecast Accuracy",
      value: "96.5",
      unit: "%",
      change: "+3.2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const quickAccessCards = [
    {
      title: "Synthetic Data Generator",
      description: "Model your facility's energy patterns",
      icon: Database,
      color: "text-blue-600",
      path: "/dashboard/enterprise/data-generator"
    },
    {
      title: "AI Forecasting",
      description: "Forecast your energy needs accurately",
      icon: TrendingUp,
      color: "text-purple-600",
      path: "/dashboard/enterprise/forecasting"
    },
    {
      title: "Optimization Engine",
      description: "Reduce costs and improve efficiency",
      icon: BarChart3,
      color: "text-green-600",
      path: "/dashboard/enterprise/optimization"
    },
    {
      title: "ESG Reports",
      description: "Track your sustainability metrics",
      icon: FileText,
      color: "text-orange-600",
      path: "/dashboard/enterprise/esg-reports"
    }
  ];

  const recentActivities = [
    { action: "Energy forecast generated", time: "1 hour ago", status: "success" },
    { action: "Cost optimization completed", time: "4 hours ago", status: "success" },
    { action: "Weekly ESG report ready", time: "1 day ago", status: "success" },
    { action: "Peak demand alert resolved", time: "2 days ago", status: "success" },
  ];

  return (
    <DashboardLayout dashboardType="enterprise">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Enterprise Dashboard</h1>
          <p className="text-gray-600">Optimize your facility's energy consumption and costs</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {kpi.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                      <Icon className={`h-4 w-4 ${kpi.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{kpi.value}</span>
                      <span className="text-sm text-gray-500">{kpi.unit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {kpi.trend === "up" ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {kpi.change}
                      </span>
                      <span className="text-sm text-gray-500">vs last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Access Cards */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickAccessCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(card.path)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`h-5 w-5 ${card.color}`} />
                          <CardTitle className="text-lg">{card.title}</CardTitle>
                        </div>
                        <CardDescription>{card.description}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-600" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <CardDescription>Latest system activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-medium">{activity.action}</span>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EnterpriseDashboard;
