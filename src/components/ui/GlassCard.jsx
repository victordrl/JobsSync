import { cn } from "@/lib/utils";

export function GlassCard({ children, className, hover = false }) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-slate-100",
        hover && "card-hover cursor-pointer",
        className
      )}
      style={
        hover
          ? {
              transition: "all 0.3s ease",
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
