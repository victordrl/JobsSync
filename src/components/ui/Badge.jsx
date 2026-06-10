import { cn } from "@/lib/utils";

const colorMap = {
  slate: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
  green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-100" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-100" },
  gray: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-100" },
};

export function Badge({ text, color = "slate", variant = "default", size = "sm" }) {
  const c = colorMap[color];
  const sizeClass = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";

  return (
    <span
      className={cn(
        "rounded-lg font-bold border",
        sizeClass,
        variant === "default" && [c.bg, c.text, c.border],
        variant === "soft" && [c.bg, c.text],
        variant === "outline" && ["bg-transparent", c.text, c.border]
      )}
    >
      {text}
    </span>
  );
}
