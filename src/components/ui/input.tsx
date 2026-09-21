import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full h-[52px] rounded-2xl border-2 border-[#F1F5F9] bg-white px-4 text-[14px] font-medium placeholder:text-slate-400 outline-none transition-all hover:border-[#F1F5F9] focus:border-[#2563eb] focus:ring-0 disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

