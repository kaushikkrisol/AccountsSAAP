import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PurchaseVoucherDetailDialog } from "./PurchaseVoucherDetailDialog";
import { exportPurchaseVoucherToPDF, exportPurchaseVouchersToExcel } from "@/lib/exportUtils";

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

export const PurchaseVoucher = () => {
  const { toast } = useToast();
  const [purchaseVouchers, setPurchaseVouchers] = useState<PurchaseVoucher[]>([
    {
      id: "1",
      voucherNo: "PV-2024-001",
      date: "2024-01-15",
      supplier: "ABC Suppliers Pvt Ltd",
      supplierState: "Maharashtra",
      items: [
        {
          id: "1",
          description: "Raw Material A",
          quantity: 100,
          rate: 500,
          amount: 50000,
          gstRate: 18,
          cgst: 4500,
          sgst: 4500,
          igst: 0,
          totalAmount: 59000,
        },
      ],
      subtotal: 50000,
      totalCgst: 4500,
      totalSgst: 4500,
      totalIgst: 0,
      grandTotal: 59000,
      status: "Paid",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<PurchaseVoucher | null>(null);
  const [viewingVoucher, setViewingVoucher] = useState<PurchaseVoucher | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    voucherNo: "",
    date: "",
    supplier: "",
    supplierState: "Maharashtra",
    items: [
      {
        id: "1",
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
        gstRate: 18,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalAmount: 0,
      },
    ],
  });

  const calculateItemAmount = (
    quantity: number,
    rate: number,
    gstRate: number,
    supplierState: string
  ) => {
    const amount = quantity * rate;
    const isInterState = supplierState !== "Maharashtra";
    
    let cgst = 0, sgst = 0, igst = 0;
    
    if (isInterState) {
      igst = (amount * gstRate) / 100;
    } else {
      cgst = (amount * gstRate) / 200;
      sgst = (amount * gstRate) / 200;
    }

    const totalAmount = amount + cgst + sgst + igst;

    return { amount, cgst, sgst, igst, totalAmount };
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (["quantity", "rate", "gstRate"].includes(field)) {
      const calculated = calculateItemAmount(
        newItems[index].quantity,
        newItems[index].rate,
        newItems[index].gstRate,
        formData.supplierState
      );
      newItems[index] = { ...newItems[index], ...calculated };
    }

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: Date.now().toString(),
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
          gstRate: 18,
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalAmount: 0,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const totalCgst = formData.items.reduce((sum, item) => sum + item.cgst, 0);
    const totalSgst = formData.items.reduce((sum, item) => sum + item.sgst, 0);
    const totalIgst = formData.items.reduce((sum, item) => sum + item.igst, 0);
    const grandTotal = formData.items.reduce((sum, item) => sum + item.totalAmount, 0);

    const newVoucher: PurchaseVoucher = {
      id: editingVoucher?.id || Date.now().toString(),
      voucherNo: formData.voucherNo,
      date: formData.date,
      supplier: formData.supplier,
      supplierState: formData.supplierState,
      items: formData.items,
      subtotal,
      totalCgst,
      totalSgst,
      totalIgst,
      grandTotal,
      status: "Pending",
    };

    if (editingVoucher) {
      setPurchaseVouchers(
        purchaseVouchers.map((v) => (v.id === editingVoucher.id ? newVoucher : v))
      );
      toast({ title: "Purchase voucher updated successfully" });
    } else {
      setPurchaseVouchers([...purchaseVouchers, newVoucher]);
      toast({ title: "Purchase voucher created successfully" });
    }

    setIsDialogOpen(false);
    setEditingVoucher(null);
    setFormData({
      voucherNo: "",
      date: "",
      supplier: "",
      supplierState: "Maharashtra",
      items: [
        {
          id: "1",
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
          gstRate: 18,
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalAmount: 0,
        },
      ],
    });
  };

  const handleEdit = (voucher: PurchaseVoucher) => {
    setEditingVoucher(voucher);
    setFormData({
      voucherNo: voucher.voucherNo,
      date: voucher.date,
      supplier: voucher.supplier,
      supplierState: voucher.supplierState,
      items: voucher.items,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPurchaseVouchers(purchaseVouchers.filter((v) => v.id !== id));
    toast({ title: "Purchase voucher deleted successfully" });
  };

  const handleViewDetails = (voucher: PurchaseVoucher) => {
    setViewingVoucher(voucher);
    setIsDetailDialogOpen(true);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Purchase Vouchers</h2>
        <div className="flex gap-2">
          <Button onClick={() => exportPurchaseVouchersToExcel(purchaseVouchers)} variant="outline">
            Export to Excel
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Purchase Voucher
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVoucher ? "Edit Purchase Voucher" : "Create Purchase Voucher"}
            </DialogTitle>
            <DialogDescription>
              {editingVoucher ? "Update purchase voucher details below." : "Create a new purchase voucher with GST calculations."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="voucherNo">Voucher No</Label>
                <Input
                  id="voucherNo"
                  value={formData.voucherNo}
                  onChange={(e) =>
                    setFormData({ ...formData, voucherNo: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="supplierState">Supplier State</Label>
                <Input
                  id="supplierState"
                  value={formData.supplierState}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setFormData({ ...formData, supplierState: newState });
                    // Recalculate all items when state changes
                    const newItems = formData.items.map((item) => {
                      const calculated = calculateItemAmount(
                        item.quantity,
                        item.rate,
                        item.gstRate,
                        newState
                      );
                      return { ...item, ...calculated };
                    });
                    setFormData({ ...formData, supplierState: newState, items: newItems });
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Purchase Items</Label>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">S.No</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Qty</TableHead>
                      <TableHead className="w-[120px]">Rate</TableHead>
                      <TableHead className="w-[120px]">Amount</TableHead>
                      <TableHead className="w-[100px]">GST%</TableHead>
                      <TableHead className="w-[100px]">CGST</TableHead>
                      <TableHead className="w-[100px]">SGST</TableHead>
                      <TableHead className="w-[100px]">IGST</TableHead>
                      <TableHead className="w-[120px]">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              updateItem(index, "description", e.target.value)
                            }
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, "quantity", parseInt(e.target.value))
                            }
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(index, "rate", parseFloat(e.target.value))
                            }
                            required
                          />
                        </TableCell>
                        <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="28"
                            value={item.gstRate}
                            onChange={(e) =>
                              updateItem(index, "gstRate", parseFloat(e.target.value))
                            }
                            required
                          />
                        </TableCell>
                        <TableCell>₹{item.cgst.toFixed(2)}</TableCell>
                        <TableCell>₹{item.sgst.toFixed(2)}</TableCell>
                        <TableCell>₹{item.igst.toFixed(2)}</TableCell>
                        <TableCell>₹{item.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={formData.items.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-2 text-right font-semibold">
                Grand Total: ₹
                {formData.items
                  .reduce((sum, item) => sum + item.totalAmount, 0)
                  .toFixed(2)}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingVoucher(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingVoucher ? "Update" : "Create"} Voucher
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <PurchaseVoucherDetailDialog
        voucher={viewingVoucher}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />

      <Card>
        <CardHeader>
          <CardTitle>Purchase Vouchers List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voucher No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Supplier State</TableHead>
                <TableHead>Grand Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseVouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell>{voucher.voucherNo}</TableCell>
                  <TableCell>{voucher.date}</TableCell>
                  <TableCell>{voucher.supplier}</TableCell>
                  <TableCell>{voucher.supplierState}</TableCell>
                  <TableCell>₹{voucher.grandTotal.toFixed(2)}</TableCell>
                  <TableCell>{voucher.status}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleViewDetails(voucher)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(voucher)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportPurchaseVoucherToPDF(voucher)}>
                          Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(voucher.id)}
                          className="text-destructive"
                        >
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
    </div>
  );
};
