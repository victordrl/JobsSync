import { GlassCard } from "./GlassCard";

const colorMap = {
  green: { bg: "bg-green-100", text: "text-green-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
};

export function StatCard({ icon, label, value, color }) {
  const c = colorMap[color];

  return (
    <GlassCard className="p-6 flex items-center gap-4">
      <div className={`w-12 h-12 ${c.bg} rounded-full flex items-center justify-center ${c.text} text-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </GlassCard>
  );
}
