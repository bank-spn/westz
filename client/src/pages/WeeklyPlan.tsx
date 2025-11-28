import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WeeklyPlan } from "../../../drizzle/schema";
import { startOfWeek, addWeeks, format } from "date-fns";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export default function WeeklyPlanPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dayOfWeek: "monday" as (typeof daysOfWeek)[number],
    startTime: "",
    endTime: "",
  });

  const { data: plans, isLoading, refetch } = trpc.weeklyPlans.getByWeek.useQuery({
    weekStartDate: currentWeekStart,
  });
  const createMutation = trpc.weeklyPlans.create.useMutation();
  const updateMutation = trpc.weeklyPlans.update.useMutation();
  const deleteMutation = trpc.weeklyPlans.delete.useMutation();

  const plansByDay = useMemo(() => {
    const grouped: Record<string, WeeklyPlan[]> = {};
    daysOfWeek.forEach((day) => {
      grouped[day] = plans?.filter((p) => p.dayOfWeek === day) || [];
    });
    return grouped;
  }, [plans]);

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, -1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handleOpenDialog = () => {
    setFormData({
      title: "",
      description: "",
      dayOfWeek: "monday",
      startTime: "",
      endTime: "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMutation.mutateAsync({
        weekStartDate: currentWeekStart,
        ...formData,
      });
      toast.success("Plan created successfully");
      handleCloseDialog();
      refetch();
    } catch (error) {
      toast.error("Failed to create plan");
    }
  };

  const handleToggleComplete = async (plan: WeeklyPlan) => {
    try {
      await updateMutation.mutateAsync({
        id: plan.id,
        isCompleted: !plan.isCompleted,
      });
      refetch();
    } catch (error) {
      toast.error("Failed to update plan");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Plan deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading weekly plan...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Weekly Plan</h1>
          <p className="text-gray-600">Plan your week ahead</p>
        </div>
        <Button onClick={handleOpenDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Plan
        </Button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-4">
        <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-lg font-semibold">
          Week of {format(currentWeekStart, "MMM dd, yyyy")}
        </div>
        <Button variant="outline" size="icon" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days Grid */}
      <div className="space-y-4">
        {daysOfWeek.map((day) => (
          <Card key={day} className="bg-white border-gray-300">
            <CardHeader>
              <CardTitle className="text-lg capitalize">{day}</CardTitle>
            </CardHeader>
            <CardContent>
              {plansByDay[day].length === 0 ? (
                <p className="text-sm text-gray-500">No plans for this day</p>
              ) : (
                <div className="space-y-2">
                  {plansByDay[day].map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <Checkbox
                        checked={plan.isCompleted || false}
                        onCheckedChange={() => handleToggleComplete(plan)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            plan.isCompleted ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {plan.title}
                        </div>
                        {plan.description && (
                          <div className="text-sm text-gray-600 mt-1">{plan.description}</div>
                        )}
                        {(plan.startTime || plan.endTime) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {plan.startTime} {plan.endTime && `- ${plan.endTime}`}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
                        className="text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Plan title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Plan description..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="dayOfWeek">Day of Week</Label>
                <Select
                  value={formData.dayOfWeek}
                  onValueChange={(value: any) => setFormData({ ...formData, dayOfWeek: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
