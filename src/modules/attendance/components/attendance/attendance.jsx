import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { cn } from "@lib/utils";
import useDebounce from "@hooks/use-debounce";
import {
  useActiveMembers,
  useTodayAttendance,
  useMarkAttendance,
} from "@modules/attendance/components/attendance/use-attendance";
import AttendancePanel from "@modules/attendance/components/attendance-panel/attendance-panel";
import InputField from "@components/input-field/input-field";

const todayLabel = () =>
  new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const Attendance = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

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
  const presentMembers = allMembers.filter((m) => presentIds.has(m._id));
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
                <span className="text-green-600">{presentMembers.length}</span>
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="font-medium text-foreground">
                Absent:{" "}
                <span className="text-red-600">{absentMembers.length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <InputField
          id="search"
          placeholder="Search by name or member ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="space-y-0"
          className="pl-10 h-10 bg-card"
        />
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
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

      {/* Panels */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AttendancePanel
            type="present"
            members={presentMembers}
            search={debouncedSearch}
            onMark={handleMark}
            pendingId={pendingId}
          />
          <AttendancePanel
            type="absent"
            members={absentMembers}
            search={debouncedSearch}
            onMark={handleMark}
            pendingId={pendingId}
          />
        </div>
      )}

      {/* Empty state — no members at all */}
      {!isLoading && !isError && allMembers.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-10">
          No active members found. Add members first.
        </p>
      )}
    </div>
  );
};

export default Attendance;
