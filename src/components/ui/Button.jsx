import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...props
}) {
  const base =
    "font-bold rounded-xl transition-all duration-300 flex items-center gap-2";

  const variants = {
    primary:
      "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:scale-105",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:scale-105",
    ghost: "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {icon && <span>{icon}</span>}
    </button>
  );
}
