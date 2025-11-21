import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Settings() {
  const [tallyConnected, setTallyConnected] = useState(false);
  const { toast } = useToast();

  const [tallyConfig, setTallyConfig] = useState({
    serverUrl: "http://localhost:9000",
    companyName: "",
    syncInterval: "60",
    autoSync: true,
  });

  const handleTallyTest = async () => {
    toast({
      title: "Testing Connection",
      description: "Connecting to Tally...",
    });
    // Simulate connection test
    setTimeout(() => {
      setTallyConnected(true);
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Tally ERP",
      });
    }, 2000);
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure system integrations and preferences
        </p>
      </div>

      <Tabs defaultValue="tally" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="tally">Tally</TabsTrigger>
          <TabsTrigger value="ocr">OCR</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="tally" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tally ERP Integration</span>
                <Badge
                  className={
                    tallyConnected
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }
                >
                  {tallyConnected ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Connected
                    </>
                  )}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tally Server URL</Label>
                <Input
                  value={tallyConfig.serverUrl}
                  onChange={(e) =>
                    setTallyConfig({ ...tallyConfig, serverUrl: e.target.value })
                  }
                  placeholder="http://localhost:9000"
                />
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={tallyConfig.companyName}
                  onChange={(e) =>
                    setTallyConfig({ ...tallyConfig, companyName: e.target.value })
                  }
                  placeholder="Your Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Sync Interval (minutes)</Label>
                <Input
                  type="number"
                  value={tallyConfig.syncInterval}
                  onChange={(e) =>
                    setTallyConfig({ ...tallyConfig, syncInterval: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync with Tally at regular intervals
                  </p>
                </div>
                <Switch
                  checked={tallyConfig.autoSync}
                  onCheckedChange={(checked) =>
                    setTallyConfig({ ...tallyConfig, autoSync: checked })
                  }
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleTallyTest}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                <Button variant="outline" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
              </div>

              <div className="mt-6 p-4 border rounded-lg bg-accent">
                <h4 className="font-medium mb-2">Sync Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Masters Synced:</span>
                    <span className="font-medium">Ledgers, Cost Centres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vouchers Posted:</span>
                    <span className="font-medium">Purchase, Payment, Journal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span className="font-medium">
                      {tallyConnected ? "2 hours ago" : "Never"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ocr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OCR Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>OCR Service</Label>
                <Input
                  value="Azure Form Recognizer"
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>API Endpoint</Label>
                <Input placeholder="https://your-endpoint.cognitiveservices.azure.com/" />
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input type="password" placeholder="Enter API Key" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-create Vendors</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create vendors from OCR extracted data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management & Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage user access and permissions (Admin, Finance, Project Manager,
                Auditor)
              </p>
              <div className="space-y-3">
                {[
                  { name: "Admin User", email: "admin@company.com", role: "Admin" },
                  { name: "Finance Manager", email: "finance@company.com", role: "Finance" },
                  {
                    name: "Project Lead",
                    email: "project@company.com",
                    role: "Project Manager",
                  },
                ].map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                ))}
              </div>
              <Button className="mt-4" variant="outline">
                Add User
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
