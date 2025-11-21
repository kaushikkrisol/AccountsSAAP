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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface Vendor {
  _id?: string;
  vendorCode: string;
  vendorName: string;
  gstin: string;
  pan: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  tdsSection: string;
  tdsRate: number;
  status: "active" | "pending-kyc" | "inactive";
}

export function VendorMaster() {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      _id: "1",
      vendorCode: "VEN001",
      vendorName: "Steel Suppliers India Ltd",
      gstin: "27AABCU9603R1ZM",
      pan: "AABCU9603R",
      contactPerson: "Rajesh Kumar",
      email: "rajesh@steelsuppliers.com",
      phone: "+91-9876543210",
      address: "Plot No. 45, Industrial Area",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      bankName: "HDFC Bank",
      accountNumber: "50200012345678",
      ifscCode: "HDFC0001234",
      tdsSection: "194C",
      tdsRate: 1,
      status: "active",
    },
    {
      _id: "2",
      vendorCode: "VEN002",
      vendorName: "Concrete Mix Solutions",
      gstin: "29AAECM8950F1ZG",
      pan: "AAECM8950F",
      contactPerson: "Amit Sharma",
      email: "amit@concretemix.com",
      phone: "+91-9876543211",
      address: "Building 12, Sector 18",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      bankName: "ICICI Bank",
      accountNumber: "001205123456",
      ifscCode: "ICIC0001205",
      tdsSection: "194C",
      tdsRate: 2,
      status: "active",
    },
    {
      _id: "3",
      vendorCode: "VEN003",
      vendorName: "Elite Interiors & Design",
      gstin: "07AAGFE2345R1ZK",
      pan: "AAGFE2345R",
      contactPerson: "Priya Desai",
      email: "priya@eliteinteriors.com",
      phone: "+91-9876543212",
      address: "Shop 23, Design District",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      bankName: "State Bank of India",
      accountNumber: "30123456789",
      ifscCode: "SBIN0001234",
      tdsSection: "194J",
      tdsRate: 10,
      status: "active",
    },
    {
      _id: "4",
      vendorCode: "VEN004",
      vendorName: "Power Electricals Co.",
      gstin: "24AAHCP8765F1ZP",
      pan: "AAHCP8765F",
      contactPerson: "Suresh Patel",
      email: "suresh@powerelectricals.com",
      phone: "+91-9876543213",
      address: "Warehouse 7, Phase 3",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380001",
      bankName: "Axis Bank",
      accountNumber: "920020123456789",
      ifscCode: "UTIB0001234",
      tdsSection: "194C",
      tdsRate: 2,
      status: "pending-kyc",
    },
    {
      _id: "5",
      vendorCode: "VEN005",
      vendorName: "Prime Transport Services",
      gstin: "33AADCP5678M1ZW",
      pan: "AADCP5678M",
      contactPerson: "Vijay Reddy",
      email: "vijay@primetransport.com",
      phone: "+91-9876543214",
      address: "Transport Nagar, Zone B",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
      bankName: "Punjab National Bank",
      accountNumber: "1234567890123",
      ifscCode: "PUNB0123400",
      tdsSection: "194C",
      tdsRate: 1,
      status: "active",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState<Vendor>({
    vendorCode: "",
    vendorName: "",
    gstin: "",
    pan: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    tdsSection: "194C",
    tdsRate: 2,
    status: "pending-kyc",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVendor?._id) {
        await apiClient.put(`/vendors/${editingVendor._id}`, formData);
        toast({ title: "Vendor updated successfully" });
      } else {
        await apiClient.post("/vendors", formData);
        toast({ title: "Vendor created successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
      // Refresh vendor list
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to save vendor",
        variant: "destructive" 
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/vendors/${id}`);
      toast({ title: "Vendor deleted successfully" });
      // Refresh vendor list
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete vendor",
        variant: "destructive" 
      });
    }
  };

  const resetForm = () => {
    setFormData({
      vendorCode: "",
      vendorName: "",
      gstin: "",
      pan: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      tdsSection: "194C",
      tdsRate: 2,
      status: "pending-kyc",
    });
    setEditingVendor(null);
  };

  const openEditDialog = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData(vendor);
    setIsDialogOpen(true);
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.gstin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vendor Master</span>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Code</TableHead>
                <TableHead>Vendor Name</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>PAN</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell>{vendor.vendorCode}</TableCell>
                  <TableCell>{vendor.vendorName}</TableCell>
                  <TableCell>{vendor.gstin}</TableCell>
                  <TableCell>{vendor.pan}</TableCell>
                  <TableCell>{vendor.contactPerson}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        vendor.status === "active"
                          ? "bg-financial-positive/10 text-financial-positive"
                          : vendor.status === "pending-kyc"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-financial-negative/10 text-financial-negative"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(vendor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => vendor._id && handleDelete(vendor._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVendor ? "Edit Vendor" : "Add New Vendor"}
            </DialogTitle>
            <DialogDescription>
              {editingVendor ? "Update vendor information below." : "Enter vendor details including contact, bank, and TDS information."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact & Address</TabsTrigger>
                <TabsTrigger value="bank">Bank & TDS</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorCode">Vendor Code</Label>
                    <Input
                      id="vendorCode"
                      value={formData.vendorCode}
                      onChange={(e) =>
                        setFormData({ ...formData, vendorCode: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendorName">Vendor Name</Label>
                    <Input
                      id="vendorName"
                      value={formData.vendorName}
                      onChange={(e) =>
                        setFormData({ ...formData, vendorName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      value={formData.gstin}
                      onChange={(e) =>
                        setFormData({ ...formData, gstin: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN</Label>
                    <Input
                      id="pan"
                      value={formData.pan}
                      onChange={(e) =>
                        setFormData({ ...formData, pan: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({ ...formData, contactPerson: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) =>
                        setFormData({ ...formData, bankName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, accountNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={formData.ifscCode}
                      onChange={(e) =>
                        setFormData({ ...formData, ifscCode: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tdsSection">TDS Section</Label>
                    <Input
                      id="tdsSection"
                      value={formData.tdsSection}
                      onChange={(e) =>
                        setFormData({ ...formData, tdsSection: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tdsRate">TDS Rate (%)</Label>
                    <Input
                      id="tdsRate"
                      type="number"
                      step="0.01"
                      value={formData.tdsRate}
                      onChange={(e) =>
                        setFormData({ ...formData, tdsRate: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
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
                {editingVendor ? "Update" : "Create"} Vendor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
