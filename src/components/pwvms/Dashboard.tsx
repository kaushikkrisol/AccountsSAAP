import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Users, 
  Building2 
} from "lucide-react";

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const metrics = [
    {
      title: "Total Outstanding",
      value: "₹45,67,890",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Due This Week",
      value: "₹8,45,000",
      change: "+5.2%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Active Projects",
      value: "24",
      change: "+3",
      trend: "up",
      icon: Building2,
    },
    {
      title: "Active Vendors",
      value: "156",
      change: "+12",
      trend: "up",
      icon: Users,
    },
    {
      title: "Pending Invoices",
      value: "45",
      change: "-8",
      trend: "down",
      icon: FileText,
    },
    {
      title: "Overdue Amount",
      value: "₹12,34,500",
      change: "-15.3%",
      trend: "down",
      icon: TrendingDown,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Project-wise Vendor Management System Overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {metric.value}
                </div>
                <p
                  className={`text-xs mt-1 flex items-center ${
                    metric.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Invoice #INV-2024-045 approved", time: "2 hours ago" },
                { action: "Payment of ₹2,50,000 processed", time: "5 hours ago" },
                { action: "New vendor 'ABC Suppliers' added", time: "1 day ago" },
                { action: "Project 'Tower A' updated", time: "2 days ago" },
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{activity.action}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigate?.("invoices")}
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <FileText className="h-6 w-6 mb-2 text-primary" />
                <p className="text-sm font-medium">Upload Invoice</p>
              </button>
              <button 
                onClick={() => onNavigate?.("payments")}
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <DollarSign className="h-6 w-6 mb-2 text-primary" />
                <p className="text-sm font-medium">Schedule Payment</p>
              </button>
              <button 
                onClick={() => onNavigate?.("vendors")}
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <Users className="h-6 w-6 mb-2 text-primary" />
                <p className="text-sm font-medium">Add Vendor</p>
              </button>
              <button 
                onClick={() => onNavigate?.("projects")}
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <Building2 className="h-6 w-6 mb-2 text-primary" />
                <p className="text-sm font-medium">New Project</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
