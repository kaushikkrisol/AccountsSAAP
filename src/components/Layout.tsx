import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Users, 
  FileText, 
  Receipt, 
  CreditCard, 
  BookOpen, 
  FileX,
  BarChart3,
  TrendingUp,
  PieChart,
  ShoppingCart,
  FolderKanban
} from "lucide-react";
import { FinancialDashboard } from "./financial/FinancialDashboard";
import { BankMaster } from "./masters/BankMaster";
import { GroupMaster } from "./masters/GroupMaster";
import { SalesInvoice } from "./transactions/SalesInvoice";
import { Receipts } from "./transactions/Receipts";
import { Payments } from "./transactions/Payments";
import { Journal } from "./transactions/Journal";
import { CreditNote } from "./transactions/CreditNote";
import { PurchaseVoucher } from "./transactions/PurchaseVoucher";

export function Layout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, component: FinancialDashboard },
    { id: "bank-master", label: "Bank Master", icon: Building2, component: BankMaster },
    { id: "group-master", label: "Group Master", icon: Users, component: GroupMaster },
    { id: "sales-invoice", label: "Sales Invoice", icon: FileText, component: SalesInvoice },
    { id: "purchase-voucher", label: "Purchase Voucher", icon: ShoppingCart, component: PurchaseVoucher },
    { id: "receipts", label: "Receipts", icon: Receipt, component: Receipts },
    { id: "payments", label: "Payments", icon: CreditCard, component: Payments },
    { id: "journal", label: "Journal", icon: BookOpen, component: Journal },
    { id: "credit-note", label: "Credit Note", icon: FileX, component: CreditNote },
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || FinancialDashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border shadow-lg">
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">Trading Accounts</h1>
            <p className="text-sm text-muted-foreground">Financial Management System</p>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overview</h3>
              </div>
              
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("dashboard")}
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Dashboard
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/pwvms")}
              >
                <FolderKanban className="w-4 h-4 mr-3" />
                PWVMS
              </Button>

              <div className="mt-6 mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Masters</h3>
              </div>
              
              <Button
                variant={activeTab === "bank-master" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("bank-master")}
              >
                <Building2 className="w-4 h-4 mr-3" />
                Bank Master
              </Button>
              
              <Button
                variant={activeTab === "group-master" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("group-master")}
              >
                <Users className="w-4 h-4 mr-3" />
                Group Master
              </Button>

              <div className="mt-6 mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transactions</h3>
              </div>
              
              {menuItems.slice(3).map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}