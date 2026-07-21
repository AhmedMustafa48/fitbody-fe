import { UserCheck, UserX, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@lib/utils";

const AttendancePanel = ({ type, members, search, onMark, pendingId }) => {
  const isPresent = type === "present";

  const filtered = (members ?? []).filter(
    (m) =>
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.memberId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col rounded-xl bg-card shadow-sm border border-border overflow-hidden">
      {/* Panel header */}
      <div
        className={cn(
          "flex items-center justify-between px-5 py-4 border-b",
          isPresent
            ? "bg-green-50 border-green-100"
            : "bg-red-50 border-red-100"
        )}
      >
        <div className="flex items-center gap-2">
          {isPresent ? (
            <UserCheck className="h-5 w-5 text-green-600" />
          ) : (
            <UserX className="h-5 w-5 text-red-600" />
          )}
          <h2
            className={cn(
              "font-semibold",
              isPresent ? "text-green-800" : "text-red-800"
            )}
          >
            {isPresent ? "Present" : "Absent"}
          </h2>
        </div>
        <span
          className={cn(
            "min-w-[1.75rem] rounded-full px-2 py-0.5 text-center text-xs font-bold",
            isPresent
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          )}
        >
          {filtered.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Member</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-5 py-12 text-center text-sm italic text-muted-foreground"
                >
                  {isPresent ? "No present members" : "No absent members"}
                </td>
              </tr>
            ) : (
              filtered.map((member) => {
                const isThisPending = pendingId === member._id;
                return (
                  <tr
                    key={member._id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground leading-tight">
                        {member.fullName}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {member.memberId}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() =>
                          onMark(
                            member._id,
                            isPresent ? "absent" : "present"
                          )
                        }
                        disabled={isThisPending}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60",
                          isPresent
                            ? "border border-red-200 text-red-600 hover:bg-red-50"
                            : "bg-green-600 text-white hover:bg-green-700"
                        )}
                      >
                        {isPresent ? (
                          <XCircle className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        {isThisPending
                          ? "Saving..."
                          : isPresent
                          ? "Mark Absent"
                          : "Mark Present"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePanel;
