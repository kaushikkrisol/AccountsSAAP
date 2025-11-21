import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PurchaseItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
}

interface PurchaseVoucher {
  id: string;
  voucherNo: string;
  date: string;
  supplier: string;
  supplierState: string;
  items: PurchaseItem[];
  subtotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  grandTotal: number;
  status: "Paid" | "Pending" | "Partial";
}

interface PurchaseVoucherDetailDialogProps {
  voucher: PurchaseVoucher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PurchaseVoucherDetailDialog = ({
  voucher,
  open,
  onOpenChange,
}: PurchaseVoucherDetailDialogProps) => {
  if (!voucher) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Purchase Voucher Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Voucher No</p>
              <p className="font-medium">{voucher.voucherNo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{voucher.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Supplier</p>
              <p className="font-medium">{voucher.supplier}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Supplier State</p>
              <p className="font-medium">{voucher.supplierState}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{voucher.status}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Purchase Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">S.No</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Rate(₹)</TableHead>
                    <TableHead className="text-right">Amount(₹)</TableHead>
                    <TableHead className="text-right">GST%</TableHead>
                    <TableHead className="text-right">CGST(₹)</TableHead>
                    <TableHead className="text-right">SGST(₹)</TableHead>
                    <TableHead className="text-right">IGST(₹)</TableHead>
                    <TableHead className="text-right">Total(₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {voucher.items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.rate.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.gstRate}%</TableCell>
                      <TableCell className="text-right">{item.cgst.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.sgst.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.igst.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-semibold">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {voucher.subtotal.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-semibold">
                      {voucher.totalCgst.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {voucher.totalSgst.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {voucher.totalIgst.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={9} className="text-right font-bold">
                      Grand Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ₹{voucher.grandTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
