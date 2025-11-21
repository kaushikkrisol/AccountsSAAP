import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Reports() {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedProject, setSelectedProject] = useState("all");
  const { toast } = useToast();

  const handleExport = (reportType: string, format: string) => {
    toast({
      title: "Exporting Report",
      description: `Generating ${reportType} report in ${format.toUpperCase()} format...`,
    });
  };

  const reportTypes = [
    {
      id: "tds",
      title: "TDS Deduction Register",
      description: "Monthly TDS deductions by vendor and section",
      icon: FileText,
    },
    {
      id: "pl",
      title: "Project P&L Report",
      description: "Revenue vs Cost analysis per project",
      icon: TrendingUp,
    },
    {
      id: "ageing",
      title: "Vendor Ageing Report",
      description: "Outstanding payables by aging buckets",
      icon: FileText,
    },
    {
      id: "gst",
      title: "GST ITC Summary",
      description: "Input Tax Credit and Output Tax details",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Compliance</h1>
        <p className="text-muted-foreground mt-2">
          Generate financial and compliance reports
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="project1">Tower A</SelectItem>
                  <SelectItem value="project2">Mall Development</SelectItem>
                  <SelectItem value="project3">Residential Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tds" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="tds">TDS Register</TabsTrigger>
          <TabsTrigger value="pl">P&L Reports</TabsTrigger>
          <TabsTrigger value="ageing">Ageing Reports</TabsTrigger>
          <TabsTrigger value="gst">GST Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="tds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TDS Deduction Register</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Monthly TDS deductions categorized by section (194C, 194J, etc.) with
                vendor-wise breakup for Form 26Q filing.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => handleExport("TDS Register", "pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("TDS Register", "excel")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
              </div>
              <div className="border rounded-lg p-4 bg-accent">
                <h4 className="font-medium mb-2">Report Includes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Vendor-wise TDS deductions</li>
                  <li>• Section-wise summary (194C, 194J, 194H, etc.)</li>
                  <li>• Monthly challan summaries</li>
                  <li>• Form 26Q ready export</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project P&L Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Revenue (Customer Invoices) vs Cost (Vendor Invoices) analysis per
                project, excluding taxes. Reconciled with Tally ledgers.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => handleExport("P&L Report", "pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("P&L Report", "excel")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
              </div>
              <div className="border rounded-lg p-4 bg-accent">
                <h4 className="font-medium mb-2">Report Includes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Project-wise revenue breakdown</li>
                  <li>• Vendor costs by project</li>
                  <li>• Profit margins and trends</li>
                  <li>• Tally reconciliation status</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ageing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Ageing Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Outstanding payables categorized by aging buckets (0-30, 31-60, 61-90,
                90+ days) with vendor and project breakup.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => handleExport("Ageing Report", "pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("Ageing Report", "excel")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
              </div>
              <div className="border rounded-lg p-4 bg-accent">
                <h4 className="font-medium mb-2">Report Includes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Vendor-wise outstanding summary</li>
                  <li>• Aging bucket analysis</li>
                  <li>• Project-wise payables</li>
                  <li>• Customer ageing (receivables)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GST ITC & Output Tax Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Input Tax Credit from vendor invoices and Output Tax from customer
                invoices with GSTR-1 and GSTR-3B reconciliation.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => handleExport("GST Report", "pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("GST Report", "excel")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
              </div>
              <div className="border rounded-lg p-4 bg-accent">
                <h4 className="font-medium mb-2">Report Includes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• ITC available and utilized</li>
                  <li>• Output tax liability</li>
                  <li>• GSTIN-wise breakup</li>
                  <li>• GSTR reconciliation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Audit Logs & Approval Trail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Complete audit trail of all transactions, approvals, and modifications with
            user details and timestamps.
          </p>
          <Button variant="outline" onClick={() => handleExport("Audit Log", "pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Export Audit Log
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
