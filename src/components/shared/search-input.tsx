import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  required?: boolean;
  className?: string
}

const SearchInput = ({ placeholder, required = false, className, ...props }: SearchInputProps) => {

  return (
    <div className="relative w-full lg:w-64">
      <Search
        size={16}
        className="absolute left-2 top-2.5 text-muted-foreground"
      />
      <Input
        placeholder={placeholder}
        required={required}
        className={`pl-8 ${className}`}
        {...props}
      />
    </div>
  );
};

export default SearchInput;
