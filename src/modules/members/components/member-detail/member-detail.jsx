import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  User,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Banknote,
} from "lucide-react";
import { cn } from "@lib/utils";
import useMemberDetail from "@modules/members/components/member-detail/use-member-detail";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const fmt = (date, opts) =>
  new Date(date).toLocaleDateString("en-PK", opts ?? {
    day: "2-digit", month: "short", year: "numeric",
  });

const StatCard = ({ label, value, sub, color }) => (
  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className={cn("mt-1 text-3xl font-bold", color ?? "text-foreground")}>{value}</p>
    {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground wrap-break-word">{value}</p>
      </div>
    </div>
  );
};

const FeeStatusBadge = ({ status }) => {
  const map = {
    paid: "bg-green-100 text-green-700",
    unpaid: "bg-amber-100 text-amber-700",
    overdue: "bg-red-100 text-red-700",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", map[status] ?? map.unpaid)}>
      {status}
    </span>
  );
};

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useMemberDetail(id);
  const [selectedMonth, setSelectedMonth] = useState(null);

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
        <div className="grid grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm font-medium text-destructive">Failed to load member profile</p>
        <p className="text-xs text-muted-foreground">
          {error?.response?.data?.message ?? error?.message}
        </p>
        <button
          onClick={() => navigate("/members")}
          className="mt-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Back to Members
        </button>
      </div>
    );
  }

  const { member, stats, monthlyAttendance, feeRecords, allRecords } = data;

  const filteredRecords = selectedMonth
    ? allRecords.filter((r) => {
        const d = new Date(r.date);
        return d.getFullYear() === selectedMonth.year && d.getMonth() + 1 === selectedMonth.month;
      })
    : allRecords;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/members")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Members
      </button>

      {/* Profile header */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:gap-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground">
          {member.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{member.fullName}</h1>
            <span className="font-mono text-sm text-muted-foreground">({member.memberId})</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              member.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {member.isActive ? "Active" : "Inactive"}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Joined {fmt(member.joinDate)}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-muted-foreground">Monthly Fee</p>
          <p className="text-xl font-bold text-foreground">PKR {member.feesAfterDiscount?.toLocaleString()}</p>
          {member.fees !== member.feesAfterDiscount && (
            <p className="text-xs text-muted-foreground line-through">PKR {member.fees?.toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Present Days"
          value={stats.totalPresent}
          sub={`of ${stats.totalDays} marked days`}
          color="text-green-600"
        />
        <StatCard
          label="Absent Days"
          value={stats.totalAbsent}
          sub={`of ${stats.totalDays} marked days`}
          color="text-red-500"
        />
        <StatCard
          label="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          sub="overall"
          color={stats.attendanceRate >= 75 ? "text-green-600" : stats.attendanceRate >= 50 ? "text-amber-500" : "text-red-500"}
        />
        <StatCard
          label="Fees"
          value={`${stats.feePaidCount}/${stats.feePaidCount + stats.feeUnpaidCount}`}
          sub={`PKR ${stats.totalFeeDue?.toLocaleString()} due`}
          color={stats.feeUnpaidCount === 0 ? "text-green-600" : "text-amber-500"}
        />
      </div>

      {/* Personal info + Monthly attendance + Daily attendance */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Personal info */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Personal Information
          </h2>
          <InfoRow icon={Phone} label="Contact" value={member.phone} />
          <InfoRow icon={CreditCard} label="CNIC" value={member.cnic} />
          <InfoRow icon={User} label="Gender" value={member.gender ? member.gender.charAt(0).toUpperCase() + member.gender.slice(1) : null} />
          <InfoRow icon={Calendar} label="Age" value={member.age ? `${member.age} years` : null} />
          <InfoRow icon={MapPin} label="Address" value={member.address} />
          <InfoRow icon={Clock} label="Member Since" value={fmt(member.joinDate, { day: "2-digit", month: "long", year: "numeric" })} />
        </div>

        {/* Monthly attendance */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Monthly Attendance
            </h2>
          </div>
          {monthlyAttendance.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No attendance records yet</p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium text-left">Month</th>
                    <th className="px-3 py-3 font-medium text-center">P</th>
                    <th className="px-3 py-3 font-medium text-center">A</th>
                    <th className="px-5 py-3 font-medium text-right">Rate</th>
                    <th className="px-5 py-3 font-medium text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {monthlyAttendance.map((m) => {
                    const isSelected = selectedMonth?.year === m.year && selectedMonth?.month === m.month;
                    return (
                      <tr 
                        key={`${m.year}-${m.month}`} 
                        className={cn(
                          "transition-colors",
                          isSelected ? "bg-muted/50" : "hover:bg-muted/20"
                        )}
                      >
                        <td className="px-5 py-3 font-medium text-foreground">
                          {MONTH_NAMES[m.month - 1]} {m.year}
                        </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-semibold text-green-600">{m.present}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-semibold text-red-500">{m.absent}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="hidden sm:block h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                m.rate >= 75 ? "bg-green-500" : m.rate >= 50 ? "bg-amber-400" : "bg-red-500"
                              )}
                              style={{ width: `${m.rate}%` }}
                            />
                          </div>
                          <span className={cn(
                            "text-xs font-semibold",
                            m.rate >= 75 ? "text-green-600" : m.rate >= 50 ? "text-amber-500" : "text-red-500"
                          )}>
                            {m.rate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => setSelectedMonth(isSelected ? null : { year: m.year, month: m.month })}
                          className={cn(
                            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors border",
                            isSelected 
                              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                              : "bg-card text-foreground border-border hover:bg-muted"
                          )}
                        >
                          {isSelected ? "Hide Days" : "View Days"}
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Daily attendance */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Daily Attendance
            </h2>
            {selectedMonth && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary">
                  {MONTH_NAMES[selectedMonth.month - 1]} {selectedMonth.year}
                </span>
                <button 
                  onClick={() => setSelectedMonth(null)}
                  className="rounded-full bg-muted/50 p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
          {filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <Clock className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No records found</p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium text-left">Date</th>
                    <th className="px-5 py-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRecords.map((r, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground">
                        {fmt(r.date)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
                          r.status === "present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Fee history */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Fee History
          </h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              {stats.feePaidCount} paid
            </span>
            <span className="flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5 text-amber-500" />
              {stats.feeUnpaidCount} pending
            </span>
          </div>
        </div>

        {feeRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Banknote className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No fee records yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-medium text-left">Paid On</th>
                  <th className="px-5 py-3.5 font-medium text-left">Expires</th>
                  <th className="px-5 py-3.5 font-medium text-left">Amount</th>
                  <th className="px-5 py-3.5 font-medium text-left">Dues</th>
                  <th className="px-5 py-3.5 font-medium text-left">Status</th>
                  <th className="px-5 py-3.5 font-medium text-left">Method</th>
                  <th className="px-5 py-3.5 font-medium text-left">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {feeRecords.map((fee) => (
                  <tr key={fee._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4 text-muted-foreground">
                      {fee.paidDate ? fmt(fee.paidDate) : <span className="text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {fee.dueDate ? fmt(fee.dueDate) : <span className="text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">
                      PKR {fee.amount?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      {fee.remaining > 0 ? (
                        <span className="font-medium text-amber-600">
                          PKR {fee.remaining.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <FeeStatusBadge status={fee.status} />
                    </td>
                    <td className="px-5 py-4 capitalize text-muted-foreground">
                      {fee.method ?? <span className="text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {fee.note ?? <span className="text-muted-foreground/50">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetail;
