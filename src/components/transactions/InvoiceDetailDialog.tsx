import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileText, Printer } from "lucide-react";

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

interface InvoiceDetailDialogProps {
  invoice: SalesInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onExportPDF: (invoice: SalesInvoice) => void;
  onPrint: (invoice: SalesInvoice) => void;
}

export function InvoiceDetailDialog({ invoice, isOpen, onClose, onExportPDF, onPrint }: InvoiceDetailDialogProps) {
  if (!invoice) return null;

  const companyName = "DGT";
  const companyAddress = "2077 Chicago Avenue Orosi, CA 93647";
  const companyEmail = "admin@example.com";
  const companyPhone = "+1 893 174 0385";

  const discount = 0;
  const orderTax = invoice.totalCGST + invoice.totalSGST + invoice.totalIGST;
  const grandTotal = invoice.totalAmount;
  const paid = invoice.status === "Paid" ? grandTotal : 0;
  const due = grandTotal - paid;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold">Sales Detail</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onExportPDF(invoice)}
              className="h-9 w-9"
            >
              <FileText className="h-4 w-4 text-red-500" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onPrint(invoice)}
              className="h-9 w-9"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button 
              onClick={onClose}
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sales
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Customer Info</h3>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{invoice.customerName}</p>
                <p className="text-sm text-muted-foreground">{invoice.customerAddress}</p>
                <p className="text-sm text-muted-foreground">Email: {invoice.customerName.toLowerCase().replace(/\s+/g, '')}@example.com</p>
                <p className="text-sm text-muted-foreground">Phone: +1 987 471 6589</p>
              </div>
            </div>

            {/* Company Info */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Company Info</h3>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{companyName}</p>
                <p className="text-sm text-muted-foreground">{companyAddress}</p>
                <p className="text-sm text-muted-foreground">Email: {companyEmail}</p>
                <p className="text-sm text-muted-foreground">Phone: {companyPhone}</p>
              </div>
            </div>

            {/* Invoice Info */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Invoice Info</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Reference:</span>
                  <span className="text-sm font-medium text-orange-500">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Date:</span>
                  <span className="text-sm text-foreground">{new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Status:</span>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">{invoice.status}</Badge>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Payment Status:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-foreground">Paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Order Summary</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold w-16">S.No</TableHead>
                    <TableHead className="font-semibold">Product</TableHead>
                    <TableHead className="font-semibold">Purchase Price(₹)</TableHead>
                    <TableHead className="font-semibold">Discount(₹)</TableHead>
                    <TableHead className="font-semibold">Tax(%)</TableHead>
                    <TableHead className="font-semibold">Tax Amount(₹)</TableHead>
                    <TableHead className="font-semibold">Unit Cost(₹)</TableHead>
                    <TableHead className="font-semibold text-right">Total Cost(₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, index) => {
                    const itemDiscount = 0;
                    const taxAmount = item.cgstAmount + item.sgstAmount + item.igstAmount;
                    const unitCost = item.rate;
                    const totalCost = item.amount + taxAmount;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs">
                              {index === 0 ? '👟' : index === 1 ? '⌚' : '🎒'}
                            </div>
                            <span>{item.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.rate.toFixed(2)}</TableCell>
                        <TableCell>{itemDiscount.toFixed(2)}</TableCell>
                        <TableCell>{item.gstRate.toFixed(2)}</TableCell>
                        <TableCell>{taxAmount.toFixed(2)}</TableCell>
                        <TableCell>{unitCost.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">{totalCost.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-6">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Order Tax</span>
                  <span className="text-sm font-medium">₹ {orderTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Discount</span>
                  <span className="text-sm font-medium">₹ {discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm font-semibold">Grand Total</span>
                  <span className="text-sm font-semibold">₹ {grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Paid</span>
                  <span className="text-sm font-medium">₹ {paid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Due</span>
                  <span className="text-sm font-medium">₹ {due.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex justify-end gap-3">
          <Button 
            variant="outline"
            onClick={onClose}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button 
            className="min-w-[100px] bg-[#FF6B35] hover:bg-[#FF5722] text-white"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
