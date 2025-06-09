import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  value?: string;
  required?: boolean;
}

const InputForm = ({ label, id, value, required = false, ...props }: InputFormProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        name={id}
        value={value}
        {...props}
        />
    </div>
  );
};

export default InputForm;
