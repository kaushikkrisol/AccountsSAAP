import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileText, Printer } from "lucide-react";

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

interface CreditNoteDetailDialogProps {
  creditNote: CreditNote | null;
  isOpen: boolean;
  onClose: () => void;
  onExportPDF: (creditNote: CreditNote) => void;
  onPrint: (creditNote: CreditNote) => void;
}

export function CreditNoteDetailDialog({ creditNote, isOpen, onClose, onExportPDF, onPrint }: CreditNoteDetailDialogProps) {
  if (!creditNote) return null;

  const companyName = "DGT";
  const companyAddress = "2077 Chicago Avenue Orosi, CA 93647";
  const companyEmail = "admin@example.com";
  const companyPhone = "+1 893 174 0385";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold">Credit Note Detail</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onExportPDF(creditNote)}
              className="h-9 w-9"
            >
              <FileText className="h-4 w-4 text-red-500" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onPrint(creditNote)}
              className="h-9 w-9"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button 
              onClick={onClose}
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Credit Notes
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
                <p className="font-semibold text-foreground">{creditNote.customerName}</p>
                <p className="text-sm text-muted-foreground">{creditNote.customerAddress}</p>
                <p className="text-sm text-muted-foreground">GST: {creditNote.customerGST}</p>
                <p className="text-sm text-muted-foreground">Email: {creditNote.customerName.toLowerCase().replace(/\s+/g, '')}@example.com</p>
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

            {/* Credit Note Info */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Credit Note Info</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[100px]">Reference:</span>
                  <span className="text-sm font-medium text-orange-500">{creditNote.creditNoteNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[100px]">Date:</span>
                  <span className="text-sm text-foreground">{new Date(creditNote.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[100px]">Original Invoice:</span>
                  <span className="text-sm text-foreground">{creditNote.originalInvoiceNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[100px]">Status:</span>
                  <Badge className={`${
                    creditNote.status === 'Applied' ? 'bg-green-500 hover:bg-green-600' :
                    creditNote.status === 'Issued' ? 'bg-blue-500 hover:bg-blue-600' :
                    'bg-gray-500 hover:bg-gray-600'
                  } text-white`}>{creditNote.status}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Reason</h3>
            <p className="text-sm text-muted-foreground border rounded-lg p-3 bg-muted/20">{creditNote.reason}</p>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold w-16">S.No</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Rate (₹)</TableHead>
                    <TableHead className="font-semibold">Amount (₹)</TableHead>
                    <TableHead className="font-semibold">GST %</TableHead>
                    <TableHead className="font-semibold">GST Amount (₹)</TableHead>
                    <TableHead className="font-semibold text-right">Total (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditNote.items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.rate.toFixed(2)}</TableCell>
                      <TableCell>{item.amount.toFixed(2)}</TableCell>
                      <TableCell>{item.gstRate}%</TableCell>
                      <TableCell>{item.gstAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {(item.amount + item.gstAmount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-6">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-sm font-medium">₹ {creditNote.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Total GST</span>
                  <span className="text-sm font-medium">₹ {creditNote.totalGST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm font-semibold">Credit Amount</span>
                  <span className="text-sm font-semibold">₹ {creditNote.totalAmount.toFixed(2)}</span>
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
            Close
          </Button>
          <Button 
            className="min-w-[100px] bg-[#FF6B35] hover:bg-[#FF5722] text-white"
            onClick={() => onExportPDF(creditNote)}
          >
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
