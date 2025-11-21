import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Download, FileText, Printer, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportInvoiceToPDF, exportInvoicesToExcel } from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoiceDetailDialog } from "./InvoiceDetailDialog";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
}

interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerGST: string;
  customerAddress: string;
  customerState: string;
  items: InvoiceItem[];
  subtotal: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalAmount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
}

export function SalesInvoice() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      date: "2024-01-15",
      customerName: "ABC Trading Co.",
      customerGST: "27AAAAA0000A1Z5",
      customerAddress: "123 Business Street, Mumbai",
      customerState: "Maharashtra",
      items: [
        {
          id: "1",
          description: "Nike Air Max Shoes",
          quantity: 5,
          rate: 2500,
          amount: 12500,
          gstRate: 18,
          cgstAmount: 1125,
          sgstAmount: 1125,
          igstAmount: 0
        },
        {
          id: "2",
          description: "Apple Watch Series 9",
          quantity: 3,
          rate: 4500,
          amount: 13500,
          gstRate: 18,
          cgstAmount: 1215,
          sgstAmount: 1215,
          igstAmount: 0
        },
        {
          id: "3",
          description: "Samsung Galaxy Buds",
          quantity: 10,
          rate: 1200,
          amount: 12000,
          gstRate: 18,
          cgstAmount: 1080,
          sgstAmount: 1080,
          igstAmount: 0
        },
        {
          id: "4",
          description: "Dell Laptop Backpack",
          quantity: 8,
          rate: 800,
          amount: 6400,
          gstRate: 18,
          cgstAmount: 576,
          sgstAmount: 576,
          igstAmount: 0
        },
        {
          id: "5",
          description: "Logitech Wireless Mouse",
          quantity: 15,
          rate: 600,
          amount: 9000,
          gstRate: 18,
          cgstAmount: 810,
          sgstAmount: 810,
          igstAmount: 0
        },
        {
          id: "6",
          description: "HP Printer Ink Cartridge",
          quantity: 20,
          rate: 450,
          amount: 9000,
          gstRate: 18,
          cgstAmount: 810,
          sgstAmount: 810,
          igstAmount: 0
        },
        {
          id: "7",
          description: "Sony Headphones",
          quantity: 7,
          rate: 3500,
          amount: 24500,
          gstRate: 18,
          cgstAmount: 2205,
          sgstAmount: 2205,
          igstAmount: 0
        },
        {
          id: "8",
          description: "Canon Camera Lens",
          quantity: 2,
          rate: 15000,
          amount: 30000,
          gstRate: 18,
          cgstAmount: 2700,
          sgstAmount: 2700,
          igstAmount: 0
        }
      ],
      subtotal: 116900,
      totalCGST: 10521,
      totalSGST: 10521,
      totalIGST: 0,
      totalAmount: 137942,
      status: "Sent"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<SalesInvoice | null>(null);
  const [formData, setFormData] = useState<Partial<SalesInvoice>>({
    items: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0, gstRate: 18, cgstAmount: 0, sgstAmount: 0, igstAmount: 0 }]
  });
  const [viewingInvoice, setViewingInvoice] = useState<SalesInvoice | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Company details - in real app, fetch from settings
  const companyState = "Maharashtra";
  
  // Mock customer groups - in real app, fetch from GroupMaster
  const customerGroups = [
    { id: "1", name: "ABC Trading Co.", gst: "27AAAAA0000A1Z5", address: "123 Business Street, Mumbai", state: "Maharashtra" },
    { id: "11", name: "Premium Customers", gst: "27BBBBB0000B1Z5", address: "123 Business District", state: "Maharashtra" },
    { id: "9", name: "Sundry Debtors", gst: "27CCCCC1111C2Z6", address: "456 Trade Center", state: "Maharashtra" },
    { id: "12", name: "Wholesale Customers", gst: "33DDDDD2222D3Z7", address: "789 Commerce Hub", state: "Tamil Nadu" },
    { id: "13", name: "Retail Customers", gst: "29EEEEE3333E4Z8", address: "321 Market Street", state: "Karnataka" }
  ];
  
  const { toast } = useToast();

  const handleCustomerChange = (customerId: string) => {
    const customer = customerGroups.find(c => c.id === customerId);
    if (customer) {
      setFormData({
        ...formData,
        customerName: customer.name,
        customerGST: customer.gst,
        customerAddress: customer.address,
        customerState: customer.state
      });
    }
  };

  const calculateItemAmount = (quantity: number, rate: number, gstRate: number, customerState: string) => {
    const amount = quantity * rate;
    const totalGstAmount = (amount * gstRate) / 100;
    
    // Same state = CGST + SGST (split equally), Different state = IGST
    const isSameState = customerState === companyState;
    
    if (isSameState) {
      return {
        amount,
        cgstAmount: totalGstAmount / 2,
        sgstAmount: totalGstAmount / 2,
        igstAmount: 0
      };
    } else {
      return {
        amount,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: totalGstAmount
      };
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const items = [...(formData.items || [])];
    items[index] = { ...items[index], [field]: value };
    
    if (field === "quantity" || field === "rate" || field === "gstRate") {
      const { amount, cgstAmount, sgstAmount, igstAmount } = calculateItemAmount(
        items[index].quantity,
        items[index].rate,
        items[index].gstRate,
        formData.customerState || companyState
      );
      items[index].amount = amount;
      items[index].cgstAmount = cgstAmount;
      items[index].sgstAmount = sgstAmount;
      items[index].igstAmount = igstAmount;
    }
    
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const totalCGST = items.reduce((sum, item) => sum + item.cgstAmount, 0);
    const totalSGST = items.reduce((sum, item) => sum + item.sgstAmount, 0);
    const totalIGST = items.reduce((sum, item) => sum + item.igstAmount, 0);
    
    setFormData({
      ...formData,
      items,
      subtotal,
      totalCGST,
      totalSGST,
      totalIGST,
      totalAmount: subtotal + totalCGST + totalSGST + totalIGST
    });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      gstRate: 18,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0
    };
    setFormData({
      ...formData,
      items: [...(formData.items || []), newItem]
    });
  };

  const removeItem = (index: number) => {
    const items = formData.items?.filter((_, i) => i !== index) || [];
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const totalCGST = items.reduce((sum, item) => sum + item.cgstAmount, 0);
    const totalSGST = items.reduce((sum, item) => sum + item.sgstAmount, 0);
    const totalIGST = items.reduce((sum, item) => sum + item.igstAmount, 0);
    
    setFormData({
      ...formData,
      items,
      subtotal,
      totalCGST,
      totalSGST,
      totalIGST,
      totalAmount: subtotal + totalCGST + totalSGST + totalIGST
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInvoice) {
      setInvoices(invoices.map(inv => inv.id === editingInvoice.id ? { ...inv, ...formData } : inv));
      toast({ title: "Invoice updated successfully" });
    } else {
      const newInvoice: SalesInvoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        status: "Draft",
        ...formData as SalesInvoice
      };
      setInvoices([...invoices, newInvoice]);
      toast({ title: "Invoice created successfully" });
    }
    setIsDialogOpen(false);
    setEditingInvoice(null);
    setFormData({ items: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0, gstRate: 18, cgstAmount: 0, sgstAmount: 0, igstAmount: 0 }] });
  };

  const handleEdit = (invoice: SalesInvoice) => {
    setEditingInvoice(invoice);
    setFormData(invoice);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
    toast({ title: "Invoice deleted successfully" });
  };

  const exportToPDF = (invoice: SalesInvoice) => {
    exportInvoiceToPDF(invoice);
    toast({ title: `${invoice.invoiceNumber} exported to PDF successfully` });
  };

  const exportToExcel = () => {
    exportInvoicesToExcel(invoices);
    toast({ title: "Invoices exported to Excel successfully" });
  };

  const printInvoice = (invoice: SalesInvoice) => {
    exportInvoiceToPDF(invoice);
    toast({ title: `Downloading ${invoice.invoiceNumber} as PDF...` });
  };

  const handleViewDetails = (invoice: SalesInvoice) => {
    setViewingInvoice(invoice);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Invoice</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingInvoice(null); setFormData({ items: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0, gstRate: 18, cgstAmount: 0, sgstAmount: 0, igstAmount: 0 }] }); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingInvoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
              <DialogDescription>
                {editingInvoice ? "Modify invoice details and items below." : "Fill in the customer details and add invoice items."}
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
                  <Select onValueChange={handleCustomerChange} value={customerGroups.find(c => c.gst === formData.customerGST)?.id}>
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
                  <Label htmlFor="customerGST">Customer GST</Label>
                  <Input
                    id="customerGST"
                    value={formData.customerGST || ""}
                    onChange={(e) => setFormData({ ...formData, customerGST: e.target.value })}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddress">Customer Address</Label>
                  <Input
                    id="customerAddress"
                    value={formData.customerAddress || ""}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="customerState">Customer State</Label>
                  <Input
                    id="customerState"
                    value={formData.customerState || ""}
                    onChange={(e) => setFormData({ ...formData, customerState: e.target.value })}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-semibold">Invoice Items</Label>
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
                      {formData.customerState === companyState ? (
                        <>
                          <TableHead>CGST</TableHead>
                          <TableHead>SGST</TableHead>
                        </>
                      ) : (
                        <TableHead>IGST</TableHead>
                      )}
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
                        {formData.customerState === companyState ? (
                          <>
                            <TableCell>₹{item.cgstAmount.toFixed(2)}</TableCell>
                            <TableCell>₹{item.sgstAmount.toFixed(2)}</TableCell>
                          </>
                        ) : (
                          <TableCell>₹{item.igstAmount.toFixed(2)}</TableCell>
                        )}
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
                      {formData.customerState === companyState ? (
                        <>
                          <div className="flex justify-between w-48">
                            <span>Total CGST:</span>
                            <span>₹{(formData.totalCGST || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-48">
                            <span>Total SGST:</span>
                            <span>₹{(formData.totalSGST || 0).toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between w-48">
                          <span>Total IGST:</span>
                          <span>₹{(formData.totalIGST || 0).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between w-48 font-semibold text-lg border-t pt-2">
                        <span>Total Amount:</span>
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
                  {editingInvoice ? "Update Invoice" : "Create Invoice"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>₹{invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      invoice.status === 'Paid' ? 'bg-success/10 text-success' :
                      invoice.status === 'Sent' ? 'bg-accent/10 text-accent' :
                      invoice.status === 'Overdue' ? 'bg-destructive/10 text-destructive' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {invoice.status}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(invoice)}>
                          <FileText className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(invoice)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportToPDF(invoice)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printInvoice(invoice)}>
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(invoice.id)} className="text-destructive">
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

      <InvoiceDetailDialog
        invoice={viewingInvoice}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onExportPDF={exportToPDF}
        onPrint={printInvoice}
      />
    </div>
  );
}