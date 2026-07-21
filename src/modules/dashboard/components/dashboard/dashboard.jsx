import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Clock,
  Dumbbell,
} from "lucide-react";
import { cn } from "@lib/utils";
import useDashboard from "@modules/dashboard/components/dashboard/use-dashboard";

const todayLabel = () =>
  new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const fmt = (date) =>
  new Date(date).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });

const StatCard = ({ icon: Icon, label, value, iconBg, iconColor, sub }) => (
  <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
        iconBg
      )}
    >
      <Icon className={cn("h-6 w-6", iconColor)} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-2xl font-bold text-foreground">{value ?? 0}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
    <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-muted" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      <div className="h-7 w-16 animate-pulse rounded bg-muted" />
    </div>
  </div>
);

const Dashboard = () => {
  const { data, isLoading, isError, error } = useDashboard();
  const stats = data?.stats;
  const checkIns = data?.recentCheckIns ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{todayLabel()}</p>
        </div>
        {stats && (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm">
            <Dumbbell className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {stats.activeMembers} active member{stats.activeMembers !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-6 text-center">
          <p className="text-sm font-medium text-destructive">Failed to load dashboard</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {error?.response?.data?.message ?? error?.message}
          </p>
        </div>
      )}

      {/* Primary stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={Users}
              label="Total Members"
              value={stats?.totalMembers}
              sub={`${stats?.activeMembers} active`}
              iconBg="bg-primary/15"
              iconColor="text-primary"
            />
            <StatCard
              icon={UserCheck}
              label="Present Today"
              value={stats?.todayPresent}
              sub="checked in"
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              icon={UserX}
              label="Absent Today"
              value={stats?.todayAbsent}
              sub="not checked in"
              iconBg="bg-red-100"
              iconColor="text-red-500"
            />
            <StatCard
              icon={UserPlus}
              label="New This Month"
              value={stats?.newThisMonth}
              sub="joined recently"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
          </>
        )}
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={Banknote}
              label="Revenue This Month"
              value={`PKR ${(stats?.monthRevenue ?? 0).toLocaleString()}`}
              sub="fees collected"
              iconBg="bg-primary/15"
              iconColor="text-primary"
            />
            <StatCard
              icon={CheckCircle2}
              label="Fees Paid Up"
              value={stats?.feePaid}
              sub="members current"
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              icon={AlertCircle}
              label="Fees Overdue"
              value={(stats?.feeOverdue ?? 0) + (stats?.feeNeverPaid ?? 0)}
              sub={`${stats?.feeOverdue ?? 0} overdue · ${stats?.feeNeverPaid ?? 0} never paid`}
              iconBg="bg-red-100"
              iconColor="text-red-500"
            />
          </>
        )}
      </div>

      {/* Recent check-ins */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold text-foreground">Today's Check-ins</h2>
          {!isLoading && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {checkIns.length} present
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-0 divide-y divide-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-36 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : checkIns.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Clock className="h-9 w-9 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No check-ins recorded yet today</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Member</th>
                  <th className="px-6 py-3 text-left font-medium">Contact</th>
                  <th className="px-6 py-3 text-right font-medium">Checked In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {checkIns.map((record) => {
                  const m = record.member;
                  return (
                    <tr key={record._id} className="transition-colors hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                            {m?.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{m?.fullName}</p>
                            <p className="font-mono text-xs text-muted-foreground">{m?.memberId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{m?.phone ?? "—"}</td>
                      <td className="px-6 py-4 text-right font-medium text-foreground">
                        {fmt(record.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
