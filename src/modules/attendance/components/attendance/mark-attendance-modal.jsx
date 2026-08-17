import { useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { cn } from "@lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import InputField from "@components/input-field/input-field";

const MarkAttendanceModal = ({ isOpen, onClose, members, onMark, pendingId }) => {
  const [search, setSearch] = useState("");

  const filteredMembers = (members ?? []).filter(
    (m) =>
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.memberId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            Search and mark present members for today.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 border-b border-border flex-shrink-0 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <InputField
              id="modal-search"
              placeholder="Search by name or member ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              containerClassName="space-y-0"
              className="pl-10 h-10 bg-background"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-6 py-3 font-medium">Member</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-12 text-center text-sm italic text-muted-foreground"
                  >
                    No unmarked members found
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const isThisPending = pendingId === member._id;
                  return (
                    <tr
                      key={member._id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-foreground leading-tight">
                          {member.fullName}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {member.memberId}
                        </p>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => onMark(member._id, "present")}
                          disabled={isThisPending}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60",
                            "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                          )}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {isThisPending ? "Saving..." : "Mark Present"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarkAttendanceModal;
