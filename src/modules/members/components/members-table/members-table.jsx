import { Eye, Edit2, Trash2, Users, AlertTriangle } from "lucide-react";
import { cn } from "@lib/utils";

const fmt = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const getDaysLeft = (feeExpiry) => {
  if (!feeExpiry) return null;
  const diff = new Date(feeExpiry) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const FEE_STATUS = {
  paid: { label: "Paid", className: "bg-green-100 text-green-700" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-700" },
  never_paid: { label: "Never Paid", className: "bg-muted text-muted-foreground" },
};

const ExpiryAlert = ({ daysLeft }) => {
  if (daysLeft === null || daysLeft > 5) return <span className="text-muted-foreground">—</span>;

  if (daysLeft < 0) return null;

  const cfg =
    daysLeft <= 2
      ? { cls: "bg-red-100 text-red-700", label: daysLeft === 0 ? "Today" : `${daysLeft}d left` }
      : daysLeft <= 4
      ? { cls: "bg-orange-100 text-orange-700", label: `${daysLeft}d left` }
      : { cls: "bg-amber-100 text-amber-700", label: `${daysLeft}d left` };

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold", cfg.cls)}>
      <AlertTriangle className="h-3 w-3" />
      {cfg.label}
    </span>
  );
};

const MembersTable = ({ members, onEdit, onDelete, onView }) => {
  if (!members?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">No members found</p>
          <p className="text-xs text-muted-foreground">Add your first member to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3.5 font-medium">Member</th>
              <th className="px-5 py-3.5 font-medium">Joined</th>
              <th className="px-5 py-3.5 font-medium">Last Paid</th>
              <th className="px-5 py-3.5 font-medium">Fee Expiry</th>
              <th className="px-5 py-3.5 font-medium">Expiry Alert</th>
              <th className="px-5 py-3.5 font-medium">Fee Status</th>
              <th className="px-5 py-3.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((member) => {
              const daysLeft = getDaysLeft(member.feeExpiry);
              const statusCfg = FEE_STATUS[member.feeStatus] ?? FEE_STATUS.never_paid;

              return (
                <tr key={member._id} className="hover:bg-muted/20 transition-colors">
                  {/* Member */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                        {member.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{member.fullName}</p>
                        <p className="text-xs text-muted-foreground">{member.phone}</p>
                        <p className="font-mono text-xs text-muted-foreground/60">{member.memberId}</p>
                      </div>
                    </div>
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4 text-muted-foreground text-sm whitespace-nowrap">
                    {fmt(member.joinDate)}
                  </td>

                  {/* Last Paid */}
                  <td className="px-5 py-4 text-sm whitespace-nowrap">
                    {member.lastPaid ? (
                      <span className="text-foreground">{fmt(member.lastPaid)}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Fee Expiry */}
                  <td className="px-5 py-4 text-sm whitespace-nowrap">
                    {member.feeExpiry ? (
                      <span className={cn(daysLeft !== null && daysLeft <= 5 && daysLeft >= 0 ? "text-orange-600 font-medium" : "text-muted-foreground")}>
                        {fmt(member.feeExpiry)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Expiry Alert */}
                  <td className="px-5 py-4">
                    <ExpiryAlert daysLeft={daysLeft} />
                  </td>

                  {/* Fee Status */}
                  <td className="px-5 py-4">
                    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", statusCfg.className)}>
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onView(member)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-green-600 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(member)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(member)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTable;
