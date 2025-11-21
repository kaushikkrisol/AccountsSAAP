import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Bank {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  accountType: string;
  openingBalance: number;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export function BankMaster() {
  const [banks, setBanks] = useState<Bank[]>([
    {
      id: "1",
      bankName: "State Bank of India",
      accountNumber: "12345678901",
      ifscCode: "SBIN0001234",
      branch: "Main Branch",
      accountType: "Current",
      openingBalance: 150000,
      address: "123 Bank Street, City Center",
      contactPerson: "John Doe",
      phone: "9876543210",
      email: "john@sbi.com"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState<Partial<Bank>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBank) {
      setBanks(banks.map(bank => bank.id === editingBank.id ? { ...bank, ...formData } : bank));
      toast({ title: "Bank updated successfully" });
    } else {
      const newBank: Bank = {
        id: Date.now().toString(),
        ...formData as Bank
      };
      setBanks([...banks, newBank]);
      toast({ title: "Bank added successfully" });
    }
    setIsDialogOpen(false);
    setEditingBank(null);
    setFormData({});
  };

  const handleEdit = (bank: Bank) => {
    setEditingBank(bank);
    setFormData(bank);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBanks(banks.filter(bank => bank.id !== id));
    toast({ title: "Bank deleted successfully" });
  };

  const exportToExcel = () => {
    toast({ title: "Exporting to Excel..." });
    // Mock export functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bank Master</h2>
        <div className="flex gap-2">
          <Button onClick={exportToExcel} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingBank(null); setFormData({}); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Bank
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingBank ? "Edit Bank" : "Add New Bank"}</DialogTitle>
                <DialogDescription>
                  {editingBank ? "Update bank account details below." : "Enter the details for the new bank account."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName || ""}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber || ""}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={formData.ifscCode || ""}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      value={formData.branch || ""}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountType">Account Type</Label>
                    <Input
                      id="accountType"
                      value={formData.accountType || ""}
                      onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="openingBalance">Opening Balance</Label>
                    <Input
                      id="openingBalance"
                      type="number"
                      value={formData.openingBalance || ""}
                      onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson || ""}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBank ? "Update" : "Save"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bank Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bank Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>IFSC Code</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Opening Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banks.map((bank) => (
                <TableRow key={bank.id}>
                  <TableCell className="font-medium">{bank.bankName}</TableCell>
                  <TableCell>{bank.accountNumber}</TableCell>
                  <TableCell>{bank.ifscCode}</TableCell>
                  <TableCell>{bank.branch}</TableCell>
                  <TableCell>{bank.accountType}</TableCell>
                  <TableCell>₹{bank.openingBalance.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(bank)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(bank.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}