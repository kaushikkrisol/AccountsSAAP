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
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface Project {
  _id?: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: "active" | "completed" | "on-hold";
}

export function ProjectMaster() {
  const [projects, setProjects] = useState<Project[]>([
    {
      _id: "1",
      projectCode: "PRJ001",
      projectName: "Corporate Office Renovation",
      clientName: "ABC Enterprises Ltd.",
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      budget: 5000000,
      status: "active",
    },
    {
      _id: "2",
      projectCode: "PRJ002",
      projectName: "Retail Mall Construction",
      clientName: "XYZ Properties",
      startDate: "2023-08-01",
      endDate: "2024-03-31",
      budget: 15000000,
      status: "completed",
    },
    {
      _id: "3",
      projectCode: "PRJ003",
      projectName: "Residential Tower Phase 2",
      clientName: "Metro Builders",
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      budget: 25000000,
      status: "active",
    },
    {
      _id: "4",
      projectCode: "PRJ004",
      projectName: "Industrial Warehouse",
      clientName: "Logistics Hub Pvt Ltd",
      startDate: "2024-01-10",
      endDate: "2024-08-15",
      budget: 8000000,
      status: "on-hold",
    },
    {
      _id: "5",
      projectCode: "PRJ005",
      projectName: "Hotel Interior Design",
      clientName: "Hospitality Group Inc",
      startDate: "2024-03-01",
      endDate: "2024-09-30",
      budget: 3500000,
      status: "active",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState<Project>({
    projectCode: "",
    projectName: "",
    clientName: "",
    startDate: "",
    endDate: "",
    budget: 0,
    status: "active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject?._id) {
        await apiClient.put(`/projects/${editingProject._id}`, formData);
        toast({ title: "Project updated successfully" });
      } else {
        await apiClient.post("/projects", formData);
        toast({ title: "Project created successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
      // Refresh project list
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to save project",
        variant: "destructive" 
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/projects/${id}`);
      toast({ title: "Project deleted successfully" });
      // Refresh project list
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete project",
        variant: "destructive" 
      });
    }
  };

  const resetForm = () => {
    setFormData({
      projectCode: "",
      projectName: "",
      clientName: "",
      startDate: "",
      endDate: "",
      budget: 0,
      status: "active",
    });
    setEditingProject(null);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setIsDialogOpen(true);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Project Master</span>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Code</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>{project.projectCode}</TableCell>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{project.clientName}</TableCell>
                  <TableCell>{project.startDate}</TableCell>
                  <TableCell>{project.endDate}</TableCell>
                  <TableCell>₹{project.budget.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        project.status === "active"
                          ? "bg-financial-positive/10 text-financial-positive"
                          : project.status === "completed"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => project._id && handleDelete(project._id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? "Update project details below." : "Enter the details for the new project."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="projectCode">Project Code</Label>
                <Input
                  id="projectCode"
                  value={formData.projectCode}
                  onChange={(e) =>
                    setFormData({ ...formData, projectCode: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData({ ...formData, projectName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
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
                {editingProject ? "Update" : "Create"} Project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
