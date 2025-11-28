import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle, AlertCircle, Truck } from "lucide-react";
import ParcelCard from "@/components/ParcelCard";
import { toast } from "sonner";

export default function Dashboard() {
  const { data: parcels, isLoading, refetch } = trpc.parcels.list.useQuery();
  const refreshStatusMutation = trpc.parcels.refreshStatus.useMutation();

  const totalParcels = parcels?.length || 0;
  const deliveredCount = parcels?.filter((p) => p.isDelivered).length || 0;
  const customsClearanceCount =
    parcels?.filter((p) =>
      p.currentStatusDescription?.toLowerCase().includes("customs")
    ).length || 0;
  const inTransitCount = totalParcels - deliveredCount;

  const recentParcels = parcels?.slice(0, 5) || [];

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
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your parcel tracking</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Parcels</CardTitle>
            <Package className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalParcels}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delivered</CardTitle>
            <CheckCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{deliveredCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Customs Clearance
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{customsClearanceCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Transit</CardTitle>
            <Truck className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{inTransitCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Parcels */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Parcels</h2>
        {recentParcels.length === 0 ? (
          <Card className="bg-white border-gray-300">
            <CardContent className="p-8 text-center text-gray-500">
              No parcels found. Add your first parcel to start tracking.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentParcels.map((parcel) => (
              <ParcelCard 
                key={parcel.id} 
                parcel={parcel} 
                onRefresh={handleRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
