import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileText, Printer } from "lucide-react";

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

interface ReceiptDetailDialogProps {
  receipt: Receipt | null;
  isOpen: boolean;
  onClose: () => void;
  onExportPDF: (receipt: Receipt) => void;
  onPrint: (receipt: Receipt) => void;
}

export function ReceiptDetailDialog({ receipt, isOpen, onClose, onExportPDF, onPrint }: ReceiptDetailDialogProps) {
  if (!receipt) return null;

  const companyName = "DGT";
  const companyAddress = "2077 Chicago Avenue Orosi, CA 93647";
  const companyEmail = "admin@example.com";
  const companyPhone = "+1 893 174 0385";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold">Receipt Detail</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onExportPDF(receipt)}
              className="h-9 w-9"
            >
              <FileText className="h-4 w-4 text-red-500" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onPrint(receipt)}
              className="h-9 w-9"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button 
              onClick={onClose}
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Receipts
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
                <p className="font-semibold text-foreground">{receipt.customerName}</p>
                <p className="text-sm text-muted-foreground">Group: {receipt.customerGroup}</p>
                <p className="text-sm text-muted-foreground">Email: {receipt.customerName.toLowerCase().replace(/\s+/g, '')}@example.com</p>
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

            {/* Receipt Info */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Receipt Info</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Reference:</span>
                  <span className="text-sm font-medium text-orange-500">{receipt.receiptNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Date:</span>
                  <span className="text-sm text-foreground">{new Date(receipt.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Status:</span>
                  <Badge className={`${
                    receipt.status === 'Received' ? 'bg-green-500 hover:bg-green-600' :
                    receipt.status === 'Pending' ? 'bg-yellow-500 hover:bg-yellow-600' :
                    'bg-red-500 hover:bg-red-600'
                  } text-white`}>{receipt.status}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Receipt Items</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold w-16">S.No</TableHead>
                  <TableHead className="font-semibold">Account Head</TableHead>
                  <TableHead className="font-semibold">Narration</TableHead>
                  <TableHead className="font-semibold text-right">Amount(₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item.accountHead}</TableCell>
                    <TableCell>{item.narration}</TableCell>
                    <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell colSpan={3} className="text-right">Total Amount</TableCell>
                  <TableCell className="text-right">₹{receipt.totalAmount.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Payment Details</h3>
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Payment Mode:</span>
                <span className="text-sm font-medium">{receipt.paymentMode}</span>
              </div>
              {receipt.bankAccount && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Bank Account:</span>
                  <span className="text-sm font-medium">{receipt.bankAccount}</span>
                </div>
              )}
              {receipt.chequeNumber && (
                <>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Cheque Number:</span>
                    <span className="text-sm font-medium">{receipt.chequeNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Cheque Date:</span>
                    <span className="text-sm font-medium">{receipt.chequeDate}</span>
                  </div>
                </>
              )}
              {receipt.upiId && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">UPI ID:</span>
                  <span className="text-sm font-medium">{receipt.upiId}</span>
                </div>
              )}
              {receipt.referenceNumber && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Reference Number:</span>
                  <span className="text-sm font-medium">{receipt.referenceNumber}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Overall Narration:</span>
                <span className="text-sm font-medium">{receipt.narration}</span>
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
            onClick={() => onExportPDF(receipt)}
          >
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
