import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Download, FileText } from "lucide-react";

interface AgeingData {
  project: string;
  vendor: string;
  invoice: string;
  dueDate: string;
  ageing: number;
  outstanding: number;
  bucket: string;
}

export function AgeingDashboard() {
  const ageingData: AgeingData[] = [
    {
      project: "Tower A",
      vendor: "ABC Suppliers",
      invoice: "INV-001",
      dueDate: "2024-01-15",
      ageing: 45,
      outstanding: 250000,
      bucket: "31-60",
    },
    {
      project: "Mall Dev",
      vendor: "XYZ Contractors",
      invoice: "INV-002",
      dueDate: "2024-02-01",
      ageing: 28,
      outstanding: 180000,
      bucket: "0-30",
    },
    {
      project: "Residential",
      vendor: "PQR Services",
      invoice: "INV-003",
      dueDate: "2023-12-20",
      ageing: 95,
      outstanding: 420000,
      bucket: "90+",
    },
  ];

  const projectAgeingData = [
    { project: "Tower A", "0-30": 150000, "31-60": 250000, "61-90": 100000, "90+": 50000 },
    { project: "Mall Dev", "0-30": 180000, "31-60": 120000, "61-90": 80000, "90+": 150000 },
    { project: "Residential", "0-30": 100000, "31-60": 200000, "61-90": 150000, "90+": 420000 },
  ];

  const bucketSummary = [
    { name: "0-30 Days", value: 430000, color: "#22c55e" },
    { name: "31-60 Days", value: 570000, color: "#eab308" },
    { name: "61-90 Days", value: 330000, color: "#f97316" },
    { name: "90+ Days", value: 620000, color: "#ef4444" },
  ];

  const totalOutstanding = bucketSummary.reduce((sum, bucket) => sum + bucket.value, 0);

  const getBucketColor = (bucket: string) => {
    const colors: Record<string, string> = {
      "0-30": "bg-green-500/10 text-green-500",
      "31-60": "bg-yellow-500/10 text-yellow-500",
      "61-90": "bg-orange-500/10 text-orange-500",
      "90+": "bg-red-500/10 text-red-500",
    };
    return colors[bucket] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ageing Payables Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track outstanding dues by aging buckets
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalOutstanding / 100000).toFixed(2)}L</div>
          </CardContent>
        </Card>
        {bucketSummary.map((bucket) => (
          <Card key={bucket.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {bucket.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: bucket.color }}>
                ₹{(bucket.value / 100000).toFixed(2)}L
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Project-wise Ageing</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectAgeingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="project" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `₹${(value / 100000).toFixed(2)}L`}
                />
                <Legend />
                <Bar dataKey="0-30" stackId="a" fill="#22c55e" name="0-30 Days" />
                <Bar dataKey="31-60" stackId="a" fill="#eab308" name="31-60 Days" />
                <Bar dataKey="61-90" stackId="a" fill="#f97316" name="61-90 Days" />
                <Bar dataKey="90+" stackId="a" fill="#ef4444" name="90+ Days" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ageing Bucket Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bucketSummary}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${((entry.value / totalOutstanding) * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bucketSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${(value / 100000).toFixed(2)}L`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ageing Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Detailed Ageing Report</span>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Bucket</TableHead>
                <TableHead>Outstanding (₹)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ageingData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.project}</TableCell>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-2 text-muted-foreground" />
                      {item.invoice}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                      {item.dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={item.ageing > 60 ? "text-red-600 font-medium" : ""}>
                      {item.ageing} days
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getBucketColor(item.bucket)}>{item.bucket} days</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{item.outstanding.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Schedule Payment
                      </Button>
                      <Button variant="ghost" size="sm">
                        Add Note
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
