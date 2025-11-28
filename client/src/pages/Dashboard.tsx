import { useState, useEffect } from "react";
import { supabase, type Parcel, fetchTrackingHistory } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle, AlertCircle, Truck } from "lucide-react";
import ParcelCard from "@/components/ParcelCard";
import { toast } from "sonner";

export default function Dashboard() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadParcels();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('parcels-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parcels' }, () => {
        loadParcels();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadParcels = async () => {
    try {
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParcels(data || []);
    } catch (error) {
      console.error('Error loading parcels:', error);
      toast.error('Failed to load parcels');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (id: string) => {
    try {
      const parcel = parcels.find(p => p.id === id);
      if (!parcel) return;

      const trackingData = await fetchTrackingHistory(parcel.tracking_number);
      
      if (trackingData && trackingData.length > 0) {
        const latest = trackingData[0];
        
        const { error } = await supabase
          .from('parcels')
          .update({
            current_status: latest.status,
            current_status_description: latest.status_description,
            current_location: latest.location,
            is_delivered: latest.status === 'delivered',
            last_updated: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
        toast.success('Parcel status updated');
      } else {
        toast.info('No tracking data available');
      }
    } catch (error) {
      console.error('Error refreshing parcel:', error);
      toast.error('Failed to refresh parcel status');
    }
  };

  const stats = {
    total: parcels.length,
    delivered: parcels.filter(p => p.is_delivered).length,
    inTransit: parcels.filter(p => !p.is_delivered).length,
    customsClearance: parcels.filter(p => 
      p.current_status?.toLowerCase().includes('customs') ||
      p.current_status_description?.toLowerCase().includes('customs')
    ).length,
  };

  const recentParcels = parcels.slice(0, 5);

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Parcels</CardTitle>
            <Package className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delivered</CardTitle>
            <CheckCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.delivered}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Customs Clearance</CardTitle>
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.customsClearance}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Transit</CardTitle>
            <Truck className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.inTransit}</div>
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
