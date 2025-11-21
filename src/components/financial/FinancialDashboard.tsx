import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { ProfitLossStatement } from "./ProfitLossStatement";
import { BalanceSheet } from "./BalanceSheet";
import { MetricCard } from "./MetricCard";

const dashboardMetrics = [
  {
    title: "Total Revenue",
    value: "$2,847,590",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Net Profit",
    value: "$589,420",
    change: "+8.3%",
    trend: "up" as const,
    icon: TrendingUp,
  },
  {
    title: "Total Assets",
    value: "$4,234,890",
    change: "+5.2%",
    trend: "up" as const,
    icon: PieChart,
  },
  {
    title: "Operating Expenses",
    value: "$1,892,340",
    change: "-2.1%",
    trend: "down" as const,
    icon: TrendingDown,
  },
];

export function FinancialDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Trading Accounts Module</h1>
          <p className="text-muted-foreground">Financial overview and reporting dashboard</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Financial Statements */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-card to-card/95">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Financial Statements</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profit-loss" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profit-loss">Profit & Loss Statement</TabsTrigger>
                <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
              </TabsList>
              <TabsContent value="profit-loss" className="mt-6">
                <ProfitLossStatement />
              </TabsContent>
              <TabsContent value="balance-sheet" className="mt-6">
                <BalanceSheet />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}