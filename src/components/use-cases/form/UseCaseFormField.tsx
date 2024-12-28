import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseCaseHints } from "../hints/UseCaseHints";

interface UseCaseFormFieldProps {
  id: string;
  label: string;
  type: "input" | "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
  hint?: "title" | "description" | "enhancer";
  actions?: React.ReactNode;
}

export function UseCaseFormField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  hint,
  actions,
}: UseCaseFormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor={id} className="text-sm font-medium text-white">
            {label}
          </Label>
          {hint && <UseCaseHints field={hint} />}
        </div>
        {actions}
      </div>
      {type === "input" ? (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`text-white placeholder:text-gray-400 ${className}`}
        />
      ) : (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`text-white placeholder:text-gray-400 ${className}`}
        />
      )}
    </div>
  );
}