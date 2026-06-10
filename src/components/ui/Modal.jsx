import { ReactNode, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X } from "@phosphor-icons/react";

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  gradientFrom = "from-blue-600",
  gradientTo = "to-indigo-600",
  icon,
  children,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 m-4 overflow-hidden",
          "transform transition-all duration-300",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        <div className={`relative bg-linear-to-r ${gradientFrom} ${gradientTo} p-8 text-white`}>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition"
            aria-label="Cerrar"
          >
            <X size={24} weight="bold" />
          </button>
          <div className="flex items-center gap-4">
            {icon && (
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold">{title}</h3>
              {subtitle && <p className="text-blue-100">{subtitle}</p>}
            </div>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
