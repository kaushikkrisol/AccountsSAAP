import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PLItem {
  label: string;
  currentPeriod: number;
  previousPeriod: number;
  isSubtotal?: boolean;
  isTotal?: boolean;
  indent?: boolean;
}

const profitLossData: PLItem[] = [
  { label: "Revenue", currentPeriod: 2847590, previousPeriod: 2534220, isSubtotal: true },
  { label: "Trading Revenue", currentPeriod: 2234560, previousPeriod: 2012340, indent: true },
  { label: "Commission Income", currentPeriod: 456780, previousPeriod: 398650, indent: true },
  { label: "Other Revenue", currentPeriod: 156250, previousPeriod: 123230, indent: true },
  
  { label: "Cost of Goods Sold", currentPeriod: -1245680, previousPeriod: -1156780 },
  { label: "Direct Trading Costs", currentPeriod: -987450, previousPeriod: -923450, indent: true },
  { label: "Transaction Fees", currentPeriod: -258230, previousPeriod: -233330, indent: true },
  
  { label: "Gross Profit", currentPeriod: 1601910, previousPeriod: 1377440, isSubtotal: true },
  
  { label: "Operating Expenses", currentPeriod: -1012490, previousPeriod: -956780 },
  { label: "Staff Costs", currentPeriod: -567890, previousPeriod: -534560, indent: true },
  { label: "Technology Costs", currentPeriod: -234500, previousPeriod: -223450, indent: true },
  { label: "Office Expenses", currentPeriod: -123450, previousPeriod: -118900, indent: true },
  { label: "Other Expenses", currentPeriod: -86650, previousPeriod: -79870, indent: true },
  
  { label: "EBITDA", currentPeriod: 589420, previousPeriod: 420660, isSubtotal: true },
  
  { label: "Depreciation & Amortization", currentPeriod: -45680, previousPeriod: -43250 },
  { label: "Interest Expense", currentPeriod: -23450, previousPeriod: -21340 },
  
  { label: "Net Profit Before Tax", currentPeriod: 520290, previousPeriod: 356070, isSubtotal: true },
  { label: "Income Tax", currentPeriod: -130073, previousPeriod: -89018 },
  { label: "Net Profit After Tax", currentPeriod: 390217, previousPeriod: 267052, isTotal: true },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

function calculateChange(current: number, previous: number): string {
  if (previous === 0) return "N/A";
  const change = ((current - previous) / Math.abs(previous)) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
}

export function ProfitLossStatement() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Current Period</CardTitle>
            <p className="text-sm text-muted-foreground">Jan 2024 - Dec 2024</p>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Previous Period</CardTitle>
            <p className="text-sm text-muted-foreground">Jan 2023 - Dec 2023</p>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-semibold">Account</th>
                  <th className="text-right p-4 font-semibold">Current Period</th>
                  <th className="text-right p-4 font-semibold">Previous Period</th>
                  <th className="text-right p-4 font-semibold">Change</th>
                </tr>
              </thead>
              <tbody>
                {profitLossData.map((item, index) => (
                  <tr 
                    key={index} 
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/20 transition-colors",
                      item.isTotal && "bg-primary/5 font-semibold",
                      item.isSubtotal && "bg-muted/20 font-medium"
                    )}
                  >
                    <td className={cn(
                      "p-4",
                      item.indent && "pl-8",
                      item.isTotal && "font-semibold",
                      item.isSubtotal && "font-medium"
                    )}>
                      {item.label}
                    </td>
                    <td className={cn(
                      "text-right p-4 font-mono",
                      item.currentPeriod > 0 ? "text-financial-positive" : "text-financial-negative",
                      item.isTotal && "font-semibold",
                      item.isSubtotal && "font-medium"
                    )}>
                      {item.currentPeriod < 0 ? '-' : ''}{formatCurrency(item.currentPeriod)}
                    </td>
                    <td className={cn(
                      "text-right p-4 font-mono",
                      item.previousPeriod > 0 ? "text-financial-positive" : "text-financial-negative",
                      item.isTotal && "font-semibold",
                      item.isSubtotal && "font-medium"
                    )}>
                      {item.previousPeriod < 0 ? '-' : ''}{formatCurrency(item.previousPeriod)}
                    </td>
                    <td className={cn(
                      "text-right p-4 text-sm font-medium",
                      item.isTotal && "font-semibold",
                      item.isSubtotal && "font-medium"
                    )}>
                      {calculateChange(item.currentPeriod, item.previousPeriod)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}