import { Controller } from "react-hook-form";
import { Checkbox } from "@components/ui/checkbox";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import InputField from "@components/input-field/input-field";
import useCollectFeeForm from "@modules/fees/components/collect-fee-form/use-collect-fee-form";

const CollectFeeForm = ({ open, onOpenChange, member, onSubmit, isLoading, serverError }) => {
  const { form } = useCollectFeeForm(member);
    const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = form;

  const handleFormSubmit = (data) => {
    onSubmit({ memberId: member._id, ...data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Collect Fee</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {member?.fullName}{" "}
            <span className="font-mono text-xs">({member?.memberId})</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-2 space-y-4">
          <InputField
            id="amount"
            label="Amount (PKR)"
            type="number"
            registration={register("amount")}
            error={errors.amount?.message}
          />

          <div className="space-y-1.5">
            <Label htmlFor="method">Payment Method</Label>
            <Controller
              name="method"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="method"
                    className={errors.method ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online Transfer</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.method && (
              <p className="text-xs font-medium text-destructive">
                {errors.method.message}
              </p>
            )}
          </div>

          <InputField
            id="note"
            label="Note (optional)"
            placeholder="e.g. Paid in advance"
            registration={register("note")}
          />

          <div className="flex items-center space-x-2">
            <Controller
              name="isToday"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isToday"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label
              htmlFor="isToday"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
            >
              Paid Today
            </Label>
          </div>

          {!form.watch("isToday") && (
            <div className="space-y-2">
              <Label htmlFor="paidDate">Payment Date</Label>
              <div className="relative">
                <div className="pointer-events-none flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground">
                  <span>
                    {form.watch("paidDate") 
                      ? form.watch("paidDate").split("-").reverse().join("/") 
                      : "dd/mm/yyyy"}
                  </span>
                  <Calendar className="h-4 w-4 opacity-50" />
                </div>
                <input
                  id="paidDate"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  {...register("paidDate")}
                  onKeyDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      e.target.showPicker();
                    }
                  }}
                  className="absolute inset-0 z-10 h-10 w-full cursor-pointer opacity-0"
                />
              </div>
              {errors.paidDate && (
                <p className="text-xs font-medium text-destructive">
                  {errors.paidDate.message}
                </p>
              )}
            </div>
          )}

          {serverError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {isLoading ? "Processing..." : "Collect Fee"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollectFeeForm;
