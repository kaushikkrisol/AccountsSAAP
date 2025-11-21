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
import { Upload, Search, CheckCircle, XCircle, Clock, Eye, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface Invoice {
  _id?: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  projectId: string;
  projectName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  ocrProcessed: boolean;
}

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      _id: "1",
      invoiceNumber: "INV-2024-001",
      vendorId: "1",
      vendorName: "Steel Suppliers India Ltd",
      projectId: "1",
      projectName: "Corporate Office Renovation",
      invoiceDate: "2024-01-20",
      dueDate: "2024-02-20",
      amount: 500000,
      gstAmount: 90000,
      totalAmount: 590000,
      status: "approved",
      ocrProcessed: true,
    },
    {
      _id: "2",
      invoiceNumber: "INV-2024-002",
      vendorId: "2",
      vendorName: "Concrete Mix Solutions",
      projectId: "3",
      projectName: "Residential Tower Phase 2",
      invoiceDate: "2024-02-05",
      dueDate: "2024-03-05",
      amount: 750000,
      gstAmount: 135000,
      totalAmount: 885000,
      status: "pending",
      ocrProcessed: true,
    },
    {
      _id: "3",
      invoiceNumber: "INV-2024-003",
      vendorId: "3",
      vendorName: "Elite Interiors & Design",
      projectId: "5",
      projectName: "Hotel Interior Design",
      invoiceDate: "2024-03-10",
      dueDate: "2024-04-10",
      amount: 300000,
      gstAmount: 54000,
      totalAmount: 354000,
      status: "approved",
      ocrProcessed: false,
    },
    {
      _id: "4",
      invoiceNumber: "INV-2024-004",
      vendorId: "4",
      vendorName: "Power Electricals Co.",
      projectId: "1",
      projectName: "Corporate Office Renovation",
      invoiceDate: "2024-03-15",
      dueDate: "2024-04-15",
      amount: 425000,
      gstAmount: 76500,
      totalAmount: 501500,
      status: "pending",
      ocrProcessed: true,
    },
    {
      _id: "5",
      invoiceNumber: "INV-2024-005",
      vendorId: "5",
      vendorName: "Prime Transport Services",
      projectId: "3",
      projectName: "Residential Tower Phase 2",
      invoiceDate: "2024-03-18",
      dueDate: "2024-04-18",
      amount: 150000,
      gstAmount: 27000,
      totalAmount: 177000,
      status: "paid",
      ocrProcessed: true,
    },
    {
      _id: "6",
      invoiceNumber: "INV-2024-006",
      vendorId: "1",
      vendorName: "Steel Suppliers India Ltd",
      projectId: "3",
      projectName: "Residential Tower Phase 2",
      invoiceDate: "2024-03-22",
      dueDate: "2024-04-22",
      amount: 680000,
      gstAmount: 122400,
      totalAmount: 802400,
      status: "approved",
      ocrProcessed: true,
    },
    {
      _id: "7",
      invoiceNumber: "INV-2024-007",
      vendorId: "2",
      vendorName: "Concrete Mix Solutions",
      projectId: "4",
      projectName: "Industrial Warehouse",
      invoiceDate: "2024-03-25",
      dueDate: "2024-04-25",
      amount: 920000,
      gstAmount: 165600,
      totalAmount: 1085600,
      status: "rejected",
      ocrProcessed: false,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNumber: "",
    vendorId: "",
    projectId: "",
    invoiceDate: "",
    dueDate: "",
    amount: 0,
    gstAmount: 0,
    status: "pending",
  });

  const handleUploadOCR = async (file: File) => {
    try {
      // Placeholder for OCR processing
      toast({
        title: "OCR Processing",
        description: "Invoice uploaded and being processed...",
      });
      // In real implementation, this would call OCR service
      setIsUploadDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process invoice",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await apiClient.put(`/invoices/${id}`, { status: "approved" });
      toast({ title: "Invoice approved successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve invoice",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiClient.put(`/invoices/${id}`, { status: "rejected" });
      toast({ title: "Invoice rejected" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject invoice",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInvoice?._id) {
        await apiClient.put(`/invoices/${editingInvoice._id}`, formData);
        toast({ title: "Invoice updated successfully" });
      } else {
        await apiClient.post("/invoices", formData);
        toast({ title: "Invoice created successfully" });
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingInvoice ? "update" : "create"} invoice`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await apiClient.delete(`/invoices/${id}`);
      toast({ title: "Invoice deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      invoiceNumber: "",
      vendorId: "",
      projectId: "",
      invoiceDate: "",
      dueDate: "",
      amount: 0,
      gstAmount: 0,
      status: "pending",
    });
    setEditingInvoice(null);
  };

  const openEditDialog = (invoice: Invoice) => {
    setFormData(invoice);
    setEditingInvoice(invoice);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: any }> = {
      pending: { className: "bg-yellow-500/10 text-yellow-500", icon: Clock },
      approved: { className: "bg-green-500/10 text-green-500", icon: CheckCircle },
      rejected: { className: "bg-red-500/10 text-red-500", icon: XCircle },
      paid: { className: "bg-blue-500/10 text-blue-500", icon: CheckCircle },
    };
    const variant = variants[status];
    const Icon = variant.icon;
    return (
      <Badge className={variant.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Invoice Management</span>
            <div className="flex gap-2">
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Invoice (OCR)
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                Add Manual Invoice
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                    {invoice.ocrProcessed && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        OCR
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{invoice.vendorName}</TableCell>
                  <TableCell>{invoice.projectName}</TableCell>
                  <TableCell>{invoice.invoiceDate}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>₹{invoice.gstAmount.toLocaleString()}</TableCell>
                  <TableCell>₹{invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {invoice.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => invoice._id && handleApprove(invoice._id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => invoice._id && handleReject(invoice._id)}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(invoice)}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => invoice._id && handleDelete(invoice._id)}
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

      {/* OCR Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Invoice for OCR Processing</DialogTitle>
            <DialogDescription>
              Upload an invoice document to automatically extract data using OCR technology.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your invoice or click to browse
              </p>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadOCR(file);
                }}
                className="max-w-xs mx-auto"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: PDF, JPG, PNG
              </p>
            </div>
            <div className="bg-accent p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">OCR will extract:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Vendor details (Name, GSTIN, PAN)</li>
                <li>• Invoice number and dates</li>
                <li>• Line items and amounts</li>
                <li>• GST breakup</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingInvoice ? "Edit Invoice" : "Add Manual Invoice"}
            </DialogTitle>
            <DialogDescription>
              {editingInvoice ? "Update invoice details below." : "Manually enter invoice information for the selected vendor and project."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input
                  value={formData.invoiceNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, invoiceNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) =>
                    setFormData({ ...formData, invoiceDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Vendor</Label>
                <Select
                  value={formData.vendorId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, vendorId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendor1">Vendor 1</SelectItem>
                    <SelectItem value="vendor2">Vendor 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, projectId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project1">Project 1</SelectItem>
                    <SelectItem value="project2">Project 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (Base)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>GST Amount</Label>
                <Input
                  type="number"
                  value={formData.gstAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, gstAmount: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
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
                {editingInvoice ? "Update Invoice" : "Create Invoice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
