import { useState } from "react";
import { UserPlus, Calendar } from "lucide-react";
import {
  useActiveMembers,
  useTodayAttendance,
  useMarkAttendance,
} from "@modules/attendance/components/attendance/use-attendance";
import MarkAttendanceModal from "./mark-attendance-modal";

const todayLabel = () =>
  new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const Attendance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const members = useActiveMembers();
  const todayAtt = useTodayAttendance();
  const markAttendance = useMarkAttendance();

  const isLoading = members.isLoading || todayAtt.isLoading;
  const isError = members.isError || todayAtt.isError;

  const presentIds = new Set(
    (todayAtt.data?.records ?? [])
      .filter((r) => r.status === "present")
      .map((r) => r.member._id)
  );

  const allMembers = members.data?.members ?? [];
  const presentMembersCount = allMembers.filter((m) => presentIds.has(m._id)).length;
  const absentMembers = allMembers.filter((m) => !presentIds.has(m._id));

  const handleMark = (memberId, status) => {
    markAttendance.mutate({ memberId, status });
  };

  const pendingId = markAttendance.isPending
    ? markAttendance.variables?.memberId
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Attendance Tracking
          </h1>
          <p className="text-sm text-muted-foreground">
            Daily attendance for gym members
          </p>
        </div>

        {/* Stats + date */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-2 text-sm shadow-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{todayLabel()}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-card border border-border px-4 py-2 shadow-sm text-sm">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="font-medium text-foreground">
                Present:{" "}
                <span className="text-green-600">{presentMembersCount}</span>
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
              <span className="font-medium text-foreground">
                Total:{" "}
                <span className="text-muted-foreground">{allMembers.length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-10 text-center">
          <p className="text-sm font-medium text-destructive">
            Failed to load attendance data
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {members.error?.response?.data?.message ??
              todayAtt.error?.response?.data?.message ??
              "Please try again"}
          </p>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !isError && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-foreground">Mark Daily Attendance</h2>
          <p className="mt-2 mb-8 max-w-sm text-sm text-muted-foreground">
            Click the button below to open the attendance modal and mark members who are present today.
          </p>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-transform active:scale-95"
          >
            <UserPlus className="h-5 w-5" />
            Open Attendance Form
          </button>
        </div>
      )}

      <MarkAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        members={absentMembers}
        onMark={handleMark}
        pendingId={pendingId}
      />
    </div>
  );
};

export default Attendance;
