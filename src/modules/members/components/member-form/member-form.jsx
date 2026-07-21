import { Controller } from "react-hook-form";
import useMemberForm from "@modules/members/components/member-form/use-member-form";
import InputField from "@components/input-field/input-field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { cn } from "@lib/utils";

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

const formatCnic = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
};

const MemberForm = ({ open, onOpenChange, onSubmit, editMember, isLoading, serverError }) => {
  const { form, showCnic } = useMemberForm(editMember);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = form;

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="sm:max-w-160 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {editMember ? "Edit Member" : "Add New Member"}
          </DialogTitle>
          {editMember ? (
            <p className="text-sm text-muted-foreground">
              Member ID:{" "}
              <span className="font-mono font-semibold text-foreground">
                {editMember.memberId}
              </span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Member ID will be auto-assigned as{" "}
              <span className="font-mono font-semibold text-foreground">A-##</span>
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">
          {/* Full Name + Contact */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="fullName"
              label="Full Name"
              placeholder="e.g. Ahmed Khan"
              registration={register("fullName")}
              error={errors.fullName}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <InputField
                  id="phone"
                  label="Contact Number"
                  placeholder="03xx-xxxxxxx"
                  value={field.value}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                  onBlur={field.onBlur}
                  error={errors.phone}
                />
              )}
            />
          </div>

          {/* Gender + Age */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Gender</label>
              <Select
                onValueChange={(val) =>
                  setValue("gender", val, { shouldValidate: true })
                }
                defaultValue={editMember?.gender ?? "male"}
              >
                <SelectTrigger className={cn(errors.gender && "border-destructive")}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-destructive">{errors.gender.message}</p>
              )}
            </div>
            <InputField
              id="age"
              label="Age"
              type="number"
              placeholder="25"
              registration={register("age")}
              error={errors.age}
            />
          </div>

          {/* CNIC (age >= 18 only) + Address */}
          <div className={cn("grid gap-4", showCnic ? "grid-cols-2" : "grid-cols-1")}>
            {showCnic && (
              <Controller
                name="cnic"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="cnic"
                    label="CNIC"
                    placeholder="12345-1234567-1"
                    value={field.value}
                    onChange={(e) => field.onChange(formatCnic(e.target.value))}
                    onBlur={field.onBlur}
                    error={errors.cnic}
                  />
                )}
              />
            )}
            <InputField
              id="address"
              label={showCnic ? "Address" : "Address (Optional)"}
              placeholder="Street, City"
              registration={register("address")}
              error={errors.address}
            />
          </div>

          {/* Admission Fees */}
          <InputField
            id="admissionFees"
            label="Admission Fees (PKR) — Optional"
            type="number"
            placeholder="Leave blank if waived (100% discount)"
            registration={register("admissionFees")}
            error={errors.admissionFees}
          />

          {/* Monthly Fees */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="fees"
              label="Monthly Fees (PKR)"
              type="number"
              placeholder="3000"
              registration={register("fees")}
              error={errors.fees}
            />
            <InputField
              id="feesAfterDiscount"
              label="After Discount (PKR)"
              type="number"
              placeholder="2500"
              registration={register("feesAfterDiscount")}
              error={errors.feesAfterDiscount}
            />
          </div>

          {serverError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {isLoading ? "Saving..." : editMember ? "Update Member" : "Add Member"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberForm;
