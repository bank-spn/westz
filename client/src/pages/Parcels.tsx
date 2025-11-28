import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ParcelCard from "@/components/ParcelCard";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Parcel } from "../../../drizzle/schema";

export default function Parcels() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  const [formData, setFormData] = useState({
    trackingNumber: "",
    destination: "",
    recipientName: "",
    dateSent: "",
    note: "",
  });

  const { data: parcels, isLoading, refetch } = trpc.parcels.list.useQuery();
  const createMutation = trpc.parcels.create.useMutation();
  const updateMutation = trpc.parcels.update.useMutation();
  const deleteMutation = trpc.parcels.delete.useMutation();
  const refreshStatusMutation = trpc.parcels.refreshStatus.useMutation();
  const { data: trackingHistoryData } = trpc.parcels.getTrackingHistory.useQuery(
    { trackingNumber: editingParcel?.trackingNumber || "" },
    { enabled: !!editingParcel }
  );

  const handleOpenDialog = (parcel?: Parcel) => {
    if (parcel) {
      setEditingParcel(parcel);
      setFormData({
        trackingNumber: parcel.trackingNumber,
        destination: parcel.destination || "",
        recipientName: parcel.recipientName || "",
        dateSent: parcel.dateSent ? new Date(parcel.dateSent).toISOString().split("T")[0] : "",
        note: parcel.note || "",
      });
    } else {
      setEditingParcel(null);
      setFormData({
        trackingNumber: "",
        destination: "",
        recipientName: "",
        dateSent: "",
        note: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingParcel(null);
    setFormData({
      trackingNumber: "",
      destination: "",
      recipientName: "",
      dateSent: "",
      note: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        dateSent: formData.dateSent ? new Date(formData.dateSent) : undefined,
      };

      if (editingParcel) {
        await updateMutation.mutateAsync({ id: editingParcel.id, ...data });
        toast.success("Parcel updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Parcel created successfully");
      }

      handleCloseDialog();
      refetch();
    } catch (error) {
      toast.error("Failed to save parcel");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this parcel?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Parcel deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete parcel");
    }
  };

  const handleRefresh = async (id: number) => {
    try {
      await refreshStatusMutation.mutateAsync({ id });
      toast.success("Parcel status updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to refresh parcel status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading parcels...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Parcels</h1>
          <p className="text-gray-600">Manage your international parcels</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Parcel
        </Button>
      </div>

      {parcels && parcels.length === 0 ? (
        <div className="bg-white border border-gray-300 rounded-lg p-8 text-center text-gray-500">
          No parcels found. Click "Add Parcel" to start tracking.
        </div>
      ) : (
        <div className="space-y-3">
          {parcels?.map((parcel) => (
            <ParcelCard
              key={parcel.id}
              parcel={parcel}
              onRefresh={handleRefresh}
              onEdit={handleOpenDialog}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{editingParcel ? "Edit Parcel" : "Add New Parcel"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="trackingNumber">Tracking Number</Label>
                <Input
                  id="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, trackingNumber: e.target.value })
                  }
                  required
                  placeholder="EE001040482TH"
                />
              </div>
              <div>
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientName: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  placeholder="Bangkok, Thailand"
                />
              </div>
              <div>
                <Label htmlFor="dateSent">Date Sent</Label>
                <Input
                  id="dateSent"
                  type="date"
                  value={formData.dateSent}
                  onChange={(e) => setFormData({ ...formData, dateSent: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingParcel ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
