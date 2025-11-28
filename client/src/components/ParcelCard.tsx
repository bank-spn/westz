import { useState, useEffect } from "react";
import { Parcel } from "../../../drizzle/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, RefreshCw, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { trpc } from "@/lib/trpc";

interface ParcelCardProps {
  parcel: Parcel;
  onRefresh?: (id: number) => void;
  onEdit?: (parcel: Parcel) => void;
  onDelete?: (id: number) => void;
}

export default function ParcelCard({
  parcel,
  onRefresh,
  onEdit,
  onDelete,
}: ParcelCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: trackingHistory, isLoading: isLoadingHistory } = trpc.parcels.getTrackingHistory.useQuery(
    { trackingNumber: parcel.trackingNumber },
    { enabled: shouldFetch }
  );

  // Fetch tracking history when card is opened
  useEffect(() => {
    if (isOpen && !shouldFetch) {
      setShouldFetch(true);
    }
  }, [isOpen, shouldFetch]);

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Card className="bg-white border-gray-300">
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <CollapsibleTrigger asChild>
          <div className="w-full cursor-pointer">
            <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              {/* Left side */}
              <div className="flex-1 text-left">
                <div className="font-semibold text-lg mb-1">{parcel.trackingNumber}</div>
                <div className="text-sm text-gray-600 mb-2">
                  {parcel.recipientName && <div>{parcel.recipientName}</div>}
                  {parcel.destination && <div>{parcel.destination}</div>}
                </div>
                {parcel.currentStatusDescription && (
                  <div className="text-sm mb-1">
                    <span className="font-medium">Status:</span> {parcel.currentStatusDescription}
                  </div>
                )}
                {parcel.currentLocation && (
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Location:</span> {parcel.currentLocation}
                  </div>
                )}
                {parcel.lastUpdated && (
                  <div className="text-xs text-gray-500">
                    Last update: {format(new Date(parcel.lastUpdated), "dd/MM/yyyy | HH:mm")}
                  </div>
                )}
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-2">
                {parcel.isDelivered ? (
                  <Badge className="bg-primary text-primary-foreground">Delivered</Badge>
                ) : (
                  <Badge variant="outline">In Transit</Badge>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onRefresh && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onRefresh(parcel.id);
                        }}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Status
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(parcel);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(parcel.id);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            </CardContent>
          </div>
        </CollapsibleTrigger>

        {/* Timeline Detail */}
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4 border-t border-gray-200">
            <div className="mt-4">
              <h4 className="font-semibold mb-3">Tracking Timeline</h4>
              
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-gray-600">Loading tracking history...</span>
                </div>
              ) : trackingHistory && trackingHistory.length > 0 ? (
                <div className="space-y-3">
                  {trackingHistory
                    .slice()
                    .reverse()
                    .map((item, index) => {
                      const isLatest = index === 0;
                      return (
                        <div
                          key={index}
                          className={`pl-4 border-l-2 pb-3 ${
                            isLatest ? "border-primary" : "border-gray-300"
                          }`}
                        >
                          {isLatest && (
                            <Badge className="mb-2 bg-primary text-primary-foreground">
                              CURRENT STATUS
                            </Badge>
                          )}
                          <div className="text-sm font-medium">{item.status_description}</div>
                          <div className="text-xs text-gray-600">{item.location}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {format(new Date(item.status_date), "dd/MM/yyyy HH:mm")}
                          </div>
                          {item.status_detail && (
                            <div className="text-xs text-gray-600 mt-1">{item.status_detail}</div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-sm text-gray-500 py-4">
                  No tracking history available. Click "Refresh Status" to fetch the latest data.
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
