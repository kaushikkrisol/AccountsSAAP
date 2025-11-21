import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileText, Printer } from "lucide-react";

interface JournalLine {
  id: string;
  accountName: string;
  debitAmount: number;
  creditAmount: number;
  narration: string;
}

interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference: string;
  narration: string;
  entries: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: "Posted" | "Draft";
}

interface JournalDetailDialogProps {
  entry: JournalEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onExportPDF: (entry: JournalEntry) => void;
  onPrint: (entry: JournalEntry) => void;
}

export function JournalDetailDialog({ entry, isOpen, onClose, onExportPDF, onPrint }: JournalDetailDialogProps) {
  if (!entry) return null;

  const companyName = "DGT";
  const companyAddress = "2077 Chicago Avenue Orosi, CA 93647";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold">Journal Entry Detail</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onExportPDF(entry)}
              className="h-9 w-9"
            >
              <FileText className="h-4 w-4 text-red-500" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onPrint(entry)}
              className="h-9 w-9"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button 
              onClick={onClose}
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Journal
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Company Info */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Company Info</h3>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{companyName}</p>
                <p className="text-sm text-muted-foreground">{companyAddress}</p>
              </div>
            </div>

            {/* Entry Info */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Entry Info</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Entry No:</span>
                  <span className="text-sm font-medium text-orange-500">{entry.entryNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Date:</span>
                  <span className="text-sm text-foreground">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Reference:</span>
                  <span className="text-sm text-foreground">{entry.reference}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground min-w-[80px]">Status:</span>
                  <Badge className={`${
                    entry.status === 'Posted' ? 'bg-green-500 hover:bg-green-600' :
                    'bg-yellow-500 hover:bg-yellow-600'
                  } text-white`}>{entry.status}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Narration */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Narration</h3>
            <p className="text-sm text-muted-foreground border rounded-lg p-3 bg-muted/20">{entry.narration}</p>
          </div>

          {/* Journal Lines */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Journal Lines</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold w-16">S.No</TableHead>
                    <TableHead className="font-semibold">Account Name</TableHead>
                    <TableHead className="font-semibold">Narration</TableHead>
                    <TableHead className="font-semibold text-right">Debit (₹)</TableHead>
                    <TableHead className="font-semibold text-right">Credit (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entry.entries.map((line, index) => (
                    <TableRow key={line.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{line.accountName}</TableCell>
                      <TableCell>{line.narration}</TableCell>
                      <TableCell className="text-right">
                        {line.debitAmount > 0 ? line.debitAmount.toLocaleString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {line.creditAmount > 0 ? line.creditAmount.toLocaleString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-6">
              <div className="w-full max-w-md space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm font-semibold">Total Debit</span>
                  <span className="text-sm font-semibold">₹ {entry.totalDebit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm font-semibold">Total Credit</span>
                  <span className="text-sm font-semibold">₹ {entry.totalCredit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm font-semibold">Difference</span>
                  <span className={`text-sm font-semibold ${
                    entry.totalDebit === entry.totalCredit ? 'text-green-500' : 'text-red-500'
                  }`}>
                    ₹ {Math.abs(entry.totalDebit - entry.totalCredit).toLocaleString()}
                  </span>
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
            onClick={() => onExportPDF(entry)}
          >
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
