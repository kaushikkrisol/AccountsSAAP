import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Group {
  id: string;
  groupName: string;
  groupType: "Customer" | "Vendor" | "Both";
  parentGroup: string;
  creditLimit: number;
  creditDays: number;
  gstNumber: string;
  panNumber: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export function GroupMaster() {
  const [groups, setGroups] = useState<Group[]>([
    // Default Accounting Groups
    { id: "1", groupName: "Cash in Hand", groupType: "Both", parentGroup: "Current Assets", creditLimit: 0, creditDays: 0, gstNumber: "", panNumber: "", address: "", contactPerson: "", phone: "", email: "", isActive: true },
    { id: "2", groupName: "Capital Account", groupType: "Both", parentGroup: "Equity", creditLimit: 0, creditDays: 0, gstNumber: "", panNumber: "", address: "", contactPerson: "", phone: "", email: "", isActive: true },
    { id: "3", groupName: "Current Assets", groupType: "Both", parentGroup: "Assets", creditLimit: 0, creditDays: 0, gstNumber: "", panNumber: "", address: "", contactPerson: "", phone: "", email: "", isActive: true },
    { id: "4", groupName: "Fixed Assets", groupType: "Both", parentGroup: "Assets", creditLimit: 0, creditDays: 0, gstNumber: "", panNumber: "", address: "", contactPerson: "", phone: "", email: "", isActive: true },
    { id: "5", groupName: "Current Liabilities", groupType: "Both", parentGroup: "Liabilities", creditLimit: 0, creditDays: 0, gstNumber: "", panNumber: "", address: "", contactPerson: "", phone: "", email: "", isActive: true },
    { id: "6", groupName: "Long Term Liabilities", groupType: "Both", parentGroup: "Liabilities", creditLimit: 0, creditDays: 0, gstNumber: "", panNumber: "", address: "", contactPerson: "", phone: "", email: "", isActive: true },
    { id: "7", groupName: "Sales Account", groupType: "Both", parentGroup: "Income", creditLimit: 0, creditDays: 0, gstNumber: "", panNumber: "", address: "", contactPerson: "", phone: "", email: "", isActive: true },
    { id: "8", groupName: "Purchase Account", groupType: "Both", parentGroup: "Expenses", creditLimit: 0, creditDays: 0, gstNumber: "", panNumber: "", address: "", contactPerson: "", phone: "", email: "", isActive: true },
    { id: "9", groupName: "Sundry Debtors", groupType: "Customer", parentGroup: "Current Assets", creditLimit: 100000, creditDays: 30, gstNumber: "", panNumber: "", address: "", contactPerson: "", phone: "", email: "", isActive: true },
    { id: "10", groupName: "Sundry Creditors", groupType: "Vendor", parentGroup: "Current Liabilities", creditLimit: 50000, creditDays: 15, gstNumber: "", panNumber: "", address: "", contactPerson: "", phone: "", email: "", isActive: true },
    {
      id: "11",
      groupName: "Premium Customers",
      groupType: "Customer",
      parentGroup: "Sundry Debtors",
      creditLimit: 500000,
      creditDays: 30,
      gstNumber: "27AAAAA0000A1Z5",
      panNumber: "AAAAA0000A",
      address: "123 Business District",
      contactPerson: "Jane Smith",
      phone: "9876543210",
      email: "jane@company.com",
      isActive: true
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState<Partial<Group>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      setGroups(groups.map(group => group.id === editingGroup.id ? { ...group, ...formData } : group));
      toast({ title: "Group updated successfully" });
    } else {
      const newGroup: Group = {
        id: Date.now().toString(),
        isActive: true,
        ...formData as Group
      };
      setGroups([...groups, newGroup]);
      toast({ title: "Group added successfully" });
    }
    setIsDialogOpen(false);
    setEditingGroup(null);
    setFormData({});
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData(group);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
    toast({ title: "Group deleted successfully" });
  };

  const exportToExcel = () => {
    toast({ title: "Exporting to Excel..." });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Group Master</h2>
        <div className="flex gap-2">
          <Button onClick={exportToExcel} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingGroup(null); setFormData({}); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingGroup ? "Edit Group" : "Add New Group"}</DialogTitle>
                <DialogDescription>
                  {editingGroup ? "Update group details below." : "Create a new customer or vendor group."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      value={formData.groupName || ""}
                      onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupType">Group Type</Label>
                    <Select value={formData.groupType} onValueChange={(value) => setFormData({ ...formData, groupType: value as Group["groupType"] })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="Vendor">Vendor</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="parentGroup">Parent Group</Label>
                    <Input
                      id="parentGroup"
                      value={formData.parentGroup || ""}
                      onChange={(e) => setFormData({ ...formData, parentGroup: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditLimit">Credit Limit</Label>
                    <Input
                      id="creditLimit"
                      type="number"
                      value={formData.creditLimit || ""}
                      onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditDays">Credit Days</Label>
                    <Input
                      id="creditDays"
                      type="number"
                      value={formData.creditDays || ""}
                      onChange={(e) => setFormData({ ...formData, creditDays: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber || ""}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber || ""}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
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
                    {editingGroup ? "Update" : "Save"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Parent Group</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>Credit Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.groupName}</TableCell>
                  <TableCell>{group.groupType}</TableCell>
                  <TableCell>{group.parentGroup}</TableCell>
                  <TableCell>₹{group.creditLimit.toLocaleString()}</TableCell>
                  <TableCell>{group.creditDays} days</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${group.isActive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                      {group.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(group)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(group.id)}>
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