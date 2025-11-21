import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BalanceSheetItem {
  label: string;
  currentPeriod: number;
  previousPeriod: number;
  isSubtotal?: boolean;
  isTotal?: boolean;
  indent?: boolean;
}

const assetsData: BalanceSheetItem[] = [
  { label: "Current Assets", currentPeriod: 0, previousPeriod: 0, isSubtotal: true },
  { label: "Cash and Cash Equivalents", currentPeriod: 1245780, previousPeriod: 1098650, indent: true },
  { label: "Trading Securities", currentPeriod: 2156890, previousPeriod: 1876540, indent: true },
  { label: "Accounts Receivable", currentPeriod: 456780, previousPeriod: 398750, indent: true },
  { label: "Other Current Assets", currentPeriod: 123450, previousPeriod: 98650, indent: true },
  { label: "Total Current Assets", currentPeriod: 3982900, previousPeriod: 3472590, isSubtotal: true },
  
  { label: "Non-Current Assets", currentPeriod: 0, previousPeriod: 0, isSubtotal: true },
  { label: "Property, Plant & Equipment", currentPeriod: 234560, previousPeriod: 256780, indent: true },
  { label: "Intangible Assets", currentPeriod: 89450, previousPeriod: 76540, indent: true },
  { label: "Other Non-Current Assets", currentPeriod: 67890, previousPeriod: 54320, indent: true },
  { label: "Total Non-Current Assets", currentPeriod: 391900, previousPeriod: 387640, isSubtotal: true },
  
  { label: "TOTAL ASSETS", currentPeriod: 4374800, previousPeriod: 3860230, isTotal: true },
];

const liabilitiesData: BalanceSheetItem[] = [
  { label: "Current Liabilities", currentPeriod: 0, previousPeriod: 0, isSubtotal: true },
  { label: "Accounts Payable", currentPeriod: 234560, previousPeriod: 198750, indent: true },
  { label: "Short-term Debt", currentPeriod: 456780, previousPeriod: 398650, indent: true },
  { label: "Accrued Expenses", currentPeriod: 123450, previousPeriod: 109870, indent: true },
  { label: "Other Current Liabilities", currentPeriod: 89450, previousPeriod: 76540, indent: true },
  { label: "Total Current Liabilities", currentPeriod: 904240, previousPeriod: 783810, isSubtotal: true },
  
  { label: "Non-Current Liabilities", currentPeriod: 0, previousPeriod: 0, isSubtotal: true },
  { label: "Long-term Debt", currentPeriod: 567890, previousPeriod: 612340, indent: true },
  { label: "Other Non-Current Liabilities", currentPeriod: 45680, previousPeriod: 43250, indent: true },
  { label: "Total Non-Current Liabilities", currentPeriod: 613570, previousPeriod: 655590, isSubtotal: true },
  
  { label: "TOTAL LIABILITIES", currentPeriod: 1517810, previousPeriod: 1439400, isTotal: true },
];

const equityData: BalanceSheetItem[] = [
  { label: "Share Capital", currentPeriod: 1000000, previousPeriod: 1000000, indent: true },
  { label: "Retained Earnings", currentPeriod: 1734560, previousPeriod: 1344390, indent: true },
  { label: "Other Equity", currentPeriod: 122430, previousPeriod: 76440, indent: true },
  { label: "TOTAL EQUITY", currentPeriod: 2856990, previousPeriod: 2420830, isTotal: true },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

function BalanceSheetSection({ 
  title, 
  data, 
  titleColor = "text-foreground" 
}: { 
  title: string; 
  data: BalanceSheetItem[];
  titleColor?: string;
}) {
  return (
    <div className="space-y-2">
      <h3 className={cn("font-semibold text-lg mb-4 pb-2 border-b border-border", titleColor)}>
        {title}
      </h3>
      {data.map((item, index) => (
        <div 
          key={index} 
          className={cn(
            "grid grid-cols-3 gap-4 py-2 px-3 rounded-md hover:bg-muted/20 transition-colors",
            item.isTotal && "bg-primary/5 font-semibold border border-primary/20",
            item.isSubtotal && "bg-muted/20 font-medium"
          )}
        >
          <div className={cn(
            "text-sm",
            item.indent && "pl-4",
            item.isTotal && "font-semibold",
            item.isSubtotal && "font-medium"
          )}>
            {item.label}
          </div>
          <div className={cn(
            "text-right font-mono text-sm",
            item.isTotal && "font-semibold",
            item.isSubtotal && "font-medium"
          )}>
            {item.currentPeriod > 0 ? formatCurrency(item.currentPeriod) : '-'}
          </div>
          <div className={cn(
            "text-right font-mono text-sm text-muted-foreground",
            item.isTotal && "font-semibold",
            item.isSubtotal && "font-medium"
          )}>
            {item.previousPeriod > 0 ? formatCurrency(item.previousPeriod) : '-'}
          </div>
        </div>
      ))}
    </div>
  );
}

export function BalanceSheet() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Current Period</CardTitle>
            <p className="text-sm text-muted-foreground">As of December 31, 2024</p>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Previous Period</CardTitle>
            <p className="text-sm text-muted-foreground">As of December 31, 2023</p>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <BalanceSheetSection 
              title="ASSETS" 
              data={assetsData}
              titleColor="text-financial-positive"
            />
          </CardContent>
        </Card>

        {/* Liabilities & Equity */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 space-y-8">
            <BalanceSheetSection 
              title="LIABILITIES" 
              data={liabilitiesData}
              titleColor="text-financial-negative"
            />
            <BalanceSheetSection 
              title="EQUITY" 
              data={equityData}
              titleColor="text-primary"
            />
          </CardContent>
        </Card>
      </div>

      {/* Balance Check */}
      <Card className="border-0 shadow-md bg-primary/5">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Balance Check:</span>
            <div className="space-y-1 text-right">
              <div className="text-sm text-muted-foreground">
                Total Assets = Total Liabilities + Total Equity
              </div>
              <div className="font-mono font-semibold">
                {formatCurrency(4374800)} = {formatCurrency(1517810)} + {formatCurrency(2856990)}
              </div>
              <div className="text-sm text-financial-positive">✓ Balanced</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}