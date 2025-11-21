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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Calendar, DollarSign, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface Payment {
  _id?: string;
  paymentNumber: string;
  vendorName: string;
  projectName: string;
  invoiceNumbers: string[];
  paymentDate: string;
  amount: number;
  tdsSection: string;
  tdsRate: number;
  tdsAmount: number;
  netPayable: number;
  status: "scheduled" | "processed" | "completed";
  tallyVoucherNumber?: string;
}

const TDS_SECTIONS = [
  { value: "194C", label: "194C - Contractor", rate: 1 },
  { value: "194J", label: "194J - Professional Services", rate: 10 },
  { value: "194H", label: "194H - Commission", rate: 5 },
  { value: "194I", label: "194I - Rent", rate: 10 },
];

export function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      _id: "1",
      paymentNumber: "PAY-2024-001",
      vendorName: "Steel Suppliers India Ltd",
      projectName: "Corporate Office Renovation",
      invoiceNumbers: ["INV-2024-001"],
      paymentDate: "2024-02-15",
      amount: 500000,
      tdsSection: "194C",
      tdsRate: 1,
      tdsAmount: 5000,
      netPayable: 495000,
      status: "completed",
      tallyVoucherNumber: "TV-2024-0015",
    },
    {
      _id: "2",
      paymentNumber: "PAY-2024-002",
      vendorName: "Elite Interiors & Design",
      projectName: "Hotel Interior Design",
      invoiceNumbers: ["INV-2024-003"],
      paymentDate: "2024-04-05",
      amount: 300000,
      tdsSection: "194J",
      tdsRate: 10,
      tdsAmount: 30000,
      netPayable: 270000,
      status: "scheduled",
    },
    {
      _id: "3",
      paymentNumber: "PAY-2024-003",
      vendorName: "Prime Transport Services",
      projectName: "Residential Tower Phase 2",
      invoiceNumbers: ["INV-2024-005"],
      paymentDate: "2024-04-12",
      amount: 150000,
      tdsSection: "194C",
      tdsRate: 1,
      tdsAmount: 1500,
      netPayable: 148500,
      status: "processed",
      tallyVoucherNumber: "TV-2024-0042",
    },
    {
      _id: "4",
      paymentNumber: "PAY-2024-004",
      vendorName: "Steel Suppliers India Ltd",
      projectName: "Residential Tower Phase 2",
      invoiceNumbers: ["INV-2024-006"],
      paymentDate: "2024-04-20",
      amount: 680000,
      tdsSection: "194C",
      tdsRate: 1,
      tdsAmount: 6800,
      netPayable: 673200,
      status: "scheduled",
    },
    {
      _id: "5",
      paymentNumber: "PAY-2024-005",
      vendorName: "Power Electricals Co.",
      projectName: "Corporate Office Renovation",
      invoiceNumbers: ["INV-2024-004"],
      paymentDate: "2024-04-14",
      amount: 425000,
      tdsSection: "194C",
      tdsRate: 2,
      tdsAmount: 8500,
      netPayable: 416500,
      status: "scheduled",
    },
    {
      _id: "6",
      paymentNumber: "PAY-2024-006",
      vendorName: "Concrete Mix Solutions",
      projectName: "Residential Tower Phase 2",
      invoiceNumbers: ["INV-2024-002"],
      paymentDate: "2024-03-01",
      amount: 750000,
      tdsSection: "194C",
      tdsRate: 2,
      tdsAmount: 15000,
      netPayable: 735000,
      status: "processed",
      tallyVoucherNumber: "TV-2024-0028",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Payment>>({
    paymentNumber: "",
    paymentDate: "",
    amount: 0,
    tdsSection: "",
    tdsRate: 0,
    tdsAmount: 0,
    netPayable: 0,
    status: "scheduled",
  });

  const calculateTDS = (amount: number, tdsRate: number) => {
    const tds = (amount * tdsRate) / 100;
    const net = amount - tds;
    setFormData({
      ...formData,
      tdsAmount: tds,
      netPayable: net,
    });
  };

  const handleTDSChange = (section: string) => {
    const tdsConfig = TDS_SECTIONS.find((s) => s.value === section);
    if (tdsConfig) {
      setFormData({
        ...formData,
        tdsSection: section,
        tdsRate: tdsConfig.rate,
      });
      if (formData.amount) {
        calculateTDS(formData.amount, tdsConfig.rate);
      }
    }
  };

  const handleAmountChange = (amount: number) => {
    setFormData({ ...formData, amount });
    if (formData.tdsRate) {
      calculateTDS(amount, formData.tdsRate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPayment?._id) {
        await apiClient.put(`/payments/${editingPayment._id}`, formData);
        toast({ title: "Payment updated successfully" });
      } else {
        await apiClient.post("/payments", formData);
        toast({ title: "Payment scheduled successfully" });
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingPayment ? "update" : "schedule"} payment`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;
    try {
      await apiClient.delete(`/payments/${id}`);
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
      paymentNumber: "",
      paymentDate: "",
      amount: 0,
      tdsSection: "",
      tdsRate: 0,
      tdsAmount: 0,
      netPayable: 0,
      status: "scheduled",
    });
    setEditingPayment(null);
  };

  const openEditDialog = (payment: Payment) => {
    setFormData(payment);
    setEditingPayment(payment);
    setIsDialogOpen(true);
  };

  const handleProcessPayment = async (id: string) => {
    try {
      await apiClient.put(`/payments/${id}/process`, {});
      toast({ title: "Payment processed and posted to Tally" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-yellow-500/10 text-yellow-500",
      processed: "bg-blue-500/10 text-blue-500",
      completed: "bg-green-500/10 text-green-500",
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Payment Management</span>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Payment
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>TDS Section</TableHead>
                <TableHead>TDS Amount</TableHead>
                <TableHead>Net Payable</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell className="font-medium">
                    {payment.paymentNumber}
                  </TableCell>
                  <TableCell>{payment.vendorName}</TableCell>
                  <TableCell>{payment.projectName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                      {payment.paymentDate}
                    </div>
                  </TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.tdsSection}</Badge>
                  </TableCell>
                  <TableCell className="text-red-600">
                    -₹{payment.tdsAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{payment.netPayable.toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {payment.status === "scheduled" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => payment._id && handleProcessPayment(payment._id)}
                        >
                          Process
                        </Button>
                      )}
                      {payment.tallyVoucherNumber && (
                        <Badge variant="outline" className="ml-2">
                          Tally: {payment.tallyVoucherNumber}
                        </Badge>
                      )}
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
              {editingPayment ? "Edit Payment" : "Schedule Payment with TDS"}
            </DialogTitle>
            <DialogDescription>
              {editingPayment ? "Update payment details below." : "Schedule a vendor payment with automatic TDS calculation."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Payment Number</Label>
                <Input
                  value={formData.paymentNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Invoice(s)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select invoice(s) to pay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inv1">INV-2024-001 - ₹50,000</SelectItem>
                    <SelectItem value="inv2">INV-2024-002 - ₹75,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gross Amount</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>TDS Section</Label>
                <Select
                  value={formData.tdsSection}
                  onValueChange={handleTDSChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select TDS section" />
                  </SelectTrigger>
                  <SelectContent>
                    {TDS_SECTIONS.map((section) => (
                      <SelectItem key={section.value} value={section.value}>
                        {section.label} ({section.rate}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2 bg-accent p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">TDS Rate</p>
                    <p className="font-medium">{formData.tdsRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">TDS Amount</p>
                    <p className="font-medium text-red-600">
                      -₹{formData.tdsAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net Payable</p>
                    <p className="font-medium text-green-600 text-lg">
                      ₹{formData.netPayable?.toLocaleString()}
                    </p>
                  </div>
                </div>
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
                <DollarSign className="mr-2 h-4 w-4" />
                {editingPayment ? "Update Payment" : "Schedule Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
