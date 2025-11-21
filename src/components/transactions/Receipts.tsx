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
import { ReceiptDetailDialog } from "./ReceiptDetailDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { exportReceiptToPDF, exportReceiptsToExcel } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

interface ReceiptItem {
  id: string;
  accountHead: string;
  amount: number;
  narration: string;
}

interface Receipt {
  id: string;
  receiptNumber: string;
  date: string;
  customerName: string;
  customerGroup: string;
  items: ReceiptItem[];
  totalAmount: number;
  paymentMode: "Cash" | "Bank" | "Cheque" | "UPI" | "NEFT/RTGS";
  bankAccount?: string;
  chequeNumber?: string;
  chequeDate?: string;
  upiId?: string;
  referenceNumber?: string;
  narration: string;
  status: "Received" | "Pending" | "Bounced";
}

export function Receipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([
    {
      id: "1",
      receiptNumber: "RCP-2024-001",
      date: "2024-01-15",
      customerName: "Premium Customers",
      customerGroup: "Sundry Debtors",
      items: [
        { id: "1", accountHead: "Sales Revenue", amount: 15000, narration: "Payment for Invoice INV-2024-001" },
        { id: "2", accountHead: "Service Charges", amount: 5000, narration: "Consulting service payment" },
        { id: "3", accountHead: "Late Payment Fee", amount: 5000, narration: "Interest on delayed payment" }
      ],
      totalAmount: 25000,
      paymentMode: "Bank",
      bankAccount: "SBI Current Account",
      referenceNumber: "TXN123456789",
      narration: "Payment received for Invoice INV-2024-001",
      status: "Received"
    },
    {
      id: "2",
      receiptNumber: "RCP-2024-002",
      date: "2024-01-18",
      customerName: "Wholesale Customers",
      customerGroup: "Sundry Debtors",
      items: [
        { id: "1", accountHead: "Sales Revenue", amount: 30000, narration: "Payment for Invoice INV-2024-005" },
        { id: "2", accountHead: "Sales Revenue", amount: 15000, narration: "Payment for Invoice INV-2024-006" }
      ],
      totalAmount: 45000,
      paymentMode: "UPI",
      upiId: "customer@paytm",
      referenceNumber: "UPI987654321",
      narration: "Payment for multiple invoices - INV-2024-005, INV-2024-006",
      status: "Received"
    },
    {
      id: "3",
      receiptNumber: "RCP-2024-003",
      date: "2024-01-20",
      customerName: "Retail Customers",
      customerGroup: "Sundry Debtors",
      items: [
        { id: "1", accountHead: "Advance Payment", amount: 10000, narration: "Advance for upcoming order" },
        { id: "2", accountHead: "Security Deposit", amount: 2500, narration: "Refundable security deposit" }
      ],
      totalAmount: 12500,
      paymentMode: "Cheque",
      chequeNumber: "456789",
      chequeDate: "2024-01-20",
      bankAccount: "HDFC Savings Account",
      narration: "Advance payment for upcoming order",
      status: "Pending"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [formData, setFormData] = useState<Partial<Receipt>>({
    items: [{ id: "1", accountHead: "", amount: 0, narration: "" }]
  });
  const [viewingReceipt, setViewingReceipt] = useState<Receipt | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  const customerGroups = [
    { id: "11", name: "Premium Customers" },
    { id: "9", name: "Sundry Debtors" },
    { id: "12", name: "Wholesale Customers" },
    { id: "13", name: "Retail Customers" }
  ];

  const bankAccounts = [
    "SBI Current Account",
    "HDFC Savings Account",
    "ICICI Business Account"
  ];

  const updateItem = (index: number, field: keyof ReceiptItem, value: any) => {
    const items = [...(formData.items || [])];
    items[index] = { ...items[index], [field]: value };
    
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    
    setFormData({
      ...formData,
      items,
      totalAmount
    });
  };

  const addItem = () => {
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      accountHead: "",
      amount: 0,
      narration: ""
    };
    setFormData({
      ...formData,
      items: [...(formData.items || []), newItem]
    });
  };

  const removeItem = (index: number) => {
    const items = formData.items?.filter((_, i) => i !== index) || [];
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    
    setFormData({
      ...formData,
      items,
      totalAmount
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReceipt) {
      setReceipts(receipts.map(receipt => receipt.id === editingReceipt.id ? { ...receipt, ...formData } : receipt));
      toast({ title: "Receipt updated successfully" });
    } else {
      const newReceipt: Receipt = {
        id: Date.now().toString(),
        receiptNumber: `RCP-2024-${String(receipts.length + 1).padStart(3, '0')}`,
        status: "Received",
        ...formData as Receipt
      };
      setReceipts([...receipts, newReceipt]);
      toast({ title: "Receipt created successfully" });
    }
    setIsDialogOpen(false);
    setEditingReceipt(null);
    setFormData({ items: [{ id: "1", accountHead: "", amount: 0, narration: "" }] });
  };

  const handleEdit = (receipt: Receipt) => {
    setEditingReceipt(receipt);
    setFormData(receipt);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setReceipts(receipts.filter(receipt => receipt.id !== id));
    toast({ title: "Receipt deleted successfully" });
  };

  const exportToPDF = (receipt: Receipt) => {
    exportReceiptToPDF(receipt);
    toast({ title: `${receipt.receiptNumber} exported to PDF successfully` });
  };

  const exportToExcel = () => {
    exportReceiptsToExcel(receipts);
    toast({ title: "Receipts exported to Excel successfully" });
  };

  const printReceipt = (receipt: Receipt) => {
    exportReceiptToPDF(receipt);
    toast({ title: `Downloading ${receipt.receiptNumber} as PDF...` });
  };

  const handleViewDetails = (receipt: Receipt) => {
    setViewingReceipt(receipt);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Receipts</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingReceipt(null); setFormData({ items: [{ id: "1", accountHead: "", amount: 0, narration: "" }] }); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Receipt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingReceipt ? "Edit Receipt" : "Create New Receipt"}</DialogTitle>
              <DialogDescription>
                {editingReceipt ? "Modify receipt details below." : "Record a new payment receipt from customer."}
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
                  <Label htmlFor="customer">Customer</Label>
                  <Select value={formData.customerName} onValueChange={(value) => setFormData({ ...formData, customerName: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customerGroups.map((customer) => (
                        <SelectItem key={customer.id} value={customer.name}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paymentMode">Payment Mode</Label>
                  <Select value={formData.paymentMode} onValueChange={(value) => setFormData({ ...formData, paymentMode: value as Receipt["paymentMode"] })}>
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
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-semibold">Receipt Items</Label>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Head</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Narration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.accountHead}
                            onChange={(e) => updateItem(index, "accountHead", e.target.value)}
                            placeholder="Account head"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.amount}
                            onChange={(e) => updateItem(index, "amount", Number(e.target.value))}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.narration}
                            onChange={(e) => updateItem(index, "narration", e.target.value)}
                            placeholder="Item narration"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => removeItem(index)}
                            disabled={formData.items?.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="text-right space-y-2">
                  <div className="text-xl font-semibold">
                    Total Amount: ₹{(formData.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="narration">Overall Narration</Label>
                <Textarea
                  id="narration"
                  value={formData.narration || ""}
                  onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                  placeholder="Overall description of the receipt..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingReceipt ? "Update Receipt" : "Create Receipt"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receipt List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                  <TableCell>{receipt.date}</TableCell>
                  <TableCell>{receipt.customerName}</TableCell>
                  <TableCell>₹{receipt.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{receipt.paymentMode}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      receipt.status === 'Received' ? 'bg-success/10 text-success' :
                      receipt.status === 'Pending' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {receipt.status}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(receipt)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(receipt)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportToPDF(receipt)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printReceipt(receipt)}>
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(receipt.id)} className="text-destructive">
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

      <ReceiptDetailDialog 
        receipt={viewingReceipt}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onExportPDF={exportToPDF}
        onPrint={printReceipt}
      />
    </div>
  );
}