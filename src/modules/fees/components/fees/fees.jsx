import { useState } from "react";
import {
  Search,
  Wallet,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  PieChart,
} from "lucide-react";
import { cn } from "@lib/utils";
import useDebounce from "@hooks/use-debounce";
import { useFeesOverview, useCollectFee } from "@modules/fees/components/fees/use-fees";
import CollectFeeForm from "@modules/fees/components/collect-fee-form/collect-fee-form";
import InputField from "@components/input-field/input-field";

const LIMIT = 20;

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Partially Paid", value: "partial" },
  { label: "Overdue", value: "overdue" },
  { label: "Never Paid", value: "never_paid" },
];

const fmt = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

const StatusBadge = ({ status }) => {
  const map = {
    paid: "bg-green-100 text-green-700",
    partial: "bg-blue-100 text-blue-700",
    overdue: "bg-red-100 text-red-700",
    never_paid: "bg-muted text-muted-foreground",
  };
  const labels = {
    paid: "Paid",
    partial: "Partially Paid",
    overdue: "Overdue",
    never_paid: "Never Paid",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        map[status] ?? "bg-muted text-muted-foreground"
      )}
    >
      {labels[status] ?? status}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
        iconBg
      )}
    >
      <Icon className={cn("h-5 w-5", iconColor)} />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value ?? 0}</p>
    </div>
  </div>
);

const Fees = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [collectTarget, setCollectTarget] = useState(null);
  const [serverError, setServerError] = useState("");

  const debouncedSearch = useDebounce(search);
  const collectFee = useCollectFee();

  const { data, isLoading, isError, error } = useFeesOverview({
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(debouncedSearch && { search: debouncedSearch }),
    page,
    limit: LIMIT,
  });

  const members = data?.members ?? [];
  const stats = data?.stats;
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const openCollect = (member) => {
    setCollectTarget(member);
    setServerError("");
  };

  const handleCollect = (formData) => {
    setServerError("");
    collectFee.mutate(formData, {
      onSuccess: () => setCollectTarget(null),
      onError: (err) =>
        setServerError(
          err?.response?.data?.message ?? "Failed to collect fee"
        ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fee Management</h1>
        <p className="text-sm text-muted-foreground">
          Rolling 30-day cycles — fee expires 30 days from payment date
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <StatCard
            icon={Users}
            label="Total Members"
            value={stats.totalMembers}
            iconBg="bg-muted"
            iconColor="text-muted-foreground"
          />
          <StatCard
            icon={CheckCircle2}
            label="Paid Up"
            value={stats.paid}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            icon={PieChart}
            label="Partially Paid"
            value={stats.partial}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue"
            value={stats.overdue}
            iconBg="bg-red-100"
            iconColor="text-red-600"
          />
          <StatCard
            icon={Clock}
            label="Never Paid"
            value={stats.neverPaid}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <InputField
            id="fee-search"
            placeholder="Search by name, member ID or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            containerClassName="space-y-0"
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-10 text-center">
          <p className="text-sm font-medium text-destructive">
            Failed to load fee data
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {error?.response?.data?.message ?? error?.message}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
              <Wallet className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No members found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3.5 text-left font-medium">Member</th>
                    <th className="px-4 py-3.5 text-left font-medium">Fee Amount</th>
                    <th className="px-4 py-3.5 text-left font-medium">Last Paid</th>
                    <th className="px-4 py-3.5 text-left font-medium">Expires On</th>
                    <th className="px-4 py-3.5 text-left font-medium">Status</th>
                    <th className="px-4 py-3.5 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {members.map((member) => {
                    const fee = member.latestFee;
                    const feeStatus = member.feeStatus;
                    const isPaid = feeStatus === "paid";
                    const isPartial = feeStatus === "partial";
                    const hasBalance = fee?.remaining > 0;
                    return (
                      <tr
                        key={member._id}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-foreground">
                            {member.fullName}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {member.memberId}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-semibold text-foreground">
                            PKR {(member.feesAfterDiscount ?? 0).toLocaleString()}
                          </p>
                          {fee?.amount != null && (
                            <p className="text-xs text-muted-foreground">
                              Paid: PKR {fee.amount.toLocaleString()}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {fee?.paidDate ? (
                            fmt(fee.paidDate)
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {fee?.dueDate ? (
                            <span
                              className={cn(
                                "font-medium",
                                feeStatus === "overdue"
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              )}
                            >
                              {fmt(fee.dueDate)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <StatusBadge status={feeStatus} />
                            {hasBalance && (
                              <span className="text-xs font-medium text-amber-600">
                                Dues: PKR {fee.remaining.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {isPaid ? (
                            <span className="text-xs text-muted-foreground/40">
                              —
                            </span>
                          ) : isPartial ? (
                            <button
                              onClick={() => openCollect(member)}
                              className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                            >
                              Collect Dues
                            </button>
                          ) : (
                            <button
                              onClick={() => openCollect(member)}
                              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                              Collect Fee
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {Math.min((page - 1) * LIMIT + 1, total)}–
            {Math.min(page * LIMIT, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      {collectTarget && (
        <CollectFeeForm
          open={!!collectTarget}
          onOpenChange={(val) => {
            if (!val) setCollectTarget(null);
          }}
          member={collectTarget}
          onSubmit={handleCollect}
          isLoading={collectFee.isPending}
          serverError={serverError}
        />
      )}
    </div>
  );
};

export default Fees;
