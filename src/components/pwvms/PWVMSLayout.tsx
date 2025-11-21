import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Receipt,
  BarChart3,
  Settings,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PWVMSLayoutProps {
  children?: React.ReactNode;
  activeMenu: string;
  onNavigate: (menuId: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "projects", label: "Project Master", icon: Building2 },
  { id: "vendors", label: "Vendor Master", icon: Users },
  { id: "invoices", label: "Invoice Management", icon: FileText },
  { id: "payments", label: "Payment Management", icon: CreditCard },
  { id: "customer-payments", label: "Customer Payments", icon: Receipt },
  { id: "ageing", label: "Ageing Dashboard", icon: TrendingUp },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function PWVMSLayout({ children, activeMenu, onNavigate }: PWVMSLayoutProps) {

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">PWVMS</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Project-wise Vendor Management
          </p>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeMenu === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeMenu === item.id && "bg-secondary"
                )}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
