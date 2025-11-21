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
import { JournalDetailDialog } from "./JournalDetailDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { exportJournalToPDF, exportJournalToExcel } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

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

interface JournalLine {
  id: string;
  accountName: string;
  debitAmount: number;
  creditAmount: number;
  narration: string;
}

export function Journal() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      entryNumber: "JV-2024-001",
      date: "2024-01-15",
      reference: "Bank Transfer",
      narration: "Transfer from Cash to Bank Account",
      entries: [
        { id: "1", accountName: "SBI Current Account", debitAmount: 50000, creditAmount: 0, narration: "Cash deposited" },
        { id: "2", accountName: "Cash in Hand", debitAmount: 0, creditAmount: 50000, narration: "Cash withdrawn" }
      ],
      totalDebit: 50000,
      totalCredit: 50000,
      status: "Posted"
    },
    {
      id: "2",
      entryNumber: "JV-2024-002",
      date: "2024-01-18",
      reference: "Salary Payment",
      narration: "Monthly salary payment for January 2024",
      entries: [
        { id: "1", accountName: "Salary Expenses", debitAmount: 85000, creditAmount: 0, narration: "Salary expense for 5 employees" },
        { id: "2", accountName: "SBI Current Account", debitAmount: 0, creditAmount: 85000, narration: "Salary paid via bank transfer" }
      ],
      totalDebit: 85000,
      totalCredit: 85000,
      status: "Posted"
    },
    {
      id: "3",
      entryNumber: "JV-2024-003",
      date: "2024-01-20",
      reference: "Rent Adjustment",
      narration: "Office rent payment and adjustment",
      entries: [
        { id: "1", accountName: "Rent Expenses", debitAmount: 25000, creditAmount: 0, narration: "Monthly office rent" },
        { id: "2", accountName: "HDFC Savings Account", debitAmount: 0, creditAmount: 20000, narration: "Rent paid" },
        { id: "3", accountName: "Office Expenses", debitAmount: 0, creditAmount: 5000, narration: "Adjustment for utilities included in rent" }
      ],
      totalDebit: 25000,
      totalCredit: 25000,
      status: "Posted"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [formData, setFormData] = useState<Partial<JournalEntry>>({
    entries: [{ id: "1", accountName: "", debitAmount: 0, creditAmount: 0, narration: "" }]
  });
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  const accountGroups = [
    "Cash in Hand",
    "SBI Current Account", 
    "HDFC Savings Account",
    "Capital Account",
    "Sales Account",
    "Purchase Account",
    "Office Expenses",
    "Salary Expenses",
    "Rent Expenses",
    "Sundry Debtors",
    "Sundry Creditors"
  ];

  const updateJournalLine = (index: number, field: keyof JournalLine, value: any) => {
    const entries = [...(formData.entries || [])];
    entries[index] = { ...entries[index], [field]: value };
    
    const totalDebit = entries.reduce((sum, entry) => sum + entry.debitAmount, 0);
    const totalCredit = entries.reduce((sum, entry) => sum + entry.creditAmount, 0);
    
    setFormData({
      ...formData,
      entries,
      totalDebit,
      totalCredit
    });
  };

  const addJournalLine = () => {
    const newLine: JournalLine = {
      id: Date.now().toString(),
      accountName: "",
      debitAmount: 0,
      creditAmount: 0,
      narration: ""
    };
    setFormData({
      ...formData,
      entries: [...(formData.entries || []), newLine]
    });
  };

  const removeJournalLine = (index: number) => {
    const entries = formData.entries?.filter((_, i) => i !== index) || [];
    const totalDebit = entries.reduce((sum, entry) => sum + entry.debitAmount, 0);
    const totalCredit = entries.reduce((sum, entry) => sum + entry.creditAmount, 0);
    
    setFormData({
      ...formData,
      entries,
      totalDebit,
      totalCredit
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.totalDebit !== formData.totalCredit) {
      toast({ title: "Error", description: "Debit and Credit amounts must be equal", variant: "destructive" });
      return;
    }

    if (editingEntry) {
      setJournalEntries(journalEntries.map(entry => entry.id === editingEntry.id ? { ...entry, ...formData } : entry));
      toast({ title: "Journal entry updated successfully" });
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        entryNumber: `JV-2024-${String(journalEntries.length + 1).padStart(3, '0')}`,
        status: "Draft",
        ...formData as JournalEntry
      };
      setJournalEntries([...journalEntries, newEntry]);
      toast({ title: "Journal entry created successfully" });
    }
    setIsDialogOpen(false);
    setEditingEntry(null);
    setFormData({ entries: [{ id: "1", accountName: "", debitAmount: 0, creditAmount: 0, narration: "" }] });
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setFormData(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setJournalEntries(journalEntries.filter(entry => entry.id !== id));
    toast({ title: "Journal entry deleted successfully" });
  };

  const exportToPDF = (entry: JournalEntry) => {
    exportJournalToPDF(entry);
    toast({ title: `${entry.entryNumber} exported to PDF successfully` });
  };

  const exportToExcel = () => {
    exportJournalToExcel(journalEntries);
    toast({ title: "Journal entries exported to Excel successfully" });
  };

  const printEntry = (entry: JournalEntry) => {
    exportJournalToPDF(entry);
    toast({ title: `Downloading ${entry.entryNumber} as PDF...` });
  };

  const handleViewDetails = (entry: JournalEntry) => {
    setViewingEntry(entry);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Journal Entries</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingEntry(null); setFormData({ entries: [{ id: "1", accountName: "", debitAmount: 0, creditAmount: 0, narration: "" }] }); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit Journal Entry" : "Create New Journal Entry"}</DialogTitle>
              <DialogDescription>
                {editingEntry ? "Modify journal entry details below." : "Create a new journal entry with debit and credit accounts."}
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
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    value={formData.reference || ""}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="Reference document/transaction"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="narration">Narration</Label>
                <Textarea
                  id="narration"
                  value={formData.narration || ""}
                  onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                  placeholder="Overall description of the journal entry..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-semibold">Journal Lines</Label>
                  <Button type="button" onClick={addJournalLine} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Line
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Debit Amount</TableHead>
                      <TableHead>Credit Amount</TableHead>
                      <TableHead>Narration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.entries?.map((line, index) => (
                      <TableRow key={line.id}>
                        <TableCell>
                          <Select value={line.accountName} onValueChange={(value) => updateJournalLine(index, "accountName", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              {accountGroups.map((account) => (
                                <SelectItem key={account} value={account}>
                                  {account}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={line.debitAmount}
                            onChange={(e) => updateJournalLine(index, "debitAmount", Number(e.target.value))}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={line.creditAmount}
                            onChange={(e) => updateJournalLine(index, "creditAmount", Number(e.target.value))}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={line.narration}
                            onChange={(e) => updateJournalLine(index, "narration", e.target.value)}
                            placeholder="Line narration"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => removeJournalLine(index)}
                            disabled={formData.entries?.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 bg-muted/20 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                    <div className="text-right">
                      <span>Total Debit: ₹{(formData.totalDebit || 0).toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span>Total Credit: ₹{(formData.totalCredit || 0).toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className={`${
                        formData.totalDebit === formData.totalCredit ? 'text-success' : 'text-destructive'
                      }`}>
                        Difference: ₹{Math.abs((formData.totalDebit || 0) - (formData.totalCredit || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEntry ? "Update Entry" : "Create Entry"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Journal Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Narration</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journalEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.entryNumber}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.reference}</TableCell>
                  <TableCell className="max-w-xs truncate">{entry.narration}</TableCell>
                  <TableCell>₹{entry.totalDebit.toLocaleString()}</TableCell>
                  <TableCell>₹{entry.totalCredit.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      entry.status === 'Posted' ? 'bg-success/10 text-success' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {entry.status}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(entry)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(entry)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportToPDF(entry)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printEntry(entry)}>
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(entry.id)} className="text-destructive">
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

      <JournalDetailDialog 
        entry={viewingEntry}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onExportPDF={exportToPDF}
        onPrint={printEntry}
      />
    </div>
  );
}