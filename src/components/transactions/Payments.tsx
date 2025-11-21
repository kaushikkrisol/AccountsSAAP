import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Download, FileText, Printer, MoreVertical, Eye } from "lucide-react";
import { PaymentDetailDialog } from "./PaymentDetailDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { exportPaymentToPDF, exportPaymentsToExcel } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  paymentNumber: string;
  date: string;
  vendorName: string;
  vendorGroup: string;
  amount: number;
  paymentMode: "Cash" | "Bank" | "Cheque" | "UPI" | "NEFT/RTGS";
  bankAccount?: string;
  chequeNumber?: string;
  chequeDate?: string;
  upiId?: string;
  referenceNumber?: string;
  narration: string;
  status: "Paid" | "Pending" | "Failed";
}

export function Payments() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      paymentNumber: "PMT-2024-001",
      date: "2024-01-15",
      vendorName: "Sundry Creditors",
      vendorGroup: "Current Liabilities",
      amount: 15000,
      paymentMode: "Bank",
      bankAccount: "SBI Current Account",
      referenceNumber: "TXN987654321",
      narration: "Payment for Purchase Order PO-2024-001",
      status: "Paid"
    },
    {
      id: "2",
      paymentNumber: "PMT-2024-002",
      date: "2024-01-17",
      vendorName: "Office Suppliers",
      vendorGroup: "Current Liabilities",
      amount: 8500,
      paymentMode: "UPI",
      upiId: "supplier@upi",
      referenceNumber: "UPI123456789",
      narration: "Payment for office supplies and stationery",
      status: "Paid"
    },
    {
      id: "3",
      paymentNumber: "PMT-2024-003",
      date: "2024-01-22",
      vendorName: "Raw Material Vendors",
      vendorGroup: "Current Liabilities",
      amount: 32000,
      paymentMode: "NEFT/RTGS",
      bankAccount: "HDFC Savings Account",
      referenceNumber: "NEFT987654321",
      narration: "Bulk payment for raw material purchase - January batch",
      status: "Paid"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<Partial<Payment>>({});
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  const vendorGroups = [
    { id: "10", name: "Sundry Creditors" },
    { id: "14", name: "Office Suppliers" },
    { id: "15", name: "Service Providers" },
    { id: "16", name: "Raw Material Vendors" }
  ];

  const bankAccounts = [
    "SBI Current Account",
    "HDFC Savings Account",
    "ICICI Business Account"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPayment) {
      setPayments(payments.map(payment => payment.id === editingPayment.id ? { ...payment, ...formData } : payment));
      toast({ title: "Payment updated successfully" });
    } else {
      const newPayment: Payment = {
        id: Date.now().toString(),
        paymentNumber: `PMT-2024-${String(payments.length + 1).padStart(3, '0')}`,
        status: "Paid",
        ...formData as Payment
      };
      setPayments([...payments, newPayment]);
      toast({ title: "Payment created successfully" });
    }
    setIsDialogOpen(false);
    setEditingPayment(null);
    setFormData({});
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData(payment);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
    toast({ title: "Payment deleted successfully" });
  };

  const exportToPDF = (payment: Payment) => {
    exportPaymentToPDF(payment);
    toast({ title: `${payment.paymentNumber} exported to PDF successfully` });
  };

  const exportToExcel = () => {
    exportPaymentsToExcel(payments);
    toast({ title: "Payments exported to Excel successfully" });
  };

  const printPayment = (payment: Payment) => {
    exportPaymentToPDF(payment);
    toast({ title: `Downloading ${payment.paymentNumber} as PDF...` });
  };

  const handleViewDetails = (payment: Payment) => {
    setViewingPayment(payment);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payments</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPayment(null); setFormData({}); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPayment ? "Edit Payment" : "Create New Payment"}</DialogTitle>
              <DialogDescription>
                {editingPayment ? "Update payment details below." : "Record a new payment to vendor."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select value={formData.vendorName} onValueChange={(value) => setFormData({ ...formData, vendorName: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorGroups.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.name}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMode">Payment Mode</Label>
                  <Select value={formData.paymentMode} onValueChange={(value) => setFormData({ ...formData, paymentMode: value as Payment["paymentMode"] })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="NEFT/RTGS">NEFT/RTGS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.paymentMode === "Bank" && (
                  <div>
                    <Label htmlFor="bankAccount">Bank Account</Label>
                    <Select value={formData.bankAccount} onValueChange={(value) => setFormData({ ...formData, bankAccount: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank account" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map((account) => (
                          <SelectItem key={account} value={account}>
                            {account}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.paymentMode === "Cheque" && (
                  <>
                    <div>
                      <Label htmlFor="chequeNumber">Cheque Number</Label>
                      <Input
                        id="chequeNumber"
                        value={formData.chequeNumber || ""}
                        onChange={(e) => setFormData({ ...formData, chequeNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="chequeDate">Cheque Date</Label>
                      <Input
                        id="chequeDate"
                        type="date"
                        value={formData.chequeDate || ""}
                        onChange={(e) => setFormData({ ...formData, chequeDate: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {formData.paymentMode === "UPI" && (
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      value={formData.upiId || ""}
                      onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    value={formData.referenceNumber || ""}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="narration">Narration</Label>
                <Textarea
                  id="narration"
                  value={formData.narration || ""}
                  onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                  placeholder="Description of the payment..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPayment ? "Update Payment" : "Create Payment"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.vendorName}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.paymentMode}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'Paid' ? 'bg-success/10 text-success' :
                      payment.status === 'Pending' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(payment)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportToPDF(payment)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printPayment(payment)}>
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(payment.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaymentDetailDialog 
        payment={viewingPayment}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onExportPDF={exportToPDF}
        onPrint={printPayment}
      />
    </div>
  );
}