import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Printer } from "lucide-react";

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

interface PaymentDetailDialogProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onExportPDF: (payment: Payment) => void;
  onPrint: (payment: Payment) => void;
}

export function PaymentDetailDialog({ payment, isOpen, onClose, onExportPDF, onPrint }: PaymentDetailDialogProps) {
  if (!payment) return null;

  const companyName = "DGT";
  const companyAddress = "2077 Chicago Avenue Orosi, CA 93647";
  const companyEmail = "admin@example.com";
  const companyPhone = "+1 893 174 0385";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold">Payment Detail</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onExportPDF(payment)}
              className="h-9 w-9"
            >
              <FileText className="h-4 w-4 text-red-500" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onPrint(payment)}
              className="h-9 w-9"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button 
              onClick={onClose}
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Payments
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Vendor Info */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Vendor Info</h3>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{payment.vendorName}</p>
                <p className="text-sm text-muted-foreground">Group: {payment.vendorGroup}</p>
                <p className="text-sm text-muted-foreground">Email: {payment.vendorName.toLowerCase().replace(/\s+/g, '')}@example.com</p>
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

            {/* Payment Info */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Payment Info</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Reference:</span>
                  <span className="text-sm font-medium text-orange-500">{payment.paymentNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Date:</span>
                  <span className="text-sm text-foreground">{new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Status:</span>
                  <Badge className={`${
                    payment.status === 'Paid' ? 'bg-green-500 hover:bg-green-600' :
                    payment.status === 'Pending' ? 'bg-yellow-500 hover:bg-yellow-600' :
                    'bg-red-500 hover:bg-red-600'
                  } text-white`}>{payment.status}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Payment Details</h3>
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Payment Mode:</span>
                <span className="text-sm font-medium">{payment.paymentMode}</span>
              </div>
              {payment.bankAccount && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Bank Account:</span>
                  <span className="text-sm font-medium">{payment.bankAccount}</span>
                </div>
              )}
              {payment.chequeNumber && (
                <>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Cheque Number:</span>
                    <span className="text-sm font-medium">{payment.chequeNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Cheque Date:</span>
                    <span className="text-sm font-medium">{payment.chequeDate}</span>
                  </div>
                </>
              )}
              {payment.upiId && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">UPI ID:</span>
                  <span className="text-sm font-medium">{payment.upiId}</span>
                </div>
              )}
              {payment.referenceNumber && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Reference Number:</span>
                  <span className="text-sm font-medium">{payment.referenceNumber}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Narration:</span>
                <span className="text-sm font-medium">{payment.narration}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm font-semibold">Amount Paid:</span>
                <span className="text-lg font-semibold">₹ {payment.amount.toLocaleString()}</span>
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
            onClick={() => onExportPDF(payment)}
          >
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
