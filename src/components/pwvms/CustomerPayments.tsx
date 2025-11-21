import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, TrendingUp, TrendingDown, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface CustomerPayment {
  _id?: string;
  receiptNumber: string;
  customerName: string;
  projectId: string;
  projectName: string;
  receiptDate: string;
  amount: number;
  paymentMode: string;
  status: "received" | "pending" | "bounced";
}

interface ProjectCashFlow {
  projectName: string;
  customerReceipts: number;
  vendorPayments: number;
  netPosition: number;
}

export function CustomerPayments() {
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [cashFlows] = useState<ProjectCashFlow[]>([
    {
      projectName: "Tower A Construction",
      customerReceipts: 50_00_000,
      vendorPayments: 32_00_000,
      netPosition: 18_00_000,
    },
    {
      projectName: "Mall Development",
      customerReceipts: 75_00_000,
      vendorPayments: 68_00_000,
      netPosition: 7_00_000,
    },
    {
      projectName: "Residential Complex",
      customerReceipts: 35_00_000,
      vendorPayments: 38_00_000,
      netPosition: -3_00_000,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPayment, setEditingPayment] = useState<CustomerPayment | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<CustomerPayment>>({
    receiptNumber: "",
    customerName: "",
    projectId: "",
    receiptDate: "",
    amount: 0,
    paymentMode: "bank_transfer",
    status: "received",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPayment?._id) {
        await apiClient.put(`/customer-payments/${editingPayment._id}`, formData);
        toast({ title: "Customer payment updated successfully" });
      } else {
        await apiClient.post("/customer-payments", formData);
        toast({ title: "Customer payment recorded successfully" });
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingPayment ? "update" : "record"} payment`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;
    try {
      await apiClient.delete(`/customer-payments/${id}`);
      toast({ title: "Payment deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      receiptNumber: "",
      customerName: "",
      projectId: "",
      receiptDate: "",
      amount: 0,
      paymentMode: "bank_transfer",
      status: "received",
    });
    setEditingPayment(null);
  };

  const openEditDialog = (payment: CustomerPayment) => {
    setFormData(payment);
    setEditingPayment(payment);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      received: "bg-green-500/10 text-green-500",
      pending: "bg-yellow-500/10 text-yellow-500",
      bounced: "bg-red-500/10 text-red-500",
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Project Cash Flow Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project-wise Cash Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Customer Receipts</TableHead>
                <TableHead>Vendor Payments</TableHead>
                <TableHead>Net Position</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashFlows.map((flow, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{flow.projectName}</TableCell>
                  <TableCell className="text-green-600">
                    ₹{flow.customerReceipts.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-red-600">
                    ₹{flow.vendorPayments.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className={
                      flow.netPosition >= 0
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {flow.netPosition >= 0 ? (
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        ₹{flow.netPosition.toLocaleString()}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        ₹{Math.abs(flow.netPosition).toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {flow.netPosition >= 0 ? (
                      <Badge className="bg-green-500/10 text-green-500">
                        Surplus
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-500">
                        Deficit
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Payment Receipts</span>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Record Receipt
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search receipts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell className="font-medium">
                    {payment.receiptNumber}
                  </TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>{payment.projectName}</TableCell>
                  <TableCell>{payment.receiptDate}</TableCell>
                  <TableCell className="font-medium">
                    ₹{payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.paymentMode}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(payment)}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => payment._id && handleDelete(payment._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPayment ? "Edit Customer Payment" : "Record Customer Payment"}
            </DialogTitle>
            <DialogDescription>
              {editingPayment ? "Update customer payment details below." : "Record a payment receipt from a customer for a project."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Receipt Number</Label>
                <Input
                  value={formData.receiptNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, receiptNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Receipt Date</Label>
                <Input
                  type="date"
                  value={formData.receiptDate}
                  onChange={(e) =>
                    setFormData({ ...formData, receiptDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Input
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData({ ...formData, projectName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Input
                  value={formData.paymentMode}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMode: e.target.value })
                  }
                  placeholder="e.g., Bank Transfer, Cheque"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingPayment ? "Update Payment" : "Record Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
