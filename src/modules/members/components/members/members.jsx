import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { cn } from "@lib/utils";
import useDebounce from "@hooks/use-debounce";
import {
  useMembers,
  useCreateMember,
  useUpdateMember,
  useDeleteMember,
} from "@modules/members/components/members/use-members";
import MemberForm from "@modules/members/components/member-form/member-form";
import MembersTable from "@modules/members/components/members-table/members-table";
import InputField from "@components/input-field/input-field";

const LIMIT = 20;

const GENDER_TABS = [
  { value: "", label: "All", key: "all" },
  { value: "male", label: "Male", key: "male" },
  { value: "female", label: "Female", key: "female" },
];

const Members = () => {
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isError, error } = useMembers({
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(gender && { gender }),
    page,
    limit: LIMIT,
  });

  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  const isMutating = createMember.isPending || updateMember.isPending;

  const openAddForm = () => {
    setEditMember(null);
    setServerError("");
    setFormOpen(true);
  };

  const handleEdit = (member) => {
    setEditMember(member);
    setServerError("");
    setFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    setServerError("");
    if (editMember) {
      updateMember.mutate(
        { id: editMember._id, data: formData },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditMember(null);
          },
          onError: (err) =>
            setServerError(
              err?.response?.data?.message ?? "Failed to update member"
            ),
        }
      );
    } else {
      createMember.mutate(formData, {
        onSuccess: () => setFormOpen(false),
        onError: (err) =>
          setServerError(
            err?.response?.data?.message ?? "Failed to add member"
          ),
      });
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMember.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const totalPages = data?.total ? Math.ceil(data.total / LIMIT) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Member Management</h1>
          <p className="text-sm text-muted-foreground">
            {data?.total != null
              ? `${data.total} total member${data.total !== 1 ? "s" : ""}`
              : "Manage your gym members"}
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add New Member
        </button>
      </div>

      {/* Gender tabs */}
      <div className="flex gap-2 rounded-xl bg-card border border-border p-1.5 shadow-sm w-fit">
        {GENDER_TABS.map((tab) => {
          const count = data?.genderSummary?.[tab.key];
          return (
            <button
              key={tab.value}
              onClick={() => { setGender(tab.value); setPage(1); }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
                gender === tab.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab.label}
              {count != null && (
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none",
                  gender === tab.value
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-sm border border-border sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <InputField
            id="search"
            placeholder="Search by name, phone, CNIC or member ID..."
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

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-10 text-center">
          <p className="text-sm font-medium text-destructive">Failed to load members</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {error?.response?.data?.message ?? error?.message}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <MembersTable
          members={data?.members}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
          onView={(member) => navigate(`/members/${member._id}`)}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {Math.min((page - 1) * LIMIT + 1, data.total)}–
            {Math.min(page * LIMIT, data.total)} of {data.total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit form dialog */}
      <MemberForm
        open={formOpen}
        onOpenChange={(val) => {
          setFormOpen(val);
          if (!val) setEditMember(null);
        }}
        onSubmit={handleFormSubmit}
        editMember={editMember}
        isLoading={isMutating}
        serverError={serverError}
      />

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-xl bg-card p-6 shadow-2xl">
            <h3 className="font-semibold text-foreground">Delete Member</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget.fullName}
              </span>{" "}
              <span className="font-mono text-xs">({deleteTarget.memberId})</span>?
              This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMember.isPending}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-60 transition-colors"
              >
                {deleteMember.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
