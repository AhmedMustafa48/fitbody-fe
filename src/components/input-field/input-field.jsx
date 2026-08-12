import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { cn } from "@lib/utils";

const InputField = ({ 
  label, 
  error, 
  id, 
  containerClassName,
  registration = {}, // From react-hook-form
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        className={cn(
          "h-10 transition-colors focus:ring-1 focus:ring-primary",
          error && "border-red-500 focus:ring-red-500"
        )}
        min={props.type === "number" ? props.min ?? "0" : undefined}
        onKeyDown={(e) => {
          if (props.type === "number") {
            if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
              e.preventDefault();
            }
          }
          if (props.onKeyDown) props.onKeyDown(e);
        }}
        {...registration}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
};

export default InputField;
