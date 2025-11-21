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
import { CreditNoteDetailDialog } from "./CreditNoteDetailDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { exportCreditNoteToPDF, exportCreditNotesToExcel } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

interface CreditNoteItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  gstRate: number;
  gstAmount: number;
}

interface CreditNote {
  id: string;
  creditNoteNumber: string;
  date: string;
  customerName: string;
  customerGST: string;
  customerAddress: string;
  originalInvoiceNumber: string;
  reason: string;
  items: CreditNoteItem[];
  subtotal: number;
  totalGST: number;
  totalAmount: number;
  status: "Draft" | "Issued" | "Applied";
}

export function CreditNote() {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([
    {
      id: "1",
      creditNoteNumber: "CN-2024-001",
      date: "2024-01-20",
      customerName: "Premium Customers",
      customerGST: "27AAAAA0000A1Z5",
      customerAddress: "123 Business Street, Mumbai",
      originalInvoiceNumber: "INV-2024-001",
      reason: "Product return due to defect",
      items: [
        {
          id: "1",
          description: "Defective Product A",
          quantity: 2,
          rate: 1000,
          amount: 2000,
          gstRate: 18,
          gstAmount: 360
        },
        {
          id: "2",
          description: "Defective Product B",
          quantity: 1,
          rate: 1500,
          amount: 1500,
          gstRate: 18,
          gstAmount: 270
        }
      ],
      subtotal: 3500,
      totalGST: 630,
      totalAmount: 4130,
      status: "Issued"
    },
    {
      id: "2",
      creditNoteNumber: "CN-2024-002",
      date: "2024-01-22",
      customerName: "Wholesale Customers",
      customerGST: "27CCCCC2222C3Z7",
      customerAddress: "789 Commerce Hub",
      originalInvoiceNumber: "INV-2024-005",
      reason: "Price adjustment",
      items: [
        {
          id: "1",
          description: "Price difference adjustment",
          quantity: 10,
          rate: 200,
          amount: 2000,
          gstRate: 12,
          gstAmount: 240
        }
      ],
      subtotal: 2000,
      totalGST: 240,
      totalAmount: 2240,
      status: "Applied"
    },
    {
      id: "3",
      creditNoteNumber: "CN-2024-003",
      date: "2024-01-25",
      customerName: "Retail Customers",
      customerGST: "27DDDDD3333D4Z8",
      customerAddress: "321 Market Street",
      originalInvoiceNumber: "INV-2024-008",
      reason: "Damaged goods",
      items: [
        {
          id: "1",
          description: "Damaged Item - Product X",
          quantity: 3,
          rate: 800,
          amount: 2400,
          gstRate: 18,
          gstAmount: 432
        },
        {
          id: "2",
          description: "Damaged Item - Product Y",
          quantity: 2,
          rate: 600,
          amount: 1200,
          gstRate: 18,
          gstAmount: 216
        }
      ],
      subtotal: 3600,
      totalGST: 648,
      totalAmount: 4248,
      status: "Draft"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCreditNote, setEditingCreditNote] = useState<CreditNote | null>(null);
  const [formData, setFormData] = useState<Partial<CreditNote>>({
    items: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0, gstRate: 18, gstAmount: 0 }]
  });
  const [viewingCreditNote, setViewingCreditNote] = useState<CreditNote | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  const customerGroups = [
    { id: "11", name: "Premium Customers", gst: "27AAAAA0000A1Z5", address: "123 Business District" },
    { id: "9", name: "Sundry Debtors", gst: "27BBBBB1111B2Z6", address: "456 Trade Center" },
    { id: "12", name: "Wholesale Customers", gst: "27CCCCC2222C3Z7", address: "789 Commerce Hub" },
    { id: "13", name: "Retail Customers", gst: "27DDDDD3333D4Z8", address: "321 Market Street" }
  ];

  const reasons = [
    "Product return due to defect",
    "Quantity discrepancy", 
    "Price adjustment",
    "Damaged goods",
    "Wrong item delivered",
    "Customer complaint resolution",
    "Post-sale discount",
    "Other"
  ];

  const calculateItemAmount = (quantity: number, rate: number, gstRate: number) => {
    const amount = quantity * rate;
    const gstAmount = (amount * gstRate) / 100;
    return { amount, gstAmount };
  };

  const updateItem = (index: number, field: keyof CreditNoteItem, value: any) => {
    const items = [...(formData.items || [])];
    items[index] = { ...items[index], [field]: value };
    
    if (field === "quantity" || field === "rate" || field === "gstRate") {
      const { amount, gstAmount } = calculateItemAmount(
        items[index].quantity,
        items[index].rate,
        items[index].gstRate
      );
      items[index].amount = amount;
      items[index].gstAmount = gstAmount;
    }
    
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const totalGST = items.reduce((sum, item) => sum + item.gstAmount, 0);
    
    setFormData({
      ...formData,
      items,
      subtotal,
      totalGST,
      totalAmount: subtotal + totalGST
    });
  };

  const addItem = () => {
    const newItem: CreditNoteItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      gstRate: 18,
      gstAmount: 0
    };
    setFormData({
      ...formData,
      items: [...(formData.items || []), newItem]
    });
  };

  const removeItem = (index: number) => {
    const items = formData.items?.filter((_, i) => i !== index) || [];
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const totalGST = items.reduce((sum, item) => sum + item.gstAmount, 0);
    
    setFormData({
      ...formData,
      items,
      subtotal,
      totalGST,
      totalAmount: subtotal + totalGST
    });
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customerGroups.find(c => c.id === customerId);
    if (customer) {
      setFormData({
        ...formData,
        customerName: customer.name,
        customerGST: customer.gst,
        customerAddress: customer.address
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCreditNote) {
      setCreditNotes(creditNotes.map(cn => cn.id === editingCreditNote.id ? { ...cn, ...formData } : cn));
      toast({ title: "Credit note updated successfully" });
    } else {
      const newCreditNote: CreditNote = {
        id: Date.now().toString(),
        creditNoteNumber: `CN-2024-${String(creditNotes.length + 1).padStart(3, '0')}`,
        status: "Draft",
        ...formData as CreditNote
      };
      setCreditNotes([...creditNotes, newCreditNote]);
      toast({ title: "Credit note created successfully" });
    }
    setIsDialogOpen(false);
    setEditingCreditNote(null);
    setFormData({ items: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0, gstRate: 18, gstAmount: 0 }] });
  };

  const handleEdit = (creditNote: CreditNote) => {
    setEditingCreditNote(creditNote);
    setFormData(creditNote);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCreditNotes(creditNotes.filter(cn => cn.id !== id));
    toast({ title: "Credit note deleted successfully" });
  };

  const exportToPDF = (creditNote: CreditNote) => {
    exportCreditNoteToPDF(creditNote);
    toast({ title: `${creditNote.creditNoteNumber} exported to PDF successfully` });
  };

  const exportToExcel = () => {
    exportCreditNotesToExcel(creditNotes);
    toast({ title: "Credit notes exported to Excel successfully" });
  };

  const printCreditNote = (creditNote: CreditNote) => {
    exportCreditNoteToPDF(creditNote);
    toast({ title: `Downloading ${creditNote.creditNoteNumber} as PDF...` });
  };

  const handleViewDetails = (creditNote: CreditNote) => {
    setViewingCreditNote(creditNote);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Credit Notes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCreditNote(null); setFormData({ items: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0, gstRate: 18, gstAmount: 0 }] }); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Credit Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCreditNote ? "Edit Credit Note" : "Create New Credit Note"}</DialogTitle>
              <DialogDescription>
                {editingCreditNote ? "Update credit note details below." : "Create a credit note for product returns or adjustments."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Select onValueChange={handleCustomerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customerGroups.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="originalInvoiceNumber">Original Invoice Number</Label>
                  <Input
                    id="originalInvoiceNumber"
                    value={formData.originalInvoiceNumber || ""}
                    onChange={(e) => setFormData({ ...formData, originalInvoiceNumber: e.target.value })}
                    placeholder="INV-2024-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="customerGST">Customer GST</Label>
                  <Input
                    id="customerGST"
                    value={formData.customerGST || ""}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddress">Customer Address</Label>
                  <Input
                    id="customerAddress"
                    value={formData.customerAddress || ""}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-semibold">Credit Note Items</Label>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>GST %</TableHead>
                      <TableHead>GST Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(index, "description", e.target.value)}
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(index, "rate", Number(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.gstRate}
                            onChange={(e) => updateItem(index, "gstRate", Number(e.target.value))}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>₹{item.gstAmount.toFixed(2)}</TableCell>
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

                <div className="mt-4 bg-muted/20 p-4 rounded-lg">
                  <div className="flex justify-end space-y-2 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between w-48">
                        <span>Subtotal:</span>
                        <span>₹{(formData.subtotal || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between w-48">
                        <span>Total GST:</span>
                        <span>₹{(formData.totalGST || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between w-48 font-semibold text-lg border-t pt-2">
                        <span>Credit Amount:</span>
                        <span>₹{(formData.totalAmount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCreditNote ? "Update Credit Note" : "Create Credit Note"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credit Note List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Credit Note No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Original Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditNotes.map((creditNote) => (
                <TableRow key={creditNote.id}>
                  <TableCell className="font-medium">{creditNote.creditNoteNumber}</TableCell>
                  <TableCell>{creditNote.date}</TableCell>
                  <TableCell>{creditNote.customerName}</TableCell>
                  <TableCell>{creditNote.originalInvoiceNumber}</TableCell>
                  <TableCell>₹{creditNote.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      creditNote.status === 'Applied' ? 'bg-success/10 text-success' :
                      creditNote.status === 'Issued' ? 'bg-accent/10 text-accent' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {creditNote.status}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(creditNote)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(creditNote)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportToPDF(creditNote)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printCreditNote(creditNote)}>
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(creditNote.id)} className="text-destructive">
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

      <CreditNoteDetailDialog 
        creditNote={viewingCreditNote}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onExportPDF={exportToPDF}
        onPrint={printCreditNote}
      />
    </div>
  );
}