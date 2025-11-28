import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function Settings() {
  const { data: settings, isLoading, refetch } = trpc.settings.get.useQuery();
  const updateMutation = trpc.settings.update.useMutation();
  const { data: connectionStatus, refetch: testConnection } = trpc.settings.testConnection.useQuery();

  const [formData, setFormData] = useState({
    thailandPostApiToken: "",
    supabaseUrl: "",
    supabaseAnonKey: "",
    notificationsEnabled: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        thailandPostApiToken: settings.thailandPostApiToken || "",
        supabaseUrl: settings.supabaseUrl || "",
        supabaseAnonKey: settings.supabaseAnonKey || "",
        notificationsEnabled: settings.notificationsEnabled || true,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync(formData);
      toast.success("Settings updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const handleTestConnection = async () => {
    try {
      await testConnection();
      toast.success("Connection test completed");
    } catch (error) {
      toast.error("Connection test failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Configure your API connections and preferences</p>
      </div>

      {/* Connection Status */}
      <Card className="bg-white border-gray-300">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>Check the status of your API connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">Thailand Post API</div>
              {connectionStatus?.thailandPostApi ? (
                <Badge className="bg-primary text-primary-foreground gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-destructive border-destructive">
                  <XCircle className="h-3 w-3" />
                  Disconnected
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleTestConnection}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <form onSubmit={handleSubmit}>
        <Card className="bg-white border-gray-300">
          <CardHeader>
            <CardTitle>Thailand Post API Configuration</CardTitle>
            <CardDescription>Configure your Thailand Post API credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="thailandPostApiToken">API Token</Label>
              <Input
                id="thailandPostApiToken"
                value={formData.thailandPostApiToken}
                onChange={(e) =>
                  setFormData({ ...formData, thailandPostApiToken: e.target.value })
                }
                placeholder="Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to use default token
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-300 mt-6">
          <CardHeader>
            <CardTitle>Supabase Configuration</CardTitle>
            <CardDescription>Configure your Supabase database connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="supabaseUrl">Supabase URL</Label>
              <Input
                id="supabaseUrl"
                value={formData.supabaseUrl}
                onChange={(e) => setFormData({ ...formData, supabaseUrl: e.target.value })}
                placeholder="https://your-project.supabase.co"
              />
            </div>
            <div>
              <Label htmlFor="supabaseAnonKey">Supabase Anon Key</Label>
              <Input
                id="supabaseAnonKey"
                value={formData.supabaseAnonKey}
                onChange={(e) => setFormData({ ...formData, supabaseAnonKey: e.target.value })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-300 mt-6">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable Notifications</div>
                <div className="text-sm text-gray-600">
                  Receive real-time updates about parcel status changes
                </div>
              </div>
              <Switch
                checked={formData.notificationsEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, notificationsEnabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={updateMutation.isPending}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
